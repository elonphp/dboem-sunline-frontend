<template>
    <section class="bg-block">
        <div class="container">
            <div class="table-box" id="table">
                <h2 class="title">{{$t('order.text_option_setting')}}</h2>
                <div class="my-4 d-flex align-items-center justify-content-between ">
                    <nuxt-link to="/home" class="btn link align-self-center">{{$t('default.text_back')}}</nuxt-link>
                    <div class="d-flex col-5 gap-2 align-items-center justify-content-end ">
                        <button type="button" class="btn search align-self-stretch me-2" @click="cancel_search" v-if="keyword">{{$t('default.text_cancel')}}{{$t('default.text_search')}}</button>
                        <div class="d-flex gap-2 align-items-center col-8">
                            <input type="text" :placeholder="$t('default.text_keyword')" class="form-control" v-model="input_keyword">
                            <button type="button" class="btn search align-self-stretch" @click="search">{{$t('default.text_search')}}</button>
                        </div>
                    </div>
                </div>
                <div class="table-inner">
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="col-4">{{$t('default.text_column_name')}}</th>
                                <th class="text-end pe-5">
                                    <select class="form-select-sm px-3" v-model="pageSize">
                                        <option value="10" selected>{{page_language_txt(10)}}</option>
                                        <option value="30">{{page_language_txt(30)}}</option>
                                        <option value="50">{{ page_language_txt(50) }}</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,idx) in show_data" :key="'data_' + idx">
                                <td>{{ item.name }}</td>
                                <td class="justify-content-end  pe-5">
                                    <nuxt-link :to="`/order-setting/${item.id}?code=${item.code}`" class="method-btn large">{{$t('default.text_setting')}}</nuxt-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pages" v-if="show_data.length > 0">
                    <button :disabled="currentPage === 1" @click="changPage(-1)">
                        <i class="fas fa-caret-left"></i>
                    </button>
                    <button v-for="(page, idx) in totalPages" :key="page" :class="pages_active(page)" @click="changPage(page)" v-show="page >= currentPageGroupStart && page <= currentPageGroupEnd || idx+1 == totalPages || idx+1 == 1">
                        <span v-if="idx+1 == totalPages && currentPage !== page">...</span>
                        {{ page }}
                        <span v-if="idx+1 == 1 && currentPage !== page">...</span>
                    </button>
                    <button :disabled="currentPage === totalPages" @click="changPage(-2)">
                        <i class="fas fa-caret-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>




</template>


<script setup>

const store = useStore()
const input_keyword = ref("")
const keyword = ref("")

const search = ()=>{
    keyword.value = input_keyword.value
}

const cancel_search = ()=>{
    keyword.value = ""
}

const data =ref([])



// 搜尋結果資料
const search_result = computed(()=>{
    if(keyword.value !== ""){
        const res = data.value.filter((item) => item.name.toLowerCase().includes(keyword.value.toLowerCase()));
        return res? res:[]
    }else{
        return null
    }
   
})

// 當前頁面
const currentPage = ref(1)

// 一頁顯示幾筆
const pageSize = ref(10);


//* 算出總共幾頁
const totalPages = computed(() => {
    if(!!search_result.value){
        return Math.ceil(search_result.value.length / +pageSize.value)
    }else{
        return Math.ceil(data.value.length / +pageSize.value);
    }
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
  document.querySelector("#table").scrollIntoView({ behavior: "smooth" });
}

// 顯示幾筆的語言文字
const page_language_txt = (value)=>{
    return store.language_txt.default?.text_row_limit.replace(':number',value)
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
    if(!!search_result.value){
        return search_result.value.slice(start, end)
    }else{
        return data.value.slice(start,end)
    }
})

// 取消搜尋當前頁面改回第一頁
watchEffect(()=>{
    if(!!search_result.value){
        currentPage.value = 1
    }
})

const get_data = async()=>{
    const url = `${store.baseUrl}api/v2/dealers/option/list?locale=${store.language}`
    try{
        const res = await fetch(url,{
            headers:{
                "Authorization": "Bearer " + store.userData.jwtToken
            }
        })
        // console.log(res);
        const res_data = await res.json()
        console.log(res_data)
        // console.log(res_data);
        if(res.ok){
            data.value = res_data.response.data
        }
    }catch (err) {
        console.log(err);
    }
}



store.show_loading(true)

onMounted(async()=>{
    await get_data()
    store.show_loading(false)
})




</script>