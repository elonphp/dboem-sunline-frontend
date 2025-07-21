<template>
    <section class="bg-block" @click="selected_state_box = false">
        <div class="container">
            <div class="table-box" v-if="list_data">
                <!-- 加總 -->
                <div class="d-flex align-items-center justify-content-between ">
                    <h2 class="title">{{$t('order.tab_data')}}</h2>
                    <div class="total-data">
                        <div>
                            <span>{{$t('order.text_product_items')}}：</span>
                            <span class="fw-bold">{{ list_data.length }}</span>
                        </div>
                        <div>
                            <span>{{$t('order.column_total_quantity')}}：</span>
                            <span class="fw-bold">{{total_quantity}}</span>
                        </div>
                        <div>
                            <span>{{$t('order.text_total_sqm')}}(m2)：</span>
                            <span class="fw-bold">{{ total_m2 }}</span>
                        </div>
                    </div>
                </div>
                <!-- 功能區(篩選按鈕) -->
                <div class="my-4 row justify-content-between ">
                    <div class="col-xxl-4 d-flex align-items-center gap-3 mb-3 mb-xxl-0">
                        <nuxt-link to="home" class="btn link">{{$t('default.text_back')}}</nuxt-link>
                        <button type="button" class="btn link" data-bs-toggle="modal"
                            data-bs-target="#list-setting">{{$t('order.text_order_display_setting')}}</button>
                        <nuxt-link to="/create_order" class="btn link">{{$t('order.text_add_order')}}</nuxt-link>
                    </div>
                    <div class="col-xxl-8 col-12 row gx-2">
                        <div class="date-input col-lg-4 col-6">
                            <input type="date" class="form-control" id="datePicker" :placeholder="$t('order.text_order_date_start')"
                                v-model="start_date">
                            <span class="px-1">~</span>
                            <input type="date" class="form-control" id="datePicker2" :placeholder="$t('order.text_order_date_end')"
                                v-model="end_date">
                        </div>
                        <div class="col-lg-2 col-6 multiSelect">
                            <div class="selectBtn form-select" @click.stop="selected_state_box = !selected_state_box">{{$t('order.column_status')}}</div>
                            <transition name="fade" mode="out-in">
                                <div class="option-group form-control" v-show="selected_state_box && status_data" @click.stop>
                                    <label v-for="status in status_values" :key="status">
                                        <input type="checkbox" class="form-check-input" v-model="selected_state"
                                            :value="status">{{ status_name(status) }}
                                    </label>
                                </div>
                            </transition>
                        </div>
                        <div class="col-lg-6 col-12 d-flex gap-2 mt-lg-0 mt-3">
                            <input type="text" :placeholder="$t('order.column_code')" class="form-control w-75"
                                v-model="search_order_code">
                            <input type="text" :placeholder="$t('default.text_keyword')" class="form-control w-75" v-model="search_keyword">
                            <button type="button" class="btn search" @click="get_list_data('search')">{{$t('default.text_search')}}</button>
            
                        </div>
                    </div>
                </div>
                <!-- 資料 -->
                <div class="table-inner" v-if="data_category && list_data">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" class="form-check-input" v-model="all_selected"
                                        @change="all_select">
                                </th>
                                <th v-for="category in data_category" :key="category.key" v-show="category.selected">{{
                                    category.name }}</th>
                                <th class="">
                                    <select class="form-select-sm px-3" v-model="pageSize">
                                        <option value="10">{{page_language_txt(10)}}</option>
                                        <option value="30">{{page_language_txt(20)}}</option>
                                        <option value="50">{{page_language_txt(50)}}</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,idx) in show_data" :key="item.name">
                                <td>
                                    <input type="checkbox" class="form-check-input" v-model="checkboxes[idx]">
                                </td>
                                <td v-for="(category,idx) in data_category" :key="category.key" v-show="category.selected">
                                    <div :class="status_colors(category.key,item)">
                                        <div>
                                            <!-- {{ has_new_comments }} -->
                                        </div>
                                        {{show_table_data(category.key,item)}}
                                    </div>
                                </td>
                                <td>
                                    <nuxt-link :to="`/order-list/item?id=${item.id}`"
                                        class="method-btn btn-s">{{$t('default.text_view')}}</nuxt-link>
                                    <button type="button" class="method-btn btn-s" @click="submit_review(item.id)"
                                        v-if="is_Draft(item)">{{$t('order.text_submit_order')}}</button>
                                    <button type="button" class="method-btn btn-s" @click="approve_excel(item)"
                                        v-if="is_Pending(item) && store.is_dealer">{{$t('order.text_order_status_dealer_confirm')}}</button>
                                    <button type="button" class="method-btn btn-s" @click="return_review(item)"
                                        v-if="is_Pending(item) && store.is_dealer">{{$t('order.text_order_status_return_to_draft')}}</button>
                                    <button type="button" class="method-btn btn-s"
                                        @click="copy_data(item.id)">{{$t('default.text_copy')}}</button>
                                    <nuxtLink :to="`/order-list/item/note?id=${item.id}`" class="method-btn btn-s position-relative ">
                                        <div class="new-comment" v-if="item.unread_comment_count > 0" >
                                            {{ item.unread_comment_count }}
                                        </div>
                                        {{ $t('order.tab_comments') }}
                                    </nuxtLink>
                                    <button type="button" class="method-btn btn-s" @click="del_data(item.id)"
                                        v-if="is_Draft(item)">{{$t('default.text_delete')}}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="d-flex align-items-center gap-2 mt-2">
                        <button type="button" :disabled="!is_some_checked" class="btn link" @click="submit_approve()"
                        v-if="store.is_dealer">{{$t('default.column_batch_approve')}}</button>
                        <button type="button" :disabled="!is_some_checked" class="btn link" @click="del_data()"
                        >{{$t('default.column_batch_delete')}}</button>
                        <span class="table-info">預設為10天前資料，如需特定區間請使用搜尋功能。</span>
                    </div>
                </div>
                <div v-else class="text-center">
                    {{$t('order.text_no_orders')}}
                </div>
                <div class="pages" v-if="list_data.length > 0">
                    <button :disabled="currentPage === 1" @click="changPage(-1)">
                        <i class="fas fa-caret-left"></i>
                    </button>
                    <button v-for="(page, idx) in totalPages" :key="page" :class="pages_active(page)"
                        @click="changPage(page)"
                        v-show="page >= currentPageGroupStart && page <= currentPageGroupEnd || idx+1 == totalPages || idx+1 == 1">
                        <span v-if="idx+1 == totalPages && currentPage !== page && totalPages > 10">...</span>
                        {{ page }}
                        <span v-if="idx+1 == 1 && currentPage !== page && totalPages > 10">...</span>
                    </button>
                    <button :disabled="currentPage === totalPages" @click="changPage(-2)">
                        <i class="fas fa-caret-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>



    <!-- Modal -->
    <div class="modal fade list-setting" id="list-setting" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content p-4">
                <button type="button" id="close" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body text-center">
                    <h3 style="letter-spacing:2px;">{{$t('order.text_order_display_setting')}}</h3>
                    <!-- <span class="fs-xs">*訂單列表顯示項目</span> -->
                    <div class="row mt-4">
                        <div class="col-md-4 col-6 mb-3" v-for="category in data_category" :key="category.key"
                            v-show="category.key !== 'id'">
                            <label class="checkbox w-100" :class="{ 'checked': category.selected }">
                                <input type="checkbox" class="form-check-input me-2" v-model="category.selected">
                                {{ category.name }}
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 justify-content-center pb-4">
                    <button type="button" class="btn sent_go" data-bs-dismiss="modal" aria-label="Close">{{$t('default.text_save')}}</button>
                </div>
            </div>
        </div>
    </div>



