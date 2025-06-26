<template>
    <section class="bg-block" @click="new_msg_remind = false">
        <div class="container container-note">
            <div class="table-box position-relative" v-if="!store.loading">
                <div class="d-flex align-items-center gap-4 mb-4">
                    <h2 class="title">{{ order_info.code }}</h2>
                    <div class="tag m-0 " :class="store.status_colors(order_info.status_code)">{{ order_info.status_name
                        }}
                    </div>
                    <h2 class="title">{{ store.language_txt.default.tab_comments }}</h2>
                </div>
                <div class="d-flex align-items-center justify-content-between  gap-3 mb-4">
                    <nuxt-link :to="`/order-list/item?id=${order_id}`" class="btn link">{{ store.language_txt.default?.text_back
                        }}</nuxt-link>
                </div>
                <!-- msg_box -->
                <div class="">
                    <div class="msg-box" v-if="!store.loading && note_data" @scroll="checkScroll">
                        <!-- msg -->
                        <div class="msg-inner" v-for="item in note_data" :key="item.id" :class="my_msg(item.user_id)">
                            <div class="msg-name">
                                <div>
                                    <i class="fas fa-circle" :class="roles_colors(item.identity,item.user_id)"></i>
                                </div>
                                <div>
                                    <p class="fs-xs">{{ item.identity_name }}</p>
                                    <p>{{ item.commenter_name }}</p>
                                </div>
                            </div>
                            <div class="flex-fill">
                                <div class="content">
                                    {{ item.comment }}
                                </div>
                                <!-- <span class="time">{{ item.created_at.slice(0, 16) }}</span> -->
                                <span class="time">{{ item.created_at }}</span>
                            </div>
                        </div>
                        <!-- my msg -->
                        <form class="for_msg" @submit.prevent="submit_comment" v-show="show_textarea">
                            <div class="msg_height_box">{{ comment }}</div>
                            <textarea v-model="comment" @keyup.enter="submit_comment"></textarea>
                            <button type="submit" class="btn sent_go" :disabled="submit_btn">
                                <span v-if="!submit_btn">{{ store.language_txt.default.text_send }}</span>
                                <div class="loader loader--style2" title="1" v-else>
                                    <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px"
                                        height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;"
                                        xml:space="preserve">
                                        <path fill="#F6930E"
                                            d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                                            <animateTransform attributeType="xml" attributeName="transform"
                                                type="rotate" from="0 25 25" to="360 25 25" dur="0.6s"
                                                repeatCount="indefinite" />
                                        </path>
                                    </svg>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
                <!-- method -->
                <div class="to_bottom" @click="to_bottom" v-show="show_to_bottom">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <div class="show_textarea" @click="show_textarea = !show_textarea">
                    <i class="fas fa-comment"></i>
                </div>
                <transition name="slide" :duration="550">
                    <div class="new_msg  alart_box" v-show="new_msg_remind" @click="to_bottom">
                        <i class="fas fa-comment-dots"></i>
                        {{ store.language_txt.default.text_you_have_new_message }}
                    </div>
                </transition>
            </div>
        </div>

    </section>
</template>

<script setup>

const store = useStore()
const route = useRoute()
const router = useRouter()
const order_id = route.query.id
const order_info = ref({})
const note_data = ref()
const new_msg_remind = ref(false)
const user_id = ref("")
const comment = ref("")
const show_to_bottom = ref(false)
const show_textarea = ref(true)
const submit_btn = ref(false)

const my_msg = (id) => {
    return id == user_id.value ? 'my_msg' : null
}


// 滑至底部
const to_bottom = () => {
    $('.msg-box').animate({ scrollTop: $('.msg-box')[0].scrollHeight }, 500);
    new_msg_remind.value = false
}
// 監聽卷軸顯示to_bottom用
const checkScroll = () => {
    const megBox = $('.msg-box')[0]
    const isAtBottomNow = megBox.scrollTop + megBox.clientHeight >= megBox.scrollHeight - 300;
    // 沒到底部顯示往下按鈕
    show_to_bottom.value = !isAtBottomNow;
    // 如果到底部則關掉新訊息提醒
    if(isAtBottomNow){
        new_msg_remind.value = false
    }
}

const roles_colors = (role,id) =>{
    // 自己
    if(id == user_id.value){
        return 'bg-my_roles'
    }
    switch (role) {
          case "manager": //總公司
              return 'bg-manager'
          case "dealer": //經銷商
              return 'bg-dealer'
          case "salesperson": // 業務
              return 'bg-member'
    }
}

// 傳送訊息
const submit_comment = async () => {
    submit_btn.value = true
    const url = `${store.baseUrl}api/v2/sales/orders/comments/add?locale=${store.language}`
    const comment_data = {
        order_id: order_id,
        comment: comment.value,
    }
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + store.userData.jwtToken,
                "X-CLIENT-IPV4":store.userData.loginIpAddress
            },
            body: JSON.stringify(comment_data)
        })
        const data = await res.json()
        if (data.success) {
            comment.value = ""
            set_read()
        }
    } catch (err) {
        console.log('error', err);
    }
    await get_note_data()
    to_bottom()
    submit_btn.value = false
}

const get_note_data = async () => {
    const url = `${store.baseUrl}api/v2/sales/orders/comments/list?locale=${store.language}&limit=0&equal_order_id=${order_id}&limit=0&pagination=false`
    try {
        const res = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + store.userData.jwtToken
            }
        })
        const data = await res.json()
        if (res.ok) {
            const new_data = data.response.data.sort((a, b) => a.id - b.id)

            if(!note_data.value){
                note_data.value = new_data
                return
            }else{
                const is_my_msg = new_data[new_data.length - 1].user_id == user_id.value
    
                if (new_data.length > note_data.value.length) {
                    note_data.value = new_data;
                    if (!is_my_msg) {
                        new_msg_remind.value = true
                    }
                }
            }
            
        }
    } catch (err) {
        console.log('error', err);
    }
}
const get_user_data = async () => {
    const data = await store.get_user_data()
    user_id.value = data.user_id
    console.log(user_id.value);
}

const get_data = async () => {
    const url = `${store.baseUrl}api/v2/sales/orders/info?locale=${store.language}&equal_id=${order_id}`
    try {
        const res = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + store.userData.jwtToken
            }
        })
        const data = await res.json()
        if (res.ok) {
            order_info.value = data.response
            // console.log('order', order_info.value);
        }
    } catch (err) {
        console.log('error', err);
    }
}

// 留言已讀
const set_read = async ()=>{
    const url =`${store.baseUrl}api/v2/sales/orders/comments/clearCommentCount?order_id=${order_id}`
    try{
        const res =  await fetch(url,{
            headers: {
                "Authorization": "Bearer " + store.userData.jwtToken
            }
        })
        const data = await res.json()
    }catch(err){
        console.log('error');
    }

}


let update_note_data;

store.show_loading(true)

onMounted(async () => {
    if(order_id){
        set_read()
        await get_data()
        try {
            // 等全部都跑完之後移至底部
            await Promise.all([get_note_data(), get_user_data()]);
            store.show_loading(false);
            nextTick(() => {
                const $megBox = $('.msg-box');
                if ($megBox.length) {
                    $megBox.scrollTop($megBox[0].scrollHeight);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
    update_note_data = setInterval(async () => {
        get_note_data()
    }, 5000);
});

onUnmounted(() => {
    clearInterval(update_note_data)
})


</script>