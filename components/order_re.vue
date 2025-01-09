<template>
   <div class="links" :class="{'links-anime':!step_box}" v-if="show_block">
    <div class="link-item">
      <a v-for="item in nav_links_state" :href="`#${item.id}`" :title="item.title"
        :class="{ active: currentItem === item.id }" @click.prevent="handleClick(item.id)" :key="item.id">
        {{ item.title }}
        <span></span>
      </a>

    </div>

    <div class="step_box" @click="step_box = !step_box">
      <i class="fas fa-ellipsis-h"></i>
    </div>
  </div>
  


  <VeeForm  @submit="onSubmit" @invalid-submit="onInvalidSubmit" v-slot="{ errors,values }" ref="order_form"> 
    <div class="alart_box" v-if="show_alart_box">
      <i class="fas fa-times" @click="show_alart_box = false,pleace_input_height = false"></i>
      <div v-html="show_errors(errors)" class="error__label"></div>
    </div>

    <div class="main_form" v-if="!!order_data">
      <section id="material">
        <div class="container container-original">
          <div class="block block1 flex-wrap">
            <h2 class="title">
              {{ store.language_txt.order.text_material }}
              <VeeErrorMessage class="error__label" :name="`${order_data.win_material.code}.option_value_id`" />
            </h2>
            <div class="d-flex justify-content-around flex-auto" :class="{ 'error': errors[`${order_data.win_material.code}.option_value_id`] }">
              <div class="material_chose" v-for="(item,idx) in order_data.win_material.option_values" :key="item.name" v-show="show_main_material(item)">
                <VeeField 
                  type="radio" 
                  v-model="data_id[order_data.win_material.code]" 
                  :name="`${order_data.win_material.code}.option_value_id`" 
                  :id="`material${item.id}`" 
                  :value="item.id"
                  label="material" 
                  rules="required" 
                  @click="set_name(item,order_data.win_material.code),get_design_data(item.id)"
                  />
                <VeeField type="hidden" :name="`${order_data.win_material.code}.name`" :value="order_data.win_material.name" />
                <VeeField type="hidden" :name="`${order_data.win_material.code}.option_id`" :value="item.option_id" />
                <VeeField type="hidden" :name="`${order_data.win_material.code}.option_code`" :value="order_data.win_material.code" />
                <VeeField type="hidden" :name="`${order_data.win_material.code}.type`" :value="order_data.win_material.type" />
                <VeeField type="hidden" :name="`${order_data.win_material.code}.value`" v-model="data_val[order_data.win_material.code]"
                   />
                <label :for="`material${item.id}`">
                  <span class="pic_lable d-inline-block">
                    <img :src="item.href" :alt="item.name" />
                  </span>
                  <span class="material_val">{{ item.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="design" v-if="!!design_data.design && design_data.type">
        <div class="container container-original">
          <div class="block block2">
            <h2 class="title">{{ store.language_txt.order.text_style}}</h2>
            <VeeErrorMessage class="error__label error-design" :name="`${design_data.design.option_code}.option_value_id`" />
            <div class="d-flex justify-content-around flex-auto gap-lg-0 gap-4 "
              :class="{ 'error': errors[`${design_data.design.option_code}.option_value_id`] }">
              <div class="type_chose" v-for="(design, designIdx) in design_data.design.option_group_suboption_values"
                :key="design.name">
                <div class="windowType">
                  <VeeField type="radio" :id="`styleType_` + design.option_value_id"
                    :name="`${design_data.design.option_code}.option_value_id`"
                    v-model="data_id[design_data.design.option_code]"
                    :value="design.option_value_id"
                    @click="set_name(design,design_data.design.option_code),remove_style()"
                    label="styleType" rules="required" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.name`"
                    :value="design_data.design.option_name" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.option_id`"
                    :value="design_data.design.option_id" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.option_code`"
                    :value="design_data.design.option_code" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.type`"
                    :value="design_data.design.option_type" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.value`" v-model="data_val[design_data.design.option_code]" />
                  <p class="designName text-center">{{ design.name }}</p>
                  <label :for="`styleType_` + design.option_value_id">
                    <img :src="design.href" :alt="design.name">
                  </label>
                </div>
                <VeeErrorMessage class="error__label col-12" :name="`${selected_win_style}.option_value_id`" />
                <!-- 款式類型 -->
                <div class="d-flex justify-content-center flex-wrap"
                  v-if="design_data.type.length > 0 && selected_win_style"
                  :class="{ 'error': errors['`${type.code}.option_value_id'] }">
                  <div class="typeCategory"
                    v-for="(type, typeIdx) in design_data.type[designIdx].option_group_suboption_values"
                    :key="type.name">
                    <VeeField
                       type="radio"
                       v-model="data_id[selected_win_style]"
                       :name="`${selected_win_style}.option_value_id`"
                      :id="`designType_` + type.option_value_id" 
                      :value="type.option_value_id"           
                       label="designType"
                       :key="selected_win_style + 'value'"
                       @click="set_name(type,order_data[selected_win_style].code)"
                       :disabled="data_id[design_data.design.option_code] !== design.option_value_id"
                      rules="required" />
                    <VeeField type="hidden" :key="selected_win_style + 'name'"  :name="`${selected_win_style}.name`" v-model="order_data[selected_win_style].name"
                     />
                    <VeeField type="hidden" :key="selected_win_style + 'id'" :name="`${selected_win_style}.option_id`" v-model="order_data[selected_win_style].id" 
                       />
                    <VeeField type="hidden" :key="selected_win_style + 'code'" :name="`${selected_win_style}.option_code`" v-model="order_data[selected_win_style].code"  />
                    <VeeField type="hidden"  :key="selected_win_style + 'type'"  :name="`${selected_win_style}.type`" v-model="order_data[selected_win_style].type"
                     />
                    <VeeField type="hidden" :key="selected_win_style + 'option_id'" :name="`${selected_win_style}.value`" v-model="data_val[selected_win_style]" />
                    <label :for="`designType_` + type.option_value_id">
                      <img :src="type.href" :alt="type.name">
                    </label>
                    <p>{{ type.name }}</p>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="setting" v-if="show_block">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">{{ store.language_txt.order.text_basicsetting}}</h2>
            <div class="row flex-auto col-12">
              <!-- 室內外 -->
              <div class="col-md-6 flex-auto" v-if="is_aluminum">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 position-relative " :for="order_data.indooroutdoor.name">
                    <span class="text-danger">*</span>
                    {{order_data.indooroutdoor.name}}
                  </label>
                  <div class="col-sm-8">
                    <VeeField 
                      as="select" 
                      :name="`${order_data.indooroutdoor.code}.option_value_id`" 
                      :id="order_data.indooroutdoor.name"
                      class="form-select" 
                      :class="{ 'error': errors[`${order_data.indooroutdoor.code}.option_value_id`] }"
                      v-model="data_id[order_data.indooroutdoor.code]" 
                      @change="set_name(option,order_data.indooroutdoor.code)"
                      label="indooroutdoor" 
                      rules="required"
                      >
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option :value="option.id" v-for="option in order_data.indooroutdoor.option_values">
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.name`" :value="order_data.indooroutdoor.name" />
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.option_id`" :value="order_data.indooroutdoor.id" />
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.option_code`"
                      :value="order_data.indooroutdoor.code" />
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.type`" :value="order_data.indooroutdoor.type" />
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.value`"
                    v-model="data_val[order_data.indooroutdoor.code]" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.indooroutdoor.code}.option_value_id`" />
                  </div>
                </div>
              </div>
              <!-- 標準/固定 -->
              <div class="col-md-6 flex-auto" v-if="is_aluminum">
                <div class="row mb-3" v-if="!is_track">
                  <label class="label-set col-form-label col-sm-4 position-relative " :for="order_data.std_or_fixed.name">
                    <span class="text-danger">*</span>
                    {{order_data.std_or_fixed.name}}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.std_or_fixed.code}.option_value_id`" :id="order_data.std_or_fixed.name"
                      class="form-select" :class="{ 'error': errors[`${order_data.std_or_fixed.code}.option_value_id`] }"
                      v-model="data_id[order_data.std_or_fixed.code]"
                      @change="set_name(option,order_data.std_or_fixed.code)"
                       label="std_or_fixed" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option :value="option.id" v-for="option in order_data.std_or_fixed.option_values">
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.name`" :value="order_data.std_or_fixed.name" />
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.option_id`" :value="order_data.std_or_fixed.id" />
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.option_code`"
                      :value="order_data.std_or_fixed.code" />
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.type`" :value="order_data.std_or_fixed.type" />
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.value`"
                      v-model="data_val[order_data.std_or_fixed.code]"  />
                    <VeeErrorMessage class="error__label" :name="`${order_data.std_or_fixed.code}.option_value_id`" />
                  </div>
                </div>
              </div>
              <!-- 標準窗類型_type -->
              <div class="col-12" v-if="!is_track && !is_special_windows">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2 " for="">
                    <span class="text-danger">*</span>
                    {{ store.language_txt.default.text_type}}
                  </label>
                  <div class="col-sm-10">
                    <div class="d-flex algin-items-center flex-wrap p-2 pt-0" :class="{ 'error': errors[`${order_data.win_stdwin_subtype.code}.option_value_id`] }">
                      <template  v-for="data in order_data.win_stdwin_subtype.option_values" >
                        <div class="picOption" v-if="show_win_stdwin_subtype(data.id)">
                          <VeeField type="checkbox"
                            :id="'win_stdwin_subtype_' + data.id"
                            :name="`${order_data.win_stdwin_subtype.code}.option_value_id`"
                            @change="set_win_stdwin_subtype(values.win_stdwin_subtype.option_value_id)"
                            :value="data.id"
                            label="win_stdwin_subtype"
                            rules="required" />
                          <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.name`"
                            :value="order_data.win_stdwin_subtype.name" />
                          <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.option_id`"
                            :value="order_data.win_stdwin_subtype.id" />
                          <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.option_code`"
                            :value="order_data.win_stdwin_subtype.code" />
                          <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.type`"
                            :value="order_data.win_stdwin_subtype.type" />
                          <label :for="'win_stdwin_subtype_' + data.id">
                            <img :src="data.thumb" :alt="data.name">
                          </label>
                          <p>{{ data.name }}</p>
                        </div>
                      </template>
                      <VeeErrorMessage class="error__label" :name="`${order_data.win_stdwin_subtype.code}.option_value_id`" />

                    </div>
                    <label v-if="show_corner_hint">
                      <VeeField type="checkbox" :class="{ 'error': errors[`${order_data.confirm_by_window.code}.option_values[0].value`] }"
                        :name="`${order_data.confirm_by_window.code}.option_values[0].value`"
                        v-model="data_val[order_data.confirm_by_window.code]" value="Y" class="form-check-input"
                        rules="required"
                         />
                      {{ order_data.confirm_by_window.name }}
                      <VeeField type="hidden" :name="`${order_data.confirm_by_window.code}.name`"
                        :value="order_data.confirm_by_window.name" />
                      <VeeField type="hidden" :name="`${order_data.confirm_by_window.code}.option_id`"
                        :value="order_data.confirm_by_window.id" />
                      <VeeField type="hidden" :name="`${order_data.confirm_by_window.code}.option_code`"
                        :value="order_data.confirm_by_window.code" />
                      <VeeField type="hidden" :name="`${order_data.confirm_by_window.code}.type`"
                        :value="order_data.confirm_by_window.type" />
                      <VeeField type="hidden" :name="`${order_data.confirm_by_window.code}.option_values[0].option_value_id`" value="0" />
                    </label>
                    <!-- <VeeErrorMessage v-if="show_corner_hint" class="error__label" :name="`${order_data.confirm_by_window.code}.option_values[0].value`" /> -->
                  </div>
                </div>
              </div>
              <!-- 實木材質(wood only) -->
              <div class="col-12" v-if="is_wood">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2 " for="">
                    <span class="text-danger">*</span>
                    {{order_data.sldwood_material.name}}
                  </label>
                  <div class="col-sm-10">
                    <div class="d-flex algin-items-center flex-wrap  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.sldwood_material.code}.option_value_id`] }">
                      <div class="picOption" v-for="item in order_data.sldwood_material.option_values">
                        <VeeField 
                          type="radio" 
                          :id="'sldwood_material' + item.id"
                          :name="`${order_data.sldwood_material.code}.option_value_id`"
                          v-model="data_id[order_data.sldwood_material.code]"
                          @change="set_name(item,order_data.sldwood_material.code)"
                          :value="item.id" label="setting_color" rules="required" />
                        <VeeField type="hidden" :name="`${order_data.sldwood_material.code}.name`"
                          :value="order_data.sldwood_material.name" />
                        <VeeField type="hidden" :name="`${order_data.sldwood_material.code}.option_id`"
                          :value="order_data.sldwood_material.id" />
                        <VeeField type="hidden" :name="`${order_data.sldwood_material.code}.code`"
                          :value="order_data.sldwood_material.code" />
                        <VeeField type="hidden" :name="`${order_data.sldwood_material.code}.type`"
                          :value="order_data.sldwood_material.type" />
                        <VeeField type="hidden" :name="`${order_data.sldwood_material.code}.value`" :value="item.name"
                        v-model="data_val[order_data.sldwood_material.code]"
                         />
                        <label :for="'sldwood_material' + item.id">
                          <img :src="item.thumb" :alt="item.name">
                        </label>
                        <p>{{ item.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${order_data.sldwood_material.code}.option_value_id`" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- left -->
              <div class="col-md-6 flex-auto">
                 <!-- 數量 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4" for="quantity">
                    <span class="text-danger">*</span>
                    {{ store.language_txt.order.text_quantity}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group" :class="{ 'error': errors[`quantity`] }">
                      <VeeField 
                        type="number" 
                        @keydown="clearInput"
                        class="form-control " 
                        v-model="data_val.quantity" name="quantity"
                        rules="required" id="quantity" />
                    </div>
                    <VeeErrorMessage class="error__label" name="quantity" />
                  </div>
                </div>
                <!-- 位置 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4" :for="order_data.win_position.name">
                    <span class="text-danger">*</span>
                    {{ order_data.win_position.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" class="form-control"
                      :class="{ 'error': errors[`${order_data.win_position.code}.value`]}"
                      v-model="data_val[order_data.win_position.code]"
                      :id="order_data.win_position.name" :name="`${order_data.win_position.code}.value`"
                      label="win_position" rules="required" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_position.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.name`"
                      :value="order_data.win_position.name" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.option_id`"
                      :value="order_data.win_position.id" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.option_code`"
                      :value="order_data.win_position.code" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.type`"
                      :value="order_data.win_position.type" />
                    <VeeField type="hidden" :name="`${order_data.win_position.code}.option_value_id`" value="0" />
                  </div>
                </div>
                <!-- 寬 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.win_width.name">
                    <span class="text-danger">*</span>
                    {{ order_data.win_width.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group">
                      <VeeField type="number" :name="`${order_data.win_width.code}.value`" class="form-control"
                       @keydown="clearInput"
                        v-model="data_val[order_data.win_width.code]"
                        :class="{ 'error': errors[`${order_data.win_width.code}.value`] }"
                        :id="order_data.win_width.name" label="寬度" :rules="{
                          required:true,
                        }" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_width.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.name`"
                      :value="order_data.win_width.name" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.option_id`"
                      :value="order_data.win_width.id" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.option_code`"
                      :value="order_data.win_width.code" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.type`"
                      :value="order_data.win_width.type" />
                    <VeeField type="hidden" :name="`${order_data.win_width.code}.option_value_id`" value="0" />
                  </div>
                </div>
                <!-- 高 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.win_height.name">
                    <span class="text-danger">*</span>
                    {{ order_data.win_height.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group has-validation">
                      <VeeField type="number" :name="`${order_data.win_height.code}.value`" class="form-control"
                        @keydown="clearInput"
                        v-model="data_val[order_data.win_height.code]"
                        :class="{ 'error': errors[`${order_data.win_height.code}.value`] }"
                        :id="order_data.win_height.name" label="高度" :rules="{
                          required:true,
                          min_value:min_hight_setting(),
                          max_value:max_hight_setting()
                        }" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.name`"
                      :value="order_data.win_height.name" />
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.option_id`"
                      :value="order_data.win_height.id" />
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.option_code`"
                      :value="order_data.win_height.code" />
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.type`"
                      :value="order_data.win_height.type" />
                    <VeeField type="hidden" :name="`${order_data.win_height.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_height.code}.value`" />
                    <span class="fs-xs">{{ store.language_txt.order.helper_height }}</span>
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="col-md-6 flex-auto">
                <!-- wsms -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 position-relative " :for="order_data.wsms.name">
                    <span class="text-danger">*</span>
                    {{ order_data.wsms.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      {{ store.language_txt.order.helper_ms }}
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.wsms.code}.option_value_id`" :id="order_data.wsms.option_value_id"
                      class="form-select" :class="{ 'error': errors[`${order_data.wsms.code}.option_value_id`] }"
                      v-model="data_id[order_data.wsms.code]"
                      @change="set_name(option,order_data.wsms.code)"
                     label="wsms" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option :value="option.id" v-for="option in wsms_data">
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.name`" :value="order_data.wsms.name" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.option_id`" :value="order_data.wsms.id" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.option_code`"
                      :value="order_data.wsms.code" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.type`" :value="order_data.wsms.type" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.value`" v-model="data_val[order_data.wsms.code]"
                    />
                    <VeeErrorMessage class="error__label" :name="`${order_data.wsms.code}.option_value_id`" />
                  </div>
                </div>
                <!-- imom -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 position-relative" :for="order_data.imom.name">
                    <span class="text-danger">*</span>
                    {{ order_data.imom.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      <p>{{ store.language_txt.order.helper_om }}</p>
                      <p>{{ store.language_txt.order.helper_im }}</p>
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.imom.code}.option_value_id`" :id="order_data.imom.name"
                      class="form-select" :class="{ 'error': errors[`${order_data.imom.code}.option_value_id`] }"
                      v-model="data_id[order_data.imom.code]"
                      @change="set_name(option,order_data.imom.code)"
                      label="imom" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option :value="option.id" v-for="option in order_data.imom.option_values" >
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.imom.code}.name`" :value="order_data.imom.name" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.option_id`" :value="order_data.imom.id" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.option_code`"
                      :value="order_data.imom.code" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.type`" :value="order_data.imom.type" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.value`"
                    v-model="data_val[order_data.imom.code]" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.imom.code}.option_value_id`" />
                  </div>
                </div>
              </div>
              <!-- windows_colors -->
              <div class="col-12">
                <div class="row">
                  <label class="label-set col-form-label col-sm-2 " for="">
                    <span class="text-danger">*</span>
                    {{material_color.name}}
                  </label>
                  <div class="col-sm-10">
                    <div class="d-flex algin-items-center flex-wrap  p-2 pt-0"
                      :class="{ 'error': errors[`${material_color.code}.option_value_id`] }">
                      <div class="picOption" v-for="color in material_color.option_values">
                        <VeeField type="radio" :id="'setting_color_' + color.id"
                          :name="`${material_color.code}.option_value_id`"
                          @change="set_custom_name(color,material_color.code)"
                          v-model="data_id[material_color.code]"
                          :value="color.id" label="setting_color" rules="required" />
                        <VeeField type="hidden" :name="`${material_color.code}.name`"
                          :value="material_color.name" />
                        <VeeField type="hidden" :name="`${material_color.code}.option_id`"
                          :value="material_color.id" />
                        <VeeField type="hidden" :name="`${material_color.code}.code`"
                          :value="material_color.code" />
                        <VeeField type="hidden" :name="`${material_color.code}.type`"
                          :value="material_color.type" />
                        <VeeField type="hidden" :name="`${material_color.code}.value`" :value="color.code + ' ' + show_custom_name(color)"
                        v-model="data_val[material_color.code]"
                         />
                        <label :for="'setting_color_' + color.id">
                          <img :src="color.thumb" :alt="show_custom_name(color)">
                        </label>

                        <p class="color-code">{{ color.code }}</p>
                        <p>{{ show_custom_name(color) }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${material_color.code}.option_value_id`" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
      <section id="outerFrame" v-if="show_block && !is_track">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">{{ store.language_txt.order.text_outer_frame }}</h2>
            <div class="row flex-auto col-12">
              <!-- 框型 -->
              <div class="row flex-auto col-12" v-if="doorType_outerFrame">
                <div class="col-md-6 flex-auto">
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-2 " for="">
                      <span class="text-danger">*</span>
                      {{ doorType_outerFrame.name }}
                    </label>
                    <div class="col-sm-10">
                      <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                        :class="{ 'error': errors[`${doorType_outerFrame.code}.option_value_id`] }">
                        <div class="picOption" v-for="(item, idx) in doorType_outerFrame.option_values"
                          :key="'outerFrame' + item.id">
                          <VeeField type="radio" :id="'outerFrame' + item.id"
                            v-model="data_id[doorType_outerFrame.code]"
                            @change="set_custom_name(item,doorType_outerFrame.code)"
                            :name="`${doorType_outerFrame.code}.option_value_id`" :value="item.id" rules="required" />
                          <VeeField type="hidden" :name="`${doorType_outerFrame.code}.name`"
                            :value="doorType_outerFrame.name" />
                          <VeeField type="hidden" :name="`${doorType_outerFrame.code}.option_id`"
                            :value="doorType_outerFrame.id" />
                          <VeeField type="hidden" :name="`${doorType_outerFrame.code}.option_code`"
                            :value="doorType_outerFrame.code" />
                          <VeeField type="hidden" :name="`${doorType_outerFrame.code}.type`"
                            :value="doorType_outerFrame.type" />
                          <VeeField type="hidden" :name="`${doorType_outerFrame.code}.value`"
                          v-model="data_val[doorType_outerFrame.code]"
                           />
                          <label :for="'outerFrame' + item.id">
                            <img :src="item.thumb" :alt="show_custom_name(item)">
                          </label>
                          <p class="fs-xs">{{ show_custom_name(item)}}</p>
                        </div>
                        <VeeErrorMessage class="error__label" :name="`${doorType_outerFrame.code}.option_value_id`" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- left -->
              <div class="col-md-6 flex-auto">
                <!-- 邊數 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_sides.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.outer_frame_sides.code}.option_value_id`" id="" class="form-select"
                      rules="required" :class="{ 'error': errors[`${order_data.outer_frame_sides.code}.option_value_id`] }"
                      v-model="data_id[order_data.outer_frame_sides.code]"
                      @change="set_name(data,order_data.outer_frame_sides.code)"
                      >
                      <option value="" disabled>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.outer_frame_sides.option_values" :key="data.id" @change="order_fill_out_id.outer_frame_sides = data.id"
                        :value="data.id">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.name`"
                      :value="order_data.outer_frame_sides.name" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.option_id`"
                      :value="order_data.outer_frame_sides.id" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.option_code`"
                      :value="order_data.outer_frame_sides.code" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.type`"
                      :value="order_data.outer_frame_sides.type" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_sides.code}.value`"
                    v-model="data_val[order_data.outer_frame_sides.code]"
                     />

                    <VeeErrorMessage class="error__label" :name="`${order_data.outer_frame_sides.code}.option_value_id`" />
                  </div>
                </div>
                <!-- 切窗台 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_cut_position.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                      :class="{ 'error': errors[`${order_data.outer_frame_cut_position.code}.option_value_id`] }">
                      <template v-for="(data,idx) in order_data.outer_frame_cut_position.option_values" :key="data.id">
                        <label :for="'outer_frame_cut_position' + data.id">
                          <VeeField 
                            type="checkbox" 
                            :name="`${order_data.outer_frame_cut_position.code}.option_value_id`" 
                            :value="data.id"
                            v-model="data_id[order_data.outer_frame_cut_position.code]"
                            class="form-check-input" 
                            :id="'outer_frame_cut_position' + data.id"
                            label="outer_frame_cut_position"
                            rules="required" 
                          />
                          <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.name`"
                            :value="order_data.outer_frame_cut_position.name" />
                          <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.option_id`"
                            :value="order_data.outer_frame_cut_position.id" />
                          <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.option_code`"
                            :value="order_data.outer_frame_cut_position.code" />
                          <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.type`"
                            :value="order_data.outer_frame_cut_position.type" />
                          <span class="ms-2">{{ data.name }}</span>
                        </label>
                      </template>
                        <VeeErrorMessage class="error__label" :name="`${order_data.outer_frame_cut_position.code}.option_value_id`" />
                    </div>
                  </div>
                </div>
                <!-- 鑽孔 -->
                <div class="row mb-3" v-if="is_wood">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.sldwood_pre_drilled_hole.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.sldwood_pre_drilled_hole.code}.option_value_id`" id="" class="form-select"
                      rules="required" :class="{ 'error': errors[`${order_data.sldwood_pre_drilled_hole.code}.option_value_id`] }"
                      v-model="data_id[order_data.sldwood_pre_drilled_hole.code]"
                      @change="set_name(data,order_data.sldwood_pre_drilled_hole.code)"
                     >
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.sldwood_pre_drilled_hole.option_values" :key="data.id"
                        :value="data.id">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.sldwood_pre_drilled_hole.code}.name`"
                      :value="order_data.sldwood_pre_drilled_hole.name" />
                    <VeeField type="hidden" :name="`${order_data.sldwood_pre_drilled_hole.code}.option_id`"
                      :value="order_data.sldwood_pre_drilled_hole.id" />
                    <VeeField type="hidden" :name="`${order_data.sldwood_pre_drilled_hole.code}.option_code`"
                      :value="order_data.sldwood_pre_drilled_hole.code" />
                    <VeeField type="hidden" :name="`${order_data.sldwood_pre_drilled_hole.code}.type`"
                      :value="order_data.sldwood_pre_drilled_hole.type" />
                    <VeeField type="hidden" :name="`${order_data.sldwood_pre_drilled_hole.code}.value`"
                    v-model="data_val[order_data.sldwood_pre_drilled_hole.code]"
                     />
                    <VeeErrorMessage class="error__label" :name="`${order_data.sldwood_pre_drilled_hole.code}.option_value_id`" />
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="col-md-6 flex-auto">
                <!-- 墊片厚度 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_gasket_thickness.name }}
                  </label>
                  <div class="col-sm-8">
                    <!-- text -->
                    <div v-if="data_val[order_data.sldwood_build_out_thickness_manually.code] == 'Y'">
                      <VeeField  type="text"
                        :name="`${order_data.outer_frame_gasket_thickness.code}.value`" class="form-control"
                        :class="{ 'error': errors[`${order_data.outer_frame_gasket_thickness.code}.value`] }"
                        v-model="data_val[order_data.outer_frame_gasket_thickness.code]"
                        />
                      <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.option_value_id`"
                        value="0" />
                    </div>
                      <!-- select -->
                    <div v-else>
                      <VeeField  as="select" :name="`${order_data.outer_frame_gasket_thickness.code}.option_value_id`"
                        id="outer_frame_gasket_thickness" class="form-select"
                        :class="{ 'error': errors[`${order_data.outer_frame_gasket_thickness.code}.option_value_id`] }"
                        v-model="data_id[order_data.outer_frame_gasket_thickness.code]" 
                        @change="set_name(data,order_data.outer_frame_gasket_thickness.code)"
                        rules="required">
                        <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                        <option v-for="data in order_data.outer_frame_gasket_thickness.option_values" :key="data.id"
                        @change="order_fill_out_id.outer_frame_gasket_thickness =  data.id"
                          :value="data.id">
                          {{ data.name }}
                        </option>
                      </VeeField>
                      <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.value`"
                      v-model="data_val[order_data.outer_frame_gasket_thickness.code]" />
                    </div>
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.name`"
                      :value="order_data.outer_frame_gasket_thickness.name" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.option_id`"
                      :value="order_data.outer_frame_gasket_thickness.id" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.option_code`"
                      :value="order_data.outer_frame_gasket_thickness.code" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.type`"
                      :value="order_data.outer_frame_gasket_thickness.type" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.outer_frame_gasket_thickness.code}.option_value_id`" />
                    <!-- 自行輸入checkbox -->
                    <div v-if="is_wood" class="mt-2">
                      <label>
                        <VeeField type="checkbox" :class="{ 'error': errors[`${order_data.sldwood_build_out_thickness_manually.code}.option_values[0].value`] }"
                          :name="`${order_data.sldwood_build_out_thickness_manually.code}.option_values[0].value`"
                          v-model="data_val[order_data.sldwood_build_out_thickness_manually.code]" value="Y"
                          class="form-check-input" />
                        {{ store.language_txt.order.text_enter_manually}}
                        <VeeField type="hidden" :name="`${order_data.sldwood_build_out_thickness_manually.code}.name`" :value="order_data.sldwood_build_out_thickness_manually.name" />
                      <VeeField type="hidden" :name="`${order_data.sldwood_build_out_thickness_manually.code}.option_id`" :value="order_data.sldwood_build_out_thickness_manually.id" />
                      <VeeField type="hidden" :name="`${order_data.sldwood_build_out_thickness_manually.code}.option_code`" :value="order_data.sldwood_build_out_thickness_manually.code" />
                      <VeeField type="hidden" :name="`${order_data.sldwood_build_out_thickness_manually.code}.type`" :value="order_data.sldwood_build_out_thickness_manually.type" />
                      <VeeField type="hidden" :name="`${order_data.sldwood_build_out_thickness_manually.code}.option_values[0].option_value_id`" value="0"/>
                      </label>
                    </div>
                  </div>
                </div>
                <!-- 墊片位置 -->
                <div class="row mb-3" v-if="values[order_data.outer_frame_gasket_thickness.code]?.option_value_id !== 2202">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_gasket_location.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.outer_frame_gasket_location.code}.option_value_id`"
                      id="outer_frame_gasket_location" class="form-select"
                      :class="{ 'error': errors[`${order_data.outer_frame_gasket_location.code}.option_value_id`] }"
                      v-model="data_id[order_data.outer_frame_gasket_location.code]"
                      @change="set_name(option,order_data.outer_frame_gasket_location.code)"
                      rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.outer_frame_gasket_location.option_values" :key="data.id"
                        @change="order_fill_out_id.outer_frame_gasket_location = data.id"
                        :value="data.id">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.name`"
                      :value="order_data.outer_frame_gasket_location.name" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.option_id`"
                      :value="order_data.outer_frame_gasket_location.id" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.option_code`"
                      :value="order_data.outer_frame_gasket_location.code" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.type`"
                      :value="order_data.outer_frame_gasket_location.type" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_location.code}.value`"
                    v-model="data_val[order_data.outer_frame_gasket_location.code]"
                      />
                    <VeeErrorMessage class="error__label"
                      :name="`${order_data.outer_frame_gasket_location.code}.option_value_id`" />
                  </div>
                </div>
                <!-- 翅膀墊片厚度 -->
                <div class="row mb-3" v-if="values[order_data.outer_frame_gasket_location.code]?.option_value_id == 2219">
                  <label class="label-set col-form-label col-sm-4" :for="order_data.wing_spacer_thickness.name">
                    <span class="text-danger">*</span>
                    {{ order_data.wing_spacer_thickness.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" class="form-control"
                      :class="{ 'error': errors[`${order_data.wing_spacer_thickness.code}.value`]}"
                      v-model="data_val[order_data.wing_spacer_thickness.code]"
                      :id="order_data.wing_spacer_thickness.name" :name="`${order_data.wing_spacer_thickness.code}.value`"
                      label="win_position" rules="required" />
                    <VeeField type="hidden" :name="`${order_data.wing_spacer_thickness.code}.name`"
                      :value="order_data.wing_spacer_thickness.name" />
                    <VeeField type="hidden" :name="`${order_data.wing_spacer_thickness.code}.option_id`"
                      :value="order_data.wing_spacer_thickness.id" />
                    <VeeField type="hidden" :name="`${order_data.wing_spacer_thickness.code}.option_code`"
                      :value="order_data.wing_spacer_thickness.code" />
                    <VeeField type="hidden" :name="`${order_data.wing_spacer_thickness.code}.type`"
                      :value="order_data.wing_spacer_thickness.type" />
                    <VeeField type="hidden" :name="`${order_data.wing_spacer_thickness.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.wing_spacer_thickness.code}.value`" />
                  </div>
                </div>
                <!-- 底部墊片厚度 -->
                <div class="row mb-3" v-if="values[order_data.outer_frame_gasket_location.code]?.option_value_id == 2219">
                  <label class="label-set col-form-label col-sm-4" :for="order_data.bottom_spacer_thickness.name">
                    <span class="text-danger">*</span>
                    {{ order_data.bottom_spacer_thickness.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" class="form-control"
                      :class="{ 'error': errors[`${order_data.bottom_spacer_thickness.code}.value`]}"
                      v-model="data_val[order_data.bottom_spacer_thickness.code]"
                      :id="order_data.bottom_spacer_thickness.name" :name="`${order_data.bottom_spacer_thickness.code}.value`"
                      label="win_position" rules="required" />
                    <VeeField type="hidden" :name="`${order_data.bottom_spacer_thickness.code}.name`"
                      :value="order_data.bottom_spacer_thickness.name" />
                    <VeeField type="hidden" :name="`${order_data.bottom_spacer_thickness.code}.option_id`"
                      :value="order_data.bottom_spacer_thickness.id" />
                    <VeeField type="hidden" :name="`${order_data.bottom_spacer_thickness.code}.option_code`"
                      :value="order_data.bottom_spacer_thickness.code" />
                    <VeeField type="hidden" :name="`${order_data.bottom_spacer_thickness.code}.type`"
                      :value="order_data.bottom_spacer_thickness.type" />
                    <VeeField type="hidden" :name="`${order_data.bottom_spacer_thickness.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.bottom_spacer_thickness.code}.value`" />
                  </div>
                </div>
                <!-- 鑽孔位置 -->
                <div class="row mb-3" v-if="is_wood && is_pre_drilled_hole">
                  <label class="label-set col-form-label col-sm-4" :for="order_data.desired_drilling_position.name">
                    <span class="text-danger">*</span>
                    {{ order_data.desired_drilling_position.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" class="form-control"
                      :class="{ 'error': errors[`${order_data.desired_drilling_position.code}.value`]}"
                      v-model="data_val[order_data.desired_drilling_position.code]"
                      :id="order_data.desired_drilling_position.name" :name="`${order_data.desired_drilling_position.code}.value`"
                      label="win_position" rules="required" />
                    <VeeField type="hidden" :name="`${order_data.desired_drilling_position.code}.name`"
                      :value="order_data.desired_drilling_position.name" />
                    <VeeField type="hidden" :name="`${order_data.desired_drilling_position.code}.option_id`"
                      :value="order_data.desired_drilling_position.id" />
                    <VeeField type="hidden" :name="`${order_data.desired_drilling_position.code}.option_code`"
                      :value="order_data.desired_drilling_position.code" />
                    <VeeField type="hidden" :name="`${order_data.desired_drilling_position.code}.type`"
                      :value="order_data.desired_drilling_position.type" />
                    <VeeField type="hidden" :name="`${order_data.desired_drilling_position.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.desired_drilling_position.code}.value`" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="doorSet" v-if="show_block">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              {{ store.language_txt.order.text_door }}
              <span v-if="!is_track">{{ store.language_txt.order.helper_door_piece }}</span>
            </h2>
            <div class="row flex-auto col-12">
            <!-- 拉桿 -->
              <div class="col-12">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2 " :for="win_lever_data.id">
                    <span class="text-danger">*</span>
                    {{ win_lever_data.name }}
                  </label>
                  <div class="col-sm-10">
                    <div :class="{ 'error': errors[`${win_lever_data.code}.option_value_id`] }"
                      class="d-flex flex-wrap align-items-start  p-2 pt-0">
                      <div class="picOption" v-for="(item, idx) in win_lever_data.option_values"
                        :key="item.name + idx">
                        <VeeField type="radio" :id="'win_lever_' + item.id" :name="`${win_lever_data.code}.option_value_id`"
                          :value="item.id" 
                          v-model="data_id[win_lever_data.code]"
                          @change="set_name(item,win_lever_data.code)"
                          :key="win_lever_data.code + 'option_value_id'"
                          label="win_lever" rules="required" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.name`"  :key="win_lever_data.code + 'name'"
                          :value="win_lever_data.name" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.option_id`"  :key="win_lever_data.code + 'option_id'"
                          :value="win_lever_data.id" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.option_code`"  :key="win_lever_data.code + 'option_code'"
                          :value="win_lever_data.code" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.type`"  :key="win_lever_data.code + 'type'"
                          :value="win_lever_data.type" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.value`"  :key="win_lever_data.code + 'value'"
                        v-model="data_val[win_lever_data.code]"
                         />
                        <label :for="'win_lever_' + item.id">
                          <img :src="item.thumb" :alt="item.name">
                        </label>
                        <p class="fs-xs">{{ item.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${win_lever_data.code}.option_value_id`" />
                    </div>

                  </div>
                </div>
              </div>
              <!-- left -->
              <div class="col-md-6 flex-auto">
                <!-- 尺寸 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="blade_size_data.id">
                    <span class="text-danger">*</span>
                    {{ blade_size_data.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" 
                    :name="`${blade_size_data.code}.option_value_id`" 
                    :id="blade_size_data.id"
                      class="form-select" 
                      :class="{ 'error': errors[`${blade_size_data.code}.option_value_id`] }"
                      v-model="data_id[blade_size_data.code]"
                      @change="set_name(size,blade_size_data.code)"
                      label="blade_size"
                      :key="blade_size_data.code + 'option_value_id'"
                      rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="size in blade_size_data.option_values" :key="size.name + size.id" :value="size.id">
                        {{ size.name }}
                      </option>
                    </VeeField>
                    <VeeErrorMessage class="error__label" :name="`${blade_size_data.code}.option_value_id`" />
                    <VeeField 
                      type="hidden" 
                      :name="`${blade_size_data.code}.name`"
                      :key="blade_size_data.code + 'name'"
                      :value="blade_size_data.name" />
                    <VeeField 
                      type="hidden" 
                      :name="`${blade_size_data.code}.option_id`"
                      :key="blade_size_data.code + 'option_id'"
                      :value="blade_size_data.id" />
                    <VeeField 
                      type="hidden" 
                      :name="`${blade_size_data.code}.option_code`"
                      :key="blade_size_data.code + 'option_code'"
                      :value="blade_size_data.code" />
                    <VeeField 
                      type="hidden" 
                      :name="`${blade_size_data.code}.type`"
                      :key="blade_size_data.code + 'type'"
                      :value="blade_size_data.type" />
                    <VeeField 
                      type="hidden" 
                      :name="`${blade_size_data.code}.value`"
                      :key="blade_size_data.code + 'value'"
                      v-model="data_val[blade_size_data.code]"
                       />
                  </div>
                </div>
                <!-- 數量 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.blade_numbers.id">
                    <span class="text-danger">*</span>
                    {{ order_data.blade_numbers.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="number" :name="`${order_data.blade_numbers.code}.value`"
                    @keydown="clearInput"
                      :id="order_data.blade_numbers.id" class="form-control"
                      :class="{ 'error': errors[`${order_data.blade_numbers.code}.value`] }"
                      v-model="data_val[order_data.blade_numbers.code]" label="blade_numbers"
                      :rules="validateWidth"
                       />
                    <span class="fs-xs">{{ doorSet_comment }}</span>
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.name`"
                      :value="order_data.blade_numbers.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.option_id`"
                      :value="order_data.blade_numbers.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.option_code`"
                      :value="order_data.blade_numbers.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.type`"
                      :value="order_data.blade_numbers.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_numbers.code}.value`" />
                    
                    <div v-if="show_not_warranty" class="text-danger fs-xs">
                      {{store.language_txt.order?.helper_selected_number_of_blades_exceeded}}
                    </div>
                    <div v-if="show_not_warranty">
                      <label>
                        <VeeField type="checkbox" :class="{ 'error': errors[`${order_data.confirm_width_limit.code}.option_values[0].value`] }"
                          :name="`${order_data.confirm_width_limit.code}.option_values[0].value`"
                          v-model="data_id[order_data.confirm_width_limit]" value="Y"
                          class="form-check-input" rules="required" />
                        {{ order_data.confirm_width_limit.name }}
                        <VeeField type="hidden" :name="`${order_data.confirm_width_limit.code}.name`"
                          :value="order_data.confirm_width_limit.name" />
                        <VeeField type="hidden" :name="`${order_data.confirm_width_limit.code}.option_id`"
                          :value="order_data.confirm_width_limit.id" />
                        <VeeField type="hidden" :name="`${order_data.confirm_width_limit.code}.option_code`"
                          :value="order_data.confirm_width_limit.code" />
                        <VeeField type="hidden" :name="`${order_data.confirm_width_limit.code}.type`"
                          :value="order_data.confirm_width_limit.type" />
                        <VeeField type="hidden" :name="`${order_data.confirm_width_limit.code}.option_values[0].option_value_id`"
                          value="0" />
                      </label>
                      <VeeErrorMessage class="error__label" :name="`confirm_width_limit.option_values[0].value`" />
                    </div>
                  </div>
                </div>
                <!-- 結構 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.blade_arrangement.name ">
                    <span class="text-danger">*</span>
                    {{ order_data.blade_arrangement.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.blade_arrangement.code}.value`"
                      :id="order_data.blade_arrangement.name"
                      placeholder="2P-1B/1F，4P-1B/1F/1F/1B"
                      v-model="data_val[order_data.blade_arrangement.code]" 
                      class="form-control"
                      :class="{ 'error': errors[`${order_data.blade_arrangement.code}.value`] }"
                      label="blade_arrangement" rules="required" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.name`"
                      :value="order_data.blade_arrangement.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.option_id`"
                      :value="order_data.blade_arrangement.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.option_code`"
                      :value="order_data.blade_arrangement.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.type`"
                      :value="order_data.blade_arrangement.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_arrangement.code}.value`" />
                  </div>
                </div>
                <!-- 開合 -->
                <div class="row mb-3" v-if="!is_track && !blade_numbers_1">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.blade_arrangement.name ">
                    <span class="text-danger">*</span>
                    {{ order_data.blade_directions.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.blade_directions.code}.option_value_id`" id="blade_directions"
                      class="form-select" 
                      v-model="data_id[order_data.blade_directions.code]"
                      @change="set_name(data,order_data.blade_directions.code)"
                      :class="{ 'error': errors[`${order_data.blade_directions.code}.option_value_id`] }"
                      label="blade_directions" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.blade_directions.option_values" :key="data.name + data.id"
                        :value="data.id">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.name`"
                      :value="order_data.blade_directions.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.option_id`"
                      :value="order_data.blade_directions.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.option_code`"
                      :value="order_data.blade_directions.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.type`"
                      :value="order_data.blade_directions.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.value`"
                    v-model="data_val[order_data.blade_directions.code]"/>
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_directions.code}.option_value_id`" />
                  </div>
                </div>
                <!-- 邊框 -->
                <div class="row mb-3" v-if="!blade_numbers_1">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{order_data.window_frame_type.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.window_frame_type.code}.option_value_id`] }">
                      <div class="picOption" v-for="frame in order_data.window_frame_type.option_values">
                        <VeeField 
                          type="radio" 
                          :id="'frame' + frame.id"
                          :name="`${order_data.window_frame_type.code}.option_value_id`" :value="frame.id"
                          v-model="data_id[order_data.window_frame_type.code]" 
                          @change="set_name(frame,order_data.window_frame_type.code)"
                          label="door_frame"
                          rules="required" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.name`"
                          :value="order_data.window_frame_type.name" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.option_id`"
                          :value="order_data.window_frame_type.id" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.option_code`"
                          :value="order_data.window_frame_type.code" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.type`"
                          :value="order_data.window_frame_type.type" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.value`"
                        v-model="data_val[order_data.window_frame_type.code]"
                         />
                        <label :for="'frame' + frame.id">
                          <img :src="frame.thumb" :alt="frame.name">
                        </label>
                        <p class="fs-xs">{{ frame.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${order_data.window_frame_type.code}.option_value_id`" />
                    </div>
                  </div>
                </div>
                <!-- 吸鐵 -->
                <div class="row mb-3" v-if="!is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="magnetic_data.name">
                    <span class="text-danger">*</span>
                    {{ magnetic_data.name }}
                  </label>
                  <div class="col-sm-8" >
                    <VeeField 
                      as="select" 
                      :name="`${magnetic_data.code}.option_value_id`"
                      v-model="data_id[magnetic_data.code]"
                      @change="set_name(item,magnetic_data.code)"
                      id="magnetic_options"
                      :key="magnetic_data.code + 'option_value_id'"
                      class="form-select"
                      :class="{ 'error': errors[`${magnetic_data.code}.option_value_id`] }"
                      label="magnetic_options" rules="required">
                      <option value="" >{{ store.language_txt.order.text_choose_specification}}</option>
                      <option 
                        :value="item.id" 
                        v-for="item in magnetic_data.option_values"
                        :key="item.id">
                        {{ item.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${magnetic_data.code}.name`"
                      :value="magnetic_data.name" :key="magnetic_data.code + 'name'" />
                    <VeeField type="hidden" :name="`${magnetic_data.code}.option_id`"
                      :value="magnetic_data.id" :key="magnetic_data.code + 'option_id'" />
                    <VeeField type="hidden" :name="`${magnetic_data.code}.option_code`"
                      :value="magnetic_data.code" :key="magnetic_data.code + 'option_code'" />
                    <VeeField type="hidden" :name="`${magnetic_data.code}.type`"
                      :value="magnetic_data.type" :key="magnetic_data.code + 'type'" />
                    <VeeField type="hidden" :name="`${magnetic_data.code}.value`" :key="magnetic_data.code + 'value'"
                    v-model="data_val[magnetic_data.code]"
                    />
                    <VeeErrorMessage class="error__label" :name="`${magnetic_data.code}.option_value_id`" />
                  </div>
                </div>
                <!-- 摺疊 -->
                <div class="row mb-3" v-if="is_folding_door && is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.folding_method.id">
                    <span class="text-danger">*</span>
                    {{order_data.folding_method.name}}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.folding_method.code}.option_value_id`"
                      :id="order_data.folding_method.id" class="form-select"
                      :class="{ 'error': errors[`${order_data.folding_method.code}.option_value_id`] }"
                      v-model="data_id[order_data.folding_method.code]"
                      @change="set_name(item,order_data.folding_method.code)"
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
                    v-model="data_val[order_data.folding_method.code]"
                      />
                    <VeeErrorMessage class="error__label" :name="`${order_data.folding_method.code}.option_value_id`" />
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="col-md-6 flex-auto">
                <!-- 鉸鍊顏色 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " :for="hinge_color_data.name">
                    <span class="text-danger">*</span>
                    {{ hinge_color_data.name }}
                  </label>
                  <div class="col-sm-8 d-flex flex-wrap align-items-start">
                      <VeeField as="select" :name="`${hinge_color_data.code}.option_value_id`"
                        :id="hinge_color_data.name" class="form-select"
                        :class="{ 'error': errors[`${hinge_color_data.code}.option_value_id`] }"
                        v-model="data_id[hinge_color_data.code]"
                        :key="hinge_color_data.code + 'option_value_id'"
                        @change="set_name(item,hinge_color_data.code)"
                        label="hinge_color" rules="required">
                        <option value="">{{ store.language_txt.order.text_choose_specification}}</option>
                        <option 
                          :value="item.id" 
                          v-for="item in hinge_color_data.option_values" 
                          :key="item.id">
                          {{ item.name }}
                        </option>
                      </VeeField>
                      <VeeField type="hidden" :name="`${hinge_color_data.code}.name`" :key="hinge_color_data.code + 'name'"
                        :value="hinge_color_data.name" />
                      <VeeField type="hidden" :name="`${hinge_color_data.code}.option_id`" :key="hinge_color_data.code + 'option_id'"
                        :value="hinge_color_data.id" />
                      <VeeField type="hidden" :name="`${hinge_color_data.code}.option_code`" :key="hinge_color_data.code + 'option_code'"
                        :value="hinge_color_data.code" />
                      <VeeField type="hidden" :name="`${hinge_color_data.code}.type`" :key="hinge_color_data.code + 'type'"
                        :value="hinge_color_data.type" />
                      <VeeField type="hidden" :name="`${hinge_color_data.code}.value`" :key="hinge_color_data.code + 'value'"
                      v-model="data_val[hinge_color_data.code]"
                         />
                      <VeeErrorMessage class="error__label" :name="`${hinge_color_data.code}.option_value_id`" />
                  </div>
                </div>
                <!-- 把手 -->
                <div class="row mb-3" v-if="!is_aluminum">
                  <label class="label-set col-form-label col-sm-4">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_type.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start"
                      :class="{ 'error': errors[`${order_data.door_handle_type.code}.option_value_id`] }">
                        <VeeField as="select" :name="`${order_data.door_handle_type.code}.option_value_id`"
                                  :id="'door_handle_type'" class="form-select"
                                  :class="{ 'error': errors[`${order_data.door_handle_type.code}.option_value_id`] }"
                                   v-model="data_id[order_data.door_handle_type.code]"
                                  key="door_handle_type"
                                  @change="get_handle_color($event),set_name(item,order_data.door_handle_type.code)"
                                  label="lock_Handle" rules="required">
                        <option value="">{{ store.language_txt.order.text_choose_specification}}</option>
                        <option 
                          :value="item.id" 
                          v-for="item in order_data.door_handle_type.option_values" 
                          :key="item.id">
                          {{ item.name }}
                        </option>
                      </VeeField>
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.name`"
                          :value="order_data.door_handle_type.name" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.option_id`"
                          :value="order_data.door_handle_type.id" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.option_code`"
                          :value="order_data.door_handle_type.code" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.type`"
                          :value="order_data.door_handle_type.type" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.value`"
                        v-model="data_val[order_data.door_handle_type.code]"
                         />
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_handle_type.code}.option_value_id`" />
                  </div>
                </div>
                <!-- 把手顏色 -->
                <div class="row mb-3" v-if="!!handle_color && !is_none_handle && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_handle_color.name">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_color.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.door_handle_color.code}.option_value_id`] }">
                      <div class="picOption" v-for="color in handle_color">
                        <VeeField type="radio" :id="'lockHandle_color' + color.id"
                          :name="`${order_data.door_handle_color.code}.option_value_id`"
                          v-model="data_id[order_data.door_handle_color.code]" 
                          @change="set_name(color,order_data.door_handle_color.code)"
                          :value="color.option_value_id"
                           label="lockHandle_color"
                          rules="required" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.name`"
                          :value="order_data.door_handle_color.name" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.option_id`"
                          :value="order_data.door_handle_color.id" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.option_code`"
                          :value="order_data.door_handle_color.code" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.type`"
                          :value="order_data.door_handle_color.type" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_color.code}.value`"
                        v-model="data_val[order_data.door_handle_color.code]"
                         />

                        <label :for="'lockHandle_color' + color.id">
                          <img :src="color.thumb" :alt="color.name">
                        </label>
                        <p class="fs-xs">{{ color.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${order_data.door_handle_color.code}.option_value_id`" />
                    </div>
                  </div>
                </div>
                <!-- 把手預鎖 -->
                <div class="row mb-3" v-if="!is_none_handle && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.handle_pre_locked.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                      :class="{ 'error': errors[`${order_data.handle_pre_locked.code}.option_value_id`] }">
                      <label :for="'handle_pre_locked' + data.id" v-for="data in order_data.handle_pre_locked.option_values"
                        :key="data.id">
                        <VeeField 
                          type="radio" 
                          :name="`${order_data.handle_pre_locked.code}.option_value_id`" :value="data.id"
                          @change="set_name(data,order_data.handle_pre_locked.code)"
                          v-model="data_id[order_data.handle_pre_locked.code]"
                          class="form-check-input" :id="'handle_pre_locked' + data.id"
                          label="handle_pre_locked"
                          rules="required" />
                        <VeeField type="hidden" :name="`${order_data.handle_pre_locked.code}.name`"
                          :value="order_data.handle_pre_locked.name" />
                        <VeeField type="hidden" :name="`${order_data.handle_pre_locked.code}.option_id`"
                          :value="order_data.handle_pre_locked.id" />
                        <VeeField type="hidden" :name="`${order_data.handle_pre_locked.code}.option_code`"
                          :value="order_data.handle_pre_locked.code" />
                        <VeeField type="hidden" :name="`${order_data.handle_pre_locked.code}.type`"
                          :value="order_data.handle_pre_locked.type" />
                        <VeeField type="hidden" :name="`${order_data.handle_pre_locked.code}.value`"
                        v-model="data_val[order_data.handle_pre_locked.code]"
                         />
                        <span class="ms-2">{{ data.name }}</span>

                      </label>
                      <VeeErrorMessage class="error__label" :name="`${order_data.handle_pre_locked.code}.option_value_id`" />
                    </div>
                  </div>
                </div>
                <!-- 把手位置 -->
                <div class="row mb-3" v-if="!is_none_handle && !is_aluminum && data_id[order_data.handle_pre_locked.code] == '2372'">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_handle_location.name">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_location.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_handle_location.code}.value`"
                      :id="order_data.door_handle_location.id" class="form-control"
                      :class="{ 'error': errors[`${order_data.door_handle_location.code}.value`] }"
                      v-model="data_val[order_data.door_handle_location.code]"
                      label="lockHandle_position" rules="required" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.name`"
                      :value="order_data.door_handle_location.name" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.option_id`"
                      :value="order_data.door_handle_location.id" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.option_code`"
                      :value="order_data.door_handle_location.code" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.type`"
                      :value="order_data.door_handle_location.type" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_location.code}.option_value_id`"
                      value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_handle_location.code}.value`" />
                  </div>
                </div>
                <!-- 把手數量 -->
                <div class="row mb-3" v-if="!is_none_handle && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_handle_qty.name">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_qty.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_handle_qty.code}.value`"
                      :id="order_data.door_handle_qty.name"
                      v-model="data_val[order_data.door_handle_qty.code]" class="form-control"
                      :class="{ 'error': errors[`${order_data.door_handle_qty.code}.value`] }" label="lockHandle_count"
                      rules="required" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.name`"
                      :value="order_data.door_handle_qty.name" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.option_id`"
                      :value="order_data.door_handle_qty.id" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.option_code`"
                      :value="order_data.door_handle_qty.code" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.type`"
                      :value="order_data.door_handle_qty.type" />
                    <VeeField type="hidden" :name="`${order_data.door_handle_qty.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_handle_qty.code}.value`" />
                  </div>
                </div>

                <!-- 鎖 -->
                <div class="row mb-3" v-if="!is_track">
                  <label class="label-set col-form-label col-sm-4 " :for="door_lock_type_data.id">
                    <span class="text-danger">*</span>
                    {{ door_lock_type_data.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start"
                      :class="{ 'error': errors[`${door_lock_type_data.code}.option_value_id`] }">
                      <VeeField as="select" :name="`${door_lock_type_data.code}.option_value_id`"
                        id="lock_type" class="form-select"
                        :class="{ 'error': errors[`${door_lock_type_data.code}.option_value_id`] }"
                         v-model="data_id[door_lock_type_data.code]"
                        key="lock_type"
                        @change="get_lock_color($event),set_name(item,door_lock_type_data.code)"
                        label="lock_type" rules="required">
                        <option value="">{{ store.language_txt.order.text_choose_specification}}</option>
                        <option 
                        :value="item.id" 
                        v-for="item in door_lock_type_data.option_values" 
                        :key="item.id">
                        {{ item.name }}
                        </option>
                      </VeeField>
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.name`" :key="door_lock_type_data.code + 'name'"
                          :value="door_lock_type_data.name" />
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.option_id`" :key="door_lock_type_data.code + 'option_id'"
                          :value="door_lock_type_data.id" />
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.option_code`" :key="door_lock_type_data.code + 'option_code'"
                          :value="door_lock_type_data.code" />
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.type`" :key="door_lock_type_data.code + 'type'"
                          :value="door_lock_type_data.type" />
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.value`" :key="door_lock_type_data.code + 'value'"
                        v-model="data_val[door_lock_type_data.code]"
                           />
                    </div>
                      <VeeErrorMessage class="error__label" :name="`${door_lock_type_data.code}.option_value_id`" />

                  </div>
                </div>
                <!-- 鎖的顏色 -->
                <div class="row mb-3" v-if="lock_color.length > 0 && !is_none_lock && !is_track && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_color.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_color.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.door_lock_color.code}.option_value_id`] }">
                      <div class="picOption" v-for="color in lock_color" :key="color.id">
                        <VeeField 
                        type="radio" 
                        :id="color.id" 
                        :name="`${order_data.door_lock_color.code}.option_value_id`"
                        v-model="data_id[order_data.door_lock_color.code]"  
                        @change="set_name(color,order_data.door_lock_color.code)"
                        :value="color.option_value_id"
                        label="lock_color"
                        rules="required" />
                        <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.name`"
                          :value="order_data.door_lock_color.name" />
                        <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.option_id`"
                          :value="order_data.door_lock_color.id" />
                        <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.option_code`"
                          :value="order_data.door_lock_color.code" />
                        <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.type`"
                          :value="order_data.door_lock_color.type" />
                        <VeeField type="hidden" :name="`${order_data.door_lock_color.code}.value`"
                        v-model="data_val[order_data.door_lock_color.code]"
                        />
                        <label :for="color.id">
                          <img :src="color.thumb" :alt="color.name">
                        </label>
                        <p class="fs-xs">{{ color.name }}</p>
                      </div>

                      <VeeErrorMessage class="error__label" :name="`${order_data.door_lock_color.code}.option_value_id`" />
                    </div>

                  </div>
                </div>
                <!-- 鎖預鎖 -->
                <div class="row mb-3" v-if="!is_none_lock && !is_track && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.lock_pre_locked.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                      :class="{ 'error': errors[`${order_data.lock_pre_locked.code}.option_value_id`] }">
                      <label :for="'lock_pre_locked' + data.id" v-for="data in order_data.lock_pre_locked.option_values"
                        :key="data.id">
                        <VeeField type="radio" :name="`${order_data.lock_pre_locked.code}.option_value_id`" :value="data.id"
                          v-model="data_id[order_data.lock_pre_locked.code]"
                          @change="set_name(data,order_data.lock_pre_locked.code)" 
                          label="lock_pre_locked"
                          :disabled="is_lock_type1"
                          class="form-check-input" :id="'lock_pre_locked' + data.id"
                          rules="required" />
                        <VeeField type="hidden" :name="`${order_data.lock_pre_locked.code}.name`"
                          :value="order_data.lock_pre_locked.name" />
                        <VeeField type="hidden" :name="`${order_data.lock_pre_locked.code}.option_id`"
                          :value="order_data.lock_pre_locked.id" />
                        <VeeField type="hidden" :name="`${order_data.lock_pre_locked.code}.option_code`"
                          :value="order_data.lock_pre_locked.code" />
                        <VeeField type="hidden" :name="`${order_data.lock_pre_locked.code}.type`"
                          :value="order_data.lock_pre_locked.type" />
                        <VeeField type="hidden" :name="`${order_data.lock_pre_locked.code}.value`"
                        v-model="data_val[order_data.lock_pre_locked.code]"
                         />
                        <span class="ms-2">{{ data.name }}</span>

                      </label>
                      <VeeErrorMessage class="error__label" :name="`${order_data.lock_pre_locked.code}.option_value_id`" />
                    </div>
                  </div>
                </div>
                <!-- 鎖的位置 -->
                <div class="row mb-3" v-if="!is_none_lock && !is_track && !is_aluminum && values.lock_pre_locked?.option_value_id == '2374'">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_location.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_location.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_lock_location.code}.value`"
                      v-model="data_val[order_data.door_lock_location.code]"
                      :id="order_data.door_lock_location.id" class="form-control"
                      :class="{ 'error': errors[`${order_data.door_lock_location.code}.value`] }" label="lock_location"
                      rules="required" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.name`"
                      :value="order_data.door_lock_location.name" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.option_id`"
                      :value="order_data.door_lock_location.id" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.option_code`"
                      :value="order_data.door_lock_location.code" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.type`"
                      :value="order_data.door_lock_location.type" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_location.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_lock_location.code}.value`" />
                  </div>
                </div>
                <!-- 鎖的數量 -->
                <div class="row mb-3" v-if="!is_none_lock && !is_track && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_qty.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_qty.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_lock_qty.code}.value`"
                      v-model="data_val[order_data.door_lock_qty.code]"
                      :id="order_data.door_lock_qty.id" class="form-control"
                      :class="{ 'error': errors[`${order_data.door_lock_qty.code}.value`] }" label="lock_qty"
                      rules="required" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.name`"
                      :value="order_data.door_lock_qty.name" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.option_id`"
                      :value="order_data.door_lock_qty.id" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.option_code`"
                      :value="order_data.door_lock_qty.code" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.type`"
                      :value="order_data.door_lock_qty.type" />
                    <VeeField type="hidden" :name="`${order_data.door_lock_qty.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_lock_qty.code}.value`" />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="partitio" v-if="show_block">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title position-relative">
              {{ store.language_txt.order.text_option_section_dividers }}
              <i class="fas fa-question-circle"></i>
              <div class="info_box">
                {{ partitio_note }}
              </div>
            </h2>
            <div class="row flex-auto col-12">
              <!-- 拉桿分段需求 -->
              <div class="col-md-12" v-if="show_add_lever && !is_none_win_lever">
                <div class="d-none" v-if="lever_segmentation_note_data.length > 0">
                  <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.name`"
                    :value="order_data.lever_segmentation_note.name" />
                  <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.option_id`"
                    :value="order_data.lever_segmentation_note.id" />
                  <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.option_code`"
                    :value="order_data.lever_segmentation_note.code" />
                  <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.type`"
                    :value="order_data.lever_segmentation_note.type" />
                  <VeeField type="hidden" :name="`${order_data.lever_segmentation_note.code}.option_value_id`"
                    value="0" />
                </div>
                <div class="row mb-3" v-for="(data,idx) in lever_segmentation_note_data" :key="`lever_segmentation${idx +1}`">
                  <label class="label-set col-form-label col-sm-2 " :for="order_data.lever_segmentation_note.name">
                    {{ order_data.lever_segmentation_note.name }}{{idx + 1}}
                  </label>
                  <div class="col-sm-4 position-relative">
                    <VeeField type="number" :name="`${order_data.lever_segmentation_note.code}.value[${idx}].lever_value`"
                      @keydown="clearInput"
                      v-model="data.lever_value"
                      :id="`${order_data.lever_segmentation_note.name}${idx + 1}`" class="form-control"
                      :label="`lever_segmentation${idx + 1}`"/>
                      <i class="fas fa-times close_btn" @click="del_json(order_data.lever_segmentation_note.code,idx)"></i>
                  </div>
                </div>
              </div>
              <!-- input_hiiden -->
              <div class="d-none" v-if="Divider_rail_data.length > 0">
                <VeeField type="hidden" :name="`${order_data.dividers_json.code}.name`"
                  :value="order_data.dividers_json.name" />
                <VeeField type="hidden" :name="`${order_data.dividers_json.code}.option_id`"
                  :value="order_data.dividers_json.id" />
                <VeeField type="hidden" :name="`${order_data.dividers_json.code}.option_code`"
                  :value="order_data.dividers_json.code" />
                <VeeField type="hidden" :name="`${order_data.dividers_json.code}.type`"
                  :value="order_data.dividers_json.type" />
                <VeeField type="hidden" :name="`${order_data.dividers_json.code}.option_value_id`" value="0" />
              </div>
              <div class="col-md-12 mb-4 border-bottom py-2  position-relative"
                v-for="(data, idx) in Divider_rail_data" :key="`partitio_${idx +1}`">
                <!-- 中隔 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2 " for="">
                    <span class="text-danger">*</span>
                    {{store.language_txt.order.text_dividers}}{{ idx + 1 }}
                  </label>
                  <div class="col-sm-4">
                    <div class="d-flex mb-2">
                      <div class="input-group">
                        <VeeField type="number" :name="`${order_data.dividers_json.code}.value[${idx}].division_height`"
                          @keydown="clearInput"
                          class="form-control"
                          @input="json_number_only($event,data.division_height)"
                          :class="{ 'error':errors[`${order_data.dividers_json.code}.value[${idx}].division_height`]}"
                          :label="`dividers_json[${idx}].division_height`" v-model.number="data.division_height"
                          rules="required" v-if="!!values.dividers_json" :disabled="data.division_center == 'Y'" />
                        <span class="input-group-text">mm</span>
                      </div>
                    </div>
                    <VeeErrorMessage class="error__label"
                      :name="`${order_data.dividers_json.code}.value[${idx}].division_height`" />
                    <div class="d-flex gap-4">
                      <div>
                        <VeeField type="checkbox" class="form-check-input me-2" v-model="data.division_center" value="Y"
                          :name="`${order_data.dividers_json.code}.value[${idx}].division_center`"
                          :id="`dividers_json_center${idx +1 }`" />
                        <label :for="`dividers_json_center${idx +1 }`">
                          {{ store.language_txt.order.text_dividers_json_is_center}}
                        </label>
                      </div>
                      <div>
                        <VeeField type="checkbox" class="form-check-input me-2" v-model="data.division_no_move"
                          value="Y" :name="`${order_data.dividers_json.code}.value[${idx}].division_no_move`"
                          :id="`dividers_json_no_move${idx +1}`" />
                        <label :for="`dividers_json_no_move${idx +1}`">
                          {{ store.language_txt.order.text_dividers_json_is_fixed }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 以上分段 -->
                <div class="row me-0 d-inline-flex col-sm-6 mb-3">
                  <label class="label-set col-form-label col-4" for="">
                    {{ store.language_txt.order.text_dividers}}{{ idx + 1
                    }}<br>{{ store.language_txt.order.text_dividers_json_above_division}}
                    
                  </label>
                  <div class="col-8 d-flex align-items-center ">
                    <div class="col me-2 input-group">
                      <VeeField type="text"
                        :name="`${order_data.dividers_json.code}.value[${idx}].above_handle_division`"
                        class="form-control" v-model="data.above_handle_division"
                        :disabled="data.above_handle_division_center == 'Y'"
                        :class="{ 'error':errors[`${order_data.dividers_json.code}.value[${idx}].above_handle_division`]}"
                        :label="`partitio[${idx}].name`" />
                      <VeeErrorMessage class="error__label"
                        :name="`${order_data.dividers_json.code}.value[${idx}].above_handle_division`" />
                    </div>
                    <VeeField type="checkbox"
                      :name="`${order_data.dividers_json.code}.value[${idx}].above_handle_division_center`" value="Y"
                      class="form-check-input mx-2" v-model="data.above_handle_division_center"
                      :id="`above_handle_division_center${idx +1}`" />
                    <label :for="`above_handle_division_center${idx +1}`">
                      {{ store.language_txt.order.text_dividers_json_is_center}}
                    </label>
                  </div>
                </div>
                <!-- 以下分段 -->
                <div class="row ms-0 d-inline-flex col-sm-6 mb-3" v-if="idx == 0">
                  <label class="label-set col-form-label col-4" for="">
                    {{ store.language_txt.order.text_dividers}}{{ idx + 1
                    }}<br>{{ store.language_txt.order.text_dividers_json_beneath_divide}}
                  </label>
                  <div class="col-sm-8 d-flex align-items-center">
                    <div class="col me-2 input-group">
                      <VeeField type="text"
                        :name="`${order_data.dividers_json.code}.value[${idx}].beneath_handle_division`"
                        class="form-control" v-model="data.beneath_handle_division"
                        :disabled="data.beneath_handle_division_center == 'Y'"
                        :class="{ 'error':errors[`${order_data.dividers_json.code}.value[${idx}].beneath_handle_division`]}"
                        :label="`partitio[${idx}].name`"
                      />
                    
                      <VeeErrorMessage class="error__label"
                        :name="`${order_data.dividers_json.code}.value[${idx}].beneath_handle_division`" />
                    </div>
                    <VeeField type="checkbox" value="Y"
                      :name="`${order_data.dividers_json.code}.value[${idx}].beneath_handle_division_center`"
                      v-model="data.beneath_handle_division_center" class="form-check-input mx-2"
                      :id="`beneath_handle_division_center${idx +1}`" />
                    <label :for="`beneath_handle_division_center${idx +1}`">
                      {{ store.language_txt.order.text_dividers_json_is_center}}
                    </label>
                  </div>
                </div>
                <i class="fas fa-times close_btn" @click="del_json(order_data.dividers_json.code,idx)"></i>
              </div>
              <div class="col-12 text-center mt-4 d-flex align-items-center justify-content-center gap-4">
                <button type="button" class="add_text_btn" @click="add_json(order_data.dividers_json.code,Divider_rail_obj)">
                  <i class="fa-solid fa-circle-plus fs-4 add_btn"></i>
                  <span>{{store.language_txt.order.text_dividers}}</span>
                </button>
                <button type="button" class="add_text_btn" v-if="show_add_lever && !is_none_win_lever" @click="add_json(order_data.lever_segmentation_note.code,lever_segmentation_obj)">
                  <i class="fa-solid fa-circle-plus fs-4 add_btn"></i>
                  <span>{{order_data.lever_segmentation_note.name}}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="track_style" v-if="show_block && is_track">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              {{ store.language_txt.order.text_track_style}}
              <i class="fas fa-info-circle" @click="show_info_img($event)">
                <div class="nav-img">
                  <img src="@/assets/images/track_info_img.jpg" alt="track_info_img">
                </div>
              </i>
            </h2>
            <div class="row flex-auto">
              <!-- TOP -->
              <div class="col-12 row flex-auto">
                <div class="col-md-6">
                  <!-- 軌道 -->
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ order_data.win_option_top_track.name }}
                      <i class="fas fa-question-circle"></i>
                      <div class="info_box">
                      {{ store.language_txt.order.text_thickness_exceed_should_cut}}
                        <!-- 厚度21mm 寬度超出2500mm，需考慮切半 -->
                      </div>
                    </label>
                    <div class="col-sm-8">
                      <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                        :class="{ 'error': errors[`${order_data.win_option_top_track.code}.option_value_id`] }">
                        <label :for="'top_Partition_' + data.id"
                          v-for="data in order_data.win_option_top_track.option_values" :key="data.id">
                          <VeeField 
                            type="radio" 
                            :name="`${order_data.win_option_top_track.code}.option_value_id`"
                            :value="data.id" 
                            class="form-check-input"
                            v-model="data_id[order_data.win_option_top_track.code]"
                            @change="set_name(data,order_data.win_option_top_track.code)"
                            :id="'top_Partition_' + data.id"
                            label="top_Partition" rules="required" />
                          <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.name`"
                            :value="order_data.win_option_top_track.name" />
                          <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.option_id`"
                            :value="order_data.win_option_top_track.id" />
                          <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.option_code`"
                            :value="order_data.win_option_top_track.code" />
                          <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.type`"
                            :value="order_data.win_option_top_track.type" />
                          <VeeField type="hidden" :name="`${order_data.win_option_top_track.code}.value`"
                          v-model="data_val[order_data.win_option_top_track.code]"
                          />
                          <span class="ms-2">{{ data.name }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <!-- 切段 -->
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ order_data.top_board_cut.name }}
                    </label>
                    <div class="col-sm-8">
                      <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                        :class="{ 'error': errors[`${order_data.top_board_cut.code}.option_value_id`] }">
                        <label :for="'top_Partition_cut' + data.id"
                          v-for="data in order_data.top_board_cut.option_values" :key="data.id">
                          <VeeField 
                            type="radio" 
                            :name="`${order_data.top_board_cut.code}.option_value_id`"
                            :value="data.id" class="form-check-input"
                            v-model="data_id[order_data.top_board_cut.code]"
                            @change="set_name(data,order_data.top_board_cut.code)"
                            :id="'top_Partition_cut' + data.id"
                            label="top_Partition" rules="required" />
                          <VeeField type="hidden" :name="`${order_data.top_board_cut.code}.name`"
                            :value="order_data.top_board_cut.name" />
                          <VeeField type="hidden" :name="`${order_data.top_board_cut.code}.option_id`"
                            :value="order_data.top_board_cut.id" />
                          <VeeField type="hidden" :name="`${order_data.top_board_cut.code}.option_code`"
                            :value="order_data.top_board_cut.code" />
                          <VeeField type="hidden" :name="`${order_data.top_board_cut.code}.type`"
                            :value="order_data.top_board_cut.type" />
                          <VeeField type="hidden" :name="`${order_data.top_board_cut.code}.value`"
                          v-model="data_val[order_data.top_board_cut.code]"
                          />
                          <span class="ms-2">{{ data.name }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <!-- 顏色 -->
                  <div class="row mb-3 ">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ order_data.upper_track_color.name }}
                    </label>
                    <div class="col-sm-8">
                      <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                        :class="{ 'error': errors[`${order_data.upper_track_color.code}.option_value_id`] }">
                        <label :for="'top_Partition_color' + data.id"
                          v-for="data in order_data.upper_track_color.option_values" :key="data.id">
                          <VeeField 
                          type="radio" 
                          :name="`${order_data.upper_track_color.code}.option_value_id`"
                            :value="data.id" class="form-check-input"
                            v-model="data_id[order_data.upper_track_color.code]"
                            @change="set_name(data,order_data.upper_track_color.code)"
                            :id="'top_Partition_color' + data.id"
                            label="top_Partition" rules="required" />
                          <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.name`"
                            :value="order_data.upper_track_color.name" />
                          <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.option_id`"
                            :value="order_data.upper_track_color.id" />
                          <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.option_code`"
                            :value="order_data.upper_track_color.code" />
                          <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.type`"
                            :value="order_data.upper_track_color.type" />
                          <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.value`"
                          v-model="data_val[order_data.upper_track_color.code]"
                          />
                          <span class="ms-2">{{ data.name }}</span>
                        </label>
                      </div>
                    </div>
                  </div> 
                </div>
                <!-- 軌道顏色圖 -->
                <div class="col-md-6">
                  <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.upper_track_color.name }}
                  </label>
                  <div class="col-sm-8 max-img">
                    <img :src="track_img(1)" alt="">
                  </div>
                  </div>
                </div>
              </div>
              <hr>
              <!-- SIDE -->
              <div class="col-12 row flex-auto">
                <div class="col-6 mb-3 row">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.win_option_side.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      {{ store.language_txt.order.text_thickness_with_mm}}
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                      :class="{ 'error': errors[`${order_data.win_option_side.code}.option_value_id`] }">
                      <label :for="'side_Partition_' + data.id" v-for="data in order_data.win_option_side.option_values"
                        :key="data.id">
                        <VeeField type="radio" :name="`${order_data.win_option_side.code}.option_value_id`" :value="data.id"
                        v-model="data_id[order_data.win_option_side.code]"
                          class="form-check-input" :id="'side_Partition_' + data.id"
                          @change="set_name(data,order_data.win_option_side.code)"
                          label="side_Partition"
                          rules="required" />
                        <VeeField type="hidden" :name="`${order_data.win_option_side.code}.name`"
                          :value="order_data.win_option_side.name" />
                        <VeeField type="hidden" :name="`${order_data.win_option_side.code}.option_id`"
                          :value="order_data.win_option_side.id" />
                        <VeeField type="hidden" :name="`${order_data.win_option_side.code}.option_code`"
                          :value="order_data.win_option_side.code" />
                        <VeeField type="hidden" :name="`${order_data.win_option_side.code}.type`"
                          :value="order_data.win_option_side.type" />
                        <VeeField type="hidden" :name="`${order_data.win_option_side.code}.value`"
                        v-model="data_val[order_data.win_option_side.code]"
                         />
                        <span class="ms-2">{{ data.name }}</span>

                      </label>
                      <VeeErrorMessage class="error__label" :name="`${order_data.win_option_side.code}.option_value_id`" />
                    </div>

                  </div>
                </div>
              </div>
              <hr>
              <!-- BOTTOM -->
              <div class="col-12 row flex-auto"  v-if="!!doorType_track?.option_name">
                <div class="col-6">
                  <!-- 底板 -->
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ order_data.win_option_bottom.name }}
                      <i class="fas fa-question-circle"></i>
                      <div class="info_box">
                        {{ store.language_txt.order.text_thickness_exceed_should_cut}}
                      </div>
                    </label>
                    <div class="col-sm-8">
                      <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                        :class="{ 'error': errors[`${order_data.win_option_bottom.code}.option_value_id`] }">
                        <label :for="'bottom_Partition_' + data.id"
                          v-for="data in order_data.win_option_bottom.option_values" :key="data.id">
                          <VeeField type="radio" 
                            :name="`${order_data.win_option_bottom.code}.option_value_id`"
                            v-model="data_id[order_data.win_option_bottom.code]" 
                            @change="set_name(data,order_data.win_option_bottom.code)"
                            :value="data.id"
                            class="form-check-input" :id="'bottom_Partition_' + data.id" label="bottom_Partition"
                            rules="required" />
                          <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.name`"
                            :value="order_data.win_option_bottom.name" />
                          <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.option_id`"
                            :value="order_data.win_option_bottom.id" />
                          <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.option_code`"
                            :value="order_data.win_option_bottom.code" />
                          <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.type`"
                            :value="order_data.win_option_bottom.type" />
                          <VeeField type="hidden" :name="`${order_data.win_option_bottom.code}.value`"
                          v-model="data_val[order_data.win_option_bottom.code]"
                          />
                          <span class="ms-2">{{ data.name }}</span>
                        </label>
                      </div>

                    </div>
                  </div>
                  <!-- 切段 -->
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ order_data.bottom_board_cut.name }}
                    </label>
                    <div class="col-sm-8">
                      <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                        :class="{ 'error': errors[`${order_data.bottom_board_cut.code}.option_value_id`] }">
                        <label :for="'top_Partition_cut' + data.id"
                          v-for="data in order_data.bottom_board_cut.option_values" :key="data.id">
                          <VeeField 
                            type="radio" 
                            :name="`${order_data.bottom_board_cut.code}.option_value_id`"
                            :value="data.id" 
                            class="form-check-input"
                            v-model="data_id[order_data.bottom_board_cut.code]"
                            @change="set_name(data,order_data.bottom_board_cut.code)"
                            :id="'top_Partition_cut' + data.id"
                            label="top_Partition" rules="required" />
                          <VeeField type="hidden" :name="`${order_data.bottom_board_cut.code}.name`"
                            :value="order_data.bottom_board_cut.name" />
                          <VeeField type="hidden" :name="`${order_data.bottom_board_cut.code}.option_id`"
                            :value="order_data.bottom_board_cut.id" />
                          <VeeField type="hidden" :name="`${order_data.bottom_board_cut.code}.option_code`"
                            :value="order_data.bottom_board_cut.code" />
                          <VeeField type="hidden" :name="`${order_data.bottom_board_cut.code}.type`"
                            :value="order_data.bottom_board_cut.type" />
                          <VeeField type="hidden" :name="`${order_data.bottom_board_cut.code}.value`"
                          v-model="data_val[order_data.bottom_board_cut.code]"
                          />
                          <span class="ms-2">{{ data.name }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <!-- 軌道 -->
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ doorType_track?.option_name }}
                      <i class="fas fa-question-circle"></i>
                      <div class="info_box">
                        {{  store.language_txt.order.helper_track}}
                      </div>
                    </label>
                    <div class="col-sm-8" v-if="doorType_track.option_group_suboption_values">
                      <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                        :class="{ 'error': errors[`${doorType_track.option_code}.option_value_id`] }">
                        <label :for="'bottom_track' + data?.option_value_id"
                          v-for="data in doorType_track.option_group_suboption_values" :key="data?.option_value?.id">
                          <VeeField type="radio"
                            :name="`${doorType_track.option_code}.option_value_id`"
                            v-model="data_id[doorType_track.option_code]" 
                            @change="set_name(data,doorType_track.option_code)"
                            :value="data.option_value_id"
                            class="form-check-input" :id="'bottom_track' + data?.option_value?.id" label="bottom_track"
                            rules="required" />
                          <VeeField type="hidden" :name="`${doorType_track.option_code}.name`"
                            :value="doorType_track.option_name" />
                          <VeeField type="hidden" :name="`${doorType_track.option_code}.option_id`"
                            :value="doorType_track.option_id" />
                          <VeeField type="hidden" :name="`${doorType_track.option_code}.option_code`"
                            :value="doorType_track.option_code" />
                          <VeeField type="hidden" :name="`${doorType_track.option_code}.type`"
                            :value="doorType_track.option_type" />
                          <VeeField type="hidden" :name="`${doorType_track.option_code}.value`"
                          v-model="data_val[doorType_track.option_code]"
                          />
                          <span class="ms-2">{{ data.name }}</span>
                        </label>
                      </div>

                    </div>
                  </div>   
                  <!-- 軌道顏色 -->
                  <div class="row mb-3" v-if="!hide_track_color">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ order_data.lower_track_color.name }}
                      <i class="fas fa-question-circle"></i>
                      <div class="info_box">
                        {{  store.language_txt.order.helper_track}}
                      </div>
                    </label>
                    <div class="col-sm-8">
                      <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                        :class="{ 'error': errors[`${order_data.lower_track_color.code}.option_value_id`] }">
                        <label :for="'bottom_track_color' + data.id"
                          v-for="data in order_data.lower_track_color.option_values" :key="data.id">
                          <VeeField 
                            type="radio"
                            :name="`${order_data.lower_track_color.code}.option_value_id`"
                            v-model="data_id[order_data.lower_track_color.code]" 
                            @change="set_name(data,order_data.lower_track_color.code)"
                            :value="data.id"
                            class="form-check-input" :id="'bottom_track_color' + data.id" :label="'bottom_track_color' + data.id"
                            rules="required" />
                          <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.name`"
                            :value="order_data.lower_track_color.name" />
                          <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.option_id`"
                            :value="order_data.lower_track_color.id" />
                          <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.option_code`"
                            :value="order_data.lower_track_color.code" />
                          <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.type`"
                            :value="order_data.lower_track_color.type" />
                          <VeeField type="hidden" :name="`${order_data.lower_track_color.code}.value`"
                          v-model="data_val[order_data.lower_track_color.code]"
                          />
                          <span class="ms-2">{{ data.name }}</span>
                        </label>
                      </div>

                    </div>
                  </div>                
                </div>
                <div class="col-md-6">
                  <!-- 種類圖片 -->
                  <div class="row mb-3" v-if="data_id[doorType_track.option_code] !== 2193">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    {{ doorType_track?.option_name }}
                  </label>
                  <div class="col-sm-8 max-img">
                    <img :src="track_img(0)" alt="">
                  </div>
                  </div>
                </div>
              </div>
              <hr>
              <!-- other -->
              <div class="col-md-6 col-12 row mb-3" v-if="is_folding_door">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ order_data.is_uplow_track_fixed.name }}
                      <i class="fas fa-question-circle"></i>
                      <div class="info_box">
                        **不固定為浮動式折門<br>
                        L型：門片固定於一側+有側板<br>
                        平面：門片固定於兩側+無側板<br>
                        不要底軸：浮動式折門
                      </div>
                    </label>
                    {{values[`${order_data.is_uplow_track_fixed.code}.value`]}}
                    <div class="col-sm-8">
                      <VeeField 
                        as="select" 
                        :name="`${order_data.is_uplow_track_fixed.code}.option_value_id`" 
                        id="track_fixed"
                        v-model="data_id[order_data.is_uplow_track_fixed.code]"  
                        @change="set_name(data,order_data.is_uplow_track_fixed.code)"
                        class="form-select"
                        :class="{ 'error': errors[`${order_data.is_uplow_track_fixed.code}.option_value_id`] }"
                        label="track_fixed" rules="required">
                        <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                        <option v-for="data in order_data.is_uplow_track_fixed.option_values" :key="data.id"
                          :value="data.id">
                          {{ data.name }}
                        </option>
                      </VeeField>
                      <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.name`"
                        :value="order_data.is_uplow_track_fixed.name" />
                      <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.option_id`"
                        :value="order_data.is_uplow_track_fixed.id" />
                      <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.option_code`"
                        :value="order_data.is_uplow_track_fixed.code" />
                      <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.type`"
                        :value="order_data.is_uplow_track_fixed.type" />
                      <VeeField type="hidden" :name="`${order_data.is_uplow_track_fixed.code}.value`"
                      v-model="data_val[order_data.is_uplow_track_fixed.code]"
                      />
                      <VeeErrorMessage class="error__label" :name="`${order_data.is_uplow_track_fixed.code}.option_value_id`" />
                    </div>
              </div>
              <div class="col-md-6 col-12 row mb-3" v-if="!is_folding_door">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ order_data.door_openclose.name }}
                      <i class="fas fa-question-circle"></i>
                      <div class="info_box">
                        {{ store.language_txt.order.helper_door_openclose}}
                      </div>
                    </label>
                    <div class="col-sm-8">
                      <VeeField as="select" :name="`${order_data.door_openclose.code}.option_value_id`" id="door_openclose"
                        class="form-select" :class="{ 'error': errors[`${order_data.door_openclose.code}.option_value_id`] }"
                        v-model="data_id[order_data.door_openclose.code]"
                        @change="set_name(data,order_data.door_openclose.code)"
                        label="door_openclose" rules="required">
                        <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                        <option v-for="data in order_data.door_openclose.option_values" :key="data.id" :value="data.id">
                          {{ data.name }}
                        </option>
                      </VeeField>
                      <VeeField type="hidden" :name="`${order_data.door_openclose.code}.name`"
                        :value="order_data.door_openclose.name" />
                      <VeeField type="hidden" :name="`${order_data.door_openclose.code}.option_id`"
                        :value="order_data.door_openclose.id" />
                      <VeeField type="hidden" :name="`${order_data.door_openclose.code}.option_code`"
                        :value="order_data.door_openclose.code" />
                      <VeeField type="hidden" :name="`${order_data.door_openclose.code}.type`"
                        :value="order_data.door_openclose.type" />
                      <VeeField type="hidden" :name="`${order_data.door_openclose.code}.value`"
                      v-model="data_val[order_data.door_openclose.code]"
                      />
                      <VeeErrorMessage class="error__label" :name="`${order_data.door_openclose.code}.option_value_id`" />
                    </div>
              </div>
              <div class="col-md-6 col-12 row mb-3">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      <span class="text-danger">*</span>
                      {{ order_data.track_width.name }}
                    </label>
                    <div class="col-sm-8">
                      <VeeField type="number" :name="`${order_data.track_width.code}.option_value_id`" id="track_width"
                        class="form-control" :class="{ 'error': errors[`${order_data.track_width.code}.option_value_id`] }"
                        v-model="data_val[order_data.track_width.code]"
                        label="track_width" rules="required">
                      </VeeField>
                      <VeeField type="hidden" :name="`${order_data.track_width.code}.name`"
                        :value="order_data.track_width.name" />
                      <VeeField type="hidden" :name="`${order_data.track_width.code}.option_id`"
                        :value="order_data.track_width.id" />
                      <VeeField type="hidden" :name="`${order_data.track_width.code}.option_code`"
                        :value="order_data.track_width.code" />
                      <VeeField type="hidden" :name="`${order_data.track_width.code}.type`"
                        :value="order_data.track_width.type" />
                      <VeeField type="hidden" :name="`${order_data.track_width.code}.value`"
                      v-model="data_val[order_data.track_width.code]"
                      />
                      <VeeErrorMessage class="error__label" :name="`${order_data.track_width.code}.option_value_id`" />
                    <label class="mt-2">
                      <VeeField type="checkbox"
                        :name="`${order_data.track_to_window_width.code}.option_values[0].value`"
                        v-model="data_val[order_data.track_to_window_width.code]" value="Y" class="form-check-input"
                         />
                      {{ order_data.track_to_window_width.name }}
                      <VeeField type="hidden" :name="`${order_data.track_to_window_width.code}.name`"
                        :value="order_data.track_to_window_width.name" />
                      <VeeField type="hidden" :name="`${order_data.track_to_window_width.code}.option_id`"
                        :value="order_data.track_to_window_width.id" />
                      <VeeField type="hidden" :name="`${order_data.track_to_window_width.code}.option_code`"
                        :value="order_data.track_to_window_width.code" />
                      <VeeField type="hidden" :name="`${order_data.track_to_window_width.code}.type`"
                        :value="order_data.track_to_window_width.type" />
                      <VeeField type="hidden" :name="`${order_data.track_to_window_width.code}.option_values[0].option_value_id`" value="0" />
                    </label>
                    </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="decorative" v-if="show_block && is_track">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              {{ store.language_txt.order.text_decorative_pane }}
              <i class="fas fa-info-circle" @click="show_info_img($event)">
                <div class="nav-img">
                  <img src="@/assets/images/decorative_info_img.jpg" alt="decorative_info_img">
                </div>
              </i>
            </h2>
            <div class="row flex-auto">
              <div class="col-md-12">
                <!-- 飾板 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2" for="">
                    <span class="text-danger">*</span>
                    {{order_data.decorative_pane_type.name}}
                  </label>
                  <div class="col-sm-10" :class="{ 'error': errors[`${order_data.decorative_pane_type.code}.option_value_id`] }">
                    <div class="picOption" v-for="data in order_data.decorative_pane_type.option_values" :key="data.id">
                      <VeeField type="radio" :id="'decorativeType' + data.id"
                        :name="`${order_data.decorative_pane_type.code}.option_value_id`"
                        v-model="data_id[order_data.decorative_pane_type.code]"
                        @change="set_name(data,order_data.decorative_pane_type.code)" 
                        :value="data.id"
                        label="decorativeType"
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.name`"
                        :value="order_data.decorative_pane_type.name" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.option_id`"
                        :value="order_data.decorative_pane_type.id" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.option_code`"
                        :value="order_data.decorative_pane_type.code" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.type`"
                        :value="order_data.decorative_pane_type.type" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_type.code}.value`"
                      v-model="data_val[order_data.decorative_pane_type.code]"
                         />
                      <label :for="'decorativeType' + data.id">
                        <img :src="data.thumb" :alt="data.name">
                      </label>
                      <div class="position-relative mb-3">
                        {{ data.name }}
                      </div>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.decorative_pane_type.code}.option_value_id`" />

                  </div>
                </div>
              </div>
              <div class="col-md-6 flex-auto" v-if="!is_none_decorative_pane && doorType_height">
                <!-- 飾板高度 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    {{doorType_height.option_name}}
                    <i class="fas fa-question-circle fs-xs"></i>
                        <div class="info_box">
                          {{ store.language_txt.order.helper_panel_height}}
                        </div>
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group">
                      <VeeField type="text" :name="`${doorType_height.option_code}.value`" class="form-control"
                        v-model="doorType_height_value" 
                        @keydown="clearInput"
                        disabled v-if="data_val[order_data.decorative_pane_height_manually.code] !== 'Y'" 
                      />
                      <VeeField  
                        v-else
                        type="number" 
                        :name="`${doorType_height.option_code}.value`"
                        @keydown="clearInput"
                        v-model="data_val[doorType_height.option_code]"  class="form-control"
                        />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.name`"
                        :value="doorType_height.option_name" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.option_id`"
                        :value="doorType_height.option_id" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.option_code`"
                        :value="doorType_height.option_code" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.type`"
                        :value="doorType_height.option_type" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.option_value_id`"
                        v-model="data_id[doorType_height.option_code]" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <div class="mt-2">
                        <VeeField type="checkbox"
                          :name="`${order_data.decorative_pane_height_manually.code}.option_values[0].value`"
                          v-model="data_val[order_data.decorative_pane_height_manually.code]" value="Y"
                          class="form-check-input" id="bottom_Partition_Cut" />
                        <VeeField type="hidden" :name="`${order_data.decorative_pane_height_manually.code}.name`"
                          :value="order_data.decorative_pane_height_manually.name" />
                        <VeeField type="hidden" :name="`${order_data.decorative_pane_height_manually.code}.option_id`"
                          :value="order_data.decorative_pane_height_manually.id" />
                        <VeeField type="hidden" :name="`${order_data.decorative_pane_height_manually.code}.option_code`"
                          :value="order_data.decorative_pane_height_manually.code" />
                        <VeeField type="hidden" :name="`${order_data.decorative_pane_height_manually.code}.type`"
                          :value="order_data.decorative_pane_height_manually.type" />
                        <VeeField type="hidden"
                          :name="`${order_data.decorative_pane_height_manually.code}.option_values[0]option_value_id`"
                          value="0" />
                      <label class="ms-2">{{order_data.decorative_pane_height_manually.option_values[0].name}}</label>
                    </div>
                  </div>
                </div>
                <!-- 轉角片 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.decorative_pane_corner_piece.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField 
                        as="select" 
                        :class="{ 'error': errors[`${order_data.decorative_pane_corner_piece.code}.option_value_id`] }"
                        :name="`${order_data.decorative_pane_corner_piece.code}.option_value_id`"
                        v-model="data_id[order_data.decorative_pane_corner_piece.code]"
                        @change="set_name(data,order_data.decorative_pane_corner_piece.code)"
                        id="decorative_pane_corner_piece"
                        rules="required"
                        class="form-select">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.decorative_pane_corner_piece.option_values" :key="data.id"
                        :value="data.id">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece.code}.name`"
                      :value="order_data.decorative_pane_corner_piece.name" />
                    <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece.code}.option_id`"
                      :value="order_data.decorative_pane_corner_piece.id" />
                    <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece.code}.option_code`"
                      :value="order_data.decorative_pane_corner_piece.code" />
                    <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece.code}.type`"
                      :value="order_data.decorative_pane_corner_piece.type" />
                    <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece.code}.value`"
                    v-model="data_val[order_data.decorative_pane_corner_piece.code]"/>
                    <VeeErrorMessage class="error__label" :name="`${order_data.decorative_pane_corner_piece.code}.option_value_id`" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 flex-auto">
                <div class="row mb-3" v-if="!is_none_decorative_pane && doorType_depth">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger"></span>
                    {{doorType_depth?.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group">
                      <VeeField 
                        type="text" 
                        :name="`${doorType_depth.code}.value`" 
                        class="form-control"
                        v-model="doorType_depth_value" 
                        disabled 
                        v-if="data_val[order_data.decorative_pane_top_depth_manually.code] !== 'Y'" />
                      <VeeField 
                        v-else
                        type="number" 
                        :name="`${doorType_depth.code}.value`"
                        @keydown="clearInput"
                        v-model="data_val[doorType_depth.code]" 
                        class="form-control"
                         />
                      <VeeField type="hidden" :name="`${doorType_depth.code}.name`" :value="doorType_depth?.name" />
                      <VeeField type="hidden" :name="`${doorType_depth.code}.option_id`":value="doorType_depth?.id" />
                      <VeeField type="hidden" :name="`${doorType_depth.code}.option_code`" :value="doorType_depth?.code" />
                      <VeeField type="hidden" :name="`${doorType_depth.code}.type`" :value="doorType_depth?.type" />
                      <VeeField type="hidden" :name="`${doorType_depth.code}.option_value_id`"
                        v-model="data_id[doorType_depth.code]" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <div class="mt-2">
                      <VeeField type="checkbox"
                          :name="`${order_data.decorative_pane_top_depth_manually.code}.option_values[0].value`"
                          v-model="data_val[order_data.decorative_pane_top_depth_manually.code]" 
                          value="Y"
                          class="form-check-input" id="bottom_Partition_Cut" />
                        <VeeField type="hidden" :name="`${order_data.decorative_pane_top_depth_manually.code}.name`"
                          :value="order_data.decorative_pane_top_depth_manually.name" />
                        <VeeField type="hidden" :name="`${order_data.decorative_pane_top_depth_manually.code}.option_id`"
                          :value="order_data.decorative_pane_top_depth_manually.id" />
                        <VeeField type="hidden" :name="`${order_data.decorative_pane_top_depth_manually.code}.option_code`"
                          :value="order_data.decorative_pane_top_depth_manually.code" />
                        <VeeField type="hidden" :name="`${order_data.decorative_pane_top_depth_manually.code}.type`"
                          :value="order_data.decorative_pane_top_depth_manually.type" />
                        <VeeField type="hidden"
                          :name="`${order_data.decorative_pane_top_depth_manually.code}.option_values[0]option_value_id`"
                          value="0" />
                      <label class="ms-2">{{order_data.decorative_pane_top_depth_manually.option_values[0].name}}</label>
                    </div>
                  </div>
                </div>
                <!-- 轉角片深度 -->
                <div class="row mb-3" v-if="!is_none_return">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{order_data.decorative_pane_corner_piece_depth.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group">
                      <VeeField  
                        type="number" 
                        :class="{ 'error': errors[`${order_data.decorative_pane_corner_piece_depth.code}.value`] }"
                        :name="`${order_data.decorative_pane_corner_piece_depth.code}.value`"
                        v-model="data_val[order_data.decorative_pane_corner_piece_depth.code]"  
                        class="form-control"
                        rules="required"
                        />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece_depth.code}.name`"
                        :value="order_data.decorative_pane_corner_piece_depth.name" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece_depth.code}.option_id`"
                        :value="order_data.decorative_pane_corner_piece_depth.id" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece_depth.code}.option_code`"
                        :value="order_data.decorative_pane_corner_piece_depth.code" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece_depth.code}.type`"
                        :value="order_data.decorative_pane_corner_piece_depth.type" />
                      <VeeField type="hidden" :name="`${order_data.decorative_pane_corner_piece_depth.code}.option_value_id`"
                        value="0" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <VeeErrorMessage class="error__label"
                      :name="`${order_data.decorative_pane_corner_piece_depth.code}.value`" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="T-POST" v-if="show_block && !is_track">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              {{ store.language_txt.order.text_t_post}}
            </h2>
            <div class="row flex-auto">
              <!-- T型式 -->
              <div class="col-md-12" v-if="t_post_data">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2" for="">
                    <span class="text-danger">*</span>
                    {{t_post_data.name}}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      {{ store.language_txt.order.text_vertical_horizontal}}
                    </div>
                  </label>
                  <div class="col-sm-10">
                    <div class="d-flex align-items-center  p-2 pt-0"
                      :class="{ 'error': errors[`${t_post_data.code}.option_value_id`] }">
                      <div v-for="data in t_post_data.option_values" :key="data.id">
                        <div class="picOption" v-if="show_t_post(data)">
                          <VeeField type="radio" :id="'t_post' + data.id"
                            :name="`${t_post_data.code}.option_value_id`" :value="data.id"
                            v-model="data_id[t_post_data.code]"
                            @change="set_name(data,t_post_data.code),select_T_post()"
                            label="t_post" rules="required" />
                          <VeeField type="hidden" :name="`${t_post_data.code}.name`"  :key="t_post_data.code + 'name'"
                            :value="t_post_data.name" />
                          <VeeField type="hidden" :name="`${t_post_data.code}.option_id`"  :key="t_post_data.code + 'option_id'"
                            :value="t_post_data.id" />
                          <VeeField type="hidden" :name="`${t_post_data.code}.option_code`"  :key="t_post_data.code + 'option_code'"
                            :value="t_post_data.code" />
                          <VeeField type="hidden" :name="`${t_post_data.code}.type`"  :key="t_post_data.code + 'type'"
                            :value="t_post_data.type" />
                          <VeeField type="hidden" :name="`${t_post_data.code}.value`"  :key="t_post_data.code + 'value'"
                          v-model="data_val[t_post_data.code]"
                            />
                          <label :for="'t_post' + data.id">
                            <img :src="data.thumb" :alt="data.name">
                          </label>
                          <p class="mb-3">
                            {{ data.name }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${t_post_data.code}.option_value_id`" />
                    
                  </div>
                </div>
              </div>
              <!-- T位置 -->
              <div class="d-none">
                <VeeField type="hidden" :name="`${order_data.t_post_json.code}.name`"
                  :value="order_data.t_post_json.name" />
                <VeeField type="hidden" :name="`${order_data.t_post_json.code}.option_id`"
                  :value="order_data.t_post_json.id" />
                <VeeField type="hidden" :name="`${order_data.t_post_json.code}.option_code`"
                  :value="order_data.t_post_json.code" />
                <VeeField type="hidden" :name="`${order_data.t_post_json.code}.type`"
                  :value="order_data.t_post_json.type" />
                <VeeField type="hidden" :name="`${order_data.t_post_json.code}.option_value_id`" value="0" />
              </div>
              <div class="col-md-12 row" v-if="t_post_json">
                <div class="col-md-6 d-flex mb-3 position-relative" v-for="(item,idx) in t_post_json.t_post_height"
                  :key="'T-POST_position' + idx +1">
                  <label class="label-set col-form-label col-sm-4 pe-3" :for="'T-POST_position' + idx+1">
                    <span class="text-danger">*</span>
                    T{{ idx+1 }}{{ store.language_txt.order.text_position}}
                  </label>
                  <div class="col-xxl-8 col pe-3">
                    <VeeField type="number"
                    @keydown="clearInput"
                     :name="`${order_data.t_post_json.code}.value.t_post_height[${idx}].t_post_value`"
                      :id="'T-POST_position' + idx +1" 
                      class="form-control" 
                      v-model="item.t_post_value" 
                      rules="required"
                      :disabled="!!t_post_json.t_post_average"
                      :class="{ 'error': errors[`${order_data.t_post_json.code}.value.t_post_height[${idx}].t_post_value`] }"
                      label="T-POST_position" />
                    <VeeErrorMessage class="error__label"
                      :name="`${order_data.t_post_json.code}.value.height[${idx}].t_post_value`" />
                  </div>
                  <div class="d-flex align-items-center">
                    <button type="button" :disabled="show_corner && idx === 0" @click="del_json(order_data.t_post_json.code,idx)">
                      <i class="fas fa-times  close_btn btn-right-2"></i>
                    </button>
                  </div>
                </div>
              </div>
              <!-- 垂直T均分 -->
              <div class="col-md-6 d-flex align-items-center mt-3" v-if="t_post_json.t_post_height.length > 0">
                <div class="col-4 label-set pe-2"></div>
                <div class="col-8">
                  <VeeField type="checkbox" :name="`${order_data.t_post_json.code}.value.t_post_average`"
                    v-model="t_post_json.t_post_average"
                    class="form-check-input" value="Y" />
                  <label for=""
                    class="col-8 label-set text-start ps-2">{{ store.language_txt.order.text_divide_equally}}</label>
                </div>
              </div>
              <div class="col-12 text-center my-4">
                <i class="fa-solid fa-circle-plus fs-3 add_btn" @click="add_json(order_data.t_post_json.code,t_post_obj)"></i>
              </div>
              <hr v-if="show_corner">
              <!-- 轉角窗 -->
              <div class="d-none" v-if="show_corner && corner_angle_data.length > 0">
                  <VeeField type="hidden" :name="`${order_data.corner_angle.code}.name`"
                    :value="order_data.corner_angle.name" />
                  <VeeField type="hidden" :name="`${order_data.corner_angle.code}.option_id`"
                    :value="order_data.corner_angle.id" />
                  <VeeField type="hidden" :name="`${order_data.corner_angle.code}.option_code`"
                    :value="order_data.corner_angle.code" />
                  <VeeField type="hidden" :name="`${order_data.corner_angle.code}.type`"
                    :value="order_data.corner_angle.type" />
                  <VeeField type="hidden" :name="`${order_data.corner_angle.code}.option_value_id`"
                    value="0" />
                </div>
                <div class="row col-md-8 col-12 mb-3" v-for="(data,idx) in corner_angle_data" :key="`corner_angle${idx +1}`" v-if="show_corner">
                  <span class="col-sm-3" v-if="idx == 0">
                    {{store.language_txt.order.text_corner_shutters}}
                    <div class="col-12 text-center mt-4" v-if="show_corner">
                      <button type="button" class="add_text_btn" @click="add_json(order_data.corner_angle.code,corner_angle_obj)">
                        <i class="fa-solid fa-circle-plus fs-4 add_btn"></i>
                        <span>{{order_data.corner_angle.name.replace(':num',corner_angle_data.length + 1) }}</span>
                      </button>
                    </div>
                  </span>
                  <span class="col-sm-3" v-else></span>
                  <div class="col-sm-8 col-12 row position-relative ">
                    <!-- 角度 -->
                    <label class="label-set col-form-label col-sm-4" :for="order_data.corner_angle.name">
                      <span class="text-danger">*</span>
                      C{{idx + 1}}{{ order_data.corner_angle.name}}
                    </label>
                    <div class="col-sm-8 position-relative mb-3">
                      <VeeField type="number" :name="`${order_data.corner_angle.code}.value[${idx}].corner_angle_value`"
                        :class="{ 'error': errors[`${order_data.corner_angle.code}.value[${idx}].corner_angle_value`] }"
                        @keydown="clearInput"
                        v-model="data.corner_angle_value"
                        :id="`${order_data.corner_angle.name}${idx + 1}`" class="form-control"
                        :label="`corner_angle${idx + 1}`"
                        rules="required"/>
                        <VeeErrorMessage class="error__label" :name="`${order_data.corner_angle.code}.value[${idx}].corner_angle_value`" />
                    </div>
                    <!-- 位置 -->
                    <label class="label-set col-form-label col-sm-4">
                      <span class="text-danger">*</span>
                      C{{idx + 1}}位置
                    </label>
                    <div class="col-sm-8 position-relative mb-3">
                      <div class="input-group">
                      <VeeField type="number" :name="`${order_data.corner_angle.code}.value[${idx}].position_value`"
                        :class="{ 'error': errors[`${order_data.corner_angle.code}.value[${idx}].position_value`] }"
                        @keydown="clearInput"
                        v-model="data.position_value"
                         class="form-control"
                        :label="`position_value${idx + 1}`"
                        rules="required"/>
                        <span class="input-group-text">mm</span>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${order_data.corner_angle.code}.value[${idx}].position_value`" />
                    </div>
                    <!-- item1 -->
                    <label class="label-set col-form-label col-sm-4" v-if="idx === 0">
                      <span class="text-danger">*</span>
                      item {{idx+1}}
                    </label>
                    <div class="col-sm-8 position-relative mb-3 " v-if="idx === 0">
                      <div class="input-group">
                      <VeeField type="number" :name="`${order_data.corner_angle.code}.value[${idx}].corner_angle_item1`"
                        :class="{ 'error': errors[`${order_data.corner_angle.code}.value[${idx}].corner_angle_item1`] }"
                        @keydown="clearInput"
                        v-model="data.corner_angle_item1"
                         class="form-control"
                        :label="`position_value${idx + 1}`"
                        rules="required"/>
                      <span class="input-group-text">mm</span>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${order_data.corner_angle.code}.value[${idx}].corner_angle_item1`" />
                    </div>
                    <!-- item -->
                    <label class="label-set col-form-label col-sm-4">
                      <span class="text-danger">*</span>
                      item {{idx+2}}
                    </label>
                    <div class="col-sm-8 position-relative mb-3 ">
                      <div class="input-group">
                        <VeeField type="number" :name="`${order_data.corner_angle.code}.value[${idx}].corner_angle_item`"
                        :class="{ 'error': errors[`${order_data.corner_angle.code}.value[${idx}].corner_angle_item`] }"
                        @keydown="clearInput"
                        v-model="data.corner_angle_item"
                         class="form-control"
                        :label="`item${idx + 1}`"
                        rules="required"/>
                      <span class="input-group-text">mm</span>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${order_data.corner_angle.code}.value[${idx}].corner_angle_item`" />
                    </div>
                  </div>
                   <div class="col position-relative ">
                    <i class="fas fa-times close_btn close_btn_2" @click="del_json(order_data.corner_angle.code,idx)"></i>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>
      <section id="auxiliary" v-if="show_block">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              {{ order_data.auxiliaries.name }}
              <i class="fas fa-info-circle" @click="show_info_img($event)">
                <div class="nav-img">
                  <img src="@/assets/images/auxiliary_info_img.jpg" alt="auxiliary_info_img">
                </div>
              </i>
            </h2>
            <div class="flex-auto">
              <div class="d-none" v-if="auxiliary_data.length > 0">
                <VeeField type="hidden" :name="`${order_data.auxiliaries.code}.name`"
                  :value="order_data.auxiliaries.name" />
                <VeeField type="hidden" :name="`${order_data.auxiliaries.code}.option_id`"
                  :value="order_data.auxiliaries.id" />
                <VeeField type="hidden" :name="`${order_data.auxiliaries.code}.option_code`"
                  :value="order_data.auxiliaries.code" />
                <VeeField type="hidden" :name="`${order_data.auxiliaries.code}.type`"
                  :value="order_data.auxiliaries.type" />
                <VeeField type="hidden" :name="`${order_data.auxiliaries.code}.option_value_id`"
                  value="0" />
              </div>
              <div class="row position-relative border-bottom p-2" v-for="(item, idx) in auxiliary_data"
                :key="`title` + idx">
                <div>
                  <p class="col-lg-1  text-lg-end">{{order_data.auxiliaries.name}} {{ idx + 1 }}</p>
                </div>
                <div class="col-md-6 flex-auto">
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " for="">
                      {{ order_data.auxiliary_length.name }}
                    </label>
                    <div class="col-sm-8">
                      <VeeField as="select" :name="`${order_data.auxiliaries.code}.value[${idx}].auxiliary_length`"
                        :id="`auxiliary_length${idx + 1 }`" v-model="item.auxiliary_length"
                        class="form-select" rules="required">
                        <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                        <option v-for="data in order_data.auxiliary_length.option_values" :key="data.id"
                          :value="data.name">
                          {{ data.name }}
                        </option>
                      </VeeField>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 " :for="`auxiliary_width${idx + 1 }`">
                      {{order_data.auxiliary_width.name}}
                    </label>
                    <div class="col-sm-8">
                      <div class="input-group">
                        <VeeField type="number" 
                        @keydown="clearInput"
                        rules="required"
                        :name="`${order_data.auxiliaries.code}.value[${idx}].auxiliary_width`"
                          :id="`auxiliary_width${idx + 1 }`" v-model="item.auxiliary_width"
                          class="form-control" />
                        <span class="input-group-text">mm</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 flex-auto">
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 "
                      :for="`auxiliary_height${idx +1}`">{{ store.language_txt.order.text_height}}</label>
                    <div class="col-sm-8">
                      <div class="input-group">
                        <VeeField type="number" 
                        @keydown="clearInput"
                        rules="required"
                          :name="`${order_data.auxiliaries.code}.value[${idx}].auxiliary_height`"
                          :id="`auxiliary_height${idx +1}`" v-model="item.auxiliary_height"
                          class="form-control" />
                        <span class="input-group-text">mm</span>
                      </div>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="label-set col-form-label col-sm-4 "
                      :for="`auxiliary_count${ idx +1}`">{{ store.language_txt.order.text_quantity}}</label>
                    <div class="col-sm-8">
                      <VeeField type="number" 
                      @keydown="clearInput"
                      rules="required"
                        :name="`${order_data.auxiliaries.code}.value[${idx}].auxiliary_quantity`"
                        v-model="item.auxiliary_quantity" class="form-control" />
                    </div>
                  </div>
                </div>
                <i class="fas fa-times  close_btn btn-right" @click="del_json(order_data.auxiliaries.code,idx)"></i>
              </div>
              <div class="col-12 text-center mt-4">
                <i class="fa-solid fa-circle-plus fs-3 add_btn" @click="add_json(order_data.auxiliaries.code,auxiliary_obj)"></i>
              </div>

            </div>
          </div>
        </div>
      </section>
      <section id="other" v-if="show_block">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">{{ store.language_txt.order.text_other}}</h2>
            <div class="row flex-auto">
              <div class="col-md-6 mb-3" v-if="show_multilayer">
                <!-- 多層窗 -->
                <div class="row mb-3" v-if="show_multilayer">
                  <span class="col-sm-2">{{store.language_txt.order.text_double_hung}}</span>
                  <label class="label-set col-form-label col-sm-4" for="layers">
                    <span class="text-danger">*</span>
                    {{ store.language_txt.order.text_layers}}
                    <!-- {{order_data.layer_json.name}} -->
                  </label>
                  <!-- 層數 -->
                  <div class="col-sm-6">
                    <VeeField 
                      type="number" 
                      @keydown="clearInput"
                      class="form-control " 
                      :name="`${order_data.layers_json.code}.value.layer`"
                      :class="{ 'error': errors[`${order_data.layers_json.code}.value.layer`] }" 
                      v-model="data_val[order_data.layers_json.code].layer"
                      id="layers" rules="required" />
                    <VeeField type="hidden" :name="`${order_data.layers_json.code}.name`" :value="order_data.layers_json.name" />
                    <VeeField type="hidden" :name="`${order_data.layers_json.code}.option_id`" :value="order_data.layers_json.id" />
                    <VeeField type="hidden" :name="`${order_data.layers_json.code}.option_code`" :value="order_data.layers_json.code" />
                    <VeeField type="hidden" :name="`${order_data.layers_json.code}.type`" :value="order_data.layers_json.type" />
                    <VeeField type="hidden" :name="`${order_data.layers_json.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.layers_json.code}.value.layer`" />
                  </div>
                </div>
                <!-- 水平T -->
                <div class="row mb-3" v-for="(data,idx) in layers_value" :key="'T-POST-horizontal-' + idx" v-if="show_multilayer">
                  <span class="col-sm-2"></span>
                  <label class="label-set col-form-label col-sm-4" :for="'T_POST_horizontal' + idx">
                    <span class="text-danger">*</span>
                    {{ store.language_txt.order.text_vertical}}T{{idx+1}}
                  </label>
                  <div class="col-sm-6">
                    <VeeField 
                      type="number" 
                      @keydown="clearInput"
                      class="form-control" 
                      rules="required" 
                      v-model="layers_value[idx]"
                      :class="{ 'error': errors[`${order_data.layers_json.code}.value.layer_value[${idx}]`] }"
                      :name="`${order_data.layers_json.code}.value.layer_value[${idx}]`" 
                      :id="'layers_json.value' + idx" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.layers_json.code}.value.layer_value[${idx}]`" />
                  </div>
                </div>
                <hr v-if="show_multilayer">
              </div>
              <!-- 窗簾盒 -->
              <div class="col-md-6 mb-3" v-if="show_pelmet">
                <div class="row mb-3">
                  <span class="col-sm-2">{{store.language_txt.order.text_valance_box}}</span>
                  <label class="label-set col-form-label col-sm-4" for="">
                    <span class="text-danger">*</span>
                    {{order_data.win_valance_box_plans.name}}
                  </label>
                  <div class="col-sm-6">
                    <div class="d-flex align-items-center  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.win_valance_box_plans.code}.option_value_id`] }">
                      <div class="picOption" v-for="data in order_data.win_valance_box_plans.option_values">
                        <VeeField type="radio" :id="'pelmet' + data.id"
                          :name="`${order_data.win_valance_box_plans.code}.option_value_id`"
                          v-model="data_id[order_data.win_valance_box_plans.code]"
                          @change="set_name(data,order_data.win_valance_box_plans.code)"
                          :value="data.id" label="pelmet"
                          rules="required" />
                        <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.name`"
                          :value="order_data.win_valance_box_plans.name" />
                        <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.option_id`"
                          :value="order_data.win_valance_box_plans.id" />
                        <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.option_code`"
                          :value="order_data.win_valance_box_plans.code" />
                        <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.type`"
                          :value="order_data.win_valance_box_plans.type" />
                        <VeeField type="hidden" :name="`${order_data.win_valance_box_plans.code}.value`"
                        v-model="data_val[order_data.win_valance_box_plans.code]"
                         />
                        <label :for="'pelmet' + data.id">
                          <img :src="data.thumb" :alt="data.name">
                        </label>
                        <p>
                          {{ data.name }}
                        </p>
                      </div>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_valance_box_plans.code}.option_value_id`" />
                  </div>
                </div>
                <!-- A -->
                <div class="row mb-3" v-if="show_pelmet_plan_A && data_id[order_data.win_valance_box_plans.code]">
                    <span class="col-sm-2"></span>
                  <label class="label-set col-form-label col-sm-4" for="pelmet_A_width">
                    <span class="text-danger">*</span>
                    <!-- A方案 -->
                    {{order_data.win_final_width.name}}
                  </label>
                  <div class="col-sm-6">
                    <div class="input-group" :class="{ 'error': errors[`${order_data.win_final_width.code}.value`] }">
                      <VeeField type="number"  @keydown="clearInput" class="form-control " :name="`${order_data.win_final_width.code}.value`"
                        v-model="data_val[order_data.win_final_width.code]" id="pelmet_A_width"
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.win_final_width.code}.name`"
                        :value="order_data.win_final_width.name" />
                      <VeeField type="hidden" :name="`${order_data.win_final_width.code}.option_id`"
                        :value="order_data.win_final_width.id" />
                      <VeeField type="hidden" :name="`${order_data.win_final_width.code}.option_code`"
                        :value="order_data.win_final_width.code" />
                      <VeeField type="hidden" :name="`${order_data.win_final_width.code}.type`"
                        :value="order_data.win_final_width.type" />
                      <VeeField type="hidden" :name="`${order_data.win_final_width.code}.option_value_id`" value="0" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_final_width.code}.value`" />
                  </div>
                </div>
                <div class="row mb-3" v-if="show_pelmet_plan_A && data_id[order_data.win_valance_box_plans.code]">
                  <span class="col-sm-2"></span>
                  <label class="label-set col-form-label col-sm-4" for="pelmet_A_hight">
                    <!-- A方案 -->
                    <span class="text-danger">*</span>
                    {{order_data.win_final_height.name}}
                  </label>
                  <div class="col-sm-6">
                    <div class="input-group"  :class="{ 'error': errors[`${order_data.win_final_height.code}.value`] }">
                      <VeeField type="number"  @keydown="clearInput" class="form-control " :name="`${order_data.win_final_height.code}.value`"
                        v-model="data_val[order_data.win_final_height.code]" id="pelmet_A_hight" />
                      <VeeField type="hidden" :name="`${order_data.win_final_height.code}.name`"
                        :value="order_data.win_final_height.name" />
                      <VeeField type="hidden" :name="`${order_data.win_final_height.code}.option_id`"
                        :value="order_data.win_final_height.id" />
                      <VeeField type="hidden" :name="`${order_data.win_final_height.code}.option_code`"
                        :value="order_data.win_final_height.code" />
                      <VeeField type="hidden" :name="`${order_data.win_final_height.code}.type`"
                        :value="order_data.win_final_height.type" />
                      <VeeField type="hidden" :name="`${order_data.win_final_height.code}.option_value_id`" value="0" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${order_data.win_final_height.code}.value`" />
                  </div>
                </div>
                <!-- B -->
                <div class="row mb-3" v-if="!show_pelmet_plan_A && data_id[order_data.win_valance_box_plans.code]">
                  <label class="label-set col-form-label col-sm-4" for="pelmet_B">
                    <span class="text-danger">*</span>
                    {{order_data.winbox_horizontal_t_position.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group" :class="{ 'error': errors[`${order_data.winbox_horizontal_t_position.code}.value`] }">
                      <VeeField type="number"  @keydown="clearInput" class="form-control " :name="`${order_data.winbox_horizontal_t_position.code}.value`"
                        id="pelmet_B" v-model="data_val[order_data.winbox_horizontal_t_position.code]"
                        rules="required" />
                      <VeeField type="hidden" :name="`${order_data.winbox_horizontal_t_position.code}.name`"
                        :value="order_data.winbox_horizontal_t_position.name" />
                      <VeeField type="hidden" :name="`${order_data.winbox_horizontal_t_position.code}.option_id`"
                        :value="order_data.winbox_horizontal_t_position.id" />
                      <VeeField type="hidden" :name="`${order_data.winbox_horizontal_t_position.code}.option_code`"
                        :value="order_data.winbox_horizontal_t_position.code" />
                      <VeeField type="hidden" :name="`${order_data.winbox_horizontal_t_position.code}.type`"
                        :value="order_data.winbox_horizontal_t_position.type" />
                      <VeeField type="hidden" :name="`${order_data.winbox_horizontal_t_position.code}.option_value_id`"
                        value="0" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <VeeErrorMessage class="error__label" name="winbox_horizontal_t_position.value" />
                  </div>
                </div>
              </div>
              <!-- 圖片 -->
              <div class="col-md-12 row mt-3">
                <label class="label-set col-form-label col-sm-2" for="pelmet_A_width">
                  {{order_data.attached_images.name}}
                </label>
                <div class="d-none" v-if="attached_images.length > 0">
                  <VeeField type="hidden" :name="`${order_data.attached_images.code}.name`" :value="order_data.attached_images.name" />
                  <VeeField type="hidden" :name="`${order_data.attached_images.code}.option_id`" :value="order_data.attached_images.id" />
                  <VeeField type="hidden" :name="`${order_data.attached_images.code}.option_code`"
                    :value="order_data.attached_images.code" />
                  <VeeField type="hidden" :name="`${order_data.attached_images.code}.type`" :value="order_data.attached_images.type" />
                </div>
                <div class="col-sm-10 mb-3 row">
                  <div class="col-sm-6 special_img mb-3" v-for="(item,idx) in attached_images">
                    <div class="special_img_box"
                      :class="{'no-img':!item.image && !item.value},{'error':errors[`${order_data.attached_images.code}.option_values[${idx}].file`]}">
                      <VeeField type="file" :name="`${order_data.attached_images.code}.option_values[${idx}].file`" class="upload-img"
                        accept="image/png,image/jpeg,image/jpg"
                        @change="Preview_img(values.attached_images.option_values[idx].file,idx)" />
                      <VeeField type="hidden" :name="`${order_data.attached_images.code}.option_values[${idx}].value`"
                        v-model="item.value" />
                      <img :src="show_Preview_img(item,$imgUrl(item.value))" alt="">
                    </div>
                    <div class="special_img_close">
                      <i class="fas fa-times close_btn none_position"
                        @click="del_json(order_data.attached_images.code,idx)"></i>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`attached_images.option_values[${idx}].file`" />
                  </div>
                  <div class="col-12 text-center mt-4">
                    <i class="fa-solid fa-circle-plus fs-3 add_btn" @click="add_json(order_data.attached_images.code,attached_images_obj)"></i>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      <section id="note" v-if="show_block">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">{{ store.language_txt.order.text_option_section_note}}</h2>
            <div class="row flex-auto col-lg col-12">
              <div class="col-12">
                <div class="row">
                  <label class="label-set col-form-label col-sm-2 " for="">
                    {{ store.language_txt.order.text_option_section_note}}
                  </label>
                  <div class="col-sm-10">
                    <VeeField v-if="data_val.note !== 'null'" as="textarea" v-model="data_val.note"
                      class="form-control " name="note" id="note" rows="5" />
                    <VeeField v-else as="textarea" class="form-control " name="note" id="note" rows="5" />
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
              <nuxt-link :to="`/order-list/item?id=${order_id}`"
                class="btn sent_go me-4">{{ store.language_txt.default?.text_back}}</nuxt-link>
              <button type="submit" class="btn sent_go" v-if="!edit_mode">{{button_text()}}</button>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  </VeeForm>

</template>

<script setup>

import Compressor from 'compressorjs'; // 壓縮圖片套件
import debounce from 'lodash/debounce'  // watch優化(延遲/防抖)
import { useForm } from 'vee-validate';  //驗證套件
const { validate,validateField,errors, } = useForm();//驗證套件

const route = useRoute()
const router = useRouter()
const store = useStore()
const order_id = route.query.id 
const edit_mode = ref(false)
const show_alart_box = ref(false)



const order_form = ref()
const order_data = ref();
const design_data = ref({
  design: null,
  type: null,
});
const material_color = ref()
const doorType_outerFrame = ref()
const lock_color = ref([])
const handle_color = ref([])
const doorType_track = ref();
const doorType_height = ref()
const show_not_warranty = ref(false)
const data_id = ref({
 
})
const data_val = ref({
 
})


// method------------------------------------------------>

// 檢視模式
const examine_mode = ()=>{
  nextTick(()=>{
      edit_mode.value = true
      $('.main_form input').prop('disabled',true)
      $('.main_form select').prop('disabled',true)
      $('.main_form textarea').prop('disabled',true)
      $('.main_form button').hide()
      $('.main_form .close_btn').hide() 
      $('.main_form .add_btn').hide()
  })
}

// 顯示主要材質
const show_main_material = (item)=>{ 
  const order_material = route.query.main  // 訂單材質
  if(order_material){
    return item.code == order_material
  }else{
    return true
  }
}

// 右側nav 收合
const step_box = ref(true);

// 右側active
const currentItem = ref("");

// 右側導覽
const link_items = ref({
  track:[
    { id: "material", title: store.language_txt.order.text_option_section_material },
    { id: "design", title: store.language_txt.order.text_option_section_style },
    { id: "setting", title: store.language_txt.order.text_option_section_basicsetting },
    { id: "doorSet", title: store.language_txt.order.text_option_section_door },
    { id: "partitio", title: store.language_txt.order.text_option_section_dividers },
    { id: "track_style", title: store.language_txt.order.text_track_style },
    { id: "decorative", title: store.language_txt.order.text_decorative_pane },
    { id: "auxiliary", title: store.language_txt.order.text_option_section_packer },
    { id: "other", title: store.language_txt.order.text_option_section_other},
    { id: "note", title: store.language_txt.order.text_option_section_note },
  ],
  windows:[
    { id: "material", title: store.language_txt.order.text_option_section_material },
    { id: "design", title: store.language_txt.order.text_option_section_style },
    { id: "setting", title: store.language_txt.order.text_option_section_basicsetting },
    { id: "outerFrame", title: store.language_txt.order.text_option_section_frame },
    { id: "doorSet", title: store.language_txt.order.text_option_section_door },
    { id: "partitio", title: store.language_txt.order.text_option_section_dividers },
    { id: "T-POST", title: store.language_txt.order.text_option_section_tpost },
    { id: "auxiliary", title: store.language_txt.order.text_option_section_packer },
    { id: "other", title:store.language_txt.order.text_option_section_other },
    { id: "note", title: store.language_txt.order.text_option_section_note },
  ]
});

// 切換右側導覽
const nav_links_state = computed(()=>{
  return is_track.value? link_items.value.track: link_items.value.windows
})

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

// 右側欄scroll位置
const handleScroll = () => {
  let found = false;
  nav_links_state.value.forEach((item) => {
    const section = document.getElementById(item.id);
    if (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2 + 50;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition <= sectionTop + sectionHeight
      ) {
        currentItem.value = item.id;
        found = true;
      }
    }
  });
  if (!found) currentItem.value = "";
};


const remove_style = ()=>{
  data_id.value[selected_win_style.value] = ""
  // 重置表單
  // 窗型類型驗證沒辦法被刪除
  // 所以強制重置並賦予材質的id(值)&value值
  order_form.value.resetForm();
  order_form.value.setFieldValue(`${order_data.value.win_material?.code}.option_value_id`,data_id.value[order_data.value.win_material?.code]);
  order_form.value.setFieldValue(`${order_data.value.win_material?.code}.value`,data_val.value[order_data.value.win_material?.code]);
  
}



// 窗型類型選項顯示
const show_win_stdwin_subtype = (id) =>{
  const pelmet = 2012
  if(is_aluminum.value){
    return id !== pelmet
  }else{
    return true
  }
}

const set_win_stdwin_subtype = (value) =>{
  // 如果包含標準窗（2367），則移除多層（2010）和轉角（2011）窗型
  if (value.includes(2367)) {
    const filteredValue = value.filter(item => 
      item === 2367 || (item !== 2010 && item !== 2011)
    )
    
    // 更新 data_id
    data_id.value[order_data.value.win_stdwin_subtype.code] = filteredValue;
    
    // 同時更新 order_form 的表單值
    order_form.value.setFieldValue("win_stdwin_subtype.option_value_id", filteredValue);
  } else {
    // 如果不包含標準窗型，直接賦值
    data_id.value[order_data.value.win_stdwin_subtype.code] = value;
  }
}


// 設置選項value的值
const set_name = (item,code)=>{
  if(item?.name){
    data_val.value[code] = item.name
  }else{
    const val = order_data.value[code].option_values.find(item => item.id === data_id.value[code]).name
    data_val.value[code] = val
  }
}
// 設置選項value的自訂名稱值
const set_custom_name = (item,code)=>{
  if(item.option_id !== 1008){
    data_val.value[code] = item.code + " " + show_custom_name(item)
  }else{
    data_val.value[code] = show_custom_name(item)
  }
}

// 按鈕文字儲存/新增切換
const button_text = ()=>{
  const product_id = route.query.product
  if(product_id){
    return store.language_txt.default?.text_save
  }else{
    return store.language_txt.default?.text_add
  }
}

// number 去除非數字
const clearInput = (e)=>{
  let key = e.key
  if(key === 'e' || key === 'E' || key === '+' || key === '-'){
    e.returnValue =false
    return false
  }
  return true
}

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


// 驗證葉片組數量與寬度
const validateWidth = () => {
  const width = +data_val.value[order_data.value.win_width.code];
  const bladeNumbers = +data_val.value[order_data.value.blade_numbers.code];
  const maxWidth = width / bladeNumbers;

  if (!bladeNumbers) return store.language_txt.order?.text_required; // 必填檢查

  if (!is_track.value) return true; // 非軌道類型直接通過

  const exceededMessage = store.language_txt.order?.helper_selected_number_of_blades_exceeded;
  const isChecked = data_id.value[order_data.value.confirm_width_limit]
  

  // 摺疊門不小於228不大於508
  if (is_folding_door.value && (maxWidth <= 228 || maxWidth >= 508)) {
    return exceededMessage; 
  }

  // 推拉門不小於228大於1092可作但沒有保固(需確認無保固checkbox)
  if (!is_folding_door.value) {
    if (maxWidth <= 228) return exceededMessage
    if (maxWidth >= 1092) {
      show_not_warranty.value = true;
      return isChecked? true:true
    }
  }
  
  show_not_warranty.value = false;
  return true; // 其他條件通過
};


// 顯示語言自訂名字(外框&顏色)
const show_custom_name = (item)=>{
  // 檢查 translations 是否存在且具有所需的語言
  const customName = item.custom_translations && item.custom_translations[store.language];
  const defaultName = item.name
  return customName || defaultName
}

// 中隔高度計算
const calculatePartitioPosition = (idx)=>{
  const total_height = +data_val.value[order_data.value.win_height.code]
  const partitio = Divider_rail_data.value
  if(idx == 0){
    partitio[0].division_height = (total_height / 2)
  }else{
    partitio[idx].division_height = (total_height - partitio[idx - 1].division_height )/2 + partitio[idx - 1].division_height
  }
}

// 軌道樣式圖片
const track_img = (top_track)=>{
  let selected_id 
  if(top_track){ 
    selected_id = data_id.value[order_data.value.upper_track_color?.code] //上軌道顏色
    return order_data.value.upper_track_color.option_values.find(item => item.id == selected_id)?.thumb
  }else{
    selected_id = data_id.value[doorType_track.value.option_code] //下軌道種類
    return doorType_track.value.option_group_suboption_values.find(item => item.option_value_id == selected_id)?.thumb
  }
}


// 選擇T柱型式起碼添加一個T位置，選擇無則取消
const select_T_post = ()=>{
  const t_post = t_post_json.value
  if(!is_none_post.value && t_post.t_post_height.length <= 0){
    add_json(order_data.value.t_post_json.code, t_post_obj.value)
  }else if(is_none_post.value){
    data_val.value[order_data.value.t_post_json?.code].t_post_height = []
  }
}



// 拉桿分段obj
const lever_segmentation_obj = ref({
  lever_value:""
})

// 中隔obj
const Divider_rail_obj =  ref({ 
    division_height:"", 
    division_center:"",
    division_no_move:"",
    above_handle_division:"",
    above_handle_division_center:"",
    beneath_handle_division:"",
    beneath_handle_division_center:""
})

// 垂直T-obj
const t_post_obj = ref({
  t_post_value:""
})
// 水平T -obj
const layer_obj = ref({
  layer_value:""
})
// 轉角窗角度 - obj
const corner_angle_obj = ref([
  {corner_angle_value:"",position_value:"",corner_angle_item1:"",corner_angle_item:""}
])

// 輔料obj
const auxiliary_obj = ref([
    { auxiliary_width: "", auxiliary_height: "", auxiliary_length: "", auxiliary_quantity: "" },
]);

// 圖片obj
const attached_images_obj = ref({
  image:""
})

// 預覽圖片
const Preview_img = (file,idx)=>{
  // 壓縮---------------------------
  const imageCompressor = new Compressor(file, {
    quality: 0.8, // 設置圖像質量
    maxWidth: 1920, // 最大寬度
    maxHeight: 1920, // 最大高度
    success(result) {
      // result 是壓縮後的圖像文件，可以做後續處理

      const reader = new FileReader();
      reader.readAsDataURL(result);
      reader.onload = () => {
        // 將壓縮後的圖像數據設置到 compressedImage 變數中，以在模板中顯示
        console.log(attached_images.value);
        
        attached_images.value[idx].image = reader.result;
        console.log(attached_images.value);
        
      };
    },
    error(err) {
      console.error('圖像壓縮錯誤：', err.message);
    }
  });
}

// 顯示舊圖或新圖(預覽圖)
const show_Preview_img = (item,old_img) =>{
  if(item.image){
    return item.image
  }else{
    return item.href
  }
}

const show_t_post = (data)=>{
  if(show_corner.value){
    const none = [2209,2348,10030]
    return !none.includes(data.id);
  }else{
    return true
  }
}

// 總軌道寬與窗同寬
const track_to_window_width = ()=>{
  const is_checked = data_val.value[order_data.value?.track_to_window_width?.code] == 'Y'
  if(is_checked){
    data_val.value[order_data.value.track_width.code] = data_val.value[order_data.value.win_width.code]
    $('#track_width').prop('disabled',true)
  }else{
    $('#track_width').prop('disabled',false)
  }
}

// JSON資料增加
const add_json = (code,data)=>{
  if (!Array.isArray(data_val.value[code]) && code !== 't_post_json') {
    data_val.value[code] = [];
  }
  if(code == 't_post_json'){
    if(!data_val.value[code].t_post_height){
      data_val.value[code].t_post_height = []
      data_val.value[code].t_post_height.push({...data})
    }else{
      data_val.value[code].t_post_height.push({...data})
    }
    console.log(data_val.value[code])
  }else{
    data_val.value[code].push({...data})
  }
}
// JSON資料刪除
const del_json = (code,idx) =>{
  if(code == 't_post_json'){
    data_val.value[code].t_post_height.splice(idx,1)
  }else{
    data_val.value[code].splice(idx,1)
  }
}

const show_info_img = (e) => {
  const currentNavImg = e.currentTarget.querySelector('.nav-img');
 
  currentNavImg.classList.toggle('show-img');  // 顯示目標圖片
 
  document.querySelectorAll('.nav-img').forEach(function (navImg) {   //移除其他圖片
    if (navImg !== currentNavImg) {
      navImg.classList.remove('show-img');
    }
  });
}


// *狀態或資料computed-------------------------------------------->

// 材質code
const material_code = computed(()=>{
  const code = order_data.value.win_material.code
  return order_data.value[code].option_values.find(item => item.id == data_id.value[code])?.code
})

// 款式子選項name(因兩款option_code不一致)
const selected_win_style = computed(() => {
  const type_id = data_id.value[design_data.value.design?.option_code]
    if(type_id == 2005){
      return design_data.value.type.find(item => item.option_id == 1004)?.option_code
    }else if(type_id == 2004){
      return design_data.value.type.find(item => item.option_id == 1003)?.option_code
    }
})

// 顯示各個選項
const show_block = computed(()=>{
  return data_id.value[selected_win_style.value] && design_data.value.type
  // return false
  
})

// 全鋁
const is_aluminum = computed (()=>{
  return data_id.value[order_data.value.win_material.code] == 2002
})

// 實木
const is_wood = computed (()=>{
  return data_id.value[order_data.value.win_material.code] == 2003
})
// 軌道
const is_track = computed(() => {
  // 2005軌道 2008摺疊門 2009 推拉門
  return data_id.value[design_data.value.design?.option_code] == 2005 && data_id.value[selected_win_style.value] == 2009 || data_id.value[selected_win_style.value] == 2008;
})

// 折疊門
const is_folding_door = computed(() => {
  return data_id.value[selected_win_style.value] == 2008;    // 2008摺疊門
})

// 異型窗
const is_special_windows = computed(()=>{
  return data_id.value[selected_win_style.value] == 2007  // 2007異型窗
})

// 顯示轉角窗提示
const show_corner_hint = computed (()=>{
  const data = data_id.value[order_data.value.win_stdwin_subtype.code]
  if(!is_track.value && data){
    return data_id.value[order_data.value.win_stdwin_subtype.code]?.find(item=> item == 2011) //轉角窗id 2011
  }
})

// 是無拉桿?
const is_none_win_lever = computed(() => {
  const win_lever = data_id.value[win_lever_data.value.code]
  return win_lever == 2095 || win_lever == 2344
});


// 無把手
const is_none_handle = computed (()=>{
  const handle_type = data_id.value[order_data.value.door_handle_type.code]
  return handle_type  == 2215 || !handle_type
})
// 沒鎖
const is_none_lock = computed(()=>{
  const lock_type = data_id.value[door_lock_type_data.value.code]
  return lock_type == 2214 || !lock_type
})
// 鎖type1 
const is_lock_type1 = computed(()=>{
  const is_type1 =  data_id.value[door_lock_type_data.value.code] == 2112
  if(is_type1){
    data_id.value[order_data.value.lock_pre_locked.code] = 2374
  }
  return is_type1
})
// 葉片組數量是否<=1
const blade_numbers_1 = computed(()=>{
  const blade_numbers = +data_val.value[order_data.value.blade_numbers.code]
  return blade_numbers <=1
})

// 無下軌道
const hide_track_color = computed(()=>{
  const value = data_id.value[doorType_track.value.option_code]
  return value == 2193 || value == 2192
})

// 無飾板
const is_none_decorative_pane = computed(()=>{
  return data_id.value[order_data.value.decorative_pane_type.code] == 2165
})

// 無T柱
const is_none_post = computed(()=>{
  const t_post = data_id.value[t_post_data.value?.code]
  return t_post== 2209 || t_post == 2348 || t_post == 10030
})

// 需要鑽孔
const is_pre_drilled_hole = computed(()=>{
  return data_id.value[order_data.value.sldwood_pre_drilled_hole.code] == 2342
})


// 窗型類型是否包含多層窗
const show_multilayer = computed(()=>{
  const id = 2010
  const data = data_id.value[order_data.value.win_stdwin_subtype.code]
  if(!is_track.value && data){
    return data_id.value[order_data.value.win_stdwin_subtype.code].includes(id) && !is_special_windows.value && !is_track.value
  }
})

// 窗型類型是否包含轉角窗
const show_corner = computed(()=>{
  const id = 2011
  const data = data_id.value[order_data.value.win_stdwin_subtype.code]
  if(!is_track.value && data){
    const match = data_id.value[order_data.value.win_stdwin_subtype.code].includes(id) && !is_special_windows.value && !is_track.value
    // 轉角窗一定要包含T1 一個
    if(t_post_json.value.t_post_height.length < 1 && t_post_json.value && match){
      add_json(order_data.value.t_post_json.code, t_post_obj.value)
    }
    if(match && corner_angle_data.value.length < 1){
      add_json(order_data.value.corner_angle.code,corner_angle_obj.value)
    }
    if(match && is_none_post.value){
      data_id.value[t_post_data.value?.code] = ""
    }
    return match
  }
})

// 窗型類型是否包含窗簾盒
const show_pelmet = computed(()=>{
  const id = 2012
  const data = data_id.value[order_data.value.win_stdwin_subtype.code]
  if(!is_track.value && data){
    return data_id.value[order_data.value.win_stdwin_subtype.code].includes(id) && !is_special_windows.value && !is_track.value
  }
})

// 顯示窗簾盒A或B
const show_pelmet_plan_A = computed(()=>{
  const id = 2187
  return data_id.value[order_data.value.win_valance_box_plans.code] == id && !is_special_windows.value
})

// wsms_data
const wsms_data = computed(() => {
  if (is_track.value) {
    return order_data.value[order_data.value.wsms.code].option_values.filter(item => item.id == '2016')
  } else {
    return order_data.value[order_data.value.wsms.code].option_values
  }
});

// 拉桿
const win_lever_data = computed(()=>{
  if(is_aluminum.value){
    return order_data.value.allalu_tilt_rod
  }else if(is_wood.value){
    return order_data.value.sldwood_tilt_rod
  }else{
    return order_data.value.win_lever
  }
})

// 葉片尺寸資料
const blade_size_data = computed(()=>{
  // 全鋁沒有size_3
  if(!is_aluminum.value){
    return order_data.value.blade_size
  }else{
    return order_data.value.allalu_louvre_size
  }
})

// 吸鐵
const magnetic_data = computed(()=>{
  if(is_aluminum.value){
    return order_data.value.allalu_catcher
  }else if(is_wood.value){
    return order_data.value.sldwood_catcher
  }else{
    return order_data.value.magnetic_catcher
  }
})

// 鉸練顏色
const hinge_color_data = computed(()=>{
  if(!is_aluminum.value){
    return order_data.value.hinge_color
  }else{
    return order_data.value.allalu_hnge_type
  }
})

// 鎖的類型
const door_lock_type_data = computed(()=>{
  if(!is_aluminum.value){
    return order_data.value.door_lock_type
  }else{
    return order_data.value.allalu_lock_type
  }
})

// 拉桿分段需求
const lever_segmentation_note_data = computed(()=>{
  return data_val.value[order_data?.value.lever_segmentation_note?.code]
})

// 中隔
const Divider_rail_data = computed(()=>{
  return data_val.value[order_data.value?.dividers_json?.code]
})

// T柱型式
const t_post_data = computed(() => {
  if(doorType_outerFrame.value){

    const select_outer_frame = doorType_outerFrame.value.option_values?.find(
      item => item.id === data_id.value[doorType_outerFrame.value.code]
    );
    const special_option_keyword = select_outer_frame?.name?.includes('CF') || select_outer_frame?.name?.includes('DF');
    const special_option_id = [2209,2211,2348,2350];
  
    let base_data;
    if (is_aluminum.value) {
      base_data = order_data.value.allalu_t_post;
    } else if (is_wood.value) {
      base_data = order_data.value.sldwood_t_post;
    } else {
      base_data = order_data.value.plsalu_t_post;
    }
  
    if (special_option_keyword) {
      return {
        ...base_data,
        option_values: base_data.option_values.filter(item => special_option_id.includes(item.id))
      };
    }
  
    return base_data;
  }
  
});


// 垂直T
const t_post_json = computed(()=>{
  return data_val.value[order_data.value?.t_post_json?.code]
})

// 水平T
const layers_value = computed(()=>{
  return data_val.value[order_data.value.layers_json?.code].layer_value
})

// 轉角窗角度
const corner_angle_data = computed(()=>{
  return data_val.value[order_data.value.corner_angle?.code]
})

// 輔料
const auxiliary_data = computed(()=>{
  return data_val.value[order_data.value.auxiliaries?.code]
})

// 不要轉角片
const is_none_return = computed(()=>{
  const value = data_id.value[order_data.value.decorative_pane_corner_piece?.code]
  return value == 2177 || value == "" 
})

// 飾板高度值
const doorType_height_value  = computed(() => {
  // 設置id
  const TOP_PARTITION_ID = 2370; //有頂板軌道
  const PLANE_TYPE_ID = 2163; //飾板型式(平面)
  const PATTERN_TYPE_ID = 2164;  //飾板型式(花紋)
  const VALUE_32 = 2194;  // 32mm
  const VALUE_53 = 2195;  // 53mm
  const VALUE_140 = 2196; // 140mm
  const VALUE_150 = 2197; // 150mm
  const is_im = data_id.value[order_data.value.imom.code] == 2013  // IM內裝
  
  // 判斷條件
  const hasTopPartition = data_id.value[order_data.value.win_option_top_track.code] == TOP_PARTITION_ID;
  const isPlane = data_id.value[order_data.value.decorative_pane_type.code] == PLANE_TYPE_ID;
  const isPattern = data_id.value[order_data.value.decorative_pane_type.code] == PATTERN_TYPE_ID;
  
  if (!doorType_height.value) return null;

  const data = doorType_height.value.option_group_suboption_values;

  // 找選項value
  const findOptionName = (valueId) => {
    const option = data.find(item => item.option_value_id == valueId);
    return option ? option.name : null;
  }

  if (is_folding_door.value) {
    if (is_im) {
      return findOptionName(hasTopPartition ? VALUE_53 : VALUE_32);
    } else if (isPlane) {
      return findOptionName(VALUE_150);
    } else if (isPattern) {
      return findOptionName(VALUE_140);
    }
  } else {
    return findOptionName(isPlane ? VALUE_150 : VALUE_140);
  }
});

// 飾板深度
const doorType_depth = computed(() => {
  if(design_data.value.design && order_data.value){
    if(is_folding_door.value){
      return order_data.value.decorative_pane_top_depth_folding_door
    }else{
      return order_data.value.decorative_pane_top_depth_sliding_door
    }
  }
});

//  飾板深度值
const doorType_depth_value = computed(() => {
  const blade_size = data_id.value[blade_size_data.value.code] == 2107 ||  data_id.value[blade_size_data.value.code] == 2306 ;  // 刀片尺寸 == 4.5
  const value_105 = 2173
  const value_115 = 2174
  const value_normal_105 = 2368
  const value_normal_115 = 2369

  if(doorType_depth.value){
    const data = doorType_depth.value.option_values
    if(is_folding_door.value){
      return blade_size? data.find(item => item.id == value_115).name:data.find(item => item.id == value_105).name
    }else{
       return blade_size? data.find(item => item.id == value_normal_115).name:data.find(item => item.id == value_normal_105).name
    }
  }
});

// 圖片資料
const attached_images = computed(()=>{
  return data_val.value[order_data.value.attached_images.code]
})

//葉片組數量備註
const doorSet_comment = computed(() => {
  if(is_track.value){
    if(is_folding_door.value){
      return store.language_txt.order?.helper_folding_width_limit
    }else{
      return store.language_txt.order?.helper_track_bypass_t_post_width_limit
    }
  }
});

// 中隔備註
const partitio_note = computed(()=>{
  return is_track.value?  store.language_txt.order?.helper_tracktype_wsms:store.language_txt.order?.helper_wintype_wsms
})

// 顯示拉桿分段需求
const show_add_lever = computed(()=>{
  const height = data_val.value[order_data.value.win_height.code] //高度
  const partitio_length = 0  //中隔arr長度
  if(height > 1800){
    return false
  }else if(partitio_length > 0){
    return false
  }
  return true
})


// WATCH----------------------------------------------->

// 寬度
watch(() => data_val.value[order_data.value?.win_width?.code],debounce(async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal && oldVal !== "") {
      order_form.value.validateField(`${order_data.value?.blade_numbers?.code}.value`);  //觸發葉片組驗證
      track_to_window_width() // 軌道總寬與窗同寬
    }
  }, 300)
);

