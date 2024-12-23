<template>

  <div class="links" :class="{'links-anime':!step_box}"  v-if="!!order_fill_out_id.designType">
    <div class="link-item">
      <a v-for="item in nav_links_state" :href="`#${item.en_title}`" :title="item.title"
        :class="{ active: currentItem === item.en_title }" @click.prevent="handleClick(item.en_title)"
        :key="item.en_title">
        {{ item.title }}
        <span></span>
      </a>

    </div>

    <div class="step_box" @click="step_box = !step_box">
      <i class="fas fa-ellipsis-h"></i>
    </div>
  </div>

  <VeeForm @submit="onSubmit" @invalid-submit="onInvalidSubmit" v-slot="{ errors,values }">
    <div class="alart_box" v-if="show_alart_box">
      <i class="fas fa-exclamation-circle me-2"></i>
      <i class="fas fa-times-circle" @click="show_alart_box = false,pleace_input_height = false"></i>
      <span v-if="pleace_input_height">請先填寫高度</span>
      <span v-else-if="pleace_input_width">請先填寫寬度</span>
      <span v-else>尚有{{errors_count(errors)}}個欄位需確認！</span>
    </div>

    <div v-if="!!order_data && material">
     
      <section id="material">
        <div class="container container-original">
          <div class="block block1 flex-wrap">
            <h2 class="title">
              {{ material.name }}
              <VeeErrorMessage class="error__label" :name="`${material.code}.value`" />
            </h2>
            <div class="d-flex justify-content-around flex-auto" :class="{ 'error': errors[`${material.code}.value`] }">
              <div class="material_chose" v-for="(item, idx) in material.option_values" :key="item.name" @click.stop="
                  get_design_data(item.id),
                  (order_fill_out_id.material = item.id)">
                <VeeField type="radio" :name="`${material.code}.value`" :id="`material${item.id}`" :value="item.name"
                  label="material" rules="required" />
                <VeeField type="hidden" :name="`${material.code}.name`" :value="material.name" />
                <VeeField type="hidden" :name="`${material.code}.option_id`" :value="item.option_id" />
                <VeeField type="hidden" :name="`${material.code}.option_code`" :value="material.code" />
                <VeeField type="hidden" :name="`${material.code}.type`" :value="material.type" />
                <VeeField type="hidden" :name="`${material.code}.option_value_id`" v-model="order_fill_out_id.material" />
                <label :for="`material${item.id}`">
                  <span class="pic_lable d-inline-block">
                    <img :src="$imgUrl(item.image)" :alt="item.name" />
                  </span>
                  <span class="material_val">{{ item.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="exclamation-info" v-if="!design_data.design">
        <i class="fas fa-exclamation-circle me-2"></i>
        請先選擇材質再進行訂單選擇
      </div>
      <section id="design" v-if="!!design_data.design && design_data.type">
        <div class="container container-original">
          <div class="block block2">
            <h2 class="title">款式</h2>
            <div class="d-flex justify-content-around flex-auto gap-lg-0 gap-4 " :class="{ 'error': errors[`${design_data.design.option_code}.value`] }">
              <VeeErrorMessage class="error__label" :name="`${design_data.design.option_code}.value`" />
              <div class="type_chose" v-for="(design, designIdx) in design_data.design.option_group_suboption_values"
                :key="design.name">
                <div class="windowType">
                  <VeeField 
                    type="radio" 
                    :id="`styleType_` + design.option_value_id" 
                    :name="`${design_data.design.option_code}.value`"
                    :value="design.name" v-model="order_fill_out.design.styleType"
                    @change="change_styleType(),order_fill_out_id.styleType = design.option_value_id"
                    :checked="order_fill_out.design.styleType == design.name" label="styleType" rules="required" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.name`" :value="design_data.design.option_name" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.option_id`" :value="design_data.design.option_id" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.option_code`" :value="design_data.design.option_code" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.type`" :value="design_data.design.option_type" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.option_value_id`" v-model="order_fill_out_id.styleType" />
                  <p class="designName text-center">{{ design.name }}</p>
                  <label :for="`styleType_` + design.option_value_id">
                    <img :src="$imgUrl(design.image)" :alt="design.name">
                  </label>
                </div>
                <div class="d-flex justify-content-center flex-wrap" v-if="order_fill_out_id.styleType && design_data.type.length > 0"
                  :class="{ 'error': errors['win_style.value'] }">
                  <VeeErrorMessage class="error__label col-12" name="win_style.value" />
                  <div class="typeCategory"
                    v-for="(type, typeIdx) in design_data.type[designIdx].option_group_suboption_values" 
                    :key="type.name">
                    <VeeField 
                      type="radio" 
                      name="win_style.value" 
                      :id="`designType_` + type.option_value_id"
                      :value="type.name" :checked="order_fill_out.design.designType == type.name"
                      v-model="order_fill_out.design.designType" 
                      @change="change_designType(design.name,design.option_value_id,type,designIdx)"
                      label="designType" rules="required" />
                    <VeeField 
                      type="hidden" 
                      name="win_style.name"
                      v-model="order_fill_out_id.designType_option_name" 
                    />
                    <VeeField 
                      type="hidden" 
                      name="win_style.option_id" 
                      :value="type.option_id" 
                    />
                    <VeeField 
                      type="hidden" 
                      name="win_style.option_code"
                      v-model="order_fill_out_id.designType_option_code"
                    />
                    <VeeField 
                      type="hidden" 
                      name="win_style.type"
                      :value="design_data.type[designIdx].option_type" 
                    />
                    <VeeField 
                      type="hidden" 
                      name="win_style.option_value_id" 
                      v-model="order_fill_out_id.designType" 
                    />
                    <label :for="`designType_` + type.option_value_id">
                      <img :src="$imgUrl(type.image)" :alt="type.name">
                    </label>
                    <p>{{ type.name }}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section id="setting" v-if="!!order_fill_out_id.designType">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">基本設定</h2>
            <div class="row flex-auto col-12">
              <!-- windows_type -->
              <div class="col-12" v-if="!is_track && !is_special_windows">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2 " for="">
                    <span class="text-danger">*</span>類型
                  </label>
                  <div class="col-sm-10">
                    <div class="d-flex algin-items-center flex-wrap  p-2 pt-0" :class="{ 'error': win_stdwin_subtype_required(values) }">
                      <div class="picOption" v-for="(data,idx) in order_data.win_stdwin_subtype.option_values">
                      <VeeField 
                        type="checkbox" 
                        :id="'win_stdwin_subtype_' + data.id" 
                        :name="`${order_data.win_stdwin_subtype.code}.option_values[${idx}].value`"
                        @change="add_win_stdwin_subtype_id(data.id)"
                        :value="data.name"
                        label="win_stdwin_subtype" 
                        :rules="{required:win_stdwin_subtype_required(values)}"
                      />
                      <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.option_values[${idx}].name`" :value="order_data.win_stdwin_subtype.name" />
                      <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.option_values[${idx}].option_id`" :value="order_data.win_stdwin_subtype.id" />
                      <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.option_code`" :value="order_data.win_stdwin_subtype.code" />
                      <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.type`" :value="order_data.win_stdwin_subtype.type" />
                      <div v-if="order_fill_out_id.win_stdwin_subtype.find((item) => item == data.id)">
                        <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.option_values[${idx}].option_value_id`" :value="data.id" />
                      </div>
                      <label :for="'win_stdwin_subtype_' + data.id" >
                        <img :src="$imgUrl(data.image)" :alt="data.name">
                      </label>
                      
                      <p>{{ data.name }}</p>
                      <VeeErrorMessage class="error__label" :name="`${order_data.win_stdwin_subtype.code}.option_values[0].value`" />
                      <VeeErrorMessage class="error__label" :name="`${order_data.win_stdwin_subtype.code}.option_values[1].value`" />
                      <VeeErrorMessage class="error__label" :name="`${order_data.win_stdwin_subtype.code}.option_values[2].value`" />
                    </div>
                    </div>
                    <label v-if="order_fill_out_id.win_stdwin_subtype.find((item)=>item == 2011)">
                      <VeeField 
                        type="checkbox" 
                        :class="{ 'error': errors['confirm_bay_window.value'] }"
                        :name="`confirm_bay_window.option_values[0].value`"
                        value="Y"
                        class="form-check-input" 
                        rules="required" />
                      我已確認轉角窗已包含轉角柱尺寸
                      <VeeField type="hidden" :name="`confirm_bay_window.option_values[0].name`" :value="order_data.confirm_bay_window.name" />
                      <VeeField type="hidden" :name="`confirm_bay_window.option_values[0].option_id`" :value="order_data.confirm_bay_window.id" />
                      <VeeField type="hidden" name="confirm_bay_window.option_code" :value="order_data.confirm_bay_window.code" />
                      <VeeField type="hidden" name="confirm_bay_window.type" :value="order_data.confirm_bay_window.type" />
                      <VeeField type="hidden" :name="`confirm_bay_window.option_values[0].option_value_id`" value="0"/>
                    </label>
                    <VeeErrorMessage class="error__label" :name="`confirm_bay_window.option_values[0].value`" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 flex-auto">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4" :for="order_data.win_position.name">
                    <span class="text-danger">*</span>
                    {{ order_data.win_position.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" class="form-control" :class="{ 'error': errors[`${order_data.win_position.code}.value`] }"
                      :id="order_data.win_position.name" :name="`${order_data.win_position.code}.value`" label="win_position"
                      rules="required" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_position.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.name`" :value="order_data.win_position.name" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.option_id`" :value="order_data.win_position.id" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.option_code`" :value="order_data.win_position.code" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.type`" :value="order_data.win_position.type" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.option_value_id`" value="0" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.win_width.name">
                    <span class="text-danger">*</span>
                    {{ order_data.win_width.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group">
                      <VeeField 
                        type="number" 
                        :name="`${order_data.win_width.code}.value`" 
                        class="form-control"
                        v-model="order_fill_out.setting.width" 
                        :class="{ 'error': errors[`${order_data.win_width.code}.value`] }"
                        :id="order_data.win_width.name" 
                        @blur="validateWidthError" 
                        label="寬度" 
                        :rules="{
                          required:true,
                        }" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_width.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.name`" :value="order_data.win_width.name" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.option_id`" :value="order_data.win_width.id" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.option_code`" :value="order_data.win_width.code" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.type`" :value="order_data.win_width.type" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.option_value_id`" value="0" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.win_height.name">
                    <span class="text-danger">*</span>
                    {{ order_data.win_height.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group has-validation">
                      <VeeField type="number" :name="`${order_data.win_height.code}.value`" class="form-control"
                        v-model="order_fill_out.setting.height"
                        :class="{ 'error': errors[`${order_data.win_height.code}.value`] }" :id="order_data.win_height.name" label="高度"
                        :rules="{
                          required:true,
                          min_value:min_hight_setting(),
                          max_value:max_hight_setting()
                        }" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.name`" :value="order_data.win_height.name" />
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.option_id`" :value="order_data.win_height.id" />
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.option_code`" :value="order_data.win_height.code" />
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.type`" :value="order_data.win_height.type" />
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_height.code}.value`" />
                    <!-- <span class="fs-xs">{{ order_note.note_height }}</span> -->
                  </div>
                </div>
              </div>
              <div class="col-md-6 flex-auto">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 position-relative " :for="order_data.wsms.name">
                    <span class="text-danger">*</span>
                    {{ order_data.wsms.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      {{ order_note.note_ms.translation }}
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.wsms.code}.value`" :id="order_data.wsms.name" class="form-select"
                      :class="{ 'error': errors[`${order_data.wsms.code}.value`] }" v-model="order_fill_out.setting.sizeStandards"
                      @change="
                        set_sizeStandards_ID(order_data.wsms.option_values),
                        order_fill_out_id.wsms_option_value_id = select_option_value_id(order_data.wsms.option_values,values.wsms.value)" label="wsms" rules="required">
                      <option value="" disabled selected>請選擇規格</option>
                      <option :value="option.name" v-for="option in order_data.wsms.option_values">
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeErrorMessage class="error__label" :name="`${order_data.wsms.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.name`" :value="order_data.wsms.name" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.option_id`" :value="order_data.wsms.id" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.option_code`" :value="order_data.wsms.code" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.type`" :value="order_data.wsms.type" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.option_value_id`"
                      v-model="order_fill_out_id.wsms_option_value_id" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 position-relative" :for="order_data.imom.name">
                    <span class="text-danger">*</span>
                    {{ order_data.imom.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      {{ order_note.note_om.translation }}
                      {{ order_note.note_im.translation }}
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.imom.code}.value`" :id="order_data.imom.name" class="form-select"
                      :class="{ 'error': errors[`${order_data.imom.code}.value`] }" v-model="order_fill_out.setting.measurementStandards"
                      @change="
                        set_measurementStandards_ID(order_data.imom.option_values),
                        order_fill_out_id.imom_option_value_id =  select_option_value_id(order_data.imom.option_values,values.imom.value)
                      " label="imom" rules="required">
                      <option value="" disabled selected>請選擇規格</option>
                      <option :value="option.name" v-for="option in imom_data">
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeErrorMessage class="error__label" :name="`${order_data.imom.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.name`" :value="order_data.imom.name" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.option_id`" :value="order_data.imom.id" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.option_code`" :value="order_data.imom.code" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.type`" :value="order_data.imom.type" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.option_value_id`"
                      v-model="order_fill_out_id.imom_option_value_id" />
                  </div>
                </div>
              </div>
              <!-- windows_colors -->
              <div class="col-12">
                <div class="row">
                  <label class="label-set col-form-label col-sm-2 " for="">
                    <span class="text-danger">*</span>顏色
                  </label>
                  <div class="col-sm-10">
                    <div class="d-flex algin-items-center flex-wrap  p-2 pt-0" :class="{ 'error': errors[`${material_color.option_code}.value`] }">
                      <div class="picOption" v-for="color in material_color.option_group_suboption_values">
                      <VeeField type="radio" :id="'setting_color_' + color.id" :name="`${material_color.option_code}.value`"
                      @change="order_fill_out_id.setting_color = color.option_value_id"
                        :value="color.name" label="setting_color" rules="required" />
                      <VeeField type="hidden" :name="`${material_color.option_code}.name`" :value="material_color.option_name" />
                      <VeeField type="hidden" :name="`${material_color.option_code}.option_id`" :value="material_color.option_id" />
                      <VeeField type="hidden" :name="`${material_color.option_code}.option_code`" :value="material_color.option_code" />
                      <VeeField type="hidden" :name="`${material_color.option_code}.type`" :value="material_color.option_type" />
                      <VeeField type="hidden" :name="`${material_color.option_code}.option_value_id`" v-model="order_fill_out_id.setting_color" />
                      <label :for="'setting_color_' + color.id" @click="click_find_label($event)">
                        <img :src="$imgUrl(color.image)" :alt="color.name">
                      </label>
                      
                      <p class="color-code">{{ color.option_value_code }}</p>
                      <p>{{ color.name }}</p>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${material_color.option_code}.value`" />
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="outerFrame" v-if="!!order_fill_out_id.designType && !is_track">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">外框</h2>
            <div class="row flex-auto col-12">
              <div class="row flex-auto col-12">
                <div class="col-md-6 flex-auto">
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-2 " for="">
                      <span class="text-danger">*</span>
                      外框
                    </label>
                    <div class="col-sm-10">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0" :class="{ 'error': errors[`${doorType_outerFrame.option_code}.value`] }">
                      <div class="picOption" v-for="(item, idx) in doorType_outerFrame.option_group_suboption_values" :key="'outerFrame' + item.id" >
                        <VeeField 
                          type="radio" 
                          :id="'outerFrame' + item.id" 
                          @change="order_fill_out_id.outerFrame_type = item.option_value_id"
                          :name="`${doorType_outerFrame.option_code}.value`" 
                          :value="item.name"
                          rules="required"
                          />
                        <VeeField type="hidden" :name="`${doorType_outerFrame.option_code}.name`" :value="doorType_outerFrame.option_name" />
                        <VeeField type="hidden" :name="`${doorType_outerFrame.option_code}.option_id`" :value="doorType_outerFrame.option_id" />
                        <VeeField type="hidden" :name="`${doorType_outerFrame.option_code}.option_code`" :value="doorType_outerFrame.option_code" />
                        <VeeField type="hidden" :name="`${doorType_outerFrame.option_code}.type`" :value="doorType_outerFrame.option_type" />
                        <VeeField type="hidden" :name="`${doorType_outerFrame.option_code}.option_value_id`" v-model="order_fill_out_id.outerFrame_type" />
                        <label :for="'outerFrame' + item.id" @click="click_find_label($event)">
                          <img :src="$imgUrl(item.image)" :alt="item.name">
                        </label>
                        <p class="fs-xs">{{ item.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${doorType_outerFrame.option_code}.value`" />
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 flex-auto">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_sides.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.outer_frame_sides.code}.value`" id="" class="form-select"   rules="required"
                    :class="{ 'error': errors[`${order_data.outer_frame_sides.code}.value`] }"
                      @change="
                      order_fill_out_id.outer_frame_sides = select_option_value_id(order_data.outer_frame_sides.option_values,values.outer_frame_sides.value)"
                    >
                      <option value="" disabled selected>請選擇規格</option>
                      <option v-for="data in order_data.outer_frame_sides.option_values" :key="data.id"
                        :value="data.name">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.name`" :value="order_data.outer_frame_sides.name" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.option_id`" :value="order_data.outer_frame_sides.id" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.option_code`" :value="order_data.outer_frame_sides.code" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.type`" :value="order_data.outer_frame_sides.type" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.option_value_id`" v-model="order_fill_out_id.outer_frame_sides" />

                    <VeeErrorMessage class="error__label" :name="`${order_data.outer_frame_sides.code}.value`" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_cut_position.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select"  :name="`${order_data.outer_frame_cut_position.code}.value`" id="" class="form-select" rules="required"
                      :class="{ 'error': errors[`${order_data.outer_frame_cut_position.code}.value`] }"
                      @change="
                        order_fill_out_id.outer_frame_cut_position = select_option_value_id(order_data.outer_frame_cut_position.option_values,values.outer_frame_cut_position.value)"
                      >
                      <option value="" disabled selected>請選擇規格</option>
                      <option v-for="data in order_data.outer_frame_cut_position.option_values" :key="data.id"
                        :value="data.name">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.name`" :value="order_data.outer_frame_cut_position.name" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.option_id`" :value="order_data.outer_frame_cut_position.id" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.option_code`" :value="order_data.outer_frame_cut_position.code" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.type`" :value="order_data.outer_frame_cut_position.type" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.option_value_id`" v-model="order_fill_out_id.outer_frame_cut_position" />

                    <VeeErrorMessage class="error__label" :name="`${order_data.outer_frame_cut_position.code}.value`" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 flex-auto">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_gasket_thickness.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField
                      as="select" 
                      :name="`${order_data.outer_frame_gasket_thickness.code}.value`" 
                      id="outer_frame_gasket_thickness" 
                      class="form-select" 
                      :class="{ 'error': errors[`${order_data.outer_frame_gasket_thickness.code}.value`] }"
                      @change="
                      order_fill_out_id.outer_frame_gasket_thickness = select_option_value_id(order_data.outer_frame_gasket_thickness.option_values,values.outer_frame_gasket_thickness.value)
                      "
                      rules="required">
                      <option value="" disabled selected>請選擇規格</option>
                      <option v-for="data in order_data.outer_frame_gasket_thickness.option_values" :key="data.id"
                        :value="data.name">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.name`" :value="order_data.outer_frame_gasket_thickness.name" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.option_id`" :value="order_data.outer_frame_gasket_thickness.id" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.option_code`" :value="order_data.outer_frame_gasket_thickness.code" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.type`" :value="order_data.outer_frame_gasket_thickness.type" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.option_value_id`" v-model="order_fill_out_id.outer_frame_gasket_thickness" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.outer_frame_gasket_thickness.code}.value`" />
                  </div>
                </div>
                
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_gasket_location.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField 
                      as="select"
                      :name="`${order_data.outer_frame_gasket_location.code}.value`" 
                      id="outer_frame_gasket_location"
                      class="form-select"  
                      :class="{ 'error': errors[`${order_data.outer_frame_gasket_location.code}.value`] }"
                      @change="
                      order_fill_out_id.outer_frame_gasket_location = select_option_value_id(order_data.outer_frame_gasket_location.option_values,values.outer_frame_gasket_location.value)"
                      rules="required">
                      <option value="" disabled selected>請選擇規格</option>
                      <option v-for="data in order_data.outer_frame_gasket_location.option_values" :key="data.id"
                        :value="data.name">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.name`" :value="order_data.outer_frame_gasket_location.name" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.option_id`" :value="order_data.outer_frame_gasket_location.id" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.option_code`" :value="order_data.outer_frame_gasket_location.code" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.type`" :value="order_data.outer_frame_gasket_location.type" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.option_value_id`" v-model="order_fill_out_id.outer_frame_gasket_location" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.outer_frame_gasket_location.code}.value`" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="doorSet" v-if="!!order_fill_out_id.designType">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              門片
              <span v-if="!is_track">{{ order_note.note_door_piece.translation }}</span>
            </h2>
            <div class="row flex-auto col-12">
            <!-- left -->
              <div class="col-md-6 flex-auto">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.win_lever.id">
                    <span class="text-danger">*</span>
                    {{ order_data.win_lever.name }}
                  </label>
                  <div class="col-sm-8">
                    <div :class="{ 'error': errors[`${order_data.win_lever.code}.value`] }" class="d-flex flex-wrap align-items-start  p-2 pt-0">
                       <div class="picOption" v-for="(item, idx) in order_data.win_lever.option_values"
                      :key="item.name + idx">
                      <VeeField type="radio" :id="'win_lever_' + item.id" :name="`${order_data.win_lever.code}.value`" :value="item.name"
                        @change="order_fill_out_id.win_lever = item.id" label="win_lever" rules="required" />
                      <VeeField type="hidden" :name="`${order_data.win_lever.code}.name`" :value="order_data.win_lever.name" />
                      <VeeField type="hidden" :name="`${order_data.win_lever.code}.option_id`" :value="order_data.win_lever.id" />
                      <VeeField type="hidden" :name="`${order_data.win_lever.code}.option_code`" :value="order_data.win_lever.code" />
                      <VeeField type="hidden" :name="`${order_data.win_lever.code}.type`" :value="order_data.win_lever.type" />
                      <VeeField type="hidden" :name="`${order_data.win_lever.code}.option_value_id`" v-model="order_fill_out_id.win_lever" />
                      <label :for="'win_lever_' + item.id">
                        <img :src="$imgUrl(item.image)" :alt="item.name">
                      </label>
                      <p class="fs-xs">{{ item.name }}</p>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_lever.code}.value`" />
                    </div>
                   
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.blade_size.id">
                    <span class="text-danger">*</span>
                    {{ order_data.blade_size.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.blade_size.code}.value`" :id="order_data.blade_size.id" class="form-select"
                      :class="{ 'error': errors[`${order_data.blade_size.code}.value`] }" v-model="order_fill_out.doorSet.size"
                      @change="set_blade_size_ID(order_data.blade_size.option_values),click_find_label($event)"
                      label="blade_size"
                      rules="required">
                      <option value="" disabled selected>請選擇規格</option>
                      <option v-for="size in order_data.blade_size.option_values" :key="size.name + size.id" :value="size.name">
                        {{ size.name }}
                      </option>
                    </VeeField>
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_size.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.blade_size.code}.name`" :value="order_data.blade_size.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_size.code}.option_id`" :value="order_data.blade_size.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_size.code}.option_code`" :value="order_data.blade_size.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_size.code}.type`" :value="order_data.blade_size.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_size.code}.option_value_id`" v-model="order_fill_out_id.blade_size" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.blade_numbers.id">
                    <span class="text-danger">*</span>
                    {{ order_data.blade_numbers.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="number" :name="`${order_data.blade_numbers.code}.value`" :id="order_data.blade_numbers.id" class="form-control"
                      :class="{ 'error': errors[`${order_data.blade_numbers.code}.value`] }" v-model="order_fill_out.doorSet.count"
                      label="blade_numbers" :rules="validateWidth" @input="validateWidth" />
                    <span class="fs-xs">{{ doorSet_comment }}</span>
                    <!-- <span class="fs-xs">{{ order_note.note_folding_width_limit.translation }}</span> -->
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_numbers.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.name`" :value="order_data.blade_numbers.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.option_id`" :value="order_data.blade_numbers.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.option_code`" :value="order_data.blade_numbers.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.type`" :value="order_data.blade_numbers.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.option_value_id`" value="0" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.blade_arrangement.name ">
                    <span class="text-danger">*</span>
                    {{ order_data.blade_arrangement.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.blade_arrangement.code}.value`" :id="order_data.blade_arrangement.name"
                      class="form-control" :class="{ 'error': errors[`${order_data.blade_arrangement.code}.value`] }" placeholder=""
                      label="blade_arrangement" rules="required" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_arrangement.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.name`" :value="order_data.blade_arrangement.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.option_id`" :value="order_data.blade_arrangement.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.option_code`" :value="order_data.blade_arrangement.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.type`" :value="order_data.blade_arrangement.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.option_value_id`" value="0" />
                  </div>
                </div>
                <div class="row mb-3" v-if="!is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.blade_arrangement.name ">
                    <span class="text-danger">*</span>
                    {{ order_data.blade_directions.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField 
                      as="select" 
                      :name="`${order_data.blade_directions.code}.value`" 
                      id="blade_directions" 
                      class="form-select"
                      :class="{ 'error': errors[`${order_data.blade_directions.code}.value`] }" 
                      @change="order_fill_out_id.blade_directions = select_option_value_id(order_data.blade_directions.option_values,values.blade_directions.value)"
                      label="blade_directions"
                      rules="required">
                      <option value="" disabled selected>請選擇規格</option>
                      <option v-for="data in order_data.blade_directions.option_values" :key="data.name + data.id" :value="data.name">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_directions.code}.value`"  />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.name`" :value="order_data.blade_directions.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.option_id`" :value="order_data.blade_directions.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.option_code`" :value="order_data.blade_directions.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.type`" :value="order_data.blade_directions.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.option_value_id`" v-model="order_fill_out_id.blade_directions" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{order_data.window_frame_type.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0" :class="{ 'error': errors[`${order_data.window_frame_type.code}.value`] }">
                      <div class="picOption" v-for="frame in order_data.window_frame_type.option_values">
                      <VeeField 
                        type="radio" 
                        :id="'frame' + frame.id" 
                        :name="`${order_data.window_frame_type.code}.value`" 
                        :value="frame.name"
                        label="door_frame" 
                        rules="required" 
                        @change="order_fill_out_id.door_frame = frame.id"
                      />
                      <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.name`" :value="order_data.window_frame_type.name" />
                      <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.option_id`" :value="order_data.window_frame_type.id" />
                      <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.option_code`" :value="order_data.window_frame_type.code" />
                      <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.type`" :value="order_data.window_frame_type.type" />
                      <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.option_value_id`" v-model="order_fill_out_id.door_frame" />
                      <label :for="'frame' + frame.id" @click="click_find_label($event)">
                        <img :src="$imgUrl(frame.image)" :alt="frame.name">
                      </label>
                      <p class="fs-xs">{{ frame.name }}</p>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.window_frame_type.code}.value`" />
                    </div>
                  </div>
                </div>
                <div class="row mb-3" v-if="!is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.magnetic_options.name">
                    <span class="text-danger">*</span>
                    {{ order_data.magnetic_options.name }}
                  </label>
                    <div class="col-sm-8">
                      <VeeField 
                        as="select" 
                        :name="`${order_data.magnetic_options.code}.value`" 
                        id="magnetic_options"
                        class="form-select"
                        :class="{ 'error': errors[`${order_data.magnetic_options.code}.value`] }"
                        @change="order_fill_out_id.magnetic_options = select_option_value_id(order_data.magnetic_options.option_values,values.magnetic_options.value)"
                         label="magnetic_options" 
                         rules="required">
                        <option value="" selected>請選擇規格</option>
                        <option :value="item.name" v-for="item in order_data.magnetic_options.option_values" :key="item.id">
                          {{ item.name }}
                        </option>
                      </VeeField>
                      <VeeField type="hidden" :name="`${order_data.magnetic_options.code}.name`" :value="order_data.magnetic_options.name" />
                      <VeeField type="hidden" :name="`${order_data.magnetic_options.code}.option_id`" :value="order_data.magnetic_options.id" />
                      <VeeField type="hidden" :name="`${order_data.magnetic_options.code}.option_code`" :value="order_data.magnetic_options.code" />
                      <VeeField type="hidden" :name="`${order_data.magnetic_options.code}.type`" :value="order_data.magnetic_options.type" />
                      <VeeField type="hidden" :name="`${order_data.magnetic_options.code}.option_value_id`" v-model="order_fill_out_id.magnetic_options" />
                      <VeeErrorMessage class="error__label" :name="`${order_data.magnetic_options.code}.value`" />
                    </div>
                </div>
                <div class="row mb-3" v-if="is_folding_door && is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.folding_method.id">
                    <span class="text-danger">*</span>
                    {{order_data.folding_method.name}}
                  </label>
                  <div class="col-sm-8">
                    <VeeField 
                      as="select" 
                      :name="`${order_data.folding_method.code}.value`" 
                      :id="order_data.folding_method.id" 
                      class="form-select"
                      :class="{ 'error': errors[`${order_data.folding_method.code}.value`] }" 
                      @change="order_fill_out_id.folding_method = select_option_value_id(order_data.folding_method.option_values,values.folding_method.value)"
                      label="folding_method" 
                      rules="required">
                      <option value="" disabled selected>請選擇規格</option>
                      <option :value="item.name" v-for="item in order_data.folding_method.option_values" :key="item.id">
                        {{ item.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.folding_method.code}.name`" :value="order_data.folding_method.name" />
                    <VeeField type="hidden" :name="`${order_data.folding_method.code}.option_id`" :value="order_data.folding_method.id" />
                    <VeeField type="hidden" :name="`${order_data.folding_method.code}.option_code`" :value="order_data.folding_method.code" />
                    <VeeField type="hidden" :name="`${order_data.folding_method.code}.type`" :value="order_data.folding_method.type" />
                    <VeeField type="hidden" :name="`${order_data.folding_method.code}.option_value_id`" v-model="order_fill_out_id.folding_method" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.folding_method.code}.value`" />
                  </div>
                </div>
                
              </div>
              <!-- right -->
              <div class="col-md-6 flex-auto">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.hinge_color.name">
                    <span class="text-danger">*</span>
                    {{ order_data.hinge_color.name }}
                  </label>
                  <div class="col-sm-8 d-flex flex-wrap align-items-start">
                    <div class="col-sm-8">
                      <VeeField as="select" :name="`${order_data.hinge_color.code}.value`" :id="order_data.hinge_color.name" class="form-select"
                        :class="{ 'error': errors[`${order_data.hinge_color.code}.value`] }"
                        @change="order_fill_out_id.hinge_color = select_option_value_id(order_data.hinge_color.option_values,values.hinge_color.value)"
                         label="hinge_color" rules="required">
                        <option value="" selected>請選擇規格</option>
                        <option :value="item.name" v-for="item in order_data.hinge_color.option_values" :key="item.id">
                          {{ item.name }}
                        </option>
                      </VeeField>
                      <VeeField type="hidden" :name="`${order_data.hinge_color.code}.name`" :value="order_data.hinge_color.name" />
                      <VeeField type="hidden" :name="`${order_data.hinge_color.code}.option_id`" :value="order_data.hinge_color.id" />
                      <VeeField type="hidden" :name="`${order_data.hinge_color.code}.option_code`" :value="order_data.hinge_color.code" />
                      <VeeField type="hidden" :name="`${order_data.hinge_color.code}.type`" :value="order_data.hinge_color.type" />
                      <VeeField type="hidden" :name="`${order_data.hinge_color.code}.option_value_id`" v-model="order_fill_out_id.hinge_color" />
                      <VeeErrorMessage class="error__label" :name="`${order_data.hinge_color.code}.value`" />
                    </div>
                  </div>
                </div>
                
                <!-- handle -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_type.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0" :class="{ 'error': errors[`${order_data.door_handle_type.code}.value`] }">
                       <div class="picOption" v-for="item in order_data.door_handle_type.option_values" :key="item.id">
                      <VeeField type="radio" :id="'lockHandle' + item.id" :name="`${order_data.door_handle_type.code}.value`" :value="item.name"
                        v-model="order_fill_out.doorSet.lockHandle.title"
                        @change="get_handle_color(item.id),order_fill_out_id.handle = item.id,order_fill_out_id.door_handle_type = item.id" 
                        label="lock_Handle"
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.name`" :value="order_data.door_handle_type.name" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.option_id`" :value="order_data.door_handle_type.id" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.option_code`" :value="order_data.door_handle_type.code" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.type`" :value="order_data.door_handle_type.type" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.option_value_id`" v-model="order_fill_out_id.door_handle_type" />
                      <label :for="'lockHandle' + item.id" @click="click_find_label($event)">
                        <img :src="$imgUrl(item.image)" :alt="item.name">
                        <label class="d-none" :for="'lock_Handle_option_value' + item.id"></label>
                      </label>
                      <p class="fs-xs">{{ item.name }}</p>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_handle_type.code}.value`" />
                    </div>
                  </div>
                </div>
                <div class="row mb-3"
                  v-if="!!handle_color & !!order_fill_out.doorSet.lockHandle.title && !is_none_handle">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_handle_color.name">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_color.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0" :class="{ 'error': errors[`${order_data.door_handle_color.code}.value`] }">
                       <div class="picOption" v-for="color in handle_color">
                      <VeeField type="radio" :id="'lockHandle_color' + color.id" :name="`${order_data.door_handle_color.code}.value`"
                        :value="color.name" @change="order_fill_out_id.lockHandle_color = color.option_value_id" label="lockHandle_color" rules="required" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.name`" :value="order_data.door_handle_color.name" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.option_id`" :value="order_data.door_handle_color.id" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.option_code`" :value="order_data.door_handle_color.code" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.type`" :value="order_data.door_handle_color.type" />
                      <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.option_value_id`" v-model="order_fill_out_id.lockHandle_color" />
                      
                      <label :for="'lockHandle_color' + color.id"> 
                        <img :src="$imgUrl(color.image)" :alt="color.name">
                      </label>
                      <p class="fs-xs">{{ color.name }}</p>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_handle_color.code}.value`" />
                    </div>
                  </div>
                </div>
                <div class="row mb-3" v-if="!!order_fill_out.doorSet.lockHandle.title && !is_none_handle">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_handle_location.name">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_location.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_handle_location.code}.value`" :id="order_data.door_handle_location.id"
                      class="form-control" :class="{ 'error': errors[`${order_data.door_handle_location.code}.value`] }" label="lockHandle_position"
                      rules="required" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.name`" :value="order_data.door_handle_location.name" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.option_id`" :value="order_data.door_handle_location.id" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.option_code`" :value="order_data.door_handle_location.code" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.type`" :value="order_data.door_handle_location.type" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_handle_location.code}.value`" />
                  </div>
            
                </div>
                <div class="row mb-3" v-if="!!order_fill_out.doorSet.lockHandle.title && !is_none_handle">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_handle_qty.name">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_qty.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_handle_qty.code}.value`" :id="order_data.door_handle_qty.name"
                      class="form-control" :class="{ 'error': errors[`${order_data.door_handle_qty.code}.value`] }" label="lockHandle_count"
                      rules="required" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.name`" :value="order_data.door_handle_qty.name" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.option_id`" :value="order_data.door_handle_qty.id" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.option_code`" :value="order_data.door_handle_qty.code" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.type`" :value="order_data.door_handle_qty.type" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_handle_qty.code}.value`" />
                  </div>
                </div>

                <!-- lock -->
                <div class="row mb-3" v-if="!is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_type.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_type.name }}
                  </label>
                  <div class="col-sm-8">
                  <div class="d-flex flex-wrap align-items-start  p-2 pt-0" :class="{ 'error': errors[`${order_data.door_lock_type.code}.value`] }">
                     <div class="picOption" v-for="item in order_data.door_lock_type.option_values" :key="item.id">
                      <VeeField type="radio" :id="item.id" :name="`${order_data.door_lock_type.code}.value`" :value="item.name"
                        v-model="order_fill_out.doorSet.lock.title"
                        @change="get_lock_color(item.id),order_fill_out_id.lock_type = item.id" label="lock_type"
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_type.code}.name`" :value="order_data.door_lock_type.name" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_type.code}.option_id`" :value="order_data.door_lock_type.id" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_type.code}.option_code`" :value="order_data.door_lock_type.code" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_type.code}.type`" :value="order_data.door_lock_type.type" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_type.code}.option_value_id`" v-model="order_fill_out_id.lock_type"/>
                      <label :for="item.id">
                        <img :src="$imgUrl(item.image)" :alt="item.name">
                      </label>
                      <p class="fs-xs">{{ item.name }}</p>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_lock_type.code}.value`" />
                  </div>
                   
                  </div>
                </div>
                <div class="row mb-3"
                  v-if="lock_color.length > 0 && !is_none_lock && !!order_fill_out.doorSet.lock.title && !is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_color.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_color.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"  :class="{ 'error': errors[`${order_data.door_lock_color.code}.value`] }"> 
                      <div class="picOption" v-for="color in lock_color" :key="color.id">
                      <VeeField 
                        type="radio" 
                        :id="color.id" 
                        :name="`${order_data.door_lock_color.code}.value`" 
                        :value="color.name"
                        @change="order_fill_out_id.door_lock_color = color.option_value_id"
                        label="lock_color"
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.name`" :value="order_data.door_lock_color.name" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.option_id`" :value="order_data.door_lock_color.id" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.option_code`" :value="order_data.door_lock_color.code" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.type`" :value="order_data.door_lock_color.type" />
                      <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.option_value_id`" v-model="order_fill_out_id.door_lock_color" />
                      <label :for="color.id">
                        <img :src="$imgUrl(color.image)" :alt="color.name">
                      </label>
                      <p class="fs-xs">{{ color.name }}</p>
                    </div>
      
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_lock_color.code}.value`" />
                    </div>
                    
                  </div>
                </div>
                <div class="row mb-3" v-if="!is_none_lock && !!order_fill_out.doorSet.lock.title && !is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_location.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_location.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_lock_location.code}.value`" :id="order_data.door_lock_location.id"
                      class="form-control" :class="{ 'error': errors[`${order_data.door_lock_location.code}.value`] }" label="lock_location"
                      rules="required" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.name`" :value="order_data.door_lock_location.name" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.option_id`" :value="order_data.door_lock_location.id" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.option_code`" :value="order_data.door_lock_location.code" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.type`" :value="order_data.door_lock_location.type" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_lock_location.code}.value`" />
                  </div>
                 
                </div>
                <div class="row mb-3" v-if="!is_none_lock && !!order_fill_out.doorSet.lock.title && !is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_qty.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_qty.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_lock_qty.code}.value`" :id="order_data.door_lock_qty.id" class="form-control"
                      :class="{ 'error': errors[`${order_data.door_lock_qty.code}.value`] }" label="lock_qty" rules="required" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.name`" :value="order_data.door_lock_qty.name" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.option_id`" :value="order_data.door_lock_qty.id" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.option_code`" :value="order_data.door_lock_qty.code" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.type`" :value="order_data.door_lock_qty.type" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_lock_qty.code}.value`" />
                  </div>
             
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="partitio" v-if="!!order_fill_out_id.designType">  
   <div class="container container-original">
     <div class="block block3 mainForm">
       <h2 class="title position-relative">
         {{ order_data.dividers_json.name }}
         <i class="fas fa-question-circle"></i>
         <div class="info_box">
           {{ partitio_note }}
         </div>
       </h2>
       <div class="row flex-auto col-12">
         <div class="col-md-12">
           <div class="row mb-3">
              <label class="label-set col-form-label col-sm-2 " :for="order_data.lever_segmentation_note.name">
             <span class="text-danger">*</span>
             {{ order_data.lever_segmentation_note.name }}
           </label>
           <div class="col-sm-4">
             <VeeField type="number" :name="`${order_data.lever_segmentation_note.code}.value`" :id="order_data.lever_segmentation_note.name"
               class="form-control" :class="{ 'error': errors[`${order_data.lever_segmentation_note.code}.value`] }"
               label="lever_segmentation_note" rules="required" />
             <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.name`" :value="order_data.lever_segmentation_note.name" />
               <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.option_id`" :value="order_data.lever_segmentation_note.id" />
               <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.option_code`" :value="order_data.lever_segmentation_note.code" />
               <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.type`" :value="order_data.lever_segmentation_note.type" />
               <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.option_value_id`" value="0" />
             <VeeErrorMessage class="error__label" :name="`${order_data.lever_segmentation_note.code}.value`" />
           </div>
           </div>
         </div>
         <div class="col-md-12 mb-4 border-bottom py-2  position-relative " v-for="(data, idx) in order_fill_out.partitio" :key="`partitio_${idx +1}`">
           <div class="row mb-3">
             <label class="label-set col-form-label col-sm-2 " for="">
               <span class="text-danger">*</span>
               {{order_data.dividers_json.name}}{{ idx + 1 }}
             </label>
             <div class="d-none">
               <VeeField type="hidden" :name="`${order_data.dividers_json.code}.name`" :value="order_data.dividers_json.name" />
               <VeeField type="hidden" :name="`${order_data.dividers_json.code}.option_id`" :value="order_data.dividers_json.id" />
               <VeeField type="hidden" :name="`${order_data.dividers_json.code}.option_code`" :value="order_data.dividers_json.code" />
               <VeeField type="hidden" :name="`${order_data.dividers_json.code}.type`" :value="order_data.dividers_json.type" />
               <VeeField type="hidden" :name="`${order_data.dividers_json.code}.option_value_id`" value="0" />
             </div>
             <div class="col-sm-4">
               <div class="d-flex mb-2">
                 <div class="input-group">
                   <VeeField 
                     type="number"
                     :name="`${order_data.dividers_json.code}.value[${idx}].height`" 
                     class="form-control"
                     :class="{ 'error':errors[`${order_data.dividers_json.code}.value[${idx}].height`]}" 
                     :label="`dividers_json[${idx}].height`"
                     v-model.number="data.height" 
                     rules="required"
                     v-if="!!values.dividers_json"
                     :disabled="data.center == 'Y'"
                   />
                   <span class="input-group-text">mm</span>
               </div>
               </div>
               <VeeErrorMessage class="error__label" :name="`${order_data.dividers_json.code}.value[${idx}].height`" />
               <div class="d-flex gap-4">
                 <div>
                   <VeeField 
                     type="checkbox" 
                     class="form-check-input me-2" 
                     v-model="data.center"
                     value="Y"
                     :name="`${order_data.dividers_json.code}.value[${idx}].center`"
                     :id="`dividers_json_center`" />
                   <label :for="`dividers_json_center`">
                     置中
                   </label>
                 </div>
                 <div>
                   <VeeField 
                     type="checkbox" 
                     class="form-check-input me-2" 
                     v-model="data.no_move"
                     value="Y" 
                     :name="`${order_data.dividers_json.code}.value[${idx}].no_move`"
                     :id="`dividers_json_no_move${idx +1}`" />
                   <label :for="`dividers_json_no_move${idx +1}`">
                     {{ order_data.divider_no_move.option_values[0].name }}
                   </label>
                 </div>
               </div>
             </div>
           </div>
           <div class="row me-0 d-inline-flex col-sm-6 mb-3">
             <label class="label-set col-form-label col-4" for="">
               <span class="text-danger">*</span>
               中隔{{ idx + 1 }}以上拉桿分段
             </label>
             <div class="col-8 d-flex align-items-center ">
               <div class="col me-2 input-group">
                 <VeeField 
                   type="text"
                   :name="`${order_data.dividers_json.code}.value[${idx}].above_handle_division`" 
                   class="form-control"
                   v-model="data.above_handle_division"
                   :disabled="data.above_handle_division_center == 'Y'"
                   :class="{ 'error':errors[`${order_data.dividers_json.code}.value[${idx}].above_handle_division`]}" 
                   :label="`partitio[${idx}].name`"
                   rules="required"
                />
                <!-- <span class="input-group-text">mm</span> -->
                <VeeErrorMessage class="error__label"   :name="`${order_data.dividers_json.code}.value[${idx}].above_handle_division`" />
               </div>
               <VeeField
                 type="checkbox"
                 :name="`${order_data.dividers_json.code}.value[${idx}].pullHandle_top_center`"
                 value="Y"
                 class="form-check-input mx-2"
                 v-model="data. above_handle_division_center"
                 :id="`pullHandle_top_center${idx +1}`"
                 />
                 <label :for="`pullHandle_top_center${idx +1}`">
                     置中
                 </label>
             </div>
           </div>
           <div class="row ms-0 d-inline-flex col-sm-6 mb-3"  v-if="idx == 0">
             <label class="label-set col-form-label col-4" for="">
               <span class="text-danger">*</span>
               中隔1以下拉桿分段
             </label>
             <div class="col-sm-8 d-flex align-items-center">
               <div class="col me-2 input-group">
                 <VeeField 
                   type="text"
                   :name="`${order_data.dividers_json.code}.value[${idx}].beneath_handle_division`" 
                   class="form-control"
                   v-model="data.beneath_handle_division"
                   :disabled="data.beneath_handle_division_center == 'Y'"
                   :class="{ 'error':errors[`${order_data.dividers_json.code}.value[${idx}].beneath_handle_division`]}" 
                   :label="`partitio[${idx}].name`"
                   rules="required"
                />
                <!-- <span class="input-group-text">mm</span> -->
               </div>
                <VeeErrorMessage class="error__label"   :name="`${order_data.dividers_json.code}.value[${idx}].beneath_handle_division`"  />
               <VeeField
                 type="checkbox"
                 value="Y"
                 :name="`${order_data.dividers_json.code}.value[${idx}].pullHandle_bottom_center`"
                 v-model="data.beneath_handle_division_center"
                 class="form-check-input mx-2"
                 :id="`pullHandle_bottom_center${idx +1}`"
                 />
                 <label :for="`pullHandle_bottom_center${idx +1}`">
                     置中
                 </label>
             </div>
           </div>
           <i class="fas fa-times-circle fs-4 close_btn" @click="del_partitio(idx)"></i>
         </div>
         <div class="col-12 text-center ">
         </div>
         <div class="col-12 text-center mt-4">
           <i class="fa-solid fa-circle-plus fs-3 add_btn" @click="add_partitio"></i>
         </div>
       </div>
     </div>
   </div>
      </section>
      

      <section id="track_style" v-if="!!order_fill_out_id.designType && is_track">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              軌道樣式
              <i class="fas fa-info-circle">
                <div class="nav-img">
                <img src="@/assets/images/track_info_img.jpg" alt="track_info_img">
              </div>
              </i>
            </h2>
            <div class="row flex-auto">
              <div class="col-md-6 flex-auto">
                <!-- TOP -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.win_option_top_track.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      厚度21mm 寬度超出2500mm，需考慮切半
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex align-items-center gap-3 flex-wrap p-2" :class="{ 'error': errors[`${order_data.win_option_top_track.code}.value`] }">
                      <label :for="'top_Partition_' + data.id"
                      v-for="data in order_data.win_option_top_track.option_values" :key="data.id">
                      <VeeField type="radio" :name="`${order_data.win_option_top_track.code}.value`" :value="data.name" class="form-check-input"
                        :id="'top_Partition_' + data.id" @change="order_fill_out_id.topPartition = data.id"
                        label="top_Partition" rules="required" />
                      <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.name`" :value="order_data.win_option_top_track.name" />
                      <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.option_id`" :value="order_data.win_option_top_track.id" />
                      <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.option_code`" :value="order_data.win_option_top_track.code" />
                      <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.type`" :value="order_data.win_option_top_track.type" />
                      <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.option_value_id`" v-model="order_fill_out_id.topPartition" />
                      <span class="ms-2">{{ data.name }}</span>
                    </label>
                    <label for="top_Partition_Cut">
                    /
                      <VeeField type="checkbox" :name="`${order_data.win_option_top_cut_track.code}.option_values[0].value`" label="top_Partition_Cut" value="Y"
                        class="form-check-input ms-2" id="top_Partition_Cut" />
                      
                      <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.option_values[0].name`" :value="order_data.win_option_top_cut_track.name" />
                      <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.option_values[0].option_id`" :value="order_data.win_option_top_cut_track.id" />
                      <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.option_code`" :value="order_data.win_option_top_cut_track.code" />
                      <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.type`" :value="order_data.win_option_top_cut_track.type" />
                      <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.option_values[0].option_value_id`" value="0" />
                      <span v-if="values.top_Partition_Cut">
                         <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.option_value_id`" value="Y" v-if="values.top_Partition_Cut.value"/>
                      </span>
                     
                      <span class="ms-2">{{ order_data.win_option_top_cut_track.name }}</span>
                    </label>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_option_top_cut_track.code}.value`" />
                    </div>
                    
                  </div>
                </div>
                <!-- SIDE -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.win_option_side.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      厚度21mm
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex align-items-center gap-3 flex-wrap p-2" :class="{ 'error': errors[`${order_data.win_option_side.code}.value`] }">
                      <label :for="'side_Partition_' + data.id" v-for="data in order_data.win_option_side.option_values"
                      :key="data.id">
                      <VeeField type="radio" :name="`${order_data.win_option_side.code}.value`" :value="data.name" class="form-check-input"
                        :id="'side_Partition_' + data.id" @change="order_fill_out_id.side_partition = data.id" label="side_Partition" rules="required" />
                      <VeeField type="hidden" :name="`${order_data.win_option_side.code}.name`" :value="order_data.win_option_side.name" />
                      <VeeField type="hidden" :name="`${order_data.win_option_side.code}.option_id`" :value="order_data.win_option_side.id" />
                      <VeeField type="hidden" :name="`${order_data.win_option_side.code}.option_code`" :value="order_data.win_option_side.code" />
                      <VeeField type="hidden" :name="`${order_data.win_option_side.code}.type`" :value="order_data.win_option_side.type" />
                      <VeeField type="hidden" :name="`${order_data.win_option_side.code}.option_value_id`" v-model="order_fill_out_id.side_partition" />
                      <span class="ms-2">{{ data.name }}</span>
                    
                    </label>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_option_side.code}.value`" />
                    </div>
                    
                  </div>
                </div>
                <!-- BOTTOM -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.win_option_bottom.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      厚度21mm 寬度超出2500mm，需考慮切半
                    </div>
                  </label>
                  <div class="col-sm-8" >
                    <div class="d-flex align-items-center gap-3 flex-wrap p-2" :class="{ 'error': errors[`${order_data.win_option_bottom.code}.value`] }">
                       <label :for="'bottom_Partition_' + data.id"
                      v-for="data in order_data.win_option_bottom.option_values" :key="data.id">
                      <VeeField 
                        type="radio"
                        @change="order_fill_out_id.bottom_partition = data.id"
                        :name="`${order_data.win_option_bottom.code}.value`" 
                        :value="data.name" class="form-check-input"
                        :id="'bottom_Partition_' + data.id" 
                        label="bottom_Partition" 
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.name`" :value="order_data.win_option_bottom.name" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.option_id`" :value="order_data.win_option_bottom.id" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.option_code`" :value="order_data.win_option_bottom.code" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.type`" :value="order_data.win_option_bottom.type" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.option_value_id`" v-model="order_fill_out_id.bottom_partition" />
                      <span class="ms-2">{{ data.name }}</span>
                    </label>
                    <label for="bottom_Partition_Cut">
                      /
                      <VeeField type="checkbox" :name="`${order_data.win_option_bottom_cut_track.code}.option_values.value`" value="Y" class="form-check-input ms-2" id="bottom_Partition_Cut" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.option_values.name`" :value="order_data.win_option_bottom_cut_track.name" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.option_values.option_id`" :value="order_data.win_option_bottom_cut_track.id" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.option_code`" :value="order_data.win_option_bottom_cut_track.code" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.type`" :value="order_data.win_option_bottom_cut_track.type" />
                      <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.option_values.option_value_id`" value="0" />
                      <span v-if="values.bottom_Partition_Cut">
                        <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.option_value_id`" value="Y" v-if="values.bottom_Partition_Cut.value"  />
                      </span>
                      
                      <span class="ms-2">{{order_data.win_option_bottom_cut_track.name}}</span>
                    </label>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_option_bottom_cut_track.code}.value`" />
                    </div>
                   
                  </div>
                </div>
                <div class="row mb-3" v-if="!is_folding_door">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.is_uplow_track_fixed.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      不固定為浮動式折門<br>
                      L型：門片固定於一側+有側板<br>
                      平面：門片固定於兩側+無側板<br>
                      不要底軸：浮動式折門
                    </div>
                  </label>
                  {{values[`${order_data.is_uplow_track_fixed.code}.value`]}}
                  <div class="col-sm-8">
                    <VeeField as="select" 
                      :name="`${order_data.is_uplow_track_fixed.code}.value`" 
                      id="track_fixed" class="form-select"
                      :class="{ 'error': errors[`${order_data.is_uplow_track_fixed.code}.value`] }" 
                      @change="order_fill_out_id.track_fixed = select_option_value_id(order_data.is_uplow_track_fixed.option_values,values[`${order_data.is_uplow_track_fixed.code}`])"
                      label="track_fixed" 
                      rules="required"
                    >
                      <option value="" disabled selected>請選擇規格</option>
                      <option v-for="data in order_data.is_uplow_track_fixed.option_values" :key="data.id"
                        :value="data.name">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.name`" :value="order_data.is_uplow_track_fixed.name" />
                    <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.option_id`" :value="order_data.is_uplow_track_fixed.id" />
                    <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.option_code`" :value="order_data.is_uplow_track_fixed.code" />
                    <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.type`" :value="order_data.is_uplow_track_fixed.type" />
                    <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.option_value_id`" v-model="order_fill_out_id.track_fixed" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.is_uplow_track_fixed.code}.value`" />
                  </div>
                </div>
                <div class="row">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.door_openclose.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.door_openclose.code}.value`" id="door_openclose" class="form-select"
                      :class="{ 'error': errors[`${order_data.door_openclose.code}.value`] }"
                      @change="order_fill_out_id.door_openclose = select_option_value_id(order_data.door_openclose.option_values,values.door_openclose.value)"
                       label="door_openclose" rules="required">
                      <option value="" disabled selected>請選擇規格</option>
                      <option v-for="data in order_data.door_openclose.option_values" :key="data.id" :value="data.name">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.door_openclose.code}.name`" :value="order_data.door_openclose.name" />
                    <VeeField type="hidden" :name="`${order_data.door_openclose.code}.option_id`" :value="order_data.door_openclose.id" />
                    <VeeField type="hidden" :name="`${order_data.door_openclose.code}.option_code`" :value="order_data.door_openclose.code" />
                    <VeeField type="hidden" :name="`${order_data.door_openclose.code}.type`" :value="order_data.door_openclose.type" />
                    <VeeField type="hidden" :name="`${order_data.door_openclose.code}.option_value_id`" v-model="order_fill_out_id.door_openclose" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_openclose.code}.value`" />
                  </div>
                  
                </div>
              </div>
              <div class="col-md-6 flex-auto" v-if="!!doorType_track">
                <div class="row mb-3 ">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.upper_track_color.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0" :class="{ 'error': errors[`${order_data.upper_track_color.code}.value`] }">
                      <div class="picOption" v-for="color in order_data.upper_track_color.option_values" :key="color.id">
                      <VeeField type="radio" :id="'topTrack' + color.id" :name="`${order_data.upper_track_color.code}.value`" :value="color.name"
                        @change="order_fill_out_id.upper_track_color = color.id"
                        label="topTrackColor" rules="required" />
                      <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.name`" :value="order_data.upper_track_color.name" />
                      <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.option_id`" :value="order_data.upper_track_color.id" />
                      <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.option_code`" :value="order_data.upper_track_color.code" />
                      <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.type`" :value="order_data.upper_track_color.type" />
                      <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.option_value_id`" v-model="order_fill_out_id.upper_track_color" />
                      <label :for="'topTrack' + color.id">
                        <img :src="$imgUrl(color.image)" :alt="color.name">
                      </label>
                      <p class="fs-xs">{{ color.name }}</p>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.upper_track_color.code}.value`" />
                    </div>
                    
                  </div>
                </div>
                <div class="row mb-3 ">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ doorType_track.option_name }}
                  </label>
                  <div class="col-sm-8">
                  <div class="d-flex flex-wrap align-items-start  p-2 pt-0" :class="{ 'error': errors[`${doorType_track.option_code}.value`] }">
                    <div class="picOption" v-for="(item, idx) in doorType_track.option_group_suboption_values"
                      :key="item.id">
                      <VeeField type="radio" :id="'track' + idx" :name="`${doorType_track.option_code}.value`" :value="item.name" label="track"
                        @change="order_fill_out_id.bottom_track = item.option_value_id" rules="required" />
                      <VeeField type="hidden" :name="`${doorType_track.option_code}.name`" :value="doorType_track.option_name" />
                      <VeeField type="hidden" :name="`${doorType_track.option_code}.option_id`" :value="doorType_track.option_id" />
                      <VeeField type="hidden" :name="`${doorType_track.option_code}.option_code`" :value="doorType_track.option_code" />
                      <VeeField type="hidden" :name="`${doorType_track.option_code}.type`" :value="doorType_track.option_type" />
                      <VeeField type="hidden" :name="`${doorType_track.option_code}.option_value_id`" v-model="order_fill_out_id.bottom_track" />
                      <label :for="'track' + idx">
                        <img :src="$imgUrl(item.image)" :alt="item.name">
                      </label>
                      <p class="fs-xs">{{ item.name }}</p>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${doorType_track.option_code}.value`" />
                  </div>
                    
                  </div>
                </div>
                <div class="row mb-3" v-if="!is_none_bottom_track">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.lower_track_color.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0" :class="{ 'error': errors[`${order_data.lower_track_color.code}.value`] }">
                      <div class="picOption" v-for="color in order_data.lower_track_color.option_values" :key="color.id">
                      <VeeField type="radio" :id="'bottomTrack' + color.id" :name="`${order_data.lower_track_color.code}.value`" :value="color.name"
                        @change="order_fill_out_id.lower_track_color = color.id"
                        label="bottomTrackColor" rules="required" />
                      <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.name`" :value="order_data.lower_track_color.name" />
                      <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.option_id`" :value="order_data.lower_track_color.id" />
                      <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.option_code`" :value="order_data.lower_track_color.code" />
                      <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.type`" :value="order_data.lower_track_color.type" />
                      <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.option_value_id`" v-model="order_fill_out_id.lower_track_color" />
                      <label :for="'bottomTrack' + color.id">
                        <img :src="$imgUrl(color.image)" :alt="color.name">
                      </label>
                      <p class="fs-xs">{{ color.name }}</p>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.lower_track_color.code}.value`" />
                    </div>
               
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="decorative" v-if="!!order_fill_out_id.designType && is_track">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              {{ order_data.decorative_pane_type.name }}
              <i class="fas fa-info-circle">
                <div class="nav-img">
                <img src="@/assets/images/decorative_info_img.jpg" alt="decorative_info_img">
              </div>
              </i>
            </h2>
            <div class="row flex-auto">
              <div class="col-md-12">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2" for="">
                    <span class="text-danger">*</span>
                    {{order_data.decorative_pane_type.name}}
                  </label>
                  <div class="col-sm-10" :class="{ 'error': errors[`${order_data.decorative_pane_type.code}.value`] }">
                    <div class="picOption" v-for="data in order_data.decorative_pane_type.option_values" :key="data.id">
                      <VeeField type="radio" :id="'decorativeType' + data.id" :name="`${order_data.decorative_pane_type.code}.value`" :value="data.name"
                        @change="order_fill_out_id.decorative_pane_type = data.id" label="decorativeType"
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.name`" :value="order_data.decorative_pane_type.name" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.option_id`" :value="order_data.decorative_pane_type.id" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.option_code`" :value="order_data.decorative_pane_type.code" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.type`" :value="order_data.decorative_pane_type.type" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.option_value_id`" v-model="order_fill_out_id.decorative_pane_type" />
                      <label :for="'decorativeType' + data.id">
                        <img :src="$imgUrl(data.image)" :alt="data.name">
                      </label>
                      <div class="position-relative mb-3">
                        {{ data.name }}
                        <i class="fas fa-question-circle fs-xs"></i>
                        <div class="info_box">
                          平面式
                        </div>
                      </div>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.decorative_pane_type.code}.value`" />
                    
                  </div>
                </div>
              </div>
              <div class="col-md-6 flex-auto" v-if="!is_none_decorative_pane && doorType_height">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    {{doorType_height.option_name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group">
                      <VeeField type="text" :name="`${doorType_height.option_code}.value`" class="form-control"
                        v-model="doorType_height_value" disabled v-if="!decorativeUserInput" />
                      <VeeField type="text" :name="`${doorType_height.option_code}.value`" class="form-control"   v-else />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.name`" :value="doorType_height.option_name" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.option_id`" :value="doorType_height.option_id" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.option_code`" :value="doorType_height.option_code" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.type`" :value="doorType_height.option_type" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.option_value_id`" v-model="order_fill_out_id.decorative_height" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <div class="mt-2">
                      <input type="checkbox" value="" class="form-check-input me-2" v-model="decorativeUserInput" />
                      <label>自行輸入</label> 
                    </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    {{ order_data.decorative_panel_corner_piece.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" 
                    :name="`${order_data.decorative_panel_corner_piece.code}.value`" 
                    id="decorative_panel_corner_piece"
                    @change="order_fill_out_id.decorative_panel_corner_piece = select_option_value_id(order_data.decorative_panel_corner_piece.option_values,values.decorative_panel_corner_piece.value)"
                      class="form-select">
                      <option value="" disabled selected>請選擇規格</option>
                      <option v-for="data in order_data.decorative_panel_corner_piece.option_values" :key="data.id"
                        :value="data.name">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.decorative_panel_corner_piece.code}.name`" :value="order_data.decorative_panel_corner_piece.name" />
                    <VeeField type="hidden" :name="`${order_data.decorative_panel_corner_piece.code}.option_id`" :value="order_data.decorative_panel_corner_piece.id" />
                    <VeeField type="hidden" :name="`${order_data.decorative_panel_corner_piece.code}.option_code`" :value="order_data.decorative_panel_corner_piece.code" />
                    <VeeField type="hidden" :name="`${order_data.decorative_panel_corner_piece.code}.type`" :value="order_data.decorative_panel_corner_piece.type" />
                    <VeeField type="hidden" :name="`${order_data.decorative_panel_corner_piece.code}.option_value_id`" v-model="order_fill_out_id.decorative_panel_corner_piece" />
                  </div>
                </div>

              </div>
              <div class="col-md-6 flex-auto">
                <div class="row mb-3" v-if="!is_none_decorative_pane">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger"></span>
                    {{doorType_depth.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group">
                      <VeeField 
                        type="text" 
                        :name="`decorative_panel_top_depth.value`" 
                        class="form-control" 
                        v-model="doorType_depth_value"
                        disabled 
                        v-if="!depthUserInput" 
                      />
                      <VeeField type="text" :name="`decorative_panel_top_depth.value`" class="form-control" v-else />
                      <VeeField type="hidden" :name="`decorative_panel_top_depth.name`" :value="doorType_depth.name" />
                      <VeeField type="hidden" :name="`decorative_panel_top_depth.option_id`" :value="doorType_depth.id" />
                      <VeeField type="hidden" :name="`decorative_panel_top_depth.option_code`" :value="doorType_depth.code" />
                      <VeeField type="hidden" :name="`decorative_panel_top_depth.type`" :value="doorType_depth.type" />
                      <VeeField type="hidden" :name="`decorative_panel_top_depth.option_value_id`" v-model="order_fill_out_id.decorative_depth" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <div class="mt-2">
                      <input type="checkbox" name="" value="" class="form-check-input me-2" v-model="depthUserInput">
                      <span>自行輸入</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="T-POST" v-if="!!order_fill_out_id.designType && !is_track">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              T柱
            </h2>
            <div class="row flex-auto">
              <div class="col-md-12">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2" for="">
                    <span class="text-danger">*</span>
                    {{order_data.pilar_type.name}}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      垂直&水平
                    </div>
                  </label>
                  <div class="col-sm-10">
                    <div class="d-flex align-items-center  p-2 pt-0" :class="{ 'error': errors[`${order_data.pilar_type.code}.value`] }">
                      <div class="picOption" v-for="data in order_data.pilar_type.option_values" :key="data.id">
                      <VeeField 
                        type="radio" 
                        :id="'decorativeType' + data.id" 
                        :name="`${order_data.pilar_type.code}.value`" 
                        :value="data.name"
                        @change="order_fill_out_id.pilar_type = data.id" 
                        label="decorativeType"
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.pilar_type.code}.name`" :value="order_data.pilar_type.name" />
                      <VeeField type="hidden" :name="`${order_data.pilar_type.code}.option_id`" :value="order_data.pilar_type.id" />
                      <VeeField type="hidden" :name="`${order_data.pilar_type.code}.option_code`" :value="order_data.pilar_type.code" />
                      <VeeField type="hidden" :name="`${order_data.pilar_type.code}.type`" :value="order_data.pilar_type.type" />
                      <VeeField type="hidden" :name="`${order_data.pilar_type.code}.option_value_id`" v-model="order_fill_out_id.pilar_type" />
                      <label :for="'decorativeType' + data.id">
                        <img :src="$imgUrl(data.image)" :alt="data.name">
                      </label>
                      <p class="mb-3">
                        {{ data.name }}
                      </p>
                    </div>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.pilar_type.code}.value`" />
                  </div>
                </div>
              </div>
              <div class="col-md-12 row gx-0">
                <div class="col-md-6 d-flex mb-3 position-relative" v-for="(data,idx) in order_fill_out.t_post.position" :key="'T-POST_position' + idx +1">
                  <label class="label-set col-form-label col-sm-4 pe-3" :for="'T-POST_position' + idx+1">
                    <span class="text-danger">*</span>
                    T{{ idx+1 }}位置
                  </label>
                  <div class="col-sm-8 pe-3">
                    <VeeField 
                      type="number" 
                      :name="`${order_data.t_post_json.code}.value.height[${idx}]`" 
                      :id="'T-POST_position' + idx +1"
                      class="form-control"
                      v-model="data.value"
                      rules="required"
                      :class="{ 'error': errors[`${order_data.t_post_json.code}.value.height[${idx}]`] }"
                      label="T-POST_position" 
                    />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.name`" :value="order_data.t_post_json.name" />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.option_id`" :value="order_data.t_post_json.id" />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.option_code`" :value="order_data.t_post_json.code" />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.type`" :value="order_data.t_post_json.type" />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.t_post_json.code}.value.height[${idx}]`"  />
                  </div>
                  <i class="fas fa-times-circle fs-4 close_btn btn-right-2" @click="del_t_post(idx)"></i>
                </div>
              </div>
              <div class="col-md-6 d-flex align-items-center mt-3" v-if="order_fill_out.t_post.position.length>0">
                  <div class="col-4 label-set pe-2">
                    <VeeField type="checkbox" :name="`${order_data.t_post_json.code}.value.average`"  class="form-check-input" value="Y" v-model="order_fill_out.t_post.setting"/>
                  </div>
                  <label for="" class="col-8 label-set text-start">均分</label>
              </div>
              <div class="col-12 text-center mt-4">
                <i class="fa-solid fa-circle-plus fs-3 add_btn" @click="add_t_post"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

       <section id="auxiliary" v-if="!!order_fill_out_id.designType"> 
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              {{ order_data.auxiliaries.name }}
              <i class="fas fa-info-circle">
                <div class="nav-img">
                <img src="@/assets/images/auxiliary_info_img.jpg" alt="auxiliary_info_img">
              </div>
              </i>
            </h2>
            <div class="flex-auto">
              <div class="row position-relative border-bottom p-2" v-for="(item, idx) in auxiliary" :key="`title` + idx">
                <div>
                  <p class="col-lg-1  text-lg-end">{{order_data.auxiliaries.name}} {{ idx + 1 }}</p>
                </div>
                <div class="col-md-6 flex-auto">
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      {{ order_data.auxiliary_length.name }}
                    </label>
                    <div class="col-sm-8">
                      <VeeField as="select" :name="`${order_data.auxiliaries.code}.value[${idx}].length`" :id="`auxiliary_length${idx + 1 }`"
                        v-model="auxiliary[idx].add_length"
                         class="form-select">
                        <option value="" disabled selected>請選擇規格</option>
                        <option v-for="data in order_data.auxiliary_length.option_values" :key="data.id"
                          :value="data.name">
                          {{ data.name }}
                        </option>
                      </VeeField>
                      <VeeField type="hidden" :name="`${order_data.auxiliaries.code}.name`" :value="order_data.auxiliaries.name" />
                      <VeeField type="hidden" :name="`${order_data.auxiliaries.code}.option_id`" :value="order_data.auxiliaries.id" />
                      <VeeField type="hidden" :name="`${order_data.auxiliaries.code}.option_code`" :value="order_data.auxiliaries.code" />
                      <VeeField type="hidden" :name="`${order_data.auxiliaries.code}.type`" :value="order_data.auxiliaries.type" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " :for="`auxiliary_width${idx + 1 }`">
                      {{order_data.auxiliary_width.name}}
                    </label>
                    <div class="col-sm-8">
                      <div class="input-group">
                        <VeeField type="text" :name="`${order_data.auxiliaries.code}.value[${idx}].width`" :id="`auxiliary_width${idx + 1 }`"
                          v-model="auxiliary[idx].add_width" class="form-control" />
                        <span class="input-group-text">mm</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 flex-auto">
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " :for="`auxiliary_height${idx +1}`">高度</label>
                    <div class="col-sm-8">
                      <div class="input-group">
                        <VeeField type="text" :name="`${order_data.auxiliaries.code}.value[${idx}].height`" :id="`auxiliary_height${idx +1}`"
                          v-model="auxiliary[idx].add_height" class="form-control" />
                        <span class="input-group-text">mm</span>
                      </div>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " :for="`auxiliary_count${ idx +1}`">數量</label>
                    <div class="col-sm-8">
                      <VeeField type="text" :name="`${order_data.auxiliaries.code}.value[${idx}].quantity`" v-model="auxiliary[idx].add_count"
                        class="form-control" />
                    </div>
                  </div>
                </div>
                <i class="fas fa-times-circle fs-4 close_btn btn-right" @click="del_auxiliary(idx)"></i>
              </div>
              <div class="col-12 text-center mt-4">
                <i class="fa-solid fa-circle-plus fs-3 add_btn" @click="add_auxiliary()"></i>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <section id="other" v-if="!!order_fill_out_id.designType">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">其他</h2>
            <div class="row flex-auto">
              <div class="col-md-6 mb-3" v-if="show_multilayer || show_corner">
                <!-- T-POST-horizontal -->
                <div class="row mb-3" v-if="show_multilayer" >
                  <label class="label-set col-form-label col-sm-4" for="layers">
                    <span class="text-danger">*</span>
                    層數
                  </label>
                  <div class="col-sm-8">
                    <VeeField 
                      type="number" 
                      class="form-control " 
                      name="layers_json.value.layer" 
                      :class="{ 'error': errors['layers_json.value.layer'] }"
                      v-model="order_fill_out.layers"
                      id="layers" 
                      rules="required"  />
                    <VeeField type="hidden" name="layers_json.name" :value="order_data.layers_json.name" />
                    <VeeField type="hidden" name="layers_json.option_id" :value="order_data.layers_json.id" />
                    <VeeField type="hidden" name="layers_json.option_code" :value="order_data.layers_json.code" />
                    <VeeField type="hidden" name="layers_json.type" :value="order_data.layers_json.type" />
                    <VeeField type="hidden" name="layers_json.option_value_id" value="0" />
                    <VeeErrorMessage class="error__label" name="layers_json.value.layer" />
                  </div>
                </div>
                <div class="row mb-3" v-for="(data,idx) in horizontal_T_POST" :key="'T-POST-horizontal-' + data.id" v-if="show_multilayer" >
                  <label class="label-set col-form-label col-sm-4" :for="'T_POST_horizontal' + data.id">
                    <span class="text-danger">*</span>
                    水平T{{idx+1}}
                  </label>
                  <div class="col-sm-8">
                    <VeeField 
                      type="number" 
                      class="form-control"
                      rules="required" 
                      :class="{ 'error': errors[`layers_json.value.layer_value[${idx}]`] }"
                      :name="`layers_json.value.layer_value[${idx}]`" 
                      :id="'layers_json.value' + data.id"  
                    />
                    <VeeErrorMessage class="error__label" :name="`layers_json.value.layer_value[${idx}]`" />
                  </div>
                </div>
                <!-- corner -->
                <div class="row mb-3" v-if="show_corner">
                  <label class="label-set col-form-label col-sm-4" for="c1_angle">
                    <span class="text-danger">*</span>
                    {{order_data.c1_angle.name}}
                  </label>
                  <div class="col-sm-8">
                    <VeeField 
                      type="number" 
                      class="form-control "
                      :class="{ 'error': errors[`${order_data.c1_angle.code}.value`] }"
                       :name="`${order_data.c1_angle.code}.value`" id="c1_angle" rules="required"  />
                    <VeeField type="hidden" :name="`${order_data.c1_angle.code}.name`" :value="order_data.c1_angle.name" />
                    <VeeField type="hidden" :name="`${order_data.c1_angle.code}.option_id`" :value="order_data.c1_angle.id" />
                    <VeeField type="hidden" :name="`${order_data.c1_angle.code}.option_code`" :value="order_data.c1_angle.code" />
                    <VeeField type="hidden" :name="`${order_data.c1_angle.code}.type`" :value="order_data.c1_angle.type" />
                    <VeeField type="hidden" :name="`${order_data.c1_angle.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.c1_angle.code}.value`" />
                  </div>
                </div>
                <div class="row mb-3" v-if="show_corner">
                  <label class="label-set col-form-label col-sm-4" for="c2_angle">
                    <span class="text-danger">*</span>
                    {{order_data.c2_angle.name}}
                  </label>
                  <div class="col-sm-8">
                    <VeeField 
                      type="number" 
                      class="form-control " 
                      :class="{ 'error': errors[`${order_data.c2_angle.code}.value`] }"
                      :name="`${order_data.c2_angle.code}.value`" 
                      id="c2_angle" 
                      rules="required" />
                    <VeeField type="hidden" :name="`${order_data.c2_angle.code}.name`" :value="order_data.c2_angle.name" />
                    <VeeField type="hidden" :name="`${order_data.c2_angle.code}.option_id`" :value="order_data.c2_angle.id" />
                    <VeeField type="hidden" :name="`${order_data.c2_angle.code}.option_code`" :value="order_data.c2_angle.code" />
                    <VeeField type="hidden" :name="`${order_data.c2_angle.code}.type`" :value="order_data.c2_angle.type" />
                    <VeeField type="hidden" :name="`${order_data.c2_angle.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.c2_angle.code}.value`" />
                  </div>
                </div>
              </div> 
              <!-- pelmet -->
              <div class="col-md-6 mb-3" v-if="show_pelmet">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4" for="">
                    <span class="text-danger">*</span>
                   {{order_data.win_valance_box_plans.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex align-items-center  p-2 pt-0" :class="{ 'error': errors[`${order_data.win_valance_box_plans.code}.value`] }">
                      <div class="picOption" v-for="data in order_data.win_valance_box_plans.option_values">
                      <VeeField 
                        type="radio" 
                        :id="'pelmet' + data.id" 
                        :name="`${order_data.win_valance_box_plans.code}.value`" 
                        :value="data.name"
                        @change="order_fill_out_id.pelmet_id = data.id"
                        label="pelmet"
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.name`" :value="order_data.win_valance_box_plans.name" />
                      <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.option_id`" :value="order_data.win_valance_box_plans.id" />
                      <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.option_code`" :value="order_data.win_valance_box_plans.code" />
                      <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.type`" :value="order_data.win_valance_box_plans.type" />
                      <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.option_value_id`" v-model="order_fill_out_id.pelmet_id"/>
                      <label :for="'pelmet' + data.id" >
                        <img :src="$imgUrl(data.image)" :alt="data.name">
                      </label>
                      <p>
                        {{ data.name }}方案
                      </p>
                    </div>
                    </div> 
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_valance_box_plans.code}.value`" />
                  </div>
                </div>
                <!-- A -->
                <div class="row mb-3" v-if="show_pelmet_plan_A && order_fill_out_id.pelmet_id">
                  <label class="label-set col-form-label col-sm-4" for="pelmet_A_width">
                    <span class="text-danger">*</span>
                    <!-- A方案 -->
                    {{order_data.win_final_width.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group" :class="{ 'error': errors[`${order_data.win_final_width.code}.value`] }">
                       <VeeField type="number" class="form-control " :name="`${order_data.win_final_width.code}.value`" id="pelmet_A_width" rules="required"   />
                       <VeeField type="hidden" :name="`${order_data.win_final_width.code}.name`" :value="order_data.win_final_width.name" />
                       <VeeField type="hidden" :name="`${order_data.win_final_width.code}.option_id`" :value="order_data.win_final_width.id" />
                       <VeeField type="hidden" :name="`${order_data.win_final_width.code}.option_code`" :value="order_data.win_final_width.code" />
                       <VeeField type="hidden" :name="`${order_data.win_final_width.code}.type`" :value="order_data.win_final_width.type" />
                       <VeeField type="hidden" :name="`${order_data.win_final_width.code}.option_value_id`" value="0" />
                       <span class="input-group-text">mm</span>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_final_width.code}.value`" />
                  </div>
                </div>
                <div class="row mb-3" v-if="show_pelmet_plan_A && order_fill_out_id.pelmet_id">
                  <label class="label-set col-form-label col-sm-4" for="pelmet_A_hight">
                    <!-- A方案 -->
                    <span class="text-danger">*</span>
                    {{order_data.win_final_height.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group" :class="{ 'error': errors[`${order_data.win_final_height.code}.value`] }">
                       <VeeField type="number" class="form-control " :name="`${order_data.win_final_height.code}.value`" id="pelmet_A_hight"  />
                       <VeeField type="hidden" :name="`${order_data.win_final_height.code}.name`" :value="order_data.win_final_height.name" />
                       <VeeField type="hidden" :name="`${order_data.win_final_height.code}.option_id`" :value="order_data.win_final_height.id" />
                       <VeeField type="hidden" :name="`${order_data.win_final_height.code}.option_code`" :value="order_data.win_final_height.code" />
                       <VeeField type="hidden" :name="`${order_data.win_final_height.code}.type`" :value="order_data.win_final_height.type" />
                       <VeeField type="hidden" :name="`${order_data.win_final_height.code}.option_value_id`" value="0" />
                       <span class="input-group-text">mm</span>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_final_height.code}.value`" />
                  </div>
                </div>
                <!-- B -->
                <div class="row mb-3" v-if="!show_pelmet_plan_A && order_fill_out_id.pelmet_id">
                  <label class="label-set col-form-label col-sm-4" for="pelmet_B">
                    <span class="text-danger">*</span>
                    窗盒水平T柱位置
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group" :class="{ 'error': errors['winbox_horizontal_t_position.value'] }">
                      <VeeField type="number" class="form-control " name="winbox_horizontal_t_position.value" id="pelmet_B"  rules="required" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.name" :value="order_data.winbox_horizontal_t_position.name" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.option_id" :value="order_data.winbox_horizontal_t_position.id" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.option_code" :value="order_data.winbox_horizontal_t_position.code" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.type" :value="order_data.winbox_horizontal_t_position.type" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.option_value_id" v-model="order_fill_out_id.pelmet" />
                       <span class="input-group-text">mm</span>
                       <!-- <VeeErrorMessage class="error__label" name="pelmet.value" /> -->
                    </div>
                    <VeeErrorMessage class="error__label" name="winbox_horizontal_t_position.value" />
                  </div>
                </div>
              </div>
              <!-- quantity -->
              <div class="col-md-6 mb-3">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4" for="pelmet_A_hight">
                    <span class="text-danger">*</span>
                    數量
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group" :class="{ 'error': errors[`quantity`] }">
                       <VeeField type="number" class="form-control " name="quantity" id="pelmet_A_hight"  />
                    </div>
                    <VeeErrorMessage class="error__label" name="quantity" />
                  </div>
                </div>
              </div>
              <!-- special -->
              <div class="col-md-12" v-if="is_special_windows">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2" for="pelmet_A_width">
                    <span class="text-danger">*</span>
                    {{order_data.attached_images.name}}
                  </label>
                  <div class="col-sm-10">
                    <div class="mb-4" v-for="(item,idx) in special_windows_img">
                      <div class="special_img_box" :class="{'no-img':!item.image},{'error':errors[`attached_images.image[${idx}]`]}">
                        <VeeField 
                          type="file" 
                          :name="`attached_images.image[${idx}]`" 
                          class="upload-img" accept="image/png,image/jpeg,image/jpg" 
                          @change="Preview_img(values.attached_images.image[idx],idx)"
                          rules="required"
                        />
                        <VeeField type="hidden" :name="`attached_images.name`" :value="order_data.attached_images.name" />
                        <VeeField type="hidden" :name="`attached_images.opt ion_id`" :value="order_data.attached_images.id" />
                        <VeeField type="hidden" :name="`attached_images.option_code`" :value="order_data.attached_images.code" />
                        <VeeField type="hidden" :name="`attached_images.type`" :value="order_data.attached_images.type" />
                        <img :src="item.image" alt="">
                        <i class="fas fa-times-circle fs-4 close_btn" @click="del_special_windows_img(idx)"></i>
                      </div>
                      <VeeErrorMessage class="error__label"  :name="`attached_images.image[${idx}]`" />
                    </div>
                    <div class="col-12 text-center mt-4">
                      <i class="fa-solid fa-circle-plus fs-3 add_btn" @click="add_special_windows_img()"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       <section id="note" v-if="!!order_fill_out_id.designType">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">備註</h2>
            <div class="row flex-auto col-lg col-12">
              <div class="col-12">
                <div class="row">
                  <label class="label-set col-form-label col-sm-2 " for="">
                    備註
                  </label>
                  <div class="col-sm-10">
                    <VeeField as="textarea" class="form-control " name="note" id="note" rows="5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section>
        <div class="container container-original">
          <div class="row">
            <div class="col-12  text-center flex-auto mb-3">
              <!-- <button type="submit" class="btn sent_go">儲存訂單</button> -->
              <button type="submit" class="btn sent_go">加入訂單</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </VeeForm>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const store = useStore()


// 右側nav 收合
const step_box = ref(true);

// 填寫高度
const pleace_input_height = ref(false)
const pleace_input_width = ref(false)

// 警示框
const show_alart_box =ref(false)

const link_items = ref({
  track:[
    { en_title: "material", title: "材質" },
    { en_title: "design", title: "款式" },
    { en_title: "setting", title: "基本設定" },
    { en_title: "doorSet", title: "門片" },
    { en_title: "partitio", title: "中隔位置" },
    { en_title: "track_style", title: "軌道樣式" },
    { en_title: "decorative", title: "飾板" },
    { en_title: "auxiliary", title: "輔料需求" },
    { en_title: "note", title: "備註" },
  ],
  windows:[
    { en_title: "material", title: "材質" },
    { en_title: "design", title: "款式" },
    { en_title: "setting", title: "基本設定" },
    { en_title: "outerFrame", title: "外框" },
    { en_title: "doorSet", title: "門片" },
    { en_title: "partitio", title: "中隔組合" },
    { en_title: "T-POST", title: "T柱" },
    { en_title: "auxiliary", title: "輔料需求" },
    { en_title: "other", title: "其他" },
    { en_title: "note", title: "備註" },
  ]
});

const nav_links_state = computed(()=>{
  return is_track.value? link_items.value.track: link_items.value.windows
})

// 未通過驗證數量&警示框
const errors_count = (errors)=>{
  const count = Object.keys(errors).length;
  return count > 0? count:show_alart_box.value = false
}

const  click_find_label = (event)=>{

  event.target.click()
}


// 右側nav用
const currentItem = ref("");

// 表單資料
const order_data = ref();
// 備註
const order_note = ref()

const material = ref();
const material_color = ref();

const design_data = ref({
  design: null,
  type: null,
});

const handle_color = ref();
const lock_color = ref([]);
const doorType_track = ref();
const doorType_height = ref()
const doorType_outerFrame = ref();
const special_windows_img = ref([
  {image:""},
])

// v-model資料
const order_fill_out = ref({
  material: {
    idx: 0,
    materialName: "",
  },
  design: {
    styleType: "",
    designType: "",
  },
  setting: {
    position: "",
    width: "",
    height: "",
    color: "",
    measurementStandards: "",
    sizeStandards: "",
  },
  doorSet: {
    win_lever: "",
    color: "",
    structure: "",
    size: "",
    count: "",
    folding: "",
    lock: {
      title: "",
      color: "",
      position: "",
      count: "",
    },
    lockHandle: {
      title: "",
      color: "",
      position: "",
      count: "",
    },
    frame: "",
    pullHandleCut: "",
  },
  partitio: [
    
  ],
  options: {
    topPartition: "",
    sidePartition: "",
    bottomPartition: "",
    fixed: "",
    track: "",
    trackTopColor: "",
    trackBottomColor: "",
  },
  decorative: {
    type: "",
    decorative_height: "",
    decorative_depth: "",
    panel_corner_piece: "",
  },
  t_post:{
    setting:"",
    position:[]
  },
  layers:"",
  win_stdwin_subtype:""
});

const order_fill_out_id = ref({
  material: "",
  styleType: "",
  designType: "",
  designType_option_code : "",
  designType_option_name:"",
  win_stdwin_subtype:[],
  wsms_option_value_id:"",
  imom_option_value_id:"",
  setting_color:"",
  measurementStandards: "",
  sizeStandards: "",
  door_frame:"",
  topPartition: "",
  side_partition:"",
  bottom_partition:"",
  track_fixed:"",
  blade_size: "",
  door_openclose:"",
  decorative_pane_type: "",
  win_lever: "",
  handle:"",
  door_handle_type:"",
  lockHandle_color:"",
  lock_type:"",
  bottom_track:"",
  folding_method:"",
  hinge_color:"",
  door_lock_color:"",
  upper_track_color:"",
  lower_track_color:"",
  decorative_panel_corner_piece:"",
  decorative_height:"",
  decorative_depth:"",
  outerFrame_type:"",
  outer_frame_sides:"",
  outer_frame_cut_position:"",
  outer_frame_gasket_thickness:"",
  outer_frame_gasket_location:"",
  magnetic_options:"",
  blade_directions:"",
  pilar_type:"",
  pelmet_id:"",
});


// 飾板自行輸入
const decorativeUserInput = ref(false);
const depthUserInput = ref(false);

// 是軌道?
const is_track = computed(() => {
  return order_fill_out_id.value.styleType == 2005 && order_fill_out_id.value.designType == 2009 || order_fill_out_id.value.designType == 2008;
});
// 是折疊門?
const is_folding_door = computed(() => {
  return order_fill_out_id.value.designType == 2008;
});

const is_IM = computed(()=>{
  return order_fill_out_id.value.measurementStandards == 2013
})

// 是無拉桿?
const is_none_win_lever = computed(() => {
  return order_fill_out_id.value.win_lever == 2098;
});
// 無把手
const is_none_handle = computed (()=>{
  return order_fill_out_id.value.handle == 2215
})
// 無鎖
const is_none_lock = computed(()=>{
  return order_fill_out_id.value.lock_type == 2214
})
// 無下軌道
const is_none_bottom_track = computed(()=>{
  return order_fill_out_id.value.bottom_track == 2193
})
// 無飾板
const is_none_decorative_pane = computed(()=>{
  return order_fill_out_id.value.decorative_pane_type == 2165
})

// 異型窗
const is_special_windows = computed(()=>{
  order_fill_out_id.value.win_stdwin_subtype = []
  order_fill_out.value.win_stdwin_subtype = []
  return order_fill_out_id.value.designType == 2007
})

// 中隔備註
const partitio_note = computed(()=>{
  return is_track.value?  order_note.value.note_tracktype_wsms.translation:order_note.value.note_wintype_wsms.translation
})

// 窗型類型是否包含多層窗
const show_multilayer = computed(()=>{
  const id = 2010
  return order_fill_out_id.value.win_stdwin_subtype.includes(id) && !is_special_windows.value
})

// 窗型類型是否包含轉角窗
const show_corner = computed(()=>{
  const id = 2011
  return order_fill_out_id.value.win_stdwin_subtype.includes(id) && !is_special_windows.value
})

// 窗型類型是否包含窗簾盒
const show_pelmet = computed(()=>{
  const id = 2012
  return order_fill_out_id.value.win_stdwin_subtype.includes(id) && !is_special_windows.value
})

// 顯示窗簾盒A或B
const show_pelmet_plan_A = computed(()=>{
  const id = 2187
  console.log(order_fill_out_id.value.pelmet_id);
  return order_fill_out_id.value.pelmet_id == id && !is_special_windows.value
})


// fn------------------------------------------------------------

// 右側nav點擊
const handleClick = (id) => {
  currentItem.value = id;
  const section = document.getElementById(id);
  if (section) {
    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth",
    });
  }
};

// 右側nav滑動位置
const handleScroll = () => {
  let found = false;
  nav_links_state.value.forEach((item) => {
    const section = document.getElementById(item.en_title);
    if (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2 + 50;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition <= sectionTop + sectionHeight
      ) {
        currentItem.value = item.en_title;
        found = true;
      }
    }
  });
  if (!found) currentItem.value = "";
};