</template>


<script setup>

// 匯出excel套件
import { saveAs } from 'file-saver'

// 時間套件
import flatpickr from 'flatpickr';
import {Mandarin} from 'flatpickr/dist/l10n/zh-tw.js';
import 'flatpickr/dist/flatpickr.min.css';

const { t, locale } = useI18n()
const store = useStore()
const show_export_box = ref(false)
const search_order_code = ref("")

const start_date = ref("")
const end_date = ref("")
const list_data = ref()
const status_data = ref()
const status_values = ref()

const checkboxes = ref([])

const all_selected = ref(false)

const data_category = ref()
const selected_state_box = ref(false)
const selected_state = ref([])
const search_keyword = ref("")
const route = useRoute()
const status_query = route.query.status


// 是否已有被勾選 
const is_some_checked = computed(()=>{
    return checkboxes.value.some(item => item == true)
})

// 檢查checkbox長度是否與資料長度一樣(防呆)
const is_length_match  = computed(()=>{
    return list_data.value.length == checkboxes.value.length
})


// 草稿狀態
const is_Draft = (item) =>{
    return item.status_code == 'Draft'
}
// 申請中
const is_Pending = (item) =>{
    return item.status_code == 'Pending'
}

// 表單header 順序這裡調
const language  = ref({
    code: t('order.column_code'),
    dealer_name: t('order.column_dealer_name'),
    material_name: t('order.text_material'),
    quantity: t('order.text_quantity'),
    customer_name: t('order.column_customer_name'),
    side_mark: t('order.column_side_mark'),
    sqm: t('order.column_sqm'),
    status_name: t('order.column_status'),
    created_at: t('order.column_order_date'),
    
    // salesperson_email:"下單者",
})

