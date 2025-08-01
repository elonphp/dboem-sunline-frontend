<template>
    <section class="bg-block">
        <div class="container">
            <div class="table-box" v-if="order_info">
                <div class="d-flex align-items-center justify-content-between flex-wrap mb-4 gap-4">
                    <div class="d-flex align-items-center gap-4">
                        <h2 class="title">{{ order_info.code }}</h2>
                        <div class="tag tag-material tag-blue">{{order_info.material_name || 'N/A'}}</div>
                        <div class="tag" :class="store.status_colors(order_info.status_code)">{{order_info.status_name}}</div>
                    </div>
                    <div class="total-data">
                        <div>
                            <span>{{ $t('order.text_product_items') }}：</span>
                            <span class="fw-bold">{{ list_data.length }}</span>
                        </div>
                        <div>
                            <span>{{ $t('order.column_total_quantity') }}：</span>
                            <span class="fw-bold">{{ total_quantity }}</span>
                        </div>
                        <div>
                            <span>{{ $t('order.text_total_sqm') }}(m2)：</span>
                            <span class="fw-bold">{{ total_sqm }}</span>
                        </div>
                    </div>
                </div>              
                <div class="d-flex align-items-center gap-3 mb-4">
                    <nuxt-link :to="localePath('/order-list')" class="btn link">{{$t('default.text_back')}}</nuxt-link>
                    <nuxt-link :to="localePath(`/create_order?code=${order_info.code}&id=${order_id}`)" class="btn link">{{$t('order.text_information')}}</nuxt-link>
                    <nuxt-link :to="localePath(`/create_order/order?id=${order_id}&main=${order_info.material}`)" v-if="list_data.length > 0 && is_Draft" class="btn link">{{$t('default.text_add')}}{{$t('order.tab_products')}}</nuxt-link>
                    <nuxt-link :to="localePath(`/create_order/order?id=${order_id}`)" v-else-if="is_Draft" class="btn link">{{$t('default.text_add')}}{{$t('order.tab_products')}}</nuxt-link>
                    <button class="btn link" @click="exportTable(0)">{{$t('default.text_export')}}</button>
                    <nuxt-link :to="localePath(`/order-list/item/note?id=${order_id}`)" class="btn link">{{$t('order.tab_comments')}}</nuxt-link>
                </div>
                <div class="table-inner">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" class="form-check-input" v-model="all_selected" @change="all_select">
                                </th>
                                <th>{{ $t('default.column_sort_order') }}</th>
                                <th>{{ $t('order.tab_products') }}</th>
                                <th>{{ $t('order.text_position') }}</th>
                                <th>{{ $t('order.text_width') }}(mm)</th>
                                <th>{{ $t('order.text_height') }}(mm)</th>
                                <th>{{ $t('order.text_quantity') }}</th>
                                <th>{{ $t('order.text_outer_frame') }}</th>
                                <th>{{ $t('order.text_color') }}</th>
                                <th>{{ $t('order.column_sqm') }}(m2)</th>
                                <th class="pe-5 col-2">
                                    <select class="form-select-sm px-3" v-model="pageSize">
                                        <option value="10" selected>{{ page_language_txt(10) }}</option>
                                        <option value="30">{{ page_language_txt(30) }}</option>
                                        <option value="50">{{ page_language_txt(50) }}</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in show_data" :key="'item_' + idx">
                                <td><input type="checkbox" class="form-check-input" v-model="checkboxes[idx]"></td>
                                <!-- <td>{{ idx + 1 }}</td> -->
                                <td>{{ (currentPage - 1) * pageSize + idx+1 }}</td>
                                <td>{{ item.name}}</td>
                                <td>{{ item.order_product_options.win_position?.value }}</td>
                                <td>{{ item.order_product_options.win_width?.value }}</td>
                                <td>{{ item.order_product_options.win_height?.value }}</td>
                                <td>{{ item.quantity}}</td>
                                <td>{{ outer_frame(item) }}</td>
                                <td>{{ item.order_product_options[`${order_info.material}_color`]?.value }}</td>
                                <td>{{ item.sqm }}</td>
                                <td class="col-2" v-if="is_Draft">
                                    <button type="button" class="method-btn btn-s" @click="copy_product(item)">{{$t('default.text_copy')}}</button>
                                    <nuxtLink :to="localePath(`/order-list/item/product?id=${order_id}&product=${item.id}&main=${order_info.material}`)" class="method-btn btn-s">{{$t('default.text_edit')}}</nuxtLink>
                                    <button type="button" class="method-btn btn-s" @click="delete_product(item)">{{$t('default.text_delete')}}</button>
                                </td>
                                <td class="col-2" v-else>
                                    <nuxtLink :to="localePath(`/order-list/item/product?id=${order_id}&product=${item.id}&main=${order_info.material}&view=1`)" class="method-btn btn-s">{{$t('default.text_view')}}</nuxtLink>
                                    <nuxtLink v-if="(is_pending && store.is_dealer)" :to="localePath(`/order-list/item/product?id=${order_id}&product=${item.id}&main=${order_info.material}`)" class="method-btn btn-s">{{$t('default.text_edit')}}</nuxtLink>
                                    <button type="button" class="method-btn btn-s" v-if="is_pending && store.is_dealer" @click="copy_product(item)">{{$t('default.text_copy')}}</button>
                                    <button v-if="(is_pending && store.is_dealer)" type="button" class="method-btn btn-s" @click="delete_product(item)">{{$t('default.text_delete')}}</button>
                                </td>
                            </tr>
                               
                        </tbody>
                    </table>
                    <button type="button" class="btn link mt-2" :disabled="!is_some_checked" @click="delete_product()" v-show="is_Draft">{{$t('default.column_batch_delete')}}</button>
                </div>
                <div class="pages" v-if="list_data.length > 0">
                    <button :disabled="currentPage === 1" @click="changPage(-1)">
                        <i class="fas fa-caret-left"></i>
                    </button>
                    <button v-for="(page, idx) in totalPages" :key="page" :class="pages_active(page)" @click="changPage(page)">
                        {{ page }}
                    </button>
                    <button :disabled="currentPage === totalPages" @click="changPage(-2)">
                        <i class="fas fa-caret-right"></i>
                    </button>
                </div>
                <div class="d-flex align-items-center justify-content-center gap-4 mt-5">
                    <button class="btn cancel" @click="delete_order" v-if="is_Draft">{{$t('default.text_delete')}}{{$t('order.text_order')}}</button>
                    <button class="btn cancel" @click="return_review" v-if="is_pending && store.is_dealer">{{$t('order.text_order_status_return_to_draft')}}</button>
                    <button class="btn sent_go" @click="submit_review" v-if="is_Draft && list_data.length > 0">{{$t('order.text_submit_order')}}</button>
                    <button class="btn sent_go" @click="submit_corporate" v-if="is_pending && store.is_dealer">{{$t('order.text_order_status_dealer_confirm')}}</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