// 款式切換主選項
const change_styleType = () => {
  order_fill_out.value.design.designType = "";
};

// 款式子選項切換主選項
const change_designType = (design,id,type_data,designIdx) => {
  order_fill_out_id.value.styleType = id
  order_fill_out.value.design.styleType = design;
  order_fill_out_id.value.designType = type_data.option_value_id
  order_fill_out_id.value.designType_option_name = design_data.value.type[designIdx].option_name
  order_fill_out_id.value.designType_option_code = design_data.value.type[designIdx].option_code
};


// select用帶optinon_value_id
const select_option_value_id = (data,value)=>{
  if(value && !value.value){
    const find_data =  data.find((item)=> item.name == value)
    return find_data.id 
  }else if(value.value){
    const find_data =  data.find((item)=> item.name == value.value)
    return find_data.id 
  }
}
// 窗型類型id
const add_win_stdwin_subtype_id = (id)=>{
  const data = order_fill_out_id.value.win_stdwin_subtype
  const is_data = data.findIndex((item)=>item == id)
  if(is_data == -1){
    data.push(id)
  }else{
    data.splice(is_data,1)
  }
}

// 設置WS/MS_ID
const set_sizeStandards_ID = (wsms) => {
  const idx = wsms.findIndex(
    (item) => item.name == order_fill_out.value.setting.sizeStandards
  );
  order_fill_out_id.value.sizeStandards = wsms[idx].id;
};
// 設置IM/OM_ID
const set_measurementStandards_ID = (imom) => {
  const idx = imom.findIndex(
    (item) => item.name == order_fill_out.value.setting.measurementStandards
  );
  order_fill_out_id.value.measurementStandards = imom[idx].id;
};