// 總平方米
const total_m2 = computed(() => {
    return list_data.value.reduce((sum, item) => {
        return sum + Number(item.sqm);
    }, 0);
});

// 總數量
const total_quantity = computed(() => {
    return list_data.value.reduce((sum, item) => {
        return sum + Number(item.quantity);
    }, 0);
});

// 表格資料
const show_table_data = (key,item)=>{
    if(key == 'created_at'){
        // 刪除秒數
        return item[key].slice(0, 16);
    }else{
        return item[key] || "-"
    }
}

// 當沒有任何品項被勾時，全選不打勾
watch(()=>checkboxes.value, (newVal, oldVal) => {
    if (!newVal.find(item => item === true)) {
        all_selected.value = false;
    }
},{
    deep: true 
});

// 全選
const all_select = ()=>{
    if(all_selected.value){
        checkboxes.value = checkboxes.value.map(()=>true)
    }else{
        checkboxes.value = checkboxes.value.map(()=>false)
    }
}

// 狀態顏色
const status_colors = (key,item) =>{
   if(key == 'status_name'){
    return store.status_colors(item.status_code)
   }
}


// 當前頁面
const currentPage = ref(1)
// 一頁顯示幾筆
const pageSize = ref(10)

// 顯示幾筆的語言文字
const page_language_txt = (value)=>{
    return t('default.text_row_limit').replace(':number',value)
}

//* 算出總共幾頁
const totalPages = computed(() => {
    return Math.ceil(list_data.value.length / +pageSize.value);
});

//* 換頁
const changPage = (page) => {
  switch (true) {
    case page == -1:
      currentPage.value--;
      break;
    case page == -2:
      currentPage.value++;
      break;
    default:
      currentPage.value = page;
      break;
    }
  //! 拉至視窗上
  document.querySelector(".table").scrollIntoView({ behavior: "smooth" });
}

// 當前頁面class
const pages_active = (page)=>{
    return currentPage.value == page? 'pages-active':null
}

// 計算頁數起始頁
const currentPageGroupStart = computed(() => {
  return Math.floor((currentPage.value - 1) / 6) * 6 + 1;
});

// 計算頁數結束頁
const currentPageGroupEnd = computed(() => {
  return Math.min(currentPageGroupStart.value + 6, totalPages.value);
});

// 顯示資料
const show_data = computed(()=>{
    const start = (currentPage.value - 1) * pageSize.value;
    const end = currentPage.value * pageSize.value;
    return list_data.value.slice(start,end)
})

// 種類顯示設定資料
const data_change_category = () => {
    if(store.is_dealer || store.is_corporate){
        language.value.salesperson_name = t('order.text_order_comment_identity_salesperson')
    }
    console.log(list_data.value);
    if (list_data.value.length > 0) {
        const key_name = Object.keys(list_data.value[0]) // 先獲取訂單的所有key
        const category = key_name.filter(item => {
            const language_keys = Object.keys(language.value);  // 設置顯示語言
            const is_key = language_keys.includes(item); // 訂單key是否包含語言有的key值
            return is_key
        }).map(item => {
            return { key: item, selected: true, name: language.value[item] };  // 設置key,checkbox,語言文字
        });
        
        // 調整排序
        const new_category = Object.keys(language.value).map(key => {
            const cat_idx = category.find(cat_idx => cat_idx.key === key);
            return cat_idx ? { key: key, selected: true, name: cat_idx.name } : null;
        }).filter(item => item !== null);
        
        data_category.value = new_category
    }
}