// 葉片組結構value改成大寫
watch(() => data_val.value[order_data.value?.blade_arrangement?.code], debounce((newVal, oldVal) => {
  if (newVal) {
    data_val.value[order_data.value?.blade_arrangement?.code] = newVal.toUpperCase();
  }
},0),{ immediate: true })

// 中隔置中計算
watch(() => Divider_rail_data.value, (newPartitio, oldPartitio) => {
  const total_height = +data_val.value[order_data.value.win_height.code]
    newPartitio.forEach((item, idx) => {
      // 組合
      if (item.division_center === "Y") {
          calculatePartitioPosition(idx)
      }
      // 以上分段
      if (item.above_handle_division_center === "Y") {
        item.above_handle_division = (total_height - +item.division_height) / 2 + +item.division_height;
      }

      // 以下分段
      if (item.beneath_handle_division_center === "Y") {
        item.beneath_handle_division = +item.division_height / 2;
      }
      
    });
  }, {
    deep: true // 深度監視
  });


// 高度變化
watch(() => data_val.value[order_data.value?.win_height?.code], debounce((newVal, oldVal) => {
  if (newVal > 1800 && Divider_rail_data.value.length < 1) {
    add_json(order_data.value.dividers_json.code,Divider_rail_obj.value)
  }
  if(Divider_rail_data.value?.length < 1){
    // 根據新的高度調整所有中隔的位置
    Divider_rail_data.value.forEach((item, idx) => {
      if (item.division_center === "Y" && newVal > 0) {
        calculatePartitioPosition(idx);
      }
    });
  }
},500),{ immediate: true })

