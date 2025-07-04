<template>
    <section class="bg-block d-flex align-items-center" >
        <div class="container-xl">
            <div class="row mb-5" v-if="!store.loading && order">
                <template v-for="(item, idx) in link" :key="'link_' + idx">
                    <div class="col-lg-3 col-md-6 mb-lg-0 mb-4" v-if="is_access(item.roles)">
                        <nuxt-link class="btn-home" :to="item.router">
                            <i class="fas" :class="item.icon"></i>
                            <h2>
                                {{ item.title }}
                            </h2>
                        </nuxt-link>
                    </div>
                </template>
                <div class="col-lg-4 col-md-6 mt-5" v-for="(item,idx) in order" :key="'order_' + idx">
                    <nuxt-link :to="`order-list/item?id=${item.id}`" class="home-order">
                        <div class="createtime">
                            <span class="fw-bold">{{item.created_at.slice(0, 16)}}</span>
                            <span class="tag m-0" :class="store.status_colors(item.status_code)">{{item.status_name}}</span>
                        </div>
                        <div class="pt-2"><span class="fw-bold">{{ $t('order.column_code') }}：</span>{{item.code }}</div>
                        <div>
                            <span class="fw-bold">{{ $t('order.column_customer_name') }}：</span>{{item.customer_name}}
                        </div>
                        <div>
                            <span class="fw-bold">{{ $t('member.column_address1') }}：</span>{{item.shipping_address1}}{{ item.shipping_address2 }}
                        </div>
                        <div>
                            <span class="fw-bold">{{ $t('order.column_total_quantity') }}：</span>{{item.quantity}}
                        </div>
                        <div>
                            <span class="fw-bold">{{ $t('order.column_sqm') }}：</span>{{item.sqm}}
                        </div>
                        <div v-if="store.is_dealer || store.userData.parent_id == 0">
                            <span class="fw-bold">{{ $t('order.text_order_comment_identity_salesperson') }}：</span>{{item.salesperson_name}}
                        </div>
                        <i class="fa-solid fa-pen"></i>
                    </nuxt-link>
                </div>
            </div>
        </div>

    </section>

</template>




<script setup>
const store = useStore()
const order = ref()
const role = store.role
const { t } = useI18n()

// 連結區塊
const link = computed(() => [
    { icon: 'fa-plus', title: t('order.text_add_order'), router: 'create_order', roles: ['salesperson', 'dealer','sunline'] },
    { icon: 'fa-history', title: t('order.tab_data'), router: 'order-list', roles: ['salesperson'] },
    { icon: 'fa-clipboard-list', title: t('order.text_manage_order'), router: 'order-list', roles: ['dealer','sunline'] },
    { icon: 'fa-file-circle-check', title: t('order.text_confirmed_orders'), router: 'order-list?status=DealerApproved', roles: ['salesperson'] },
    { icon: 'fa-user-pen', title: t('default.text_basic_information'), router: 'user-info', roles: ['salesperson', 'dealer','sunline'] },
    { icon: 'fa-gear', title: t('order.text_option_setting'), router: '/order-setting', roles: ['dealer','sunline'] },
])

const is_access = (item)=>{
    if(store.role){
        return item.some(item => item == Object.keys(store.role))
    }
}



const get_order_data = async()=>{
    // 今日
    const now = new Date();
    const todayDate = now.toISOString().substring(0, 10); // 只保留日期部分

    // 10天前
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const tenDaysAgoDate = tenDaysAgo.toISOString().substring(0, 10); // 只保留日期部分
    //業務 
    let url = `${store.baseUrl}api/v2/sales/orders/list?locale=${store.language}&equal_salesperson_id=${store.userData.member_id}&limit=6`

    // 經銷商
    if(store.is_dealer){
        url = `${store.baseUrl}api/v2/sales/orders/list?locale=${store.language}&equal_dealer_id=${store.userData.employer_company_id}&limit=6`
    }else if(store.is_corporate){
        url = `${store.baseUrl}api/v2/sales/orders/list?locale=${store.language}&limit=6`
    }
    // console.log(url);
    const default_time_zone = `&filter_order_date=${tenDaysAgoDate}-${todayDate}`
    url = url + default_time_zone
    
    try{
        const res = await fetch(url,{
             headers:{
                "Authorization": "Bearer " + store.userData.jwtToken
            }
        })
        const data = await res.json()
        // console.log(data);
        if(res.ok){
            order.value = data.response.data
            
        }

    }catch(err){
        console.log('error',err);
    }
}



store.show_loading(true)
onMounted(async()=>{
    if(store.userData){
        await get_order_data()
    }
    store.show_loading(false)
    
})


</script>

