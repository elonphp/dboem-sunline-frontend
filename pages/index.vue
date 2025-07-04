<template>
  <div class="login_container">
      <div class="login">
        <div class="login_tit">
          <img class="login_logo" src="@/assets/images/logo.png" alt="logo">
          {{ $t('auth.text_login') }}
        </div>
        <form id="login" class="mt-3" @submit.prevent="recaptcha">
          <div class="login_input">
            <label  for="login_account">  {{ $t('auth.column_email') }}</label>
            <input class="form-control" type="email" id="login_account" :placeholder="$t('auth.text_input_email')" v-model="login_email"  required>
          </div>
          <div class="login_input input-group">
            <label class="mt-3" for="login_password">{{ $t('auth.column_password') }}</label>
            <input class="form-control" :type="is_active? 'text':'password'" id="login_password" :placeholder="$t('auth.column_password')" v-model="login_password" autocomplete="off" required>
            <span class="input-group-text" @mousedown="Previewing_pw" @mouseup="Previewing_pw">
              <i class="fas" :class="is_active? 'fa-eye-slash':'fa-eye'"></i>
            </span>
          </div>
          <div class="fs-6 mt-1 login_input text-end">
              <i class="fas fa-question-circle"></i>
              <nuxt-link to="/" class="ms-1" data-bs-toggle="modal" data-bs-target="#exampleModal" 
              style="text-decoration: underline;">{{ $t('auth.text_forget_password') }}</nuxt-link>
          </div>
          <button class="login_btn"> {{ $t('auth.text_login') }}</button>
        </form>
      </div>

      <div class="login_bg">
        <img class="login_logo" src="@/assets/images/logo.png" alt="logo">
      </div>

      <!-- Modal -->
    <div class="modal fade resetPW" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered " style="max-width: 650px;" >
        <VeeForm class="modal-content px-4" @submit="send_reset_pw" v-slot="{ errors}">
          <div class="modal-header d-block text-center  border-0 pb-0">
            <h2 class="modal-title" id="exampleModalLabel" style="letter-spacing: 5px;">{{ $t('auth.text_reset_password') }}</h2>
            <p class="fs-6 text-black-50 mt-2">{{ $t('auth.text_verification_sending') }}</p>
          </div>
          <transition name="fade" mode="out-in">
            <div class="bg-danger text-white text-center p-1 fs-6" v-show="error_msg" key="1">{{ error_msg }}</div>
          </transition>
          <transition name="fade" mode="out-in">
            <div class="modal-body" v-if="!reset_pw_submit_ok" key="2">
            <label class="d-block mb-3">
              {{ $t('auth.column_email') }}
              <VeeField type="email" name="reset_pw_email" class="form-control mt-2" v-model="reset_pw_email" :placeholder="$t('auth.text_input_email')"  rules="required|email" />
              <VeeErrorMessage class="error__label fs-xs" name="reset_pw_email" />
            </label>
            <div class="modal-footer border-0 justify-content-center pb-4">
              <button type="submit" class="btn sent_go" :disabled="submit_btn">{{ $t('auth.text_reset_password') }}</button>
            </div>   
            </div>
            <div class="modal-body text-center" v-else key="3">
            <i class="far fa-check-circle me-2" style="color: #63E6BE;"></i>
            <span style="letter-spacing:2px;">{{ ok_msg }}</span>
            <div class="modal-footer border-0 justify-content-center pt-4">
              <span class="btn sent_go"  data-bs-dismiss="modal" aria-label="Close" @click="reset_pw_submit_ok = false">{{ $t('default.text_close') }}</span>
            </div>
            </div>
          </transition>
        </VeeForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import sha256 from 'js-sha256';
import { useReCaptcha } from 'vue-recaptcha-v3'
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

const store = useStore()
const router = useRouter()
const recaptchaToken = ref('')

const login_email = ref("")
const login_password = ref("")
const is_active = ref(false)
const reset_pw_email = ref("")
const reset_pw_submit_ok = ref(false)
const error_msg = ref("")
const submit_btn =ref(false)
const ok_msg = ref("")

// 預覽密碼
const Previewing_pw = ()=>{
  is_active.value = !is_active.value
}

// google驗證
const recaptcha  = async()=>{
  submit_btn.value = true
  store.show_loading(true)
  await recaptchaLoaded()
  const token = await executeRecaptcha('login')
  recaptchaToken.value = token
  await login()
  submit_btn.value = false
  store.show_loading(false)
}

// // 登入
const login = async () =>{
  const sha256_PW = sha256(login_password.value.toString())
  let url = `${store.baseUrl}api/v2/login`
  const form_data = {
    email: login_email.value,
    password: sha256_PW,
    'google-recaptcha-v3-token':recaptchaToken.value
  }
  try{
    const res = await fetch(url,{
      method: 'POST',
      body: store.jsonToFormData(form_data)
    });
    const data = await res.json();
    if(res.ok && !data.error){
       await store.set_token(data)
       router.push('/home')
    }else{
     alert(data.error)
    }
  }catch (err) {
    console.log(err);
  }
}

// 送出忘記密碼信箱
const send_reset_pw = async () =>{
  store.show_loading(true)
  submit_btn.value = true
  const url = `${store.baseUrl}api/v2/password/email`
  let formData = new FormData();
  formData.append('email',reset_pw_email.value)
  try{
    const res = await fetch(url,{
      method: "POST",
      body:formData
    })
     const data = await res.json();
    if (res.ok) {
      reset_pw_submit_ok.value = true;
      // 設置訊息
      ok_msg.value = data.success
      error_msg.value = ""
    }else{
      // 錯誤則返回錯誤訊息
      error_msg.value = data.error
    }
  } catch (err) {
    console.log(err);
  }

  submit_btn.value = false
  store.show_loading(false)
}

onMounted(async()=>{
  store.show_loading(false)
})

</script>