const { t, locale } = useI18n()
const localePath = useLocalePath()
const store = useStore()
const route = useRoute()
const router = useRouter()
const list_data = ref([])
const order_info = ref()
const all_selected = ref(false)
const checkboxes = ref([])
const order_id = route.query.id


// 當前頁面
const currentPage = ref(1)
// 一頁顯示幾筆
const pageSize = ref(10)

// 顯示幾筆的語言文字
const page_language_txt = (value)=>{
    // return 1
    return t('default.text_row_limit').replace(':number',value)
}

// 狀態 = 草稿
const is_Draft = computed(() =>{
    return order_info.value.status_code == 'Draft'
})

// 狀態 = 申請中
const is_pending = computed(()=>{
    return order_info.value.status_code == 'Pending'
})

// 是否已有被勾選 
const is_some_checked = computed(()=>{
    return checkboxes.value.some(item => item == true)
})

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

// 無外框顯示 N/A
const outer_frame = (item)=>{
    const outer_frame = item.order_product_options[order_info.value.material + '_win_frame']?.value
    return outer_frame?  outer_frame: "N/A"
}

// 總數
const total_quantity = computed(()=>{
    return list_data.value.reduce((acc,item)=>{
        acc += +item.quantity
        return acc
    },0)
})

// 總sqm
const total_sqm = computed(()=>{
    return list_data.value.reduce((acc,item)=>{
        acc += +item.sqm
        return acc
    },0)
})


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

// 顯示資料
const show_data = computed(()=>{
    const start = (currentPage.value - 1) * pageSize.value;
    const end = currentPage.value * pageSize.value;
    return list_data.value.slice(start,end)
})



// 複製
const copy_product = async(item)=>{
        try {
            const res = await $api.sales.ordersCopyOrderProduct(item.id)
            alert(res.success)
            await up_date()
        } catch (err) {
            console.log('copy_product', err);
        }
        await get_data()
}

// 刪除