// 軌道總寬與窗同寬
watch(()=>data_val.value[order_data.value?.track_to_window_width?.code],debounce((newVal,oldVal)=>{
  track_to_window_width()
},100),{ immediate: true })


// 更換摺疊門or推拉門觸發下軌道種類&頂板深度、高度api資料
watch(()=> data_id.value[selected_win_style.value],debounce((newVal, oldVal) => {
  if (newVal && newVal !== oldVal && is_track.value) {
    get_door_track() 
  }
},100),{immediate: true})

// 水平T數量
watch(() => data_val.value[order_data.value?.layers_json?.code]?.layer, (newVal, oldVal) => {
  if(!data_val.value[order_data.value.layers_json.code].layer_value){
    data_val.value[order_data.value.layers_json.code].layer_value = []
  }

  if (newVal > 0) {
    data_val.value[order_data.value.layers_json.code].layer_value.length = newVal - 1;
  } else {
    data_val.value[order_data.value.layers_json.code].layer_value = []
  }
},{
    deep: true // 深度監視
})

// 垂直T 均分
const calculate_T_POST = (idx)=>{
  const width = +data_val.value[order_data.value?.win_width?.code]
  const t_post = t_post_json.value.t_post_height
  if(idx == 0){
    t_post[0].t_post_value = Math.floor(width / (t_post.length + 1) )
  }else{
    t_post[idx].t_post_value = Math.floor(t_post[0].t_post_value + t_post[idx - 1].t_post_value)
  }
  
}
// 垂直T 均分
watch(() => t_post_json.value, (newVal, oldVal) => {
  const checked =  newVal.t_post_average 
  if(!!checked){
    newVal.t_post_height.map((item,idx)=>{
      calculate_T_POST(idx)
    })
  }
  }, {
    deep: true // 深度監視
});