// 設置門片尺寸_ID
const set_blade_size_ID = (size) => {
  const idx = size.findIndex(
    (item) => item.name == order_fill_out.value.doorSet.size
  );
  order_fill_out_id.value.blade_size = size[idx].id;
};

// imom_data
const imom_data = computed(() => {
  if (+order_fill_out_id.value.sizeStandards == 2015) {
    return [order_data.value.imom.option_values[0]];
  } else {
    return order_data.value.imom.option_values;
  }
});

// 門型類別飾板高度值
const doorType_height_value = computed(() => {
  const is_top_partition = order_fill_out_id.value.topPartition == 2139;
  const decorative_pane_type = order_fill_out_id.value.decorative_pane_type == 2163;
  
  if (doorType_height.value) {
    // 摺疊門
    if (is_folding_door.value && doorType_height.value.option_group_suboption_values.length > 3) {
      if (decorativeUserInput.value) {
        // 自行輸入
          return doorType_height.value.option_group_suboption_values[4].name
      }else if(is_IM.value){
        // 內裝?
        return is_top_partition
          ? doorType_height.value.option_group_suboption_values[1].name
          : doorType_height.value.option_group_suboption_values[0].name;
      }else {
        // 裝飾類型
        return decorative_pane_type
          ? doorType_height.value.option_group_suboption_values[2].name
          : doorType_height.value.option_group_suboption_values[3].name;
      }
    } else {
      // 推拉門
      if(decorativeUserInput.value){
        return doorType_height.value.option_group_suboption_values[2].name
      }else{
        return decorative_pane_type
        ? doorType_height.value.option_group_suboption_values[0].name
        : doorType_height.value.option_group_suboption_values[1].name;
      }
      
    }
  }

});