const delete_product = async(item)=>{
    // 顯示確認視窗，詢問是否要刪除
    const confirmed = confirm(t('order.text_confirm_delete'));
    if (!confirmed) return;

    // 儲存要刪除的商品 ID
    let del_item_ids = [];

    // 如果沒有傳入 item，表示是多選刪除
    if (!item) {
        del_item_ids = list_data.value.reduce((acc, curr, idx) => {
            if (checkboxes.value[idx]) acc.push(curr.id); // 有勾選就加入陣列
            return acc;
        }, []);
    } else {
        // 單筆刪除的情況
        del_item_ids.push(item.id);
    }

    let lastSuccessMessage = ""; // 儲存最後一筆成功的訊息

    // 逐筆執行刪除
    for (const id of del_item_ids) {
        try {
            // 發送 POST 請求進行刪除
            const res = await $api.sales.ordersDeleteOrderProduct(order_id, id)
            // 若成功，顯示一次成功訊息（可視需求取消或修改）
            if (res.success) {
                // alert(data.success);
                lastSuccessMessage = res.success;
            }else {
                lastSuccessMessage = res.message;
            }
            
        } catch (err) {
            // 發生錯誤時印出錯誤訊息到 console（開發用）
            console.error(`刪除失敗${id}`, err);
        }
    }

    // 刪除完成後重新取得資料
    await up_date()

    if (lastSuccessMessage) {
        alert(lastSuccessMessage);
    }
    }


// 審核
const submit_review = async () => {
    const confirmed = confirm(t('order.text_confirm_submit'))
    if (confirmed) {
        const formData = {
            order_id: order_id
        }
        try {
            const res = await $api.sales.ordersApply(formData, locale.value)
            if (res.success) {
              alert(res.success)
            }
        } catch (err) {
            console.log('submit_review', err);
        }
        await get_data()
    }
}

// 審核退回
const return_review = async () => {
    const confirmed = confirm(t('order.text_confirm_return'))
    if (confirmed) {
        const formData = {
            status_code: order_info.value.status_code
        }
        try {
            const res = await $api.sales.ordersStatusDealerReturn(formData, order_id, locale.value)
            if(res.success){
                alert(res.success);
            }else if (res.error){
                alert(res.error.status_code)
            }
        } catch (err) {
            console.log('return_review', err);
        }
        await get_data()
    }
}

// 送出訂單
const submit_corporate = async ()=>{
    const confirmed = confirm(t('order.text_confirm_send'))
    approve_excel()
    if (confirmed) {
        const formData = {
            status_code: order_info.value.status_code
        }
        try {
            const res = await $api.sales.ordersStatusDealerApprove(formData, order_id, locale.value)
            if(res.success){
                alert(res.success)
            }
        } catch (err) {
            console.log('submit_corporate', err);
        }
        await get_data()
    }
}
// 寄信
const approve_excel = async()=>{
    const excel = store.exportTable(order_info.value,'mail', locale.value)
    const formData = new FormData
    formData.append("order_id",order_info.value.id)
    formData.append("order_code",order_info.value.code)
    formData.append("order-excel",excel)
    try{
        await $api.sales.ordersSaveExcel(formData, locale.value)
    }catch (err) {
        console.log('approve_excel', err);
    }
}



// 刪除訂單
const delete_order = async()=>{
    const confirmed =  confirm(t('order.text_confirm_delete'))
    if (confirmed) {
        try {
            const res = await $api.sales.ordersDestroy(order_id)
            if (res.success) {
                alert(res.success)
                router.push(localePath('/order-list'))
            }
        } catch (err) {
            console.log('delete_order', err);
        }
    }
}

// 更新資料
const up_date = async () => {
    await get_data()
    const data = {...order_info.value}
    console.log(data);
    // 如果目前沒有材質則從網址路徑抓
    if(!data.material){
        data.material = route.query.material
    }
    // 如果沒有資料的話清空
    else if(data.order_products.length <= 0){
        data.material = ""
    }
    
    data.order_id = data.id
    data.quantity = total_quantity.value

    delete data.order_products

    
    try{
        await $api.sales.saveOrderHeader(data, locale.value)
        // 更新完如果網址路徑還有材質的code則清空網址路徑
        if(route.query.material){
            router.push(localePath(`/order-list/item?id=${order_id}`))
        }
        
    }catch(err){
        console.log(err);
    }
    await get_data()
}


const get_data = async()=>{
    try{
      const res = await $api.sales.ordersInfoById(order_id, locale.value)        
      order_info.value = res.response
      list_data.value = res.response.order_products
      // console.log('get',list_data.value);
      // console.log('order',order_info.value);
      // 設置checkbox 數量
      checkboxes.value = list_data.value.map(()=>false)
        
    }catch(err){
        console.log('get_data',err);
        // router.push('/error')
    }
    
}

const exportTable = ()=>{
    store.exportTable(order_info.value, null, locale.value)
}


onMounted(async()=>{
    await up_date()
})

</script>