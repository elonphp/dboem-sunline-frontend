使用VeeField 驗證套件

依據後端要求資料格式 (需要name,option_id,option_code,type,value,option_value_id)
如是text 則 option_value_id 固定設置 0
<!-- select text radio  -->
<VeeField 
    as="select"
    :name="`${order_data.folding_method.code}.option_value_id`"
    :id="order_data.folding_method.id" 
    class="form-select"
    :class="{ 'error': errors[`${order_data.folding_method.code}.option_value_id`] }"
    v-model="order_fill_out_id.folding_method"  //綁定id
    label="folding_method" rules="required">
    <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
    <option :value="item.id" v-for="item in order_data.folding_method.option_values" :key="item.id">
      {{ item.name }}
    </option>
</VeeField>

<VeeField type="hidden" :name="`${order_data.folding_method.code}.name`"
  :value="order_data.folding_method.name" />
<VeeField type="hidden" :name="`${order_data.folding_method.code}.option_id`"
  :value="order_data.folding_method.id" />
<VeeField type="hidden" :name="`${order_data.folding_method.code}.option_code`"
  :value="order_data.folding_method.code" />
<VeeField type="hidden" :name="`${order_data.folding_method.code}.type`"
  :value="order_data.folding_method.type" />
<VeeField type="hidden" :name="`${order_data.folding_method.code}.value`"
v-model="set_name(order_data.folding_method,order_fill_out_id.folding_method).value" //根據id去帶出對應的value
  />

  <!-- 驗證未通過的錯誤訊息 -->
<VeeErrorMessage class="error__label" :name="`${order_data.folding_method.code}.option_value_id`" />



<!-- checkbox -->
 結構與其他不同 value固定為Y v-model要在getProductOptionValue加入checkbox_item 才會正常
<VeeField 
    type="checkbox" 
    :class="{ 'error': errors['confirm_width_limit.option_values[0].value'] }"
    :name="`confirm_width_limit.option_values[0].value`"
    v-model="getProductOptionValue('confirm_width_limit').value" value="Y"
    class="form-check-input" rules="required" />

    {{ order_data.confirm_width_limit.name }}

<VeeField type="hidden" :name="`confirm_width_limit.name`"
  :value="order_data.confirm_width_limit.name" />
<VeeField type="hidden" :name="`confirm_width_limit.option_id`"
  :value="order_data.confirm_width_limit.id" />
<VeeField type="hidden" name="confirm_width_limit.option_code"
  :value="order_data.confirm_width_limit.code" />
<VeeField type="hidden" name="confirm_width_limit.type"
  :value="order_data.confirm_width_limit.type" />
<VeeField type="hidden" :name="`confirm_width_limit.option_values[0].option_value_id`"
  value="0" />


<VeeErrorMessage class="error__label" :name="`confirm_width_limit.option_values[0].value`" />