// 門型類別飾板深度
const doorType_depth = computed(() => {
  if(!!design_data.value.design){
    return is_folding_door.value? 
      order_data.value.decorative_panel_top_depth_folding_door:
      order_data.value.decorative_panel_top_depth_sliding_door
  }
  
});

//  門型類別飾板深度值
const doorType_depth_value = computed(() => {
   // 刀片尺寸 == 4.5
  const blade_size = order_fill_out_id.value.blade_size == 2107;

  if(depthUserInput.value && doorType_depth.value){
    return doorType_depth.value.option_values[1].name
  }else if (blade_size && doorType_depth.value) {
    return doorType_depth.value.option_values[1].name;
  } else {
    return doorType_depth.value.option_values[0].name;
  }
});



// 驗證高度最小值
const min_hight_setting = () => {
  return is_track.value ? 381 : 1;
};


// 驗證高度最大值
const max_hight_setting = () => {
  if (is_track.value) {
    return is_none_win_lever.value ? 2286 : 3048;
  } else {
    return Infinity;
  }
};


// 窗戶類型多選驗證
const win_stdwin_subtype_required = (values)=>{
  if(values.win_stdwin_subtype){
    const is_values = values.win_stdwin_subtype.option_values.some(item => item.value)
    return is_values?  false:"required"
  }
}

