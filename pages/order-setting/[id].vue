<template>
    <section class="bg-block">
        <div class="container">
            <div class="table-box" v-if="!!data" :key="data_page">
                <h2 class="title">{{ $t('default.text_setting') }} - {{ data.name }}</h2>
                <div class="my-4">
                    <nuxt-link :to="localePath('/order-setting')" class="btn link ">{{ $t('default.text_back') }}</nuxt-link>
                </div>
                <VeeForm class="table-inner" v-slot="{ values}" @submit="onSubmit">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('default.text_type2') }}</th>
                                <th>{{ $t('option.text_original_name') }}({{ $t('default.text_language_en') }})</th>
                                <th>{{ $t('option.text_original_name') }}({{ $t('default.text_language_zh_Hant') }})</th>
                                <th>{{ $t('option.text_custom_name') }}({{ $t('default.text_language_en') }})</th>
                                <th>{{ $t('option.text_custom_name') }}({{ $t('default.text_language_zh_Hant') }})</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,idx) in data.option_values" :key="'item_' + idx">
                                <td>{{ item.code }}</td>
                                <td>{{item.translations[0].name}}</td>
                                <td>{{item.translations[1].name}}</td>
                                <td>
                                    <VeeField 
                                        type="text"
                                        :name="`options.win_${data.code}.option_values[${idx}].option_value_dealers.en`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.option_value_dealers?.en || item.translations?.en" />
                                    <!-- <VeeField 
                                        type="hidden"
                                        :name="`options.win_${data.code}.option_values[${idx}].option_value_dealers.en.id`" 
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.option_value_dealers?.en?.id || null" /> -->
                                </td>
                                <td>
                                    <VeeField 
                                        type="text" 
                                        :name="`options.win_${data.code}.option_values[${idx}].option_value_dealers.zh_Hant`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.option_value_dealers?.zh_Hant || item.translations?.zh_Hant"/>
                                    <!-- <VeeField 
                                        type="hidden" 
                                        :name="`options.win_${data.code}.option_values[${idx}].option_value_dealers.zh_Hant.id`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.option_value_dealers?.zh_Hant?.id || null"/> -->
                                </td>
                                <td v-show="false">
                                    <VeeField 
                                        type="hidden"
                                        :name="`options.win_${data.code}.option_id`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="data.id"/>
                                    <VeeField 
                                        type="hidden"
                                        :name="`options.win_${data.code}.option_name`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="data.name"/>
                                    <VeeField 
                                        type="hidden"
                                        :name="`options.win_${data.code}.option_values[${idx}].option_value_name`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.name"/>
                                    <VeeField 
                                        type="hidden"
                                        :name="`options.win_${data.code}.option_values[${idx}].option_value_id`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.id"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                <div class="text-center mt-5">
                        <button type="submit" class="btn sent_go" :disabled="submit_btn_close">{{ $t('default.text_save') }}</button>
                </div>
                </VeeForm>
            </div>
        </div>
    </section>




</template>


<script setup>

const store = useStore()
const localePath = useLocalePath()
const route = useRoute()
const id = route.params.id
const option_code = route.query.code

const data = ref()
const colors = ref([])
const submit_btn_close = ref(false)
const data_page = ref(1)


const get_data = async()=>{
  try{
      const params = {
        equal_code: option_code
      }
      const res = await $api.sales.getCatalogOptionsInfo(params)
      data.value = res.response
    }catch(err){
        console.log('err',err);
    }
}



const onSubmit = async(values)=>{
    submit_btn_close.value = true
    const submit_data = {
        dealer_id:store.userData.employer_company_id,
        options:values.options
        // option_id:values.option_id,
        // option_values:values.option_values
    }
    try{
        const res = await $api.sales.dealersSaveMany(submit_data)
        alert(res.success)
        await get_data()
        data_page.value++
    }catch(err){
        console.log(err);
    }
    submit_btn_close.value = false
}



store.show_loading(true)

onMounted(async()=>{
    await get_data()
    store.show_loading(false)
    
})


</script>