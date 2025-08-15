import  XLSX  from 'xlsx-js-style'

export function useExportExcel() {
  const { t, locale } = useI18n()
  const textMap = ref(null) //匯出excel的json_header
    // json選項標題語言文字
    const json_headers_language = (data) => {
      // 放各個json格式裡面的標題
      let headers = []
      // 需要跳過的(中格2以後不出現)
      const skip_header = ['beneath_handle_division', 'beneath_handle_division_center']
      Object.keys(data).forEach((key) => {
          // 如果json是物件陣列
          if (Array.isArray(data[key])) {
              data[key].forEach((item, idx) => {
                  let text
                  if (Object.keys(item)[0] == 't_post_value') {
                      const value = textMap.value[Object.keys(item)[0]].replace('idx', idx + 1)
                      text = value
                  } else {
                      // 把key值當索引獲取語言文字
                      text = textMap.value[key] + (idx + 1)
                  }
                  if (text) {
                      headers.push(text)
                  }
              })
              // json是陣列物件
          } else if (typeof data[key] == 'object') {
              data.map((item, idx) => {
                  Object.keys(data[key]).forEach((obj_key, i) => {
                      if (idx > 0) {
                          // 只有中隔1有以下拉桿分段
                          if (skip_header.find((item) => item == obj_key)) {
                              return
                          }
                      }
                      // 把key值當索引獲取語言文字
                      let text
                      if(obj_key === 'corner_angle_item'){
                          text = textMap.value[obj_key].replace(':num', idx + 2)
                      }else if(textMap.value[obj_key].includes(':num')){
                          text = textMap.value[obj_key].replace(':num', idx + 1)
                      }else{
                          text = textMap.value[obj_key].replace('idx', idx + 1)
                      }
                      if (text) {
                          headers.push(text)
                      }
                  })
              })
              // 物件
          } else {
              // 把key值當索引獲取語言文字
              let text = textMap.value[key]
              if (text) {
                  headers.push(text)
              }
          }
      })
      console.log('語言');
      
      return headers
  }

  // json選項設定值
  const json_body_value = (data, header) => {
      let match_value = null

      data.forEach((item) => {
          // 如果 item 不是陣列，表示是物件資料
          if (!Array.isArray(item)) {
              Object.keys(item).forEach((k) => {
                  // 比對textMap的文字欄位
                  if (textMap.value[k] === header) {
                      match_value = item[k] || ''    // 沒有值就給空字串
                  }
                  // 如果item[k]是陣列
                  else if (Array.isArray(item[k])) {
                      item[k].forEach((v, i) => {
                          // 顯示文字 形式如：欄位名稱1、欄位名稱2...
                          if (textMap.value[k] + (i + 1) === header) {
                              match_value = v || ''   
                          } else {
                              // 針對陣列中是物件的情況，抓出 key 跟 value
                              const key = Object.keys(v)[0]
                              const textMapValue = textMap.value[key]
                              // 如果 textMap 中的對應欄位有設定 idx，例如：欄位idx → 替換成欄位1、欄位2
                              if (textMapValue && textMapValue.replace('idx', i + 1) === header) {
                                  match_value = Object.values(v)[0] || ''
                              }
                          }
                      })
                  }
              })
          } 
          // 如果 item 是陣列
          else {
              item.forEach((obj, idx) => {
                  Object.keys(obj).forEach((k) => {
                      let index = idx + 1
                      let replace = 'idx'

                      // 處理 textMap 用的是 :num 的格式（例如欄位:num）
                      if(textMap.value[k].includes(':num')){
                          replace = ':num'
                      }
                      // corner_angle_item 這個欄位特別處理，index +2
                      if(k === 'corner_angle_item'){
                          index = idx +2
                      }
                      // 比對處理後的欄位名稱是與 header 是否一致
                      if (textMap.value[k].replace(replace, index) === header) {
                          match_value = obj[k]
                      }
                  })
              })
          }
      })
      // 如果值是空字串，預設填入 'N'
      if (match_value == '') {
          match_value = 'N'
      }
      return match_value
  }
  

  // 匯出excel
// 匯出excel
  const exportTable = (order, mail) => {
    try {
      if (!order?.order_products || order.order_products.length === 0) {
        alert('沒有可匯出的訂單產品資料');
        return;
      }

      const fileName = `${order.code}.xlsx`;
      const wb = XLSX.utils.book_new();

      // 分組
      const track = order.order_products.filter(x => !!x.order_product_options?.win_track_subtype);
      const windows = order.order_products.filter(x => !!x.order_product_options?.win_win_subtype);
      const excel_data = [track, windows].filter(x => x.length > 0);

      if (excel_data.length === 0) {
        alert('沒有符合條件的產品資料可匯出');
        return;
      }

      excel_data.forEach((item_data, index) => {
        const sheetName = `type${index + 1}`;
        const ws = XLSX.utils.aoa_to_sheet([]);

        const table_header = [{ name: 'item#', code: 'item' }];
        const processedOptions = new Set();
        const priority_header = [
          'win_type', 'win_position', 'win_width', 'win_height', 'wsms', 'imom',
          `${order.material}_color`, 'win_win_subtype', 'win_track_subtype'
        ];

        const priority_header_data = [];
        const json_data = [];

        item_data.forEach((item, idx) => {
          const options = item.order_product_options || {};
          Object.keys(options).sort().forEach(option => {
            const opt = options[option];
            if (opt?.type === 'checkbox') opt.option_code = option;
            if (processedOptions.has(opt?.option_code)) return;

            const header_name = opt?.name;
            const priorityIdx = priority_header.findIndex(text => option.includes(text));

            if (option !== 'win_material' && option !== 'attached_images' && priorityIdx === -1) {
              if (opt?.type === 'json' && opt?.value !== undefined && opt?.value !== 'undefined') {
                json_data.push(opt);
              } else {
                table_header.push({ name: header_name, code: opt?.option_code });
              }
            } else if (priorityIdx !== -1) {
              priority_header_data.push({ name: header_name, sort: priorityIdx, option_code: opt?.option_code });
            }

            processedOptions.add(opt?.option_code);
          });

          if (idx === item_data.length - 1) {
            // 插入優先欄位
            priority_header_data.sort((a, b) => a.sort - b.sort).forEach(item => {
              if (item.sort === 7 || item.sort === 8) {
                table_header.splice(2, 0, { name: item.name, code: item.option_code });
              } else {
                table_header.splice(item.sort + 1, 0, { name: item.name, code: item.option_code });
              }
            });

            // JSON 欄位展開
            const json_sort_order = ["dividers_json", "lever_segmentation_note", "auxiliaries", "layers_json", "t_post_json", "corner_angle"];
            json_data.sort((a, b) => {
              const indexA = json_sort_order.indexOf(a.option_code);
              const indexB = json_sort_order.indexOf(b.option_code);
              return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
            }).forEach(data => {
              try {
                const json_values = json_headers_language(JSON.parse(data.value));
                json_values.forEach(name => {
                  if (!processedOptions.has(name)) {
                    table_header.push({ name, code: 'json' });
                    processedOptions.add(name);
                  }
                });
              } catch {}
            });
          }
        });

        table_header.push({ name: 'M2', code: 'sqm' });
        table_header.push({ name: t('order.text_quantity'), code: 'quantity' });
        table_header.push({ name: t('order.text_option_section_note'), code: 'note' });

        // 填資料
        const row_data = item_data.map((item, idx) => {
          const options = item.order_product_options || {};
          const json_keys = Object.keys(options).filter(k => options[k]?.type === 'json');
          const json_arr = json_keys.map(k => {
            try {
              const val = options[k]?.value;
              return (val && val !== 'undefined') ? JSON.parse(val) : null;
            } catch { return null; }
          }).filter(Boolean);

          const row = [idx + 1];
          table_header.forEach(header => {
            const key = Object.keys(options).find(k => options[k]?.option_code === header.code);
            if (!key && header.code !== 'json' && header.code !== 'sqm' && header.code !== 'quantity' && header.code !== 'note') {
              row.push('');
              return;
            }
            if (header.code === 'sqm') {
              row.push(item.sqm || '');
            } else if (header.code === 'quantity') {
              row.push(item.quantity || '');
            } else if (header.code === 'note') {
              row.push(item.note && item.note !== 'null' ? item.note : '');
            } else if (header.code === 'json') {
              const val = json_body_value(json_arr, header.name);
              row.push(val === 'Y' ? '✓' : val === 'N' ? '' : val);
            } else if (options[key]?.type === 'checkbox') {
              const values = options[key].option_values.map(v => v.value === 'Y' ? '✓' : '');
              row.push(values.join(', '));
            } else {
              const val = locale.value === 'en' ? options[key]?.en_value : options[key]?.value;
              row.push(val || '');
            }
          });
          return row;
        });

        const data = [table_header.map(h => h.name), ...row_data];
        XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A1' });
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      // 確保至少有一個 sheet
      if (wb.SheetNames.length === 0) {
        const ws = XLSX.utils.aoa_to_sheet([['無資料']]);
        XLSX.utils.book_append_sheet(wb, ws, 'Empty');
      }

      if (mail) {
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const uint8Array = new Uint8Array(wbout.split('').map(c => c.charCodeAt(0)));
        return new File([uint8Array], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      } else {
        XLSX.writeFile(wb, fileName);
      }

    } catch (error) {
      console.error(error);
      alert(`匯出 Excel 失敗：${error.message || error}`);
    }
  };

  
  return {
    exportTable
  }
}