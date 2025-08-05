<template>
    <section class="bg-block">
        <div class="container">
            <VeeForm class="table-box" @submit="onSubmit" v-slot="{ errors}">
                <h2 class="title">{{ $t('order.text_information') }}</h2>
                <div class="my-4">
                    <nuxt-link :to="prev_page" class="btn link">{{ $t('default.text_back') }}</nuxt-link>
                </div>
                <div class="row" v-if="userData">
                    <div class="col-lg-6 px-4 mb-lg-0 mb-4">
                        <h3 class="title fs-3 mb-4">{{$t('order.text_salesperson_information')}}</h3>
                        <div class="row bg-body p-4" style="border-radius: 5px;">
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                    <span class="col-4 ">{{$t('order.column_dealer_code')}}</span>
                                    <div class="col" v-if="!order_id">{{ userData.employer_company_code }}</div>
                                    <div class="col" v-else>{{ order_info.dealer_code }}</div>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                     <span class="col-4 ">{{$t('order.column_tax_id_num')}}</span>
                                    <div class="col" v-if="!order_id">{{ userData.tax_id_num }}</div>
                                    <div class="col" v-else>{{ order_info.dealer?.tax_id_number }}</div>
                                </div>
                            </div>
                            <div class="col-md-12  mb-2">
                                <div class="user-data">
                                    <span class="col-xxl-2 col-4">{{$t('order.column_company_name')}}</span>
                                    <div class="col" v-if="!order_id">{{ userData.employer_company_name }}</div>
                                    <div class="col" v-else>{{ order_info.dealer_name }}</div>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                    <span class="col-4">{{$t('order.column_salesperson_name')}}</span>
                                    <div class="col" v-if="!order_id">{{ userData.name }}</div>
                                    <div class="col" v-else>{{ order_info.salesperson_name }}</div>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                     <span class="col-4 ">{{$t('order.column_salesperson_email')}}</span>
                                    <div class="col" v-if="!order_id">{{ userData.email }}</div>
                                    <div class="col" v-else>{{ order_info.salesperson_email }}</div>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                     <span class="col-4 ">{{$t('order.column_salesperson_mobile')}}</span>
                                    <div class="col" v-if="!order_id">{{ userData.mobile }}</div>
                                    <div class="col" v-else>{{ order_info.salesperson_mobile }}</div>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                     <span class="col-4 ">{{$t('order.column_salesperson_telephone')}}</span>
                                    <div class="col" v-if="!order_id">{{ userData.telephone }}</div>
                                    <div class="col" v-else>{{ order_info.salesperson_telephone }}</div>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                     <span class="col-4 ">{{$t('member.column_country')}}</span>
                                    <div class="col" v-if="is_ship_to_me">
                                        <div v-if="!order_id">{{ userData.country_name }}</div>
                                        <div v-else>{{ order_info.shipping_country_code }}</div>
                                    </div>
                                    <div class="col" v-else></div>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                     <span class="col-4 ">{{$t('member.column_zip_code')}}</span>
                                    <div class="col" v-if="is_ship_to_me">
                                        <div v-if="!order_id">{{ userData.zip_code }}</div>
                                        <div v-else>{{ order_info.shipping_zip_code }}</div>
                                    </div>
                                    <div class="col" v-else></div>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                     <span class="col-4 ">{{$t('member.column_state')}}</span>
                                    <div class="col" v-if="is_ship_to_me">
                                        <div v-if="!order_id">{{ userData.state }}</div>
                                        <div v-else>{{ order_info.shipping_state }}</div>
                                    </div>
                                    <div class="col" v-else></div>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-12  mb-2">
                                <div class="user-data">
                                     <span class="col-4 ">{{$t('member.column_city')}}</span>
                                     <div class="col" v-if="is_ship_to_me">
                                        <div v-if="!order_id">{{ userData.city }}</div>
                                        <div v-else>{{ order_info.shipping_city }}</div>
                                     </div>
                                     <div class="col" v-else></div>
                                </div>
                            </div>
                            <div class="col-md-12  mb-2">
                                <div class="user-data">
                                    <span class="col-2">{{$t('member.column_address1')}}</span>
                                    <div class="col" v-if="is_ship_to_me">
                                        <div v-if="!order_id">{{ userData.address1 }}</div>
                                        <div v-else>{{ order_info.shipping_address1 }}</div>
                                    </div>
                                    <div class="col" v-else></div>
                                </div>
                            </div>
                            <div class="col-md-12  mb-2">
                                <div class="user-data">
                                    <span class="col-2">{{$t('member.column_address2')}}</span>
                                    <div class="col" v-if="is_ship_to_me">
                                        <div v-if="!order_id">{{ userData.address2 }}</div>
                                        <div v-else>{{ order_info.shipping_address2 }}</div>
                                    </div>
                                    <div class="col" v-else></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 px-4 d-flex flex-column">
                        <h3 class="title fs-3 mb-4">{{$t('order.text_customer_information')}}</h3>
                        <div class="box_shadow flex-auto p-4 px-5" style="border-radius: 5px;">
                            <div class="col-md-12 mb-3">
                                <label class="col-3 form-label"> <span class="text-danger">*</span>{{$t('order.column_shipping_to')}}</label>
                                <VeeField 
                                    as="select" 
                                    name="delivery_method" 
                                    :class="{ 'error': errors['delivery_method']}"
                                    class="form-select"
                                    v-model="order_info.delivery_method"
                                    rules="required"
                                    >
                                    <option value="pickup">{{ $t('order.text_delivery_method_pickup') }}</option>
                                    <option value="delivery">{{ $t('order.text_delivery_method_delivery') }}</option>
                                </VeeField>
                                <VeeErrorMessage class="error__label" name="delivery_method" />
                            </div>
                            <div class="col-md-12 mb-3">
                                <label class="col-3 form-label"> <span class="text-danger">*</span>{{$t('order.column_customer_first_name')}}</label>
                                <VeeField 
                                    type="text" 
                                    class="form-control" 
                                    :class="{ 'error': errors['customer_first_name'] }" 
                                    name="customer_first_name"
                                    v-model="order_info.customer_first_name"
                                    rules="required"/>
                                <VeeErrorMessage class="error__label" name="customer_first_name" />
                            </div>
                            <div class="col-md-12 mb-3">
                                <label class="col-3 form-label"> <span class="text-danger">*</span>{{$t('order.column_customer_last_name')}}</label>
                                <VeeField 
                                    type="text" 
                                    class="form-control" 
                                    :class="{ 'error': errors['customer_last_name'] }" 
                                    name="customer_last_name" 
                                    v-model="order_info.customer_last_name"
                                    rules="required"/>
                                <VeeErrorMessage class="error__label" name="customer_last_name" />
                            </div>
                            <div class="col-md-12 mb-3">
                                <label class="col-3 form-label"> <span class="text-danger">*</span>{{$t('order.column_side_mark')}}</label>
                                <VeeField 
                                    type="text" 
                                    class="form-control" 
                                    :class="{ 'error': errors['side_mark'] }"
                                    name="side_mark" 
                                    v-model="order_info.side_mark"
                                    rules="required"/>
                                <VeeErrorMessage class="error__label" name="side_mark" />
                            </div>
                            <div class="col-md-12 mb-3">
                                <label class="col-3 form-label">{{$t('order.text_option_section_note')}}</label>
                                <VeeField 
                                    as="textarea"
                                    class="form-control" 
                                    :class="{ 'error': errors['note'] }"
                                    v-model="order_info.note"
                                    name="note"/>
                                <VeeErrorMessage class="error__label" name="note" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-5">
                    <button type="submit" class="btn sent_go" v-if="order_id && is_Draft">{{$t('default.text_save')}}</button>
                    <button type="submit" class="btn sent_go" v-if="!order_id">{{$t('default.text_continue')}}</button>
                </div>
            </VeeForm>
        </div>
    </section>