// API ------------------------------------------------>
const get_order_data = async()=>{
  const url = `${store.baseUrl}api/v2/catalog/options/list?lang=${store.language}&limit=0`
  const data = await store.get_api(url)
  order_data.value = data.data

  // 把所有選項的code賦予空值，綁定v-model雙向控制
  Object.values(order_data.value).forEach(item=>{
    data_id.value[item.code] = ""
    data_val.value[item.code] = ""
  })
  // json
  data_val.value[order_data.value.lever_segmentation_note.code] = []   //拉桿分段 
  data_val.value[order_data.value.dividers_json.code] = []    //中隔
  data_val.value[order_data.value.auxiliaries.code] = []  //輔料
  data_val.value[order_data.value.t_post_json.code] = {t_post_average:"",t_post_height:[]}  //垂直T
  data_val.value[order_data.value.layers_json.code] = {layer:"",value:[]}  //水平T
  data_val.value[order_data.value.corner_angle.code] = []   // 轉角窗角度
  // 多選checkbox
  // data_id.value[order_data.value.win_stdwin_subtype.code] = []   //類型窗
  // 圖片
  data_val.value[order_data.value.attached_images.code] = []
}


const get_design_data = async (id) => {
  await order_form.value.resetForm();  // 重置表單
  data_id.value[order_data.value.win_material.code] = id
  set_name(0,order_data.value.win_material.code)
  design_data.value = {}
  material_color.value = []
  design_data.value.type = []
  if(!order_id){
    data_id.value[order_data.value.win_stdwin_subtype.code] = []
  }
  const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=${store.language}&equal_option_value_ids=${id}`
  const data = await store.get_api(url)
  console.log(data)
  design_data.value.design = data.option_group_suboptions.win_type
  get_material_color()

  // 窗型/軌道型子選項資料
  if (design_data.value.design.option_group_suboption_values) {
    // 跑迴圈抓個別資料
    const design_type  = design_data.value.design.option_group_suboption_values.map(async(item) => {
      const url_2 = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=${store.language}&equal_option_value_ids=${id},${item.option_value_id}`
      try {
        const requests = await fetch(url_2,{
          headers:{
            "Authorization": "Bearer " + store.userData.jwtToken
        }
        })
        if(requests.ok){
          const data = await requests.json()
          
          // 外框(窗型才有) (2004 = 窗型)
          if(item.option_value_id == 2004){
            get_outer_frame()
          }
          // 窗型跟軌道型子選項
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
  default_val()
};

// 默認首選
const default_val = ()=>{
  // 共用
  data_id.value[order_data.value.outer_frame_sides.code] = 2217;  // 外框邊數
  data_id.value[order_data.value.outer_frame_gasket_thickness.code] = 2202;  // 墊片厚度
  data_id.value[order_data.value.door_handle_type.code] = 2215;  // 無把手
  
  if(is_aluminum.value){
    data_id.value[door_lock_type_data.value.code] = 10027          // 鎖
    data_id.value[magnetic_data.value.code] = 2313
    data_id.value[hinge_color_data.value.code] = 10028	
  }else if(is_wood.value){
    data_id.value[door_lock_type_data.value.code] = 2214            // 鎖
    data_id.value[magnetic_data.value.code] = 2347                  // 吸鐵
    data_id.value[hinge_color_data.value.code] = 2100         // 絞鍊
  }else{
    data_id.value[door_lock_type_data.value.code] = 2214            // 鎖
    data_id.value[magnetic_data.value.code] = 2101                  // 吸鐵
    data_id.value[hinge_color_data.value.code] = 2100         // 絞鍊
  }
  // 一次性設定名稱
  [
    order_data.value.outer_frame_sides.code,
    order_data.value.outer_frame_gasket_thickness.code,
    order_data.value.door_handle_type.code,
    door_lock_type_data.value.code,
    magnetic_data.value.code,
    hinge_color_data.value.code
  ].forEach(code => set_name(0, code));
}

// 材質顏色
const get_material_color = async ()=>{
  const code = material_code.value + '_color' //取的材質的code來抓對應的材質顏色
  const url = `${store.baseUrl}api/v2/dealers/option/list?locale=${store.language}`
  const data = await store.get_api(url)
  const colors = Object.values(data.data).find(item => item.code == code)
  if(colors){
    material_color.value = colors
  }else{
    alert('該材質顏色未授權')
  }
}
// 外框
const get_outer_frame = async ()=>{
  const code = material_code.value + '_win_frame' //取的材質的code來抓對應的材質顏色
  const url = `${store.baseUrl}api/v2/dealers/option/list?locale=${store.language}`
  const data = await store.get_api(url)
  console.log(data);
  
  const outer_frames = Object.values(data.data).find(item => item.code == code)
  if(outer_frames){
    doorType_outerFrame.value = Object.values(data.data).find(item => item.code == code)
  }else{
    alert('該材質外框未授權')
  }
}
// 把手顏色
const get_handle_color = async (e) => {
  if (!e?.target?.value) {
    return;
  }
  const selectedId = e.target.value;
  handle_color.value = []
  const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=${store.language}&equal_option_value_ids=${selectedId}`
  const data = await store.get_api(url)
  if(!data.error){
    const handleColorValue = Object.keys(data.option_group_suboptions)
      .filter(key => key.startsWith('door_handle_color'))
      .map(key => data.option_group_suboptions[key].option_group_suboption_values)
      .find(value => value !== undefined);

    if (handleColorValue) {
      handle_color.value = handleColorValue;
    }
    // handle_color.value = Object.values(data.option_group_suboptions).flatMap(suboption => suboption.option_group_suboption_values);

    
  }
};
// 鎖顏色
const get_lock_color = async (e) => {
  const selectedId = e.target.value;
  lock_color.value = []
  const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=${store.language}&equal_option_value_ids=${selectedId}`;
  const data = await store.get_api(url)
  if(!data.error){
    // lock_color.value = data.option_group_suboptions.door_lock_color.option_group_suboption_values 
    const lockColorValue = Object.keys(data.option_group_suboptions)
      .filter(key => key.startsWith('door_lock_color'))
      .map(key => data.option_group_suboptions[key].option_group_suboption_values)
      .find(value => value !== undefined);

    if (lockColorValue) {
        lock_color.value = lockColorValue;
    }
  }
};
// 下軌道顏色
const get_door_track = async () => {
  const design = data_id.value[selected_win_style.value]
  const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=${store.language}&equal_option_value_ids=${design}`;
  const data = await store.get_api(url)
  if(!data.error){
    doorType_height.value = data.option_group_suboptions.decorative_pane_height
    doorType_track.value = data.option_group_suboptions.door_down_track;
  }
};

// 訂單資料
const get_product_data = async () => {
  const product_id = route.query.product;  // 商品ID
  const order_id = route.query.id;         // 訂單ID
  const view = route.query.view            //檢視
  

  if (order_id && product_id) {
    const url = `${store.baseUrl}api/v2/sales/orders/info?locale=${store.language}&equal_id=${order_id}`;
    const data = await store.get_api(url);
    const order = data.order_products.find(item => item.id == product_id);  // 查找商品資料

    const handle_type = order_data.value.door_handle_type.code;
    const lock_type = door_lock_type_data.code;

    // 處理商品選項
    Object.keys(order.order_product_options).forEach(key => {
      const option = order.order_product_options[key];

      // 更新 data_id
      data_id.value[key] = option.type === 'checkbox'? option.option_values.map(item => item.option_value_id):option.option_value_id;

      // 處理選項值類型
      if(option.type == 'checkbox'){
        data_val.value[key] = option.option_values[0].value
      }else if(option.type == 'json'){
        data_val.value[key] = JSON.parse(option.value)
      }else if(option.type == 'images'){
        data_val.value[key] = option.option_values
      }else{
        data_val.value[key] = option.value
      }

      // 把手和鎖的顏色
      if (key === handle_type) {
        get_handle_color(data_id.value[handle_type]);
      } else if (key === lock_type) {
        get_lock_color(data_id.value[lock_type]);
      }
    });

    // 更新數量與備註
    data_val.value.quantity = order.quantity;
    data_val.value.note = order.note;
    
    
    // 執行API獲取款式數據
    await get_design_data(data_id.value[order_data.value.win_material.code]);
    
    const stdwin_type = data_id.value[order_data.value.win_stdwin_subtype.code]
    order_form.value.setFieldValue("win_stdwin_subtype.option_value_id", stdwin_type);
    
    // 不可編輯
    const order_state = data.status_code 
    if(view){
      examine_mode()
    }else{
      switch(order_state) {
        case 'Draft':
          return
        case 'Pending':
          store.is_dealer? null:examine_mode()
          return
        default:
          examine_mode()
      }
    }
  }
};



// submit-----------------------------------------------

// 顯示驗證錯誤訊息
const show_errors = (errors) => {
  const errorKeys = Object.keys(errors);

  // 檢查欄位是否有包含在errors
  const matchedKeys = errorKeys.map(errorKey => {
    const keyBase = errorKey.split('.')[0]; // 只擷取code
    const match = Object.keys(order_data.value).find(itemKey => order_data.value[itemKey].code === keyBase);

    // 確保找到匹配的 keyBase 或者 keyBase 是 'quantity'
    if (match || keyBase === 'quantity') {
      return {
        option: order_data.value[keyBase]?.name || store.language_txt.order.text_quantity,
        msg: errors[errorKey]
      };
    }
  }).filter(Boolean); // 過濾 undefined 項目

  if (matchedKeys.length > 4) {
    return store.language_txt.order.text_fields_need_to_be_confirmed.replace(':number', matchedKeys.length); // 數量大於4顯示數量
  } else if (matchedKeys.length > 0) {
    const formattedErrors = matchedKeys.map(item => `<div>${item.option}：${item.msg}</div>`); // 小於則顯示哪邊錯誤
    return formattedErrors.join(''); // 轉字串
  } else {
    show_alart_box.value = false; // 都沒有則關掉
  }
};



// 未通過驗證
const onInvalidSubmit = ({ values, errors, results }) =>{
  if(errors){
    console.log(errors);
    
    show_alart_box.value = true
  }else if(edit_mode.value !== true){
    onSubmit()
  }
}
// 通過驗證
const onSubmit = async(values) => {
  await store.token_validation();  //驗證token
  const order_id = route.query.id   //訂單ID
  const product_id = route.query.product  //商品ID
  const quantity = values.quantity
  const note = values.note || ""
  const sqm = +values.win_width.value * values.win_height.value / 1000000
  delete values.quantity
  delete values.note

  // 將values轉成陣列並加入id
  const arr_values = Object.keys(values).map((key, idx) => {
    const key_id = key  // 保留key值，後續使用
    return {
        ...values[key],
        order_id,
        key_id
    }
  });

  // 重組
  const new_values = arr_values.reduce((new_obj, item) => {
    const key = item.key_id // 保留key值
    delete item.key_id;  // 原資料的刪除key_id
    const is_json = item.type == 'json'
    const is_checkbox = item.type == 'checkbox'
    const is_image = item.type == 'images'

    if (is_json) {
      item.value = JSON.stringify(item.value) //type是json則轉json格式
    } else if (is_checkbox) {
        if(item.option_value_id) { 
          //多選checkbox 篩選以選擇的id的原資料
          const filteredValues = order_data.value[item.option_code].option_values.filter(option => 
            item.option_value_id.includes(option.id)
          );
          // 重定義資料格式
          const data = filteredValues.map(item => {
            return {
              option_value_id:item.id,
              value:item.name
            }
          })
          item.option_values = data
          delete item.option_value_id
        }
    } else if(is_image){
        // 圖片非必填，所以只保留有value(舊圖)或是新圖，都沒有則跳過
        if(item.option_values){
          item.option_values = item.option_values.filter(item => item.file?.size || item.value)
        }
        if(!item.option_values || item.option_values.length <= 0 ) {
          return new_obj;
        }
    }
    if(!item.type){
      return new_obj;
    }
    
    new_obj[key] = item  // 把處理後的資料 加到新物件中
    
    return new_obj;
  }, {});


  const submit_data = {
    order_id:order_id,
    material:material_code.value,
    name:new_values.win_material.value + new_values.win_type.value + new_values[selected_win_style.value].value,
    quantity,
    note,
    sqm,
    order_product_options:new_values
  }
  if(product_id){
    submit_data.id = product_id
  }
  console.log(submit_data);
  await store.add_product(submit_data)
  router.push(`/order-list/item?id=${order_id}`)
};


store.show_loading(true)
onMounted(async() => {
  window.addEventListener("scroll", handleScroll); //監聽側邊欄目前位置
  await get_order_data()
  await get_product_data()
  store.show_loading(false)
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});


</script>

