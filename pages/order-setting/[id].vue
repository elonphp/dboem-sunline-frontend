<template>
    <section class="bg-block">
        <div class="container">
            <div class="table-box" v-if="!!data" :key="data_page">
                <h2 class="title">{{ store.language_txt.default.text_setting }} - {{ data.name }}</h2>
                <div class="my-4">
                    <nuxt-link to="/order-setting" class="btn link ">{{store.language_txt.default?.text_back}}</nuxt-link>
                </div>
                <VeeForm class="table-inner" v-slot="{ values}" @submit="onSubmit">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{store.language_txt.default.text_type2}}</th>
                                <th>{{store.language_txt.option.text_original_name}}({{ store.language_txt.default.text_language_en }})</th>
                                <th>{{store.language_txt.option.text_original_name}}({{store.language_txt.default.text_language_zh_Hant}})</th>
                                <th>{{store.language_txt.option.text_custom_name}}({{store.language_txt.default.text_language_en}})</th>
                                <th>{{store.language_txt.option.text_custom_name}}({{store.language_txt.default.text_language_zh_Hant}})</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,idx) in data.option_values" :key="'item_' + idx">
                                <td>{{ item.code }}</td>
                                <td>{{item.translations?.en}}</td>
                                <td>{{item.translations?.zh_Hant}}</td>
                                <td>
                                    <VeeField 
                                        type="text"
                                        :name="`options.${data.code}.option_values[${idx}].option_value_dealers.en.name`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.custom_translations?.en || item.translations?.en" />
                                    <!-- <VeeField 
                                        type="hidden"
                                        :name="`options.${data.code}.option_values[${idx}].option_value_dealers.en.id`" 
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.option_value_dealers?.en?.id || null" /> -->
                                </td>
                                <td>
                                    <VeeField 
                                        type="text" 
                                        :name="`options.${data.code}.option_values[${idx}].option_value_dealers.zh_Hant.name`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.custom_translations?.zh_Hant || item.translations?.zh_Hant"/>
                                    <!-- <VeeField 
                                        type="hidden" 
                                        :name="`options.${data.code}.option_values[${idx}].option_value_dealers.zh_Hant.id`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.option_value_dealers?.zh_Hant?.id || null"/> -->
                                </td>
                                <td v-show="false">
                                    <VeeField 
                                        type="hidden"
                                        :name="`options.${data.code}.option_id`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="data.id"/>
                                    <VeeField 
                                        type="hidden"
                                        :name="`options.${data.code}.option_name`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="data.name"/>
                                    <VeeField 
                                        type="hidden"
                                        :name="`options.${data.code}.option_values[${idx}].option_value_name`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.name"/>
                                    <VeeField 
                                        type="hidden"
                                        :name="`options.${data.code}.option_values[${idx}].option_value_id`"
                                        class="form-control w-50 m-auto text-center" 
                                        :value="item.id"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                <div class="text-center mt-5">
                        <button type="submit" class="btn sent_go" :disabled="submit_btn_close">{{store.language_txt.default?.text_save}}</button>
                </div>
                </VeeForm>
            </div>
        </div>
    </section>




</template>


<script setup>

const store = useStore()
const route = useRoute()
const id = route.params.id

const data = ref()
const colors = ref([])
const submit_btn_close = ref(false)
const data_page = ref(1)


const another_language = computed(()=>{
    return store.language == "zh_Hant"? "en":"zh_Hant"
})


const get_data = async()=>{
    const url = `${store.baseUrl}api/v2/dealers/option/list?locale=${store.language}`
    try{
        const res = await fetch(url,{
            headers:{
                "Authorization": "Bearer " + store.userData.jwtToken
            }
        })
        if(res.ok){
            const res_data =await res.json()
            data.value = Object.values(res_data.response.data).find(item=> item.id == id && item.option_values)
            // console.log(data.value);
        }
    }catch(err){
        console.log('err',err);
    }
}



const onSubmit = async(values)=>{
    store.show_loading(true)
    submit_btn_close.value = true
    const submit_data = {
        dealer_id:store.userData.employer_company_id,
        options:values.options
    }
   
    try{
        const url = `${store.baseUrl}api/v2/dealers/option/saveMany`
        const res = await fetch(url,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + store.userData.jwtToken
            },
            body: JSON.stringify(submit_data)
        })

        const res_data = await res.json()
        if(res.ok && !res_data.error){
            alert(res_data.success)
            await get_data()
            data_page.value++
            store.show_loading(false)
            // console.log(data.value);
        }else{
            alert(res_data.error)
        }

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