// 驗證葉片組數量與寬度X
const validateWidth =  () => {
  const width = order_fill_out.value.setting.width
  const blade_numbers = order_fill_out.value.doorSet.count
  const maxWidth = +width / +blade_numbers
  if(!blade_numbers){
    return "此欄位為必填"
  }else if(is_track.value){
    if(is_folding_door.value){
      if(maxWidth <= 228 || maxWidth >= 508){
        return "所選葉片組數量已超過寬度制規"
      }
    }else if(maxWidth <= 228 || maxWidth >= 1092){
        return "所選葉片組數量已超過寬度制規"
    }
  }
  return true
};

// 輸入寬度自動驗證與葉片組是否符合
const validateWidthError = ()=>{
  const targe = document.getElementById(`${order_data.value.blade_numbers.id}`)
  targe.focus()
  targe.blur()
}


const doorSet_comment = computed(() => {
  const designType = order_fill_out_id.value.designType;
  if (designType == 2008) {
    return "折門單片寬度限制為508mm。";
  } else {
    return "推拉門單片加中柱的寬度限制為1092mm(可作但不提供保固)";
  }
});


// 中隔
const partitio =  ref({ 
    height:"", 
    center:"",
    no_move:"",
    above_handle_division:"",
    above_handle_division_center:"",
    beneath_handle_division:"",
    beneath_handle_division_center:""
  })

