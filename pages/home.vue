<template>
    <section class="bg-block d-flex align-items-center" >
        <div class="container-xl">
            <div class="row mb-5" v-if="order">
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
const { t, locale} = useI18n()

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
  return Object.keys(store.role).some(role => item.includes(role))
}


const dayjs = useDayjs()
onMounted(() => {
  get_order_data()
})
const get_order_data = async()=>{
    // 今日
    const todayDate = dayjs().format('YYYY-MM-DD');
    // 10天前
    const tenDaysAgoDate = dayjs().subtract(10, 'day').format('YYYY-MM-DD');
    const params = {
      locale: locale.value,
      [store.is_dealer ? 'equal_dealer_id' : undefined]: store.userData.employer_company_id,
      [!store.is_dealer && !store.is_corporate ? 'equal_salesperson_id' : undefined]: store.userData.member_id,
      limit: 6,
      filter_order_date: `${tenDaysAgoDate}-${todayDate}`
    }
    try {
      const res = await $api.sales.getOrderList(params)
      order.value = res.response.data
    } catch (error) {
      console.log(error);
      
    }
}



// store.show_loading(true)
// onMounted(async()=>{
//     if(store.userData){
//         await get_order_data()
//     }
//     store.show_loading(false)
    
// })


</script>