// 複製
const copy_data = async(id)=>{
    const confirmed =  confirm(t('order.text_confirm_copy'))
    if (confirmed){
        store.show_loading(true)
        const url = `${store.baseUrl}api/v2/sales/orders/copyOrder/${id}`
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + store.userData.access_token
                },
                body: ""
            })
            const data = await res.json()
            if (res.ok) {
                alert(data.success || data.error)
                await get_list_data()
            }
        } catch (err) {
            console.log('error', err);
        }





        // const copy_item = await get_order_data(id)
        // // 刪除id & 時間
        // delete copy_item.code
        // delete copy_item.created_at
        // delete copy_item.updated_at
        // delete copy_item.id
        // copy_item.status_code = 'Draft'
        // delete copy_item.order_date
        // // 選項刪除id & 時間
        // copy_item.order_products.map(item =>{
        //     delete item.order_id;
        //     delete item.id
        //     Object.keys(item.order_product_options).forEach(key => {
        //         delete item.order_product_options[key].id;
        //         delete item.order_product_options[key].order_product_id;
        //         delete item.order_product_options[key].sort_order;
        //         delete item.order_product_options[key].created_at;
        //         delete item.order_product_options[key].updated_at;
        //         if(item.order_product_options[key].type == 'checkbox'){
        //         // checkbox 刪除id
        //         Object.values(item.order_product_options[key].option_values).map(item =>{
        //             delete item.id
        //             delete item.sort_order
        //         })
        //     }
        //     });
            
        // })
        // // console.log(copy_item);
        // await Save_order(copy_item)
        store.show_loading(false)

    }
}

// 刪除訂單
const del_data = async(id)=>{
    const confirmed =  confirm(t('order.text_confirm_delete'))
    if (confirmed && is_length_match.value) {
        store.show_loading(true)
        const del_data = new FormData()
        const url = `${store.baseUrl}api/v2/sales/orders/deleteOrder/${id}`
    
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + store.userData.access_token
                },
                body: ""
            })
            const data = await res.json()
            if (res.ok) {
                alert(data.success || data.error)
                await get_list_data()
            }
        } catch (err) {
            console.log('error', err);
        }
        store.show_loading(false)
    }
}

// 獲取該筆訂單資訊
const get_order_data = async(id)=>{
    const url = `${store.baseUrl}api/v2/sales/orders/info?locale=${locale.value}&equal_id=${id}`
    try{
        const res = await fetch(url,{
            headers:{
                "Authorization": "Bearer " + store.userData.access_token
            }
        })
        const data = await res.json()
        if(res.ok){
            return data.response
        }
    }catch(err){
        console.log('error',err);
    }
}

// 複製儲存訂單
const Save_order = async (item) => {
    const url = `${store.baseUrl}api/v2/sales/orders/save?locale=${locale.value}`
    const news_form_data = store.jsonToFormData(item)
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + store.userData.access_token
            },
            body: news_form_data
        })
        const data = await res.json()
        console.log(res)
        if (res.ok) {
            // console.log('post_data', data)
        }
    } catch (err) {
        console.log('error', err);
    }
    get_list_data()
}

// 審核
const submit_review = async (id) => {
    const confirmed = confirm(t('order.text_confirm_submit'))
    if (confirmed) {
        store.show_loading(true)
        const url = `${store.baseUrl}api/v2/sales/orders/apply?locale=${locale.value}`
        const formData = {
            order_id: id
        }
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + store.userData.access_token
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            // console.log(res);
            // console.log(data);
            if(data.success){
                alert(data.success);
            }else if (data.error){
                alert(data.error.status_code)
            }
        } catch (err) {
            console.log('error', err);
        }
        await get_list_data()
        store.show_loading(false)

    }
}

// 經銷商退回訂單
const return_review = async (item) => {
    const confirmed = confirm(t('order.text_confirm_return'))
    if (confirmed) {
        store.show_loading(true)
        const url = `${store.baseUrl}api/v2/sales/orders/status/dealerReturn/${item.id}?locale=${locale.value}`
        const formData = {
            status_code: item.status_code
        }
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + store.userData.access_token
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            // console.log(res);
            // console.log(data);
            if(data.success){
                alert(data.success);
            }else if (data.error){
                alert(data.error.status_code)
            }
        } catch (err) {
            console.log('error', err);
        }
        await get_list_data()
        store.show_loading(false)

    }
}