// 增加中隔
const add_partitio = ()=>{
  order_fill_out.value.partitio.push({...partitio.value})
}
// 刪除中隔
const del_partitio = (idx) =>{
  order_fill_out.value.partitio.splice(idx,1)
}


// 中隔高度計算
const calculatePartitioPosition = (idx)=>{
  const total_height = +order_fill_out.value.setting.height
  const partitio = order_fill_out.value.partitio
  if(idx == 0){
    partitio[0].height = total_height / 2
  }else{
    partitio[idx].height = (total_height - partitio[idx - 1].height )/2 + partitio[idx - 1].height
  }
 
}
// 監視中隔的變化
watch(() => order_fill_out.value.partitio, (newPartitio, oldPartitio) => {
  const total_height = order_fill_out.value.setting.height
    newPartitio.forEach((item, idx) => {
      if (item.center === "Y") {
          calculatePartitioPosition(idx)
        // if(total_height > 0 ){
        //   calculatePartitioPosition(idx)
        // }else{
        //   pleace_input_height.value = true
        //   show_alart_box.value =true
        //   nextTick(() => {
        //      item.center = ""
        //   })
        // }
      }
      if(item.above_handle_division_center == "Y"){
        item.above_handle_division = item.height / 2
        // if(item.height > 0 ){
        //   item.above_handle_division = item.height / 2
        // }else{
        //   pleace_input_height.value = true
        //   show_alart_box.value =true
        //   nextTick(() => {
        //      item.above_handle_division_center = ""
        //   })
        // }
      }
      if(item.beneath_handle_division_center == "Y"){
        item.beneath_handle_division = item.height / 2
        // if(item.height > 0 ){
        //   item.beneath_handle_division = item.height / 2
        // }else{
        //   pleace_input_height.value = true
        //   show_alart_box.value =true
        //   nextTick(() => {
        //      item.beneath_handle_division_center = ""
        //   })
        // }
      }
    });
  }, {
    deep: true // 深度監視
  });


