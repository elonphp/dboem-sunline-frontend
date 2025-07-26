<template>
    <section class="bg-block">
        <div class="container">
            <div class="table-box">
                <h2 class="title">{{$t('default.text_basic_information')}}</h2>
                <div class="my-4">
                    <nuxt-link to="/home" class="btn link">{{$t('default.text_back')}}</nuxt-link>
                </div>
                <div class="user-info px-2" v-if="!!userinfo">
                    <div class="row mb-xl-4">
                        <div class="col-xl-3 col-12 user-data">
                            <span class="col-xl-1 col-4">{{$t('member.column_email')}}</span>
                            <div class="col-2">{{ userinfo.email }}</div>
                        </div>
                        <div class="col-xl-3 user-data">
                            <span class="col-4">{{$t('member.column_first_name')}}</span>
                            <div class="col">{{ userinfo.name }}</div>
                        </div>
                        <div class="col-xl-3 user-data">
                            <span class="col-4">{{$t('member.column_telephone')}}</span>
                            <div class="col">{{ userinfo.telephone }}</div>
                        </div>
                        <div class="col-xl-3 user-data">
                            <span class="col-4">{{$t('member.column_phone')}}</span>
                            <div class="col">{{ userinfo.mobile }}</div>
                        </div>
                    </div>
                    <div class="row mb-xl-4">
                        <div class="col-xl-3 user-data">
                            <span class="col-4">{{$t('member.column_dealer_code')}}</span>
                            <div class="col">{{ userinfo.employer_company_code }}</div>
                        </div>
                        <div class="col-xl-3 user-data">
                            <span class="col-4">{{$t('member.column_tax_id_num')}}</span>
                            <div class="col">{{ userinfo.tax_id_num }}</div>
                        </div>
                        <div class="col-xl-3 user-data">
                            <span class="col-xl-2 col-4">{{$t('member.column_company_name')}}</span>
                            <div class="col">{{ userinfo.employer_company_name }}</div>
                        </div>
                        <div class="col-xl-3  user-data">
                            <span class="col-xl col-4">{{$t('member.column_country')}}</span>
                            <div class="col">{{ userinfo.country_name }}</div>
                        </div>
                    </div>
                    <div class="row mb-xl-4">
                        <div class="col-xl-1  user-data">
                            <span class="col-xl col-4">{{$t('member.column_zip_code')}}</span>
                            <div class="col">{{ userinfo.zip_code }}</div>
                        </div>
                        <div class="col-xl-2  user-data">
                            <span class="col-xl col-4">{{$t('member.column_state')}}</span>
                            <div class="col">{{userinfo.state}}</div>
                        </div>
                        <div class="col-xl-2  user-data">
                            <span class="col-xl col-4">{{$t('member.column_city')}}</span>
                            <div class="col">{{ userinfo.city }}</div>
                        </div>
                        <div class="col-xl-3 user-data flex-auto">
                            <span class="col-xl-2 col-4">{{$t('member.column_address1')}}</span>
                            <div class="col">{{ userinfo.address1 }}</div>
                        </div>
                        <div class="col-xl-3 user-data flex-auto">
                            <span class="col-xl-2 col-4">{{$t('member.column_address2')}}</span>
                            <div class="col">{{ userinfo.address2 }}</div>
                        </div>
                    </div>
                </div>
                <h2 class="title mb-xl-4 my-xl-0 my-4">{{$t('auth.text_reset_password')}}</h2>
                <VeeForm class="pw-reset px-2" v-if="!!userinfo" @submit="onSubmit" v-slot="{ errors}">
                    <div class="row mb-xl-4">
                        <div class="col-12 row user-data pb-3 align-items-center">
                            <span class="col-xl-1 col-4">{{$t('member.column_old_password')}}</span>
                            <div class="form-box">
                                <VeeField type="password" class="form-control" autocomplete="off"
                                    :class="{ 'error': errors.password }" name="password" 
                                    :placeholder="$t('member.column_old_password')"
                                    rules="required" 
                                    :label="$t('member.column_old_password')" />
                                <VeeErrorMessage class="error__label fs-6 " name="password" />
                            </div>
                        </div>
                        <!-- new -->
                        <div class="col-12 row user-data pb-3 align-items-center">
                            <span class="col-xl-1 col-4">{{$t('member.column_new_password')}}</span>
                            <div class="form-box">
                                <VeeField type="password" class="form-control" autocomplete="off"
                                    :class="{ 'error': errors.new_password }" name="new_password"
                                    :placeholder="$t('member.help_new_password')"
                                    :rules="{ required: true, regex: /^(?=.*[A-Za-z]).{8,16}$/ }" 
                                    :label="$t('member.column_new_password')" />
                                <VeeErrorMessage class="error__label fs-6 " name="new_password" />
                            </div>
                        </div>
                        <!-- confirm_pw -->
                        <div class="col-12 row user-data pb-3 align-items-center">
                            <span class="col-xl-1 col-4">{{$t('member.column_confirm_password')}}</span>
                            <div class="form-box">
                                <VeeField type="password" class="form-control" autocomplete="off"
                                    :class="{ 'error': errors.confirm_new_password }" name="confirm_new_password"
                                    :placeholder="$t('member.help_confirm_password')" 
                                    rules="required|confirmed:@new_password" 
                                    :label="$t('member.column_confirm_password')" />
                                <VeeErrorMessage class="error__label fs-6 " name="confirm_new_password" />
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <!-- <button type="submit" class="btn sent_go" :disabled="submit_btn_close">{{ text.text_save}}</button> -->
                        <button 
                            class="g-recaptcha login_btn" 
                            :disabled="submit_btn_close"
                            data-sitekey="6LcMcOwpAAAAALlXivXwE8zGjzVwpIm77jv9ft8a" 
                            data-action="verify"
                            data-callback="onSubmit">
                            {{$t('default.text_save')}}
                        </button>
                    </div>
                </VeeForm>

            </div>
        </div>
    </section>