// 經銷商審核(送出訂單)
const submit_approve = async (item) => {
    const formData = new FormData()
    let url
    if (item) {
        store.show_loading(true)
        url = `${store.baseUrl}api/v2/sales/orders/status/dealerApprove/${item.id}?locale=${locale.value}`
        formData.append('status_code', item.status_code)
    } else {
        url = `${store.baseUrl}api/v2/sales/orders/status/dealerApproveMany?locale=zh_Hant`
        const batch_data = list_data.value.filter((item, idx) => checkboxes.value[idx])
        console.log(batch_data);
        batch_data.forEach(item => {
            formData.append('order_ids[]', item.id)
        })
    }
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + store.userData.access_token
            },
            body: formData
        })
        const data = await res.json()
        if (res.ok) {
            alert(data.success || data.error)
        }
    } catch (err) {
        console.log('error', err);
    }
}
// 經銷商審核(excel)
const approve_excel = async(item)=>{
    const confirmed = confirm(t('order.text_confirm_send'))
    if (confirmed) {
        const data = await get_order_data(item.id)
        const excel = store.exportTable(data, 'mail')
        const url = `${store.baseUrl}api/v2/sales/orders/saveExcel?locale=${locale.value}`
        const formData = new FormData
        formData.append("order_id", item.id)
        formData.append("order_code", item.code)
        formData.append("order-excel", excel)
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + store.userData.access_token
                },
                body: formData
            })
            const res_data = await res.json()
            if (res_data.success) {
                submit_approve(item)
            }
        } catch (err) {
            console.log('error', err);
        }
        await get_list_data()
        store.show_loading(false)
    }  
}

// 資料
const get_list_data = async(search)=>{
    store.show_loading(true)
    // 今日
    const now = new Date();
    const todayDate = now.toISOString().substring(0, 10); // 只保留日期部分

    // 10天前
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const tenDaysAgoDate = tenDaysAgo.toISOString().substring(0, 10); // 只保留日期部分

    // 預設業務
    let url = `${store.baseUrl}api/v2/sales/orders/list?locale=${locale.value}&equal_salesperson_id=${store.userData.member_id}&limit=0`
    // 經銷商
    if(store.is_dealer){
        url = `${store.baseUrl}api/v2/sales/orders/list?locale=${locale.value}&equal_dealer_id=${store.userData.employer_company_id}&limit=0`
    }
    const default_time_zone = `&filter_order_date=${tenDaysAgoDate}-${todayDate}`
    url = url + default_time_zone

    // 搜尋
    if(search || status_query){
        // status_query = 從首頁直接點擊獲取經銷商已審核完成訂單
        const state = selected_state.value.length > 0 ? selected_state.value:status_query
        // 有選狀態加參數
        if(state){
            url = url + `&filter_status_codes=${state}`
        }
         // 有輸入編號加參數
        if(search_order_code.value){
            url= url + `&equal_code=${search_order_code.value}`
        }
        // 有輸入日期加參數
        if(start_date.value){
            url = url.replace(default_time_zone,"")
            console.log(url);
            url = url + `&filter_order_date=${start_date.value}-${end_date.value}`
        }
        // 有輸入關鍵字加參數
        if(search_keyword.value){
            url = url + `&filter_keyword=${search_keyword.value}`
        }
    }
    // console.log(url);
    try{
        const res = await fetch(url,{
             headers:{
                "Authorization": "Bearer " + store.userData.access_token
            }
        })
        const data = await res.json()
        
        if(res.ok){
            list_data.value = data.response.data
            data_change_category()
            console.log(list_data.value);
            console.log(data_category.value)
            
            // for(let i = 0;i<300;i++){
            //     list_data.value.push(data.response.data[0])
            // }
            
            // console.log(list_data.value);
            // console.log(data.response);
             // 設置checkbox 數量
            checkboxes.value = list_data.value.map(()=>false)
        }

    }catch(err){
        console.log('error',err);
    }
    store.show_loading(false)
}

const picker_locale = computed(()=>{
    return locale.value == 'en'? 'en':'zh_tw'
})

// 日期套件
const set_picker = ()=>{
    // console.log(picker_locale.value);
    flatpickr("#datePicker", {
    locale:picker_locale.value,
    dateFormat: "Y-m-d",  // 設定開始日期和時間格式
    });
    flatpickr("#datePicker2", {
    locale:picker_locale.value,
    dateFormat: "Y-m-d",  // 設定結束日期和時間格式
    });
}


const get_status_data = async()=>{
    const url = `${store.baseUrl}api/v2/sales/orders/resource?locale=${locale.value}`
    try{
        const res = await fetch(url,{
             headers:{
                "Authorization": "Bearer " + store.userData.access_token
            }
        })
        const res_data = await res.json()
        if(res_data.success){
            status_data.value = res_data.response.statuses
            status_values.value = Object.keys(res_data.response.statuses)
        }
    }catch (err) {
        console.log(err);
    }
}





const status_name = (code)=>{
    if(status_data.value){
        return status_data.value[code]
    }
}


store.show_loading(true)

onMounted(async() => {
    await get_list_data()
    get_status_data()
    await data_change_category()
    set_picker()
    store.show_loading(false)
})

</script>