// T-POST---------------------------
const t_post = ref({value:""})

const add_t_post = ()=>{
  order_fill_out.value.t_post.position.push({...t_post.value})
  
}
const del_t_post = (idx)=>{
  order_fill_out.value.t_post.position.splice(idx, 1)
}

// T-POST 均分算式
const calculate_T_POST = (idx)=>{
  const width = +order_fill_out.value.setting.width
  const t_post = order_fill_out.value.t_post.position
  if(idx == 0){
    t_post[0].value = Math.floor(width / (t_post.length + 1) )
  }else{
    t_post[idx].value = Math.floor(t_post[0].value + t_post[idx - 1].value)
  }
  
  
}
// WATCH均分
watch(() => order_fill_out.value.t_post, (newVal, oldVal) => {
  const width = order_fill_out.value.setting.width
  const divide = order_fill_out.value.t_post.setting

  newVal.position.forEach((item, idx) => {
    if (!!divide) {
      if(width > 0 ){
        calculate_T_POST(idx)
      }else{
        pleace_input_width.value = true
        show_alart_box.value =true
        nextTick(() => {
          order_fill_out.value.t_post.setting = ""
        })
      }
    }
  });

  }, {
    deep: true // 深度監視
  });


  // 水平
  const horizontal_T_POST = computed(()=>{
    const layers = order_fill_out.value.layers
    return layers? (+layers-1):0
  })

