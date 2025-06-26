<template>
  
  <div class="login_container">
    <div class="login">
      <div class="login_tit">
        <img class="login_logo" src="@/assets/images/logo.png" alt="logo">
        {{ store.language_txt.auth?.text_reset_password }}
      </div>
      <!-- <transition name="fade" mode="out-in">
      <div class="bg-danger text-white w-75 p-1 text-center" v-show="error">
        {{ error }}
        <nuxt-link to="/" class="ps-2 text-white" v-show="!error.errors">請至首頁重新申請</nuxt-link>
      </div>
      </transition> -->
      <VeeForm id="login" class="mt-3" @submit="onSubmit" v-slot="{ errors}">
        <div class="login_input input-group">
          <label class="mt-3" for="new_password">{{store.language_txt.auth?.column_password}}</label>
          <VeeField 
            class="form-control"
            :class="{ 'error': errors.new_password }"
            name="new_password"
            :type="is_active.new_password? 'text':'password'" 
            id="new_password"
            :placeholder="store.language_txt.auth.text_password_rule" 
            v-model="new_password"
            :rules="{required:true,regex:/^(?=.*[A-Za-z]).{8,16}$/}"
            :label="store.language_txt.auth.column_new_password"
          
             />
          <span class="input-group-text" @mousedown="Previewing_pw(0)" @mouseup="Previewing_pw(0)">
            <i class="fas" :class="is_active.new_password? 'fa-eye-slash':'fa-eye'"></i>
          </span>
          <VeeErrorMessage class="error__label fs-6" name="new_password" />
        </div>

        <div class="login_input input-group">
          <label class="mt-3" for="new_password_confirmation">{{ store.language_txt.auth.column_confirm_password }}</label>
          <VeeField 
            class="form-control"
            :class="{ 'error': errors.new_password_confirmation }"
            name="new_password_confirmation"
            :type="is_active.new_password_confirmation? 'text':'password'" 
            id="new_password_confirmation" 
            :placeholder="store.language_txt.auth.text_enter_new_password" 
            v-model="new_password_confirmation"
            rules="required|confirmed:@new_password"
            :label="store.language_txt.auth.column_confirm_password"
            />
          <span class="input-group-text" @mousedown="Previewing_pw(1)" @mouseup="Previewing_pw(1)">
            <i class="fas" :class="is_active.new_password_confirmation? 'fa-eye-slash':'fa-eye'"></i>
          </span>
          <VeeErrorMessage class="error__label fs-6" name="new_password_confirmation" />
        </div>
        <button class="login_btn" type="submit" :disabled="submit_btn_close">{{store.language_txt.default?.text_save}}</button>
        <button class="d-none" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" id="open_modal">{{ store.language_txt.default?.text_save }}</button>
      </VeeForm>
    </div>

    <div class="login_bg">
      <img class="login_logo" src="@/assets/images/logo.png" alt="logo">
    </div>

    <!-- Modal -->
    <div class="modal fade resetPW" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
        <button type="button" class="d-none" id="close_modal" data-bs-dismiss="modal" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-content px-4">
          <div class="modal-body text-center fs-5 py-5">
            <div v-if="!msg.error">
              <i class="far fa-check-circle me-2" style="color: #63E6BE;"></i>
              <span style="letter-spacing:2px;">{{ msg.success }}</span>
            </div>
            <div v-else>
              <i class="fas fa-exclamation-circle me-2" style="color: #dc3545;"></i>
              <span style="letter-spacing:2px;">{{ msg.error }}</span>
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-center pb-4">
            <button type="button" class="btn sent_go" @click="go_login">{{store.language_txt.default?.text_back}}{{store.language_txt.default?.text_login}}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
  import sha256 from 'js-sha256';
  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const is_active = ref({
    new_password: false,
    new_password_confirmation: false
  })

  const token = ref(route.query.token)
  const email = ref(route.query.email)
  const new_password = ref("")
  const new_password_confirmation = ref("")
  const submit_btn_close = ref(false)
  const msg = ref("")

  const go_login = ()=>{
    $('#close_modal').click()
    router.push("/")
  }

  // 顯示密碼
  const Previewing_pw = (type)=>{
    if(!type){
      is_active.value.new_password = !is_active.value.new_password
    }else{
      is_active.value.new_password_confirmation = !is_active.value.new_password_confirmation
    }
  }

  const onSubmit = async()=>{
    submit_btn_close.value = true
    const url = `${store.baseUrl}api/v2/password/update`
    const sha256_PW = sha256(new_password.value.toString())
    let formData = new FormData();
    formData.append('email', email.value);
    formData.append('token', token.value);
    formData.append('password', sha256_PW);
    formData.append('password_confirmation', sha256_PW);
    try{
        const res = await fetch(url,{
            method: "POST",
            headers: {
                  "Authorization": "Bearer " + store.userData.jwtToken,
                  "X-CLIENT-IPV4":store.userData.loginIpAddress
            },
            body: formData
        });
        // console.log(res);
        const data = await res.json();
        // console.log(data);
        if(res.ok){
          msg.value = data
          $('#open_modal').click()
        }
    }catch (err) {
      console.log(err);
    }
    submit_btn_close.value = false
  }


</script>
  
