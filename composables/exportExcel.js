import  XLSX  from 'xlsx-js-style'

export function useExportExcel() {
  const { t, locale } = useI18n()
  const dayjs = useDayjs()
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
    // console.log(order);
    const orderDate = dayjs(order.order_date).format('YYYY-MM-DD')
    const orderNumber = order.code
    const customName = order.customer_name
    const total = order.total
    const phone = order.salesperson_mobile
    const fax = order.salesperson_telephone
    const addressHandle = () => {
      const { shipping_zip_code, shipping_city, shipping_country_name, shipping_address1, shipping_address2 } = order
      if (shipping_zip_code && shipping_city && shipping_country_name && shipping_address1 && shipping_address2) {
        return `${shipping_zip_code} ${shipping_city} ${shipping_country_name} ${shipping_address1} ${shipping_address2}`
      }
      return ''
    }

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

            // 訂單資訊區塊 - 重新排列
      const infoRows = [
        // 第1列 (r:0)
        ["Homecreations", "", "", "", "", "", "", "", "CUSTOMER NAME:", "", customName || "", "", "", "", "", "", "", "", ""],
        // 第2列 (r:1) - 空列，用於合併
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        // 第3列 (r:2)
        ["Unit 21 Clarke Road, Milton Keynes, MK1 1LG", "", "", "", "", "", "", "", "ADDRESS：", "", addressHandle(), "", "", "", "", "", "ORDER Total M2", "", total || ""],
        // 第4列 (r:3)
        ["United Kingdom", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        // 第5列 (r:4)
        [`Phone:${phone || ""}`, "", "", "", "", "", "", "", "ORDER NUMBER:", "", orderNumber || "", "", "", "", "", "", "", "", ""],
        // 第6列 (r:5)
        [`Fax:${fax || ""}`, "", "", "", "", "", "", "", "DATE:", "", orderDate || "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], // 空行
      ];

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

        // 填資料 - 每筆資料佔用三列，但所有資料都放在第一列
        const row_data = [];
        item_data.forEach((item, idx) => {
          const options = item.order_product_options || {};
          const json_keys = Object.keys(options).filter(k => options[k]?.type === 'json');
          const json_arr = json_keys.map(k => {
            try {
              const val = options[k]?.value;
              return (val && val !== 'undefined') ? JSON.parse(val) : null;
            } catch { return null; }
          }).filter(Boolean);

          // 第一列資料 - 包含所有資料
          const row1 = [idx + 1];
          // 第二列資料 - 所有欄位都是空白
          const row2 = [''];
          // 第三列資料 - 所有欄位都是空白
          const row3 = [''];
          
          table_header.forEach((header, headerIdx) => {
            // 跳過第一欄 item#，因為已經處理了
            if (headerIdx === 0) return;
            
            const key = Object.keys(options).find(k => options[k]?.option_code === header.code);
            let cellValue = '';
            
            if (!key && header.code !== 'json' && header.code !== 'sqm' && header.code !== 'quantity' && header.code !== 'note') {
              cellValue = '';
            } else if (header.code === 'sqm') {
              cellValue = item.sqm || '';
            } else if (header.code === 'quantity') {
              cellValue = item.quantity || '';
            } else if (header.code === 'note') {
              cellValue = item.note && item.note !== 'null' ? item.note : '';
            } else if (header.code === 'json') {
              const val = json_body_value(json_arr, header.name);
              cellValue = val === 'Y' ? '✓' : val === 'N' ? '' : val;
            } else if (options[key]?.type === 'checkbox') {
              const values = options[key].option_values.map(v => v.value === 'Y' ? '✓' : '');
              cellValue = values.join(', ');
            } else {
              const val = locale.value === 'en' ? options[key]?.en_value : options[key]?.value;
              cellValue = val || '';
            }
            
            // 防止顯示 undefined、null 或其他不合法資料
            if (cellValue === 'undefined' || cellValue === 'null' || cellValue === undefined || cellValue === null) {
              cellValue = '';
            }
            
            // 第一列放入資料
            row1.push(cellValue);
            // 第二列放空字串
            row2.push('');
            // 第三列放空字串
            row3.push('');
          });
          
          // 將三列都加入資料陣列
          row_data.push(row1);
          row_data.push(row2);
          row_data.push(row3);
        });

        // 合併訂單資訊與表格資料
        let sheetData = [
          ...infoRows,
          // 表格標題第一列
          table_header.map(h => h.name),
          // 表格標題第二列（空白列，用於合併）
          table_header.map(() => ''),
          // 表格標題第三列（空白列，用於合併）
          table_header.map(() => ''),
          ...row_data
        ];
        XLSX.utils.sheet_add_aoa(ws, sheetData, { origin: 'A1' });

        // 設定欄位寬度
        const colWidths = [];
        for (let col = 0; col < table_header.length; col++) {
          // 計算這一欄所有內容的最大長度
          let maxLength = table_header[col].name.length; // 標題長度
          
          // 檢查資料列的內容長度
          item_data.forEach((item, idx) => {
            const options = item.order_product_options || {};
            const json_keys = Object.keys(options).filter(k => options[k]?.type === 'json');
            const json_arr = json_keys.map(k => {
              try {
                const val = options[k]?.value;
                return (val && val !== 'undefined') ? JSON.parse(val) : null;
              } catch { return null; }
            }).filter(Boolean);

            let cellValue = '';
            const header = table_header[col];
            
            if (col === 0) {
              cellValue = (idx + 1).toString();
            } else {
              const key = Object.keys(options).find(k => options[k]?.option_code === header.code);
              
              if (!key && header.code !== 'json' && header.code !== 'sqm' && header.code !== 'quantity' && header.code !== 'note') {
                cellValue = '';
              } else if (header.code === 'sqm') {
                cellValue = item.sqm || '';
              } else if (header.code === 'quantity') {
                cellValue = item.quantity || '';
              } else if (header.code === 'note') {
                cellValue = item.note && item.note !== 'null' ? item.note : '';
              } else if (header.code === 'json') {
                const val = json_body_value(json_arr, header.name);
                cellValue = val === 'Y' ? '✓' : val === 'N' ? '' : val;
              } else if (options[key]?.type === 'checkbox') {
                const values = options[key].option_values.map(v => v.value === 'Y' ? '✓' : '');
                cellValue = values.join(', ');
              } else {
                const val = locale.value === 'en' ? options[key]?.en_value : options[key]?.value;
                cellValue = val || '';
              }
            }
            
            // 防止顯示 undefined、null 或其他不合法資料
            if (cellValue === 'undefined' || cellValue === 'null' || cellValue === undefined || cellValue === null) {
              cellValue = '';
            }
            
            if (cellValue && cellValue.length > maxLength) {
              maxLength = cellValue.length;
            }
          });
          
          // 設定最小寬度和最大寬度，並根據內容調整
          const minWidth = 10;
          const maxWidth = 50;
          let width = Math.max(minWidth, Math.min(maxWidth, maxLength * 1.2));
          
          colWidths.push({ wch: width });
        }
        
        ws['!cols'] = colWidths;

        // 文字全部置中，並設定自動換行 - 確保所有儲存格都有樣式
        const totalRows = sheetData.length;
        const totalCols = Math.max(...sheetData.map(row => row.length)); // 確保涵蓋所有欄位
        for (let r = 0; r < totalRows; r++) {
          for (let c = 0; c < totalCols; c++) {
            const cellRef = XLSX.utils.encode_cell({ r, c });
            // 確保儲存格存在，如果不存在就創建
            if (!ws[cellRef]) {
              ws[cellRef] = { v: '', t: 's' }; // 創建空白儲存格
            }
            // 設定樣式
            ws[cellRef].s = ws[cellRef].s || {};
            ws[cellRef].s.alignment = ws[cellRef].s.alignment || {};
            ws[cellRef].s.alignment.horizontal = 'center';
            ws[cellRef].s.alignment.vertical = 'center';
            ws[cellRef].s.alignment.wrapText = true; // 自動換行
          }
        }

        // 設定列高
        const rowHeights = [];
        for (let r = 0; r < totalRows; r++) {
          // 為標題列和資料列設定適中的高度
          if (r >= infoRows.length) {
            // 表格部分（標題和資料）設定適中高度
            rowHeights.push({ hpt: 25 }); // 25 點高度，再少一點
          } else {
            // 訂單資訊區塊保持預設高度
            rowHeights.push({ hpt: 20 }); // 20 點高度
          }
        }
        
        ws['!rows'] = rowHeights;

        // 合併儲存格設定
        const merges = [
          // 訂單資訊區塊的合併儲存格
          // Homecreations 合併兩列、從A到G
          { s: { r:0, c:0 }, e: { r:1, c:6 } },
          // CUSTOMER NAME: 合併兩列、從I到J
          { s: { r:0, c:8 }, e: { r:1, c:9 } },
          // customName 合併兩列、從K到L
          { s: { r:0, c:10 }, e: { r:1, c:11 } },
          // Unit 21 Clarke Road... 第三列、從A到G
          { s: { r:2, c:0 }, e: { r:2, c:6 } },
          // ADDRESS：第三列從I到J
          { s: { r:2, c:8 }, e: { r:2, c:9 } },
          // address 從K到Q
          { s: { r:2, c:10 }, e: { r:2, c:16 } },
          // ORDER Total M2 第三列從R到S
          { s: { r:2, c:17 }, e: { r:2, c:18 } },
          // United Kingdom 第四列從A到G
          { s: { r:3, c:0 }, e: { r:3, c:6 } },
          // "Phone:" + phone 第五列從A到G
          { s: { r:4, c:0 }, e: { r:4, c:6 } },
          // ORDER NUMBER: 第五列從I到J
          { s: { r:4, c:8 }, e: { r:4, c:9 } },
          // orderNumber從K到M
          { s: { r:4, c:10 }, e: { r:4, c:12 } },
          // "Fax:" + fax 第六列從A到G
          { s: { r:5, c:0 }, e: { r:5, c:6 } },
          // DATE:從I到J
          { s: { r:5, c:8 }, e: { r:5, c:9 } },
          // orderDate從K到M
          { s: { r:5, c:10 }, e: { r:5, c:12 } },
        ];

        // 表格資料的合併儲存格 - 表格標題和每個產品的所有欄位都跨三列
        const headerRowIndex = infoRows.length; // 標題列的索引
        const headerSecondRow = headerRowIndex + 1; // 標題第二列
        const headerThirdRow = headerRowIndex + 2; // 標題第三列
        const dataStartRow = headerRowIndex + 3; // 資料開始的列（因為標題佔三列）
        
        // 為表格標題的每一欄建立合併儲存格（標題跨三列）
        for (let col = 0; col < table_header.length; col++) {
          merges.push({
            s: { r: headerRowIndex, c: col }, // 標題第一列
            e: { r: headerThirdRow, c: col }  // 標題第三列
          });
        }
        
        // 為每個 item 的所有欄位建立合併儲存格（每三列合併一次）
        for (let i = 0; i < item_data.length; i++) {
          const startRow = dataStartRow + (i * 3); // 每個 item 佔三列
          const endRow = startRow + 2; // 第三列
          
          // 為這個產品的每一欄都建立合併儲存格
          for (let col = 0; col < table_header.length; col++) {
            merges.push({
              s: { r: startRow, c: col },
              e: { r: endRow, c: col }
            });
          }
        }

        ws['!merges'] = merges;

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