// T-POST_end--------------------------


// 輔料需求------------
const auxiliary = ref([]);

const add_auxiliary = () => {
  const auxiliaryBlock = ref([
    { add_width: "", add_height: "", add_length: "", add_count: "" },
  ]);
  auxiliary.value.push(auxiliaryBlock);
};

const del_auxiliary = (idx) => {
  auxiliary.value.splice(idx, 1);
};

// 輔料需求_end------------



// 高度判斷自動添加中隔
watchEffect(() => {
  if (!!order_fill_out_id.value.designType) {

    if (
      +order_fill_out.value.setting.height > 1800 &&
      order_fill_out.value.partitio.length <= 0
    ) {
      order_fill_out.value.partitio.push({ ...partitio.value });
    }
    if (
      +order_fill_out.value.setting.height > 2400 &&
      order_fill_out.value.partitio.length <= 1
    ) {
      order_fill_out.value.partitio.push({ ...partitio.value });
    }

    // 根據新的高度調整所有中隔的位置
    order_fill_out.value.partitio.forEach((item, idx) => {
      if (item.center === "Y" && order_fill_out.value.setting.height > 0) {
        calculatePartitioPosition(idx);
      }
    });

  }
});

// 預覽圖片
const Preview_img = (img,idx)=>{
  const reader = new FileReader();
  // 讀取完觸發獲取URL
  reader.onload = function(event) {
    const imgURL = event.target.result;
    special_windows_img.value[idx].image = imgURL; 
  };

  // 讀取
  reader.readAsDataURL(img);
}

//新增圖片
const add_special_windows_img = ()=>{
  const data = {image:""}
  special_windows_img.value.push({...data})
}

// 刪除圖片
const del_special_windows_img = (idx) =>{
  special_windows_img.value.splice(idx,1)
}



// 未通過驗證
const onInvalidSubmit = ({ values, errors, results }) =>{
  console.log(values);
  console.log(errors);
  if(errors){
    show_alart_box.value = true
  }else{
    onSubmit()
  }
}
// 通過驗證
const onSubmit = async(values) => {
  await store.token_validation();
  const url = `${store.baseUrl}api/v2/sales/orders/product/saveWithOptions?locale=${store.language}`
  const main_order_id = route.query.id
  // 需轉成json的欄位
  const json_data = ['dividers_json','t_post_json','auxiliaries','layers_json']
  // 上下切軌(沒選value為空值所以給值，否則value不得為空)
  const cut_tracks_data = ['win_option_bottom_cut_track','win_option_top_cut_track']

  const quantity = values.quantity
  const note = values.note
  const sqm = +values.win_width.value * values.win_height.value / 1000000
  delete values.quantity
  delete values.note

  // 將values轉成陣列並加入id、sort_order等等值
  const arr_values = Object.keys(values).map((key, idx) => {
    // const id = idx + 1;
    // const sort_order = idx + 1;
    // 產品id (空值為自動遞增)
    // const order_product_id = "";
    // 訂單id
    const order_id = main_order_id;
    // 保留key值用
    const key_id = key
    return {
        ...values[key],
        // id,
        // sort_order,
        order_id,
        key_id
    }
  });

  // 重組
  const new_values = arr_values.reduce((new_obj, item) => {
    // 保留key值並帶入
    const key = item.key_id 
    // 刪除該欄
    delete item.key_id;
    // 如果是json格式則轉json
    const is_json = json_data.find(item => item == [key])
    const is_cut_track = cut_tracks_data.find(item => item == [key])
    if(is_json){
      item.value = JSON.stringify(item.value)
    }else if(is_cut_track){
      if(!item.option_values[0]?.value){
        return new_obj;
      }
    }else if([key] == 'win_stdwin_subtype'){
      item.option_values.filter(item => !item.value )
    }
    if(!item.type){
      alert('err',[key])
      console.log([key]);
      console.log(item);
      
    }
    new_obj[key] = item
    
    return new_obj;
  }, {});


  const submit_data = {
    order_id:main_order_id,
    // sort_order:main_order_id,
    name:new_values.win_material.value + new_values.win_type.value + new_values.win_style.value,
    quantity,
    note,
    sqm,
    order_product_options:new_values
  }
  console.log(submit_data);
  await store.add_product(submit_data)
  router.push(`/order-list/order_item_${main_order_id}`)
};




// 欄位
const get_order_data = async() => {
  const url = `${store.baseUrl}api/v2/catalog/options/list?lang=zh_Hant&limit=0`
  try{
    const res = await fetch(url,{
      // headers:{
      //   "Authorization": "Bearer " + store.userData.jwtToken
      // }
    })
    if(res.ok){
      const data = await res.json()
      order_data.value = data.response.data
      console.log("全部",order_data.value);
    }else{
      console.log("err");
    }
  }catch(err){
    console.log(err);
  }
};

// 備註
const get_order_note = async()=>{
  const url = `${store.baseUrl}api/v1/common/translations/list/catalog.option?lang=zh_Hant`
  try{
    const res = await fetch(url,{
      // headers:{
      //   "Authorization": "Bearer " + store.userData.jwtToken
      // }
    })
    if(res.ok){
      const data = await res.json()
      order_note.value = data
      // console.log(data);
      
    }else{
      console.log("err");
    }
  }catch(err){
    console.log(err);
  }
}

// 材料資料
const get_material_data = async() => {
  const url = `${store.baseUrl}api/v2/catalog/options/info?lang=zh_Hant&equal_code=win_material`
  try{
    const res = await fetch(url,{
      // headers:{
      //   "Authorization": "Bearer " + store.userData.jwtToken
      // }
    })
    if(res.ok){
      const data = await res.json()
      material.value = data.response
      // console.log('材質', material.value);
    }else{
      console.log("err");
    }
  }catch(err){
    console.log(err);
  }
};

// 設計資料&材質顏色
const get_design_data = async (id) => {
  design_data.value = []
  material_color.value = []
  design_data.value.type = []
  const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=zh_Hant&equal_option_value_ids=${id}`
  try {
    const response = await fetch(url,{
        // headers:{
        //     "Authorization": "Bearer " + store.userData.jwtToken
        // }
    });
    const data = await response.json();
    design_data.value.design =
      data.response.option_group_suboptions.win_type
    material_color.value =
      data.response.option_group_suboptions.win_color_plsalu
  } catch (error) {
    console.log(error);
  }
  // 款式細項
  if (design_data.value.design.option_group_suboption_values) {
    // 畫面要先出來所以先全抓資料
    const design_type  = design_data.value.design.option_group_suboption_values.map(async(item) => {
      const url_2 = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=zh_Hant&equal_option_value_ids=${id},${item.option_value_id}`
      try {
        const requests = await fetch(url_2)
        if(requests.ok){
          const data = await requests.json()
          
          // 外框
          if(data.response.option_group_suboptions.win_win_frame_plsalu){
            doorType_outerFrame.value =  data.response.option_group_suboptions.win_win_frame_plsalu
          }
          const track = data.response.option_group_suboptions.win_track_subtype
          const window = data.response.option_group_suboptions.win_win_subtype

          return track? track:window
        }
      }catch(err){
        console.log(err);
        return null; 
      }
    })
    // 待異步資料完成再賦予值
    const results = await Promise.all(design_type);
    design_data.value.type = results
  }
};

// 把手顏色
const get_handle_color = async (id) => {
  handle_color.value = []
  const url = `${store.baseUrl}api/v2/catalog/option_group_suboptions/info?lang=zh_Hant&equal_option_value_id=${id}&equal_level=0`
  try {
    const res = await fetch(url,{
      // headers:{
      //     "Authorization": "Bearer " + store.userData.jwtToken
      // }
    });
    const data = await res.json();
    handle_color.value = data.response.option_group_suboption_values;
  
  } catch (err) {
    console.log(err);
  }
};

// 鎖顏色
const get_lock_color = async (id) => {
  lock_color.value = []
  const url = `${store.baseUrl}api/v2/catalog/option_group_suboptions/info?lang=zh_Hant&equal_option_value_id=${id}&equal_level=0`;
  try {
    const res = await fetch(url,{
    //   headers:{
    //         "Authorization": "Bearer " + store.userData.jwtToken
    // }
    });
    const data = await res.json();
    lock_color.value = data.response.option_group_suboption_values;
  } catch (err) {
    lock_color.value =[]
    console.log(err);
  }
};

// 軌道
const get_door_track = async () => {
  try {
    const design = order_fill_out_id.value.designType;
    const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=zh_Hant&equal_option_value_ids=${design}`;
    if (design) {
      const res = await fetch(url,{
        // headers:{
        //     "Authorization": "Bearer " + store.userData.jwtToken
        // }
      });
      console.log(res);
      const data = await res.json();
      doorType_height.value = data.response.option_group_suboptions.decorative_panel_height
      // console.log(data);
      doorType_track.value = data.response.option_group_suboptions.door_down_track;
    }
  } catch (err) {
    console.log(err);
  }
};



watchEffect(() => {
  if (is_folding_door.value || !is_folding_door.value && is_track.value) {
    get_door_track();
  }
});

// 飾板高度的option_value_id
watchEffect(() => {
  if(doorType_height_value.value){
      const data = doorType_height.value.option_group_suboption_values.find((item)=>item.name == doorType_height_value.value) 
      order_fill_out_id.value.decorative_height =  data.option_value_id
     
  }
})

watchEffect(() => {
  if(!!doorType_depth.value){
    // console.log(doorType_depth.value);
      const data = doorType_depth.value.option_values.find((item)=>item.name == doorType_depth_value.value) 
      // console.log(data);
      order_fill_out_id.value.decorative_depth =  data.id
     
  }
})

const product_data = ref()

const get_product_data = async()=>{
  const product_id = route.query.product
  const order_id = route.query.id
  const url = `${store.baseUrl}api/v2/sales/orders/info?locale=${store.language}&equal_id=${order_id}`
  try{
    const res = await fetch(url,{
      headers:{
        "Authorization": "Bearer " + store.userData.jwtToken
      }
    })
    const data = await res.json()
    console.log(res);
    console.log(data);
    product_data.value = data.response.order_products.filter(item => item.id == product_id)
    console.log(product_data.value);
  }catch(err){
    console.log('error',err);
  }
}



store.show_loading(true)

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  get_material_data();
  get_order_note()
  get_order_data();
  get_product_data()
  store.show_loading(false)

});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

