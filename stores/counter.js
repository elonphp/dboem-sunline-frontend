import { defineStore } from 'pinia'
import  XLSX  from 'xlsx-js-style'


export const useStore = defineStore('counter', () => {
    const router = useRouter()
    const userData = ref('')
    const role = ref({})
    const pageKey = ref(1)    // 換語言重新渲染用的key
    const baseUrl = ref('')   
    const loading = ref(false)
    const language = ref('en')  // zh_Hant en
    const language_txt = ref({})
    const method_nav = ref(false)
    const temporarily_product = ref()
    const textMap = ref(null) //匯出excel的json_header

    const set_token = async (data) => {
        // data.id = await get_ip()
        localStorage.setItem('token', JSON.stringify(data)) // 設定token到localStorage
        userData.value = data
        await update_local(data)
        await get_user_data()
    }

    const logout = async () => {
        const now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)       // 現在時間UTC+8
        const nowTime = now.toISOString().replace('T', ' ').substring(0, 19)  // 轉格式(YYYY-MM-DD HH:MM:SS)
        const expTime = userData.value.jwtExpireAt                            // 取得目前使用者 JWT（JSON Web Token）過期時間
        // 沒過期透過api(登出)消除 過期則直接刪除
        if (nowTime < expTime) {
            const url = `${baseUrl.value}api/v2/logout/${userData.value.refreshToken}`
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + userData.value.jwtToken,
                    },
                })
                const data = await res.json()
                if (res.ok) {
                }
            } catch (err) {
                console.log(err)
            }
        }
        router.push('/')  // 返回登入頁
        localStorage.removeItem('token')  // 刪除localStorage
        userData.value = ''              
        role.value = {}
    }

    const get_user = async () => {
        console.log('get_user');
        
         // 從 localStorage 中取出儲存的 token 並解析為 JSON 物件
        const data = JSON.parse(localStorage.getItem('token'))
         // 如果 token 存在
        if (data) {
            userData.value = data
            await update_local(data)
            // await get_user_data()
    
            const now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
            const nowTime = now.toISOString().replace('T', ' ').substring(0, 19)
            const expTime = userData.value.jwtExpireAt

            // 如果現在時間已超過 token 的過期時間，表示登入已逾時
            if (nowTime > expTime) {
                 // 執行登出動作（如清除 token、導向登入頁）
                await logout()
                alert('連線逾時，請重新登入')
            }
        } else {
            // 若無 token，清空使用者資料
            userData.value = ''
        }
        
    }

    const get_user_data = async () => {
        const url = `${baseUrl.value}api/v2/members/info?locale=${language.value}&equal_id=${userData.value.member_id}`
        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: 'Bearer ' + userData.value.jwtToken,
                },
            })
            if (res.status == 200) {
                const data = await res.json()
                //  更新公司
                userData.value.employer_company_id = data.response.employer_company_id
                //  角色
                role.value = data.response.roles
                //  上級
                userData.value.parent_id = data.response.parent_id
               
                return data.response
            } else {
                //  console.log(res);
            }
        } catch (err) {
            console.log(err)
        }
    }

    // 更新語言
    const update_local = async (data)=>{
        // 如果選擇的語言跟帳號不一樣
        if(language.value !== data.locale){
            // 更新語言
            language.value = data.locale
            await get_auth_language_txt()
            pageKey.value++
        }
    }

    const get_ip = async () => {
        fetch('https://api.ipify.org?format=json')
            .then((res) => res.json())
            .then((data) => {
                console.log('使用者 IP:', data.ip)
                return data.ip
            })
            .catch((err) => {
                console.error('取得 IP 失敗:', err)
            })
    }
    
    


    // 驗證 JWT token 是否已過期
    const token_validation = async () => {
        const now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        const nowTime = now.toISOString().replace('T', ' ').substring(0, 19)
        const expTime = userData.value.jwtExpireAt
        // console.log("現在時刻" + nowTime);
        // console.log("過期時刻" + expTime);
        // console.log(`過期：${nowTime > expTime}`);

        // 如果現在時間已超過過期時間，表示 token 已過期
        if (nowTime > expTime) {
            // 嘗試刷新 token
            await refresh_token()
            return
        }
    }

    // 刷新 access token
    const refresh_token = () => {
        // 從使用者資料中取得 refresh token
        const refresh_token = userData.value.refreshToken

        // 如果 refresh token
        if (refresh_token) {
            fetch(`${baseUrl.value}api/v2/newAccessToken/${refresh_token}`)
                .then((res) => res.json())
                .then((res) => {
                     // 如果後端回傳錯誤（例如 token 已失效），執行登出
                    if (res.error) {
                        logout()
                    }
                     // 否則儲存新的 token 資訊
                    set_token(res)
                    // console.log("刷新");
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    // api網域位置
    const set_baseUrl = () => {
        if (process.env.NODE_ENV === 'production') {
            // 取得目前網站的通訊協定（http: 或 https:）
            const protocol = window.location.protocol
            // 取得目前網站的主機名稱與埠號（例如：www.example.com 或 localhost:3000）
            const host = window.location.host 
            baseUrl.value = `${protocol}//${host}/`
        } else {
            // 開發環境，使用指定的測試 API 網址
            // baseUrl.value = 'http://sunline.dboem.com:8088/';
            baseUrl.value = 'https://sunlinedev.elonphp.tw/';
            
        }
    }

    // 翻譯文字
    const get_auth_language_txt = async () => {
        console.log('翻譯',language.value);
        
        const url = `${baseUrl.value}api/v2/common/translations/list/global?locale=${language.value}&equal_flag=2`
        const data = await get_api(url)
        if(!data.error){
            const path = data
            const txt = {
                auth: path['global/auth'],
                option: path['global/dealer/option'],
                default: path['global/default'],
                order: path['global/sales/order'],
                member: Object.assign({}, path['global/user/member'], path['global/user/user']),
            }
            language_txt.value = txt
            set_textMap()
        }
    }

    // 表單 轉formData
    const jsonToFormData = (data, formData = new FormData(), parentKey = '') => {
        // 檢查 data 是否是一個物件，並且不是 Date 或 File 的實例。
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach((key) => {
                jsonToFormData(
                    // 帶入data的key值、formData、(如果沒有父key則帶入原本key否則帶入父key)
                    data[key],
                    formData,
                    parentKey ? `${parentKey}[${key}]` : key
                )
            })
            // 如果都不是則加進formData
        } else {
            formData.append(parentKey, data)
        }
        return formData
    }


    // const add_product = (item) => {
    //     temporarily_product.value = item
    // }

    // tag狀態顏色
    const status_colors = (status) => {
        switch (status) {
            case 'Draft': //草稿
                return 'tag tag-org'
            case 'Pending': //申請中
                return 'tag tag-yellow'
            case 'DealerApproved': // 經銷商已確認
                return 'tag tag-yellow'
            case 'Confirmed': //  已確認
                return 'tag tag-green'
            case 'Processing': // 處理中
                return 'tag tag-green'
            default: //作廢、刪除
                return 'tag tag-gray'
        }
    }

    // loading
    const show_loading = (val) => {
        loading.value = val
    }

    // excel
    const set_textMap = ()=>{
        const order = language_txt.value.order
      textMap.value = {
        // 水平T
        layer: order.text_layers, //層數
        layer_value: 'T POST', //水平arr

        // T柱(垂直T)
        t_post_value: 'T-' + 'idx' + order.text_position,
        t_post_average: order.text_divide_equally,

        // 輔料
        auxiliary_height: order.text_auxiliaries + 'idx' + order.text_height,
        auxiliary_width: order.text_auxiliaries + 'idx' + order.text_width,
        auxiliary_length: order.text_auxiliaries + 'idx' + order.text_length,
        auxiliary_quantity: order.text_auxiliaries + 'idx' + order.text_quantity,

        // 中隔
        division_height: order.text_dividers + 'idx' + order.text_height, //中隔高度
        division_no_move: order.text_dividers + 'idx' + order.text_dividers_json_is_fixed, //不移動
        division_center: order.text_dividers + 'idx' + order.text_dividers_json_is_center, //置中
        above_handle_division: order.text_dividers + 'idx' + order.text_dividers_json_above_division, // 以上拉桿
        beneath_handle_division: order.text_dividers + 'idx' + order.text_dividers_json_beneath_divide, // 以下拉桿
        // 以上拉桿分段置中
        beneath_handle_division_center:order.text_dividers + 'idx'  + order.text_dividers_json_above_division + order.text_dividers_json_is_center, 
        // 以上拉桿分段置中
        above_handle_division_center: order.text_dividers + 'idx' + order.text_dividers_json_beneath_divide + order.text_dividers_json_is_center, 
        
        // 拉桿分段需求
        lever_value:'拉桿分段需求idx',
        // 轉角度數
        corner_angle_value:order.text_corner_angle,
        
        position_value:`C:num${order.text_position}`,

        corner_angle_item1:'item1',

        corner_angle_item:'item:num'

      }
    }

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
    const exportTable = (order,mail) => {
        console.log(order);
        
        // 檔案名字
        const fileName = order.code + '.xlsx'
        // 樣式
        const border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        }
        const alignment = {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true,
        }
        const font = {
            sz: 10,
        }
        const excel_data = []
        // 分窗型/軌道分頁
        const track = order.order_products.filter((x) => !!x.order_product_options.win_track_subtype)
        const windows = order.order_products.filter((x) => !!x.order_product_options.win_win_subtype)
        if (track.length > 0) {
            excel_data.push(track)
        }
        if (windows.length > 0) {
            excel_data.push(windows)
        }

        // STEP 1: 創建工作簿
        const wb = XLSX.utils.book_new()

        excel_data.forEach((item_data, index) => {
            // STEP 1-1:工作簿名字
            const sheetName = 'type' + (index + 1)

            // STEP 2: 放資料&設定樣式
            // 建置資料表
            var ws = XLSX.utils.aoa_to_sheet([])
            // 標題先設置'item#'
            let table_header = [{ name: 'item#', code: 'item' }]
            const color = order.material + '_color'

            // 需排列至前面的選項(照順序優先權)
            const priority_header = [
                'win_type',
                'win_position',
                'win_width',
                'win_height',
                'wsms',
                'imom',
                color,
                'win_win_subtype',
                'win_track_subtype',
            ]

            // 用來存放已經處理過的選項名字，避免重複添加
            const processedOptions = new Set()

            // 存放JSON格式的選項
            const json_data = []
            // 存放需要優先排列的選項及其排序索引
            const priority_header_data = []

            item_data.forEach((item, idx) => {
                // 各個商品的選項物件
                const options = item.order_product_options
                // 遍歷所有選項
                Object.keys(options)
                    .sort()
                    .forEach((option) => {
                        if (options[option].type == 'checkbox') {
                            options[option].option_code = option
                        }
                        // 如果已經處理過這個選項，則跳過
                        if (processedOptions.has(options[option].option_code)) {
                            return
                        }
                        // 標頭中英文
                        // const header_name = language.value == 'en' ? options[option].en_name : options[option].name
                        const header_name = options[option].name

                        // 檢查選項是否在優先排列的清單中
                        const priority_header_idx = priority_header.findIndex((text) => option.includes(text))

                        // 如果選項不是 '材質' 且不在優先清單中
                        if (option !== 'win_material' && option !== 'attached_images' && priority_header_idx === -1) {
                            if (idx == 2) {
                            }
                            // 如果選項的類型是 JSON，則存入 json_data
                            if (options[option].type === 'json') {
                                if(options[option].value !== 'undefined'){
                                    json_data.push(options[option])
                                }
                                console.log(options[option]);
                                
                                return
                            } else {
                                // 否則直接添加到表頭
                                table_header.push({ name: header_name, code: options[option].option_code })
                            }
                            // 如果選項在優先清單中，存入 priority_header_data
                        } else if (priority_header_idx !== -1) {
                            priority_header_data.push({ name: header_name, sort: priority_header_idx, option_code: options[option].option_code })
                        }

                        // 標記這個選項已經處理過
                        processedOptions.add(options[option].option_code)
                    })

                if (idx == item_data.length - 1) {
                    // 按照 sort 屬性對 priority_header_data 進行排序
                    priority_header_data.sort((a, b) => a.sort - b.sort)
                    // 根據排序索引將優先選項插入到表頭的指定位置
                    priority_header_data.forEach((item) => {
                        // console.log(item);
                        // 窗型/軌道型指定第3個位置
                        if (item.sort == 7 || item.sort == 8) {
                            table_header.splice(2, 0, { name: item.name, code: item.option_code })
                        } else {
                            table_header.splice(item.sort + 1, 0, { name: item.name, code: item.option_code })
                        }
                    })

                    // 處理 JSON 選項，把標題添加到表頭
                    let json_data_sort = ["dividers_json","lever_segmentation_note","auxiliaries","layers_json","t_post_json","corner_angle"]
                    json_data.sort((a, b) => {
                        
                        const json_valuesA = json_headers_language(JSON.parse(a.value))
                        const json_valuesB = json_headers_language(JSON.parse(b.value))
                        const indexA = json_data_sort.indexOf(a.option_code);
                        const indexB = json_data_sort.indexOf(b.option_code);
                        // 如果 option_code 相同
                        if (indexA === indexB) {
                            // 比較 json_values 的長度，長的排前面所以B - A
                            return json_valuesB.length - json_valuesA.length;
                        }
                        // 如果 option_code 不同，維持原本的排序邏輯
                        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
                      });
                    json_data.forEach((data) => {
                        const json_values = json_headers_language(JSON.parse(data.value))
                        json_values.forEach((name) => {
                            if (processedOptions.has(name)) {
                                return
                            } else {
                                table_header.push({ name: name, code: 'json' })
                                processedOptions.add(name)
                            }
                        })
                    })
                }
            })

            // 標題最後加M2(平方米)
            table_header.push({ name: 'M2', code: 'sqm' })
            const quantity = language_txt.value.order?.text_quantity
            table_header.push({ name: quantity, code: 'quantity' })
            const note = language_txt.value.order?.text_option_section_note
            table_header.push({ name: note, code: 'note' })

            // 設置資料表
            let row_data = item_data.map((item, idx) => {
                // 各個商品的選項物件
                const options = item.order_product_options
                // 搜尋是否有json
                const json = Object.keys(options).filter((key) => options[key].type == 'json')
                let json_arr
                // 有的話另外處理
                if (json) {
                    // json_arr = json.map((key) => JSON.parse(options[key].value))
                   json_arr = json
                    .map((key) => {
                      const value = options[key]?.value;
                      if (value !== undefined && value !== 'undefined') {
                        try {
                          return JSON.parse(value);
                        } catch (e) {
                          console.warn(`JSON parse failed for key ${key}:`, value);
                          return null;
                        }
                      }
                      return null;
                    })
                    .filter(item => item !== null);
                }
                // 商品順序
                let row = [idx + 1]

                // // 按照header填入資料
                table_header.forEach((header, idx) => {
                    // 資料是否有對應的code
                    const key = Object.keys(options).find((k) => options[k].option_code === header.code)
                    // 中英文value
                    const language_value = () => {
                        if (key) {
                            const value = language.value == 'en' ? options[key]?.en_value : options[key].value
                            return value ? value : options[key].value
                        }
                    }
                    // checkbox
                    const is_checkbox = options[key]?.type == 'checkbox'
                    // m2
                    const is_M2 = header.code == 'sqm'
                    // 數量
                    const is_quantity = header.code == 'quantity'
                    // 備註
                    const is_note = header.code == 'note'
                    let is_json
                    // json
                    
                    if (json_arr.length > 0) {
                        is_json = json_body_value(json_arr, header.name)
                    }
                    // 都不符合條件則加入
                    if (header.code !== 'item' && !is_M2 && !is_checkbox && !is_json && !is_quantity && !is_note) {
                        row.push(key ? language_value() : '')

                    } else if (is_checkbox) {
                        // checkbox
                        if (key == 'win_stdwin_subtype' || key == 'outer_frame_cut_position') {
                            let data = ''
                            options[key].option_values.forEach((value) => {
                                data += `${value.value},\n`
                            }) 
                            
                            row.push(key ? data : '')
                        } else {
                            options[key].option_values.forEach((value) => {
                                
                                row.push(value.value == 'Y'? '✓' : '')
                            })
                        }
                    } else if (json.length > 0 && !!is_json) {
                        // json加入json_arr的值
                        if (is_json == 'Y' || is_json == 'N') {
                            row.push(is_json == 'Y' ? '✓' : '')
                        } else {
                            row.push(is_json)
                        }
                    } else if (is_M2) {
                        // M2
                        row.push(item.sqm ? item.sqm : '')
                    } else if (is_quantity) {
                        row.push(item.quantity ? item.quantity : '')
                    } else if (is_note) {
                        if(item.note == 'null'){
                            row.push('')
                        }else{
                            row.push(item.note)
                        }
                    }
                })

                return row
            })
            const name = table_header.map((item) => item.name)
            // 標題+資料
            let data = [name, ...row_data]
            // data從A8位置開始
            XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A8' })
            // 要合併儲存格的 arr
            let merges = []
            // 上方資料位置到5
            const info_end_idx = 5
            // 設置合併儲存格
            for (let i = 0; i < info_end_idx; i++) {
                merges.push(XLSX.utils.decode_range(`A${i + 1}:G${i + 1}`))
                merges.push(XLSX.utils.decode_range(`I${i + 1}:J${i + 1}`))
                merges.push(XLSX.utils.decode_range(`K${i + 1}:M${i + 1}`))
            }
            merges.push(XLSX.utils.decode_range(`R2:S2`))
            const address = order.state + order.city + order.shipping_address1 + order.shipping_address2
            // 合併
            ws['!merges'] = merges

            // 設置最上方資料
            ws['A1'] = { v: 'Homecreations' }
            ws['A2'] = { v: 'Unit 21 Clarke Road, Milton Keynes, MK1 1LG' }
            ws['A3'] = { v: 'United Kingdom' }
            ws['A4'] = { v: 'Phone:01908 642 888' }
            ws['A5'] = { v: 'Fax:02892 625947' }

            ws['I1'] = { v: 'CUSTOMER NAME:' }
            ws['I2'] = { v: 'ADDRESS：' }
            ws['I4'] = { v: 'ORDER NUMBER:' }
            ws['I5'] = { v: 'DATE:' }

            ws['K1'] = { v: order.customer_name }
            ws['K2'] = { v: '' }
            ws['K4'] = { v: order.code }
            ws['K5'] = { v: order.order_date }

            ws['R2'] = { v: 'ORDER Total M2' }
            ws['T2'] = { v: order.sqm }

            // 設置所有儲存格的邊框
            const setCellBorder = (ws, range) => {
                // 遍歷範圍內的所有行
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    // 遍歷範圍內的所有列
                    for (let C = range.s.c; C <= range.e.c; ++C) {
                        // 生成儲存格的引用（例如 "A1", "B1","C1" 等）
                        const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
                        // 如果儲存格不存在，初始化它
                        if (!ws[cellRef]) ws[cellRef] = { v: '' }
                        // 確保儲存格有樣式屬性
                        ws[cellRef].s = ws[cellRef].s || {}
                        // 設置邊框樣式
                        ws[cellRef].s.border = border
                    }
                }
            }

            // 對所有合併範圍內的儲存格設置邊框
            merges.forEach((range) => setCellBorder(ws, range))

            // 設置資料格式
            const info_positon = ['A', 'I', 'K', 'R', 'T']
            Object.keys(ws).forEach((key) => {
                const col = key.substring(0, 1)
                const row = parseInt(key.substring(1))

                if (info_positon.includes(col) && row <= info_end_idx) {
                    ws[key].t = 's'
                    ws[key].s = {
                        font: { bold: true, sz: 12 },
                        border,
                        alignment,
                    }
                } else {
                    if (ws[key].v || ws[key].v === '') {
                        ws[key].t = 's'
                        ws[key].s = {
                            font: { sz: 10 },
                            alignment,
                            border,
                        }
                    }
                }
            })
            // 最資料格式設定--end

            // 資料+上方資訊+中間空2格
            const maxRow = data.length + info_end_idx + 2
            const maxCol = data[0].length

            // 設定資料庫範圍(S:起始位置,e:結束位置)
            // c:列↓　r:行→
            ws['!ref'] = XLSX.utils.encode_range({
                s: { c: 0, r: 0 },
                e: { c: maxCol - 1, r: maxRow - 1 },
            })

            XLSX.utils.book_append_sheet(wb, ws, sheetName)
        })
        
        if (mail) {
            //字串符
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

            // 轉 Uint8Array
            const uint8Array = new Uint8Array([...wbout].map((char) => char.charCodeAt(0)))

            // file 對象
            const file = new File([uint8Array], 'filename.xlsx', {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                lastModified: new Date().getTime(), // 時間
            })
            return file
        } else {
            XLSX.writeFile(wb, fileName)
        }
    }


    const get_api = async(url)=>{
        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: 'Bearer ' + userData.value.jwtToken,
                },
            })
            const res_data = await res.json()
            if(res_data.success && !res_data.error){
                return res_data.response
            }else{
                alert('系統錯誤，請聯繫相關人員')
            }
        } catch (err) {
            console.log(err)
        }
    }



    // computed
    // 有登入?
    const is_login = computed(() => {
        return !!userData.value
    })
    // 是經銷商?
    const is_dealer = computed(() => {
        console.log(role.value);
        
        return !!role.value.dealer || role.value.sunline
    })
    // 是翔特
    const is_sunline = computed(() => {
        return !!role.value.sunline
    })
    // 英文版樣式
    const en_class = computed(() => {
        
        return language.value == 'en' ? 'en-main' : '';
    });

    return {
        pageKey,
        role,
        language,
        method_nav,
        baseUrl,
        userData,
        // add_product,
        temporarily_product,
        set_token,
        logout,
        get_user_data,
        get_user,
        token_validation,
        refresh_token,
        is_login,
        show_loading,
        loading,
        jsonToFormData,
        status_colors,
        is_dealer,
        get_auth_language_txt,
        set_baseUrl,
        language_txt,
        is_sunline,
        exportTable,
        get_api,
        en_class
    }
})