</template>


<script setup>
import sha256 from 'js-sha256';
import { useReCaptcha } from 'vue-recaptcha-v3'
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()
const store = useStore()
const recaptchaToken = ref('')
const { t } = useI18n()

const userinfo = ref()
const submit_btn_close = ref(false)

const text = ref()

const form_data = ref({
    password:"",
    new_password:"",
    confirm_new_password:""
})


const get_data = async()=>{
    const data = await store.get_user_data()
    userinfo.value = data.response
}



// 驗證原密碼
const verify = async (values) =>{
  const email = userinfo.value.email
  const sha256_PW = sha256(values.password.toString())
  const form_data = {
    email,
    password: sha256_PW,
    'google-recaptcha-v3-token':recaptchaToken.value
  }
  try{
    const res = await $api.auth.login(form_data)
  }catch (err) {
    alert(t('auth.error_old_password'))
    console.log(err);
  }
}

const onSubmit = async(values)=>{
    store.show_loading(true)
    // 停用按鈕
    submit_btn_close.value = true
    // 獲取recaptcha驗證
    await recaptchaLoaded()
    const token = await executeRecaptcha('verify')
    recaptchaToken.value = token
    // 驗證原密碼
    const verify_res = await verify(values)
    
    // 正確執行更改密碼
     if(verify_res){
         await update_data(values)
     }
     // 開啟按鈕
     submit_btn_close.value =false
     store.show_loading(false)
}

// 更新POST
const update_data = async (values) =>{
    const sha256_PW = sha256(values.new_password.toString())
    let formData = new FormData();
    formData.append('member_id', userinfo.value.id);
    formData.append('email', userinfo.value.email);
    formData.append('password', sha256_PW);
   try{
        const res = await $api.member.membersSave(formData)
        alert(res.success)
        store.logout()
        
    }catch (err) {
      alert(err)
      console.log(err);
    }
}

onMounted(()=>{
    get_data()
})


</script>