</template>


<script setup>
const { locale } = useI18n()
const localePath = useLocalePath()
const store = useStore()
const { userData } = storeToRefs(store)
const router = useRouter()
const route = useRoute()
const order_id = route.query.id


const order_info = ref({})

const text = ref()


const is_ship_to_me = computed(()=>{
    return order_info.value.delivery_method == 'delivery'
})

const is_Draft = computed(() =>{
    return order_info.value.status_code == 'Draft'
})



// 返回的路徑
const prev_page = computed(()=>{
    return order_id? localePath(`/order-list/item?id=${order_id}`):localePath('/home')
})
const dayjs = useDayjs()


const onSubmit = async(values)=>{
  const now  = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const timezone = userData.value.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = {
        // 運送方式
        delivery_method:values.delivery_method,
        // 經銷商(資訊)
        dealer_id:userData.value.employer_company_id,
        dealer_name:userData.value.employer_company_name,
        employer_company_code:userData.value.employer_company_code,
        // 業務
        salesperson_id:userData.value.id,
        salesperson_first_name:userData.value.first_name,
        salesperson_last_name:userData.value.last_name,
        salesperson_email:userData.value.email,
        salesperson_telephone:userData.value.telephone || "",
        salesperson_mobile:userData.value.mobile || "",
        
        // 客戶
        customer_first_name:values.customer_first_name,
        customer_last_name:values.customer_last_name,
        shipping_recipient:values.customer_last_name + values.customer_first_name,
        customer_email:userData.value.email,
        status_code:"Draft",
        side_mark:values.side_mark,
        note:values.note || "",
        tax:userData.value.tax_id_number || "",
        order_date: now,
        shipping_date: '',
        delivery_date: '',
        timezone
    }
    if(is_ship_to_me.value && (order_info.value.salesperson_id == userData.value.user_id || !order_id)){
        // 運送
        data.shipping_country_code = userData.value.country_code || ""
        // data.shipping_country_name = userData.value.country_name || "",
        data.shipping_zip_code = userData.value.zip_code || ""
        data.shipping_state = userData.value.state || ""
        data.shipping_city = userData.value.city || ""
        data.shipping_address1 = userData.value.address1 || ""
        data.shipping_address2 = userData.value.address2 || ""
    }
    if(order_id){
        data.order_id = order_id
        data.material = order_info.value.material
        data.quantity = order_info.value.quantity
        data.sqm = order_info.value.sqm
        data.status_code = data.status_code
    }
    // console.log(data);
    try{
      const res = await $api.sales.saveOrderHeader(data, locale.value)
        if(order_id){
            // 路由參數有id則返回列表頁
            router.push(localePath(`/order-list/item?id=${order_id}`))
        }else if(res.order_id){
            // 則往新增頁
            router.push(localePath(`/create_order/order?id=${res.order_id}`))
        }
    }catch(err){
        console.log(err);
    }
}

// 會員資料
const { $j } = useNuxtApp()

// 訂單資料
const get_order_data = async()=>{
  const params = {
    locale: locale.value,
    equal_id: order_id
  }
    try{
      const res = await $api.sales.ordersInfo(params)
        if(res.success){
          order_info.value = res.response
            // 不是草稿且有訂單id則不能修改
            if (!is_Draft.value && order_id) {
                nextTick(() => {
                    $j('.table-box input').attr('disabled', true)
                    $j('.table-box select').attr('disabled', true)
                    $j('.table-box textarea').attr('disabled', true)
                })
    }
        }
    }catch(err){
        console.log(err);
    }
}

onMounted(async()=>{
    if(order_id){
        await get_order_data()
    }
})
</script>