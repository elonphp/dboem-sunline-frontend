<template>
  <div class="links" :class="{'links-anime':!step_box}" v-if="!!order_fill_out_id.designType">
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

  <VeeForm @submit="onSubmit" @invalid-submit="onInvalidSubmit" v-slot="{ errors,values }">
    <div class="alart_box" v-if="show_alart_box">
      <i class="fas fa-exclamation-circle me-2"></i>
      <i class="fas fa-times" @click="show_alart_box = false,pleace_input_height = false"></i>
      <span>{{show_errors_txt(errors_count(errors))}}</span>
    </div>
    
    <div class="main_form" v-if="!!order_data && material">
      <section id="material">
        <div class="container container-original">
          <div class="block block1 flex-wrap">
            <h2 class="title">
              {{ store.language_txt.order.text_material }}
              <VeeErrorMessage class="error__label" :name="`${material.code}.value`" />
            </h2>
            <div class="d-flex justify-content-around flex-auto" :class="{ 'error': errors[`${material.code}.value`] }">
              <div class="material_chose" v-for="(item, idx) in material.option_values" :key="item.name" @change="
                  get_design_data(item.id),
                  (order_fill_out_id.material = item.id), 
                  order_fill_out_id.material_code = item.code" v-show="show_main_material(item)"
                  >
                <VeeField type="radio" :name="`${material.code}.option_value_id`" :id="`material${item.id}`" :value="item.id"
                  label="material" rules="required" v-model="order_fill_out_id.material" />
                <VeeField type="hidden" :name="`${material.code}.name`" :value="material.name" />
                <VeeField type="hidden" :name="`${material.code}.option_id`" :value="item.option_id" />
                <VeeField type="hidden" :name="`${material.code}.option_code`" :value="material.code" />
                <VeeField type="hidden" :name="`${material.code}.type`" :value="material.type" />
                <VeeField type="hidden" :name="`${material.code}.value`" v-model="set_name(material,order_fill_out_id.material).value"
                   />
                   <!-- v-model="getProductOptionValue(material.code).value" -->
                <label :for="`material${item.id}`">
                  <span class="pic_lable d-inline-block">
                    <img :src="item.href" :alt="item.name" />
                    <!-- <img :src="$imgUrl(item.image)" :alt="item.name" /> -->
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
        {{ store.language_txt.order.text_note_choose_material_first}}
      </div>

      <section id="design" v-if="!!design_data.design && design_data.type">
        <div class="container container-original">
          <div class="block block2">
            <h2 class="title">{{ store.language_txt.order.text_style}}</h2>
            <VeeErrorMessage class="error__label error-design" :name="`${design_data.design.option_code}.value`" />
            <div class="d-flex justify-content-around flex-auto gap-lg-0 gap-4 "
              :class="{ 'error': errors[`${design_data.design.option_code}.value`] }">
              <div class="type_chose" v-for="(design, designIdx) in design_data.design.option_group_suboption_values"
                :key="design.name">
                <div class="windowType">
                  <!-- v-model="order_fill_out.design.styleType" -->
                  <VeeField type="radio" :id="`styleType_` + design.option_value_id"
                    :name="`${design_data.design.option_code}.option_value_id`" :value="design.option_value_id"
                    v-model="order_fill_out_id.styleType" 
                    @change="change_styleType(),order_fill_out_id.styleType = design.option_value_id"
                    :checked="order_fill_out.design.styleType == design.name" label="styleType" rules="required" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.name`"
                    :value="design_data.design.option_name" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.option_id`"
                    :value="design_data.design.option_id" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.option_code`"
                    :value="design_data.design.option_code" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.type`"
                    :value="design_data.design.option_type" />
                  <VeeField type="hidden" :name="`${design_data.design.option_code}.value`" v-model="set_name(design_data.design,order_fill_out_id.styleType).value"/>
                  <p class="designName text-center">{{ design.name }}</p>
                  <label :for="`styleType_` + design.option_value_id">
                    <img :src="design.href" :alt="design.name">
                  </label>
                </div>
                <VeeErrorMessage class="error__label col-12" :name="`${selected_win_style}.value`" />
                <!-- inner -->
                <div class="d-flex justify-content-center flex-wrap"
                  v-if="order_fill_out_id.styleType && design_data.type.length > 0"
                  :class="{ 'error': errors['`${type.code}.value'] }">
                  <div class="typeCategory"
                    v-for="(type, typeIdx) in design_data.type[designIdx].option_group_suboption_values"
                    :key="type.name">
                    <VeeField type="radio" :name="`${selected_win_style}.option_value_id`"
                      :id="`designType_` + type.option_value_id" :value="type.option_value_id"
                      :disabled="order_fill_out_id.styleType !== design.option_value_id"
                      :key="selected_win_style + 'value'"  v-model="order_fill_out_id.designType"
                      @change="change_designType(design.name,design.option_value_id,type,designIdx), (order_fill_out_id.designTypeIdx = designIdx)"
                       label="designType"
                      rules="required" />
                    <VeeField type="hidden" :key="selected_win_style + 'name'" :name="`${selected_win_style}.name`"
                      v-model="order_fill_out_id.designType_option_name" />
                    <VeeField type="hidden" :key="selected_win_style + 'id'" :name="`${selected_win_style}.option_id`"
                      v-model="order_data[selected_win_style].id" />
                    <VeeField type="hidden" :key="selected_win_style + 'code'"
                      :name="`${selected_win_style}.option_code`" v-model="order_fill_out_id.designType_option_code" />
                    <VeeField type="hidden" :key="selected_win_style + 'type'" :name="`${selected_win_style}.type`"
                      v-model="order_data[selected_win_style].type" />
                    <VeeField type="hidden" :key="selected_win_style + 'option_id'"
                      :name="`${selected_win_style}.value`" v-model="set_name(design_data.type[order_fill_out_id.designTypeIdx],order_fill_out_id.designType).value" />
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

      <section id="setting" v-if="!!order_fill_out_id.designType">
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
                    <VeeField as="select" :name="`${order_data.indooroutdoor.code}.option_value_id`" :id="order_data.indooroutdoor.name"
                      class="form-select" :class="{ 'error': errors[`${order_data.indooroutdoor.code}.option_value_id`] }"
                      v-model="order_fill_out_id.indooroutdoor"
                      label="indooroutdoor" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option :value="option.id" v-for="option in order_data.indooroutdoor.option_values" @change="order_fill_out_id.indooroutdoor = option.id">
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeErrorMessage class="error__label" :name="`${order_data.indooroutdoor.code}.option_value_id`" />
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.name`" :value="order_data.indooroutdoor.name" />
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.option_id`" :value="order_data.indooroutdoor.id" />
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.option_code`"
                      :value="order_data.indooroutdoor.code" />
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.type`" :value="order_data.indooroutdoor.type" />
                    <VeeField type="hidden" :name="`${order_data.indooroutdoor.code}.value`"
                    v-model="set_name(order_data.indooroutdoor,order_fill_out_id.indooroutdoor).value" />
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
                      v-model="order_fill_out_id.std_or_fixed"
                       label="std_or_fixed" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option :value="option.id" v-for="option in order_data.std_or_fixed.option_values" @change="order_fill_out_id.std_or_fixed = option.id">
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.name`" :value="order_data.std_or_fixed.name" />
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.option_id`" :value="order_data.std_or_fixed.id" />
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.option_code`"
                      :value="order_data.std_or_fixed.code" />
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.type`" :value="order_data.std_or_fixed.type" />
                    <VeeField type="hidden" :name="`${order_data.std_or_fixed.code}.value`"
                      v-model="set_name(order_data.std_or_fixed,order_fill_out_id.std_or_fixed).value"  />
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
                    <div class="d-flex algin-items-center flex-wrap  p-2 pt-0"
                      :class="{ 'error': win_stdwin_subtype_error(errors) }">
                      <template v-for="(data, idx) in order_data.win_stdwin_subtype.option_values">
                        <div class="picOption" v-if="show_win_stdwin_sbutype(data.id)">
                          <VeeField type="checkbox" :id="'win_stdwin_subtype_' + data.id"
                            :name="`${order_data.win_stdwin_subtype.code}.option_values[${idx}].option_value_id`"
                            v-model="order_fill_out_id.win_stdwin_subtype"
                            @click="add_win_stdwin_subtype_id(data.id)" 
                            :value="data.id" 
                            label="win_stdwin_subtype"
                            :rules="{ required: win_stdwin_subtype_required(values) }" />
                          <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.name`"
                            :value="order_data.win_stdwin_subtype.name" />
                          <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.option_id`"
                            :value="order_data.win_stdwin_subtype.id" />
                          <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.option_code`"
                            :value="order_data.win_stdwin_subtype.code" />
                          <VeeField type="hidden" :name="`${order_data.win_stdwin_subtype.code}.type`"
                            :value="order_data.win_stdwin_subtype.type" />
                          <div v-if="order_fill_out_id.win_stdwin_subtype.find((item) => item == data.id)">
                            <VeeField type="hidden"
                              :name="`${order_data.win_stdwin_subtype.code}.option_values[${idx}].value`"
                              :value="data.name" />
                          </div>
                          <label :for="'win_stdwin_subtype_' + data.id">
                            <img :src="data.thumb" :alt="data.name">
                          </label>
                          <p>{{ data.name }}</p>
                        </div>
                      </template>

                      <VeeErrorMessage class="error__label" v-if="win_stdwin_subtype_error(errors)"
                        :name="`${order_data.win_stdwin_subtype.code}.option_values[0].value`" />
                    </div>
                    <label v-if="values.win_stdwin_subtype?.option_values[1].value">
                      <VeeField type="checkbox" :class="{ 'error': errors['confirm_bay_window.value'] }"
                        :name="`confirm_bay_window.option_values[0].value`"
                        v-model="getProductOptionValue('confirm_bay_window').value" value="Y" class="form-check-input"
                         />
                      {{ order_data.confirm_bay_window.name }}
                      <VeeField type="hidden" :name="`confirm_bay_window.name`"
                        :value="order_data.confirm_bay_window.name" />
                      <VeeField type="hidden" :name="`confirm_bay_window.option_id`"
                        :value="order_data.confirm_bay_window.id" />
                      <VeeField type="hidden" name="confirm_bay_window.option_code"
                        :value="order_data.confirm_bay_window.code" />
                      <VeeField type="hidden" name="confirm_bay_window.type"
                        :value="order_data.confirm_bay_window.type" />
                      <VeeField type="hidden" :name="`confirm_bay_window.option_values[0].option_value_id`" value="0" />
                    </label>
                    <VeeErrorMessage class="error__label" :name="`confirm_bay_window.option_values[0].value`" />
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
                          v-model="order_fill_out_id.sldwood_material"
                          @change="order_fill_out_id.sldwood_material = item.id"
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
                        v-model="set_name(order_data.sldwood_material,order_fill_out_id.sldwood_material).value"
                         />
                        <label :for="'sldwood_material' + item.id" @click="click_find_label($event)">
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
                 <!-- quantity -->
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
                        v-model="product_data.quantity" name="quantity"
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
                      v-model="getProductOptionValue(order_data.win_position.code).value"
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
                        v-model="getProductOptionValue(order_data.win_width.code).value"
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
                        v-model="getProductOptionValue(order_data.win_height.code).value"
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
                    <span class="fs-xs">{{ store.language_txt.order.text_note_height }}</span>
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="col-md-6 flex-auto">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 position-relative " :for="order_data.wsms.name">
                    <span class="text-danger">*</span>
                    {{ order_data.wsms.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      {{ store.language_txt.order.text_note_ms }}
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.wsms.code}.option_value_id`" :id="order_data.wsms.option_value_id"
                      class="form-select" :class="{ 'error': errors[`${order_data.wsms.code}.value`] }"
                      v-model="order_fill_out_id.wsms_option_value_id"
                     label="wsms" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option :value="option.id" v-for="option in wsms_data" @change="order_fill_out_id.wsms_option_value_id = option.id">
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeErrorMessage class="error__label" :name="`${order_data.wsms.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.name`" :value="order_data.wsms.name" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.option_id`" :value="order_data.wsms.id" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.option_code`"
                      :value="order_data.wsms.code" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.type`" :value="order_data.wsms.type" />
                    <VeeField type="hidden" :name="`${order_data.wsms.code}.value`" v-model="set_name(order_data.wsms,order_fill_out_id.wsms_option_value_id).value"
                    />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 position-relative" :for="order_data.imom.name">
                    <span class="text-danger">*</span>
                    {{ order_data.imom.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      <p>{{ store.language_txt.order.text_note_om }}</p>
                      <p>{{ store.language_txt.order.text_note_im }}</p>
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.imom.code}.option_value_id`" :id="order_data.imom.name"
                      class="form-select" :class="{ 'error': errors[`${order_data.imom.code}.value`] }"
                      v-model="order_fill_out_id.imom_option_value_id"
                      label="imom" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option :value="option.id" v-for="option in order_data.imom.option_values" @change="order_fill_out_id.imom_option_value_id = option.id">
                        {{ option.name }}
                      </option>
                    </VeeField>
                    <VeeErrorMessage class="error__label" :name="`${order_data.imom.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.name`" :value="order_data.imom.name" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.option_id`" :value="order_data.imom.id" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.option_code`"
                      :value="order_data.imom.code" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.type`" :value="order_data.imom.type" />
                    <VeeField type="hidden" :name="`${order_data.imom.code}.value`"
                    v-model="set_name(order_data.imom,order_fill_out_id.imom_option_value_id).value" />
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
                          v-model="order_fill_out_id.setting_color"
                          @change="order_fill_out_id.setting_color = color.id"
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
                        v-model="set_name(material_color,order_fill_out_id.setting_color).value"
                         />
                        <label :for="'setting_color_' + color.id" @click="click_find_label($event)">
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

      <section id="outerFrame" v-if="!!order_fill_out_id.designType && !is_track">
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
                        :class="{ 'error': errors[`${doorType_outerFrame.code}.value`] }">
                        <div class="picOption" v-for="(item, idx) in doorType_outerFrame.option_values"
                          :key="'outerFrame' + item.id">
                          <VeeField type="radio" :id="'outerFrame' + item.id"
                            v-model="order_fill_out_id.outerFrame_type"
                            @change="order_fill_out_id.outerFrame_type = item.id"
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
                          v-model="set_name(doorType_outerFrame,order_fill_out_id.outerFrame_type).value"
                           />
                          <label :for="'outerFrame' + item.id" @click="click_find_label($event)">
                            <img :src="item.thumb" :alt="show_custom_name(item)">
                          </label>
                          <p class="fs-xs">{{ show_custom_name(item)}}</p>
                        </div>
                        <VeeErrorMessage class="error__label" :name="`${doorType_outerFrame.code}.value`" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- left -->
              <div class="col-md-6 flex-auto">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_sides.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.outer_frame_sides.code}.option_value_id`" id="" class="form-select"
                      rules="required" :class="{ 'error': errors[`${order_data.outer_frame_sides.code}.option_value_id`] }"
                      v-model="order_fill_out_id.outer_frame_sides"
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
                    v-model="set_name(order_data.outer_frame_sides,order_fill_out_id.outer_frame_sides).value"
                     />

                    <VeeErrorMessage class="error__label" :name="`${order_data.outer_frame_sides.code}.option_value_id`" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_cut_position.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.outer_frame_cut_position.code}.option_value_id`" id=""
                      class="form-select" rules="required"
                      :class="{ 'error': errors[`${order_data.outer_frame_cut_position.code}.option_value_id`] }"
                      v-model="order_fill_out_id.outer_frame_cut_position"
                      >
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.outer_frame_cut_position.option_values" :key="data.id"
                      @change="order_fill_out_id.outer_frame_cut_position = data.id"
                        :value="data.id">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.name`"
                      :value="order_data.outer_frame_cut_position.name" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.option_id`"
                      :value="order_data.outer_frame_cut_position.id" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.option_code`"
                      :value="order_data.outer_frame_cut_position.code" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.type`"
                      :value="order_data.outer_frame_cut_position.type" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_cut_position.code}.value`"
                    v-model="set_name(order_data.outer_frame_cut_position,order_fill_out_id.outer_frame_cut_position).value"
                       />

                    <VeeErrorMessage class="error__label" :name="`${order_data.outer_frame_cut_position.code}.option_value_id`" />
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
                      v-model="order_fill_out_id.sldwood_pre_drilled_hole"
                     >
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.sldwood_pre_drilled_hole.option_values" :key="data.id"
                      @change="order_fill_out_id.sldwood_pre_drilled_hole = data.id"
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
                    v-model="set_name(order_data.sldwood_pre_drilled_hole,order_fill_out_id.sldwood_pre_drilled_hole).value"
                     />

                    <VeeErrorMessage class="error__label" :name="`${order_data.sldwood_pre_drilled_hole.code}.option_value_id`" />
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="col-md-6 flex-auto">
                <!-- 墊片位置 -->
                <div class="row mb-3" v-if="!is_none_gasket_thickness">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_gasket_location.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.outer_frame_gasket_location.code}.option_value_id`"
                      id="outer_frame_gasket_location" class="form-select"
                      :class="{ 'error': errors[`${order_data.outer_frame_gasket_location.code}.option_value_id`] }"
                      v-model="order_fill_out_id.outer_frame_gasket_location"
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
                    v-model="set_name(order_data.outer_frame_gasket_location,order_fill_out_id.outer_frame_gasket_location).value"
                      />
                    <VeeErrorMessage class="error__label"
                      :name="`${order_data.outer_frame_gasket_location.code}.option_value_id`" />
                  </div>
                </div>
                <!-- 墊片厚度 -->
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.outer_frame_gasket_thickness.name }}
                  </label>
                  <div class="col-sm-8">
                    <!-- text -->
                    <div v-if="values.sldwood_build_out_thickness_manually?.option_values[0].value == 'Y'">
                      <VeeField  type="text"
                        :name="`${order_data.outer_frame_gasket_thickness.code}.value`" class="form-control"
                        :class="{ 'error': errors[`${order_data.outer_frame_gasket_thickness.code}.value`] }"
                        v-model="getProductOptionValue(order_data.outer_frame_gasket_thickness.code).value"
                        @input="order_fill_out_id.outer_frame_gasket_thickness = 0" />
                      <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.option_value_id`"
                        value="0" />
                    </div>
                      <!-- select -->
                    <div v-else>
                      <VeeField  as="select" :name="`${order_data.outer_frame_gasket_thickness.code}.option_value_id`"
                        id="outer_frame_gasket_thickness" class="form-select"
                        :class="{ 'error': errors[`${order_data.outer_frame_gasket_thickness.code}.option_value_id`] }"
                        v-model="order_fill_out_id.outer_frame_gasket_thickness" rules="required">
                        <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                        <option v-for="data in order_data.outer_frame_gasket_thickness.option_values" :key="data.id"
                        @change="order_fill_out_id.outer_frame_gasket_thickness =  data.id"
                          :value="data.id">
                          {{ data.name }}
                        </option>
                      </VeeField>
                      <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.value`"
                      v-model="set_name(order_data.outer_frame_gasket_thickness,order_fill_out_id.outer_frame_gasket_thickness).value" />
                    </div>
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.name`"
                      :value="order_data.outer_frame_gasket_thickness.name" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.option_id`"
                      :value="order_data.outer_frame_gasket_thickness.id" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.option_code`"
                      :value="order_data.outer_frame_gasket_thickness.code" />
                    <VeeField type="hidden" :name="`${order_data.outer_frame_gasket_thickness.code}.type`"
                      :value="order_data.outer_frame_gasket_thickness.type" />
                    <!-- 自行輸入checkbox -->
                    <div v-if="is_wood" class="mt-2">
                      <label>
                        <VeeField type="checkbox" :class="{ 'error': errors[`${order_data.sldwood_build_out_thickness_manually.code}.option_values[0].value`] }"
                          :name="`${order_data.sldwood_build_out_thickness_manually.code}.option_values[0].value`"
                          v-model="getProductOptionValue(order_data.sldwood_build_out_thickness_manually.code).value" value="Y"
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
                <!-- 鑽孔位置 -->
                <div class="row mb-3" v-if="is_wood && !is_none_pre_drilled_hole">
                  <label class="label-set col-form-label col-sm-4" :for="order_data.desired_drilling_position.name">
                    <span class="text-danger">*</span>
                    {{ order_data.desired_drilling_position.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" class="form-control"
                      :class="{ 'error': errors[`${order_data.desired_drilling_position.code}.value`]}"
                      v-model="getProductOptionValue(order_data.desired_drilling_position.code).value"
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

      <section id="doorSet" v-if="!!order_fill_out_id.designType">
        <div class="container container-original">
          <div class="block block3 mainForm">
            <h2 class="title">
              {{ store.language_txt.order.text_door }}
              <span v-if="!is_track">{{ store.language_txt.order.text_note_door_piece }}</span>
            </h2>
            <div class="row flex-auto col-12">
            <!-- 拉桿 -->
              <div class="col-12" :key="win_style_key">
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
                          v-model="order_fill_out_id.win_lever"
                          :key="win_lever_data.code + 'option_value_id'"
                          @change="order_fill_out_id.win_lever = item.id" label="win_lever" rules="required" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.name`"  :key="win_lever_data.code + 'name'"
                          :value="win_lever_data.name" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.option_id`"  :key="win_lever_data.code + 'option_id'"
                          :value="win_lever_data.id" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.option_code`"  :key="win_lever_data.code + 'option_code'"
                          :value="win_lever_data.code" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.type`"  :key="win_lever_data.code + 'type'"
                          :value="win_lever_data.type" />
                        <VeeField type="hidden" :name="`${win_lever_data.code}.value`"  :key="win_lever_data.code + 'value'"
                        v-model="set_name(win_lever_data,order_fill_out_id.win_lever).value"
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
                      v-model="order_fill_out_id.blade_size"
                      label="blade_size"
                      :key="blade_size_data.code + 'option_value_id'"
                      rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="size in blade_size_data.option_values" :key="size.name + size.id" :value="size.id" @change="order_fill_out_id.blade_size = size.id">
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
                      v-model="set_name(blade_size_data,order_fill_out_id.blade_size).value"
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
                      v-model="getProductOptionValue(order_data.blade_numbers.code).value" label="blade_numbers"
                      :rules="validateWidth" @input="validateWidth" />
                    <span class="fs-xs">{{ doorSet_comment }}</span>
                    <!-- <span class="fs-xs">{{ store.language_txt.order.text_note_folding_width_limit }}</span> -->
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_numbers.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.name`"
                      :value="order_data.blade_numbers.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.option_id`"
                      :value="order_data.blade_numbers.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.option_code`"
                      :value="order_data.blade_numbers.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.type`"
                      :value="order_data.blade_numbers.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_numbers.code}.option_value_id`" value="0" />
                    <div v-if="show_not_warranty">*已超過</div>
                    <div class="" v-if="show_not_warranty">
                      <label>
                        <VeeField type="checkbox" :class="{ 'error': errors['confirm_width_limit.option_values[0].value'] }"
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
                      v-model="getProductOptionValue(order_data.blade_arrangement.code).value" class="form-control"
                      :class="{ 'error': errors[`${order_data.blade_arrangement.code}.value`] }"
                      label="blade_arrangement" rules="required" />
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_arrangement.code}.value`" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.name`"
                      :value="order_data.blade_arrangement.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.option_id`"
                      :value="order_data.blade_arrangement.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.option_code`"
                      :value="order_data.blade_arrangement.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.type`"
                      :value="order_data.blade_arrangement.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_arrangement.code}.option_value_id`" value="0" />
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
                      class="form-select" v-model="order_fill_out_id.blade_directions"
                      :class="{ 'error': errors[`${order_data.blade_directions.code}.option_value_id`] }"
                      label="blade_directions" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.blade_directions.option_values" :key="data.name + data.id"
                        @change="order_fill_out_id.blade_directions = data.id"
                        :value="data.id">
                        {{ data.name }}
                      </option>
                    </VeeField>
                    <VeeErrorMessage class="error__label" :name="`${order_data.blade_directions.code}.option_value_id`" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.name`"
                      :value="order_data.blade_directions.name" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.option_id`"
                      :value="order_data.blade_directions.id" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.option_code`"
                      :value="order_data.blade_directions.code" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.type`"
                      :value="order_data.blade_directions.type" />
                    <VeeField type="hidden" :name="`${order_data.blade_directions.code}.value`"
                    v-model="set_name(order_data.blade_directions,order_fill_out_id.blade_directions).value"
                     />
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
                        <VeeField type="radio" :id="'frame' + frame.id"
                          :name="`${order_data.window_frame_type.code}.option_value_id`" :value="frame.id"
                          v-model="order_fill_out_id.door_frame" label="door_frame"
                          rules="required" @change="order_fill_out_id.door_frame = frame.id" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.name`"
                          :value="order_data.window_frame_type.name" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.option_id`"
                          :value="order_data.window_frame_type.id" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.option_code`"
                          :value="order_data.window_frame_type.code" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.type`"
                          :value="order_data.window_frame_type.type" />
                        <VeeField type="hidden" :name="`${order_data.window_frame_type.code}.value`"
                        v-model="set_name(order_data.window_frame_type,order_fill_out_id.door_frame).value"
                         />
                        <label :for="'frame' + frame.id" @click="click_find_label($event)">
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
                      v-model="order_fill_out_id.magnetic_options"  
                      id="magnetic_options"
                      :key="magnetic_data.code + 'option_value_id'"
                      class="form-select"
                      :class="{ 'error': errors[`${magnetic_data.code}.option_value_id`] }"
                      label="magnetic_options" rules="required">
                      <option value="" >{{ store.language_txt.order.text_choose_specification}}</option>
                      <option 
                      @change="order_fill_out_id.magnetic_options = item.id"
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
                    v-model="set_name(magnetic_data,order_fill_out_id.magnetic_options).value"
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
                      v-model="order_fill_out_id.folding_method"
                      label="folding_method" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option :value="item.id" v-for="item in order_data.folding_method.option_values" :key="item.id"  @change="order_fill_out_id.folding_method = item.id">
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
                    v-model="set_name(order_data.folding_method,order_fill_out_id.folding_method).value"
                      />
                    <VeeErrorMessage class="error__label" :name="`${order_data.folding_method.code}.option_value_id`" />
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="col-md-6 flex-auto">
                <!-- 鉸鍊顏色 -->
                <div class="row mb-3" :key="win_style_key">
                  <label class="label-set col-form-label col-sm-4 " :for="hinge_color_data.name">
                    <span class="text-danger">*</span>
                    {{ hinge_color_data.name }}
                  </label>
                  <div class="col-sm-8 d-flex flex-wrap align-items-start">
                      <VeeField as="select" :name="`${hinge_color_data.code}.option_value_id`"
                        :id="hinge_color_data.name" class="form-select"
                        :class="{ 'error': errors[`${hinge_color_data.code}.option_value_id`] }"
                        v-model="order_fill_out_id.hinge_color"
                        :key="hinge_color_data.code + 'option_value_id'"
                        label="hinge_color" rules="required">
                        <option value="">{{ store.language_txt.order.text_choose_specification}}</option>
                        <option 
                        @change="order_fill_out_id.hinge_color = item.id"
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
                      v-model="set_name(hinge_color_data,order_fill_out_id.hinge_color).value"
                         />
                      <VeeErrorMessage class="error__label" :name="`${hinge_color_data.code}.option_value_id`" />
                  </div>
                </div>

                <!-- handle -->
                <div class="row mb-3" v-if="!is_aluminum">
                  <label class="label-set col-form-label col-sm-4">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_type.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.door_handle_type.code}.option_value_id`] }">
                      <div class="picOption" v-for="item in order_data.door_handle_type.option_values" :key="item.id">
                        <VeeField type="radio" :id="'lockHandle' + item.id"
                          :name="`${order_data.door_handle_type.code}.option_value_id`" :value="item.id"
                          v-model="order_fill_out_id.door_handle_type"
                          @change="get_handle_color(item.id), order_fill_out_id.door_handle_type = item.id"
                          label="lock_Handle" rules="required" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.name`"
                          :value="order_data.door_handle_type.name" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.option_id`"
                          :value="order_data.door_handle_type.id" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.option_code`"
                          :value="order_data.door_handle_type.code" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.type`"
                          :value="order_data.door_handle_type.type" />
                        <VeeField type="hidden" :name="`${order_data.door_handle_type.code}.value`"
                        v-model="set_name(order_data.door_handle_type,order_fill_out_id.door_handle_type).value"
                         />
                        <label :for="'lockHandle' + item.id" @click="click_find_label($event)">
                          <img :src="item.thumb" :alt="item.name">
                          <label class="d-none" :for="'lock_Handle_option_value' + item.id"></label>
                        </label>
                        <p class="fs-xs">{{ item.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${order_data.door_handle_type.code}.option_value_id`" />
                    </div>
                  </div>
                </div>
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
                          v-model="order_fill_out_id.lockHandle_color" :value="color.option_value_id"
                          @change="order_fill_out_id.lockHandle_color = color.option_value_id" label="lockHandle_color"
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
                        v-model="set_name(order_data.door_handle_color,order_fill_out_id.lockHandle_color).value"
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
                <div class="row mb-3" v-if="!is_none_handle && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_handle_location.name">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_location.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_handle_location.code}.value`"
                      :id="order_data.door_handle_location.id" class="form-control"
                      :class="{ 'error': errors[`${order_data.door_handle_location.code}.value`] }"
                      v-model="getProductOptionValue(order_data.door_handle_location.code).value"
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
                <div class="row mb-3" v-if="!is_none_handle && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_handle_qty.name">
                    <span class="text-danger">*</span>
                    {{ order_data.door_handle_qty.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_handle_qty.code}.value`"
                      :id="order_data.door_handle_qty.name"
                      v-model="getProductOptionValue(order_data.door_handle_qty.code).value" class="form-control"
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

                <!-- lock -->
                <div class="row mb-3" v-if="!is_track" :key="win_style_key">
                  <label class="label-set col-form-label col-sm-4 " :for="door_lock_type_data.id">
                    <span class="text-danger">*</span>
                    {{ door_lock_type_data.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                      :class="{ 'error': errors[`${door_lock_type_data.code}.option_value_id`] }">
                      <div class="picOption" v-for="item in door_lock_type_data.option_values" :key="item.id">
                        <VeeField type="radio" :id="item.id" :name="`${door_lock_type_data.code}.option_value_id`"
                          v-model="order_fill_out_id.lock_type" :value="item.id"
                          :key="door_lock_type_data.code + 'option_value_id'"
                          @change="get_lock_color(item.id),order_fill_out_id.lock_type = item.id" label="lock_type"
                          rules="required" />
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.name`" :key="door_lock_type_data.code + 'name'"
                          :value="door_lock_type_data.name" />
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.option_id`" :key="door_lock_type_data.code + 'option_id'"
                          :value="door_lock_type_data.id" />
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.option_code`" :key="door_lock_type_data.code + 'option_code'"
                          :value="door_lock_type_data.code" />
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.type`" :key="door_lock_type_data.code + 'type'"
                          :value="door_lock_type_data.type" />
                        <VeeField type="hidden" :name="`${door_lock_type_data.code}.value`" :key="door_lock_type_data.code + 'value'"
                        v-model="set_name(door_lock_type_data,order_fill_out_id.lock_type).value"
                           />
                        <label :for="item.id">
                          <img :src="item.thumb" :alt="item.name">
                        </label>
                        <p class="fs-xs">{{ item.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${door_lock_type_data.code}.option_value_id`" />
                    </div>

                  </div>
                </div>
                <div class="row mb-3" v-if="lock_color.length > 0 && !is_none_lock && !is_track && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_color.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_color.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.door_lock_color.code}.option_value_id`] }">
                      <div class="picOption" v-for="color in lock_color" :key="color.id">
                        <VeeField type="radio" :id="color.id" :name="`${order_data.door_lock_color.code}.option_value_id`"
                        v-model="order_fill_out_id.door_lock_color"  :value="color.option_value_id"
                          @change="order_fill_out_id.door_lock_color = color.option_value_id" label="lock_color"
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
                        v-model="set_name(order_data.door_lock_color,order_fill_out_id.door_lock_color).value"
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
                <div class="row mb-3" v-if="!is_none_lock && !is_track && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_location.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_location.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_lock_location.code}.value`"
                      v-model="getProductOptionValue(order_data.door_lock_location.code).value"
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
                <div class="row mb-3" v-if="!is_none_lock && !is_track && !is_aluminum">
                  <label class="label-set col-form-label col-sm-4 " :for="order_data.door_lock_qty.id">
                    <span class="text-danger">*</span>
                    {{ order_data.door_lock_qty.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="text" :name="`${order_data.door_lock_qty.code}.value`"
                      v-model="getProductOptionValue(order_data.door_lock_qty.code).value"
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

      <section id="partitio" v-if="!!order_fill_out_id.designType">
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
              <div class="col-md-12" v-if="show_add_lever &&  !is_none_win_lever">
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-2 " :for="order_data.lever_segmentation_note.name">
                    {{ order_data.lever_segmentation_note.name }}
                  </label>
                  <div class="col-sm-4">
                    <VeeField type="number" :name="`${order_data.lever_segmentation_note.code}.value`"
                      @keydown="clearInput"
                      v-model="getProductOptionValue(order_data.lever_segmentation_note.code).value"
                      :id="order_data.lever_segmentation_note.name" class="form-control"
                      :class="{ 'error': errors[`${order_data.lever_segmentation_note.code}.value`] }"
                      label="lever_segmentation_note"  />
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
                    <VeeErrorMessage class="error__label" :name="`${order_data.lever_segmentation_note.code}.value`" />
                  </div>
                </div>
              </div>
              <!-- input_hiiden -->
              <div class="d-none" v-if="order_fill_out.partitio.length > 0">
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
              <div class="col-md-12 mb-4 border-bottom py-2  position-relative "
                v-for="(data, idx) in order_fill_out.partitio" :key="`partitio_${idx +1}`">
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
                <i class="fas fa-times close_btn" @click="del_partitio(idx)"></i>
              </div>
              <div class="col-12 text-center mt-4 d-flex align-items-center justify-content-center gap-4">
                <button type="button" class="add_text_btn" @click="add_lever_segmentation" v-if="show_add_lever">
                  <i class="fa-solid fa-circle-plus fs-4 add_btn"></i>
                  <span>{{order_data.lever_segmentation_note.name}}</span>
                </button>
                <button type="button" class="add_text_btn" @click="add_partitio">
                  <i class="fa-solid fa-circle-plus fs-4 add_btn"></i>
                  <span>{{store.language_txt.order.text_dividers}}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="track_style" v-if="!!order_fill_out_id.designType && is_track">
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
              <div class="col-md-6 flex-auto">
                <!-- TOP -->
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
                        <VeeField type="radio" :name="`${order_data.win_option_top_track.code}.option_value_id`"
                          :value="data.id" class="form-check-input"
                          v-model="order_fill_out_id.topPartition"
                          :id="'top_Partition_' + data.id" @change="order_fill_out_id.topPartition = data.id"
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
                        v-model="set_name(order_data.win_option_top_track,order_fill_out_id.topPartition).value"
                         />
                        <span class="ms-2">{{ data.name }}</span>
                      </label>

                      <label for="top_Partition_Cut" class="d-block">
                        <VeeField type="checkbox"
                          :name="`${order_data.win_option_top_cut_track.code}.option_values[0].value`"
                          label="top_Partition_Cut"
                          v-model="getProductOptionValue(order_data.win_option_top_cut_track.code).value" value="Y"
                          class="form-check-input" id="top_Partition_Cut" />
                        <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.name`"
                          :value="order_data.win_option_top_cut_track.name" />
                        <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.option_id`"
                          :value="order_data.win_option_top_cut_track.id" />
                        <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.option_code`"
                          :value="order_data.win_option_top_cut_track.code" />
                        <VeeField type="hidden" :name="`${order_data.win_option_top_cut_track.code}.type`"
                          :value="order_data.win_option_top_cut_track.type" />
                        <VeeField type="hidden"
                          :name="`${order_data.win_option_top_cut_track.code}.option_values[0].option_value_id`"
                          value="0" />
                        <span v-if="values.top_Partition_Cut">
                          <VeeField type="hidden"
                            :name="`${order_data.win_option_top_cut_track.code}.option_values[0].option_value_id`"
                            value="Y" v-if="values.top_Partition_Cut.value" />
                        </span>

                        <span class="ms-2">{{ order_data.win_option_top_cut_track.name }}</span>
                      </label>
                      <VeeErrorMessage class="error__label"
                        :name="`${order_data.win_option_top_cut_track.code}.value`" />
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
                      {{ store.language_txt.order.text_thickness_with_mm}}
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                      :class="{ 'error': errors[`${order_data.win_option_side.code}.option_value_id`] }">
                      <label :for="'side_Partition_' + data.id" v-for="data in order_data.win_option_side.option_values"
                        :key="data.id">
                        <VeeField type="radio" :name="`${order_data.win_option_side.code}.option_value_id`" :value="data.id"
                        v-model="order_fill_out_id.side_partition"
                          class="form-check-input" :id="'side_Partition_' + data.id"
                          @change="order_fill_out_id.side_partition = data.id" label="side_Partition"
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
                        v-model="set_name(order_data.win_option_side,order_fill_out_id.side_partition).value"
                         />
                        <span class="ms-2">{{ data.name }}</span>

                      </label>
                      <VeeErrorMessage class="error__label" :name="`${order_data.win_option_side.code}.option_value_id`" />
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
                      {{ store.language_txt.order.text_thickness_exceed_should_cut}}
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex align-items-center gap-3 flex-wrap p-2"
                      :class="{ 'error': errors[`${order_data.win_option_bottom.code}.option_value_id`] }">
                      <label :for="'bottom_Partition_' + data.id"
                        v-for="data in order_data.win_option_bottom.option_values" :key="data.id">
                        <VeeField type="radio" @change="order_fill_out_id.bottom_partition = data.id"
                          :name="`${order_data.win_option_bottom.code}.option_value_id`"
                          v-model="order_fill_out_id.bottom_partition" :value="data.id"
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
                        v-model="set_name(order_data.win_option_bottom,order_fill_out_id.bottom_partition).value"
                         />
                        <span class="ms-2">{{ data.name }}</span>
                      </label>
                      <label for="bottom_Partition_Cut" class="d-block">
                        <VeeField type="checkbox"
                          :name="`${order_data.win_option_bottom_cut_track.code}.option_values[0].value`"
                          v-model="getProductOptionValue(order_data.win_option_bottom_cut_track.code).value" value="Y"
                          class="form-check-input" id="bottom_Partition_Cut" />
                        <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.name`"
                          :value="order_data.win_option_bottom_cut_track.name" />
                        <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.option_id`"
                          :value="order_data.win_option_bottom_cut_track.id" />
                        <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.option_code`"
                          :value="order_data.win_option_bottom_cut_track.code" />
                        <VeeField type="hidden" :name="`${order_data.win_option_bottom_cut_track.code}.type`"
                          :value="order_data.win_option_bottom_cut_track.type" />
                        <VeeField type="hidden"
                          :name="`${order_data.win_option_bottom_cut_track.code}.option_values[0]option_value_id`"
                          value="0" />
                        <span v-if="values.bottom_Partition_Cut">
                          <VeeField type="hidden"
                            :name="`${order_data.win_option_bottom_cut_track.code}.option_values[0]option_value_id`"
                            value="Y" v-if="values.bottom_Partition_Cut.value" />
                        </span>

                        <span class="ms-2">{{order_data.win_option_bottom_cut_track.name}}</span>
                      </label>
                      <VeeErrorMessage class="error__label"
                        :name="`${order_data.win_option_bottom_cut_track.code}.value`" />
                    </div>

                  </div>
                </div>
                <div class="row mb-3" v-if="!is_folding_door">
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
                    <VeeField as="select" :name="`${order_data.is_uplow_track_fixed.code}.option_value_id`" id="track_fixed"
                    v-model="order_fill_out_id.track_fixed"  class="form-select"
                      :class="{ 'error': errors[`${order_data.is_uplow_track_fixed.code}.option_value_id`] }"
                      label="track_fixed" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.is_uplow_track_fixed.option_values" :key="data.id"
                      @change="order_fill_out_id.track_fixed = data.id"
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
                    v-model="set_name(order_data.is_uplow_track_fixed,order_fill_out_id.track_fixed).value"
                     />
                    <VeeErrorMessage class="error__label" :name="`${order_data.is_uplow_track_fixed.code}.option_value_id`" />
                  </div>
                </div>
                <div class="row mb-3" v-if="!is_folding_door">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.door_openclose.name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      {{ store.language_txt.order.text_note_door_openclose}}
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.door_openclose.code}.option_value_id`" id="door_openclose"
                      class="form-select" :class="{ 'error': errors[`${order_data.door_openclose.code}.option_value_id`] }"
                      v-model="order_fill_out_id.door_openclose"
                      label="door_openclose" rules="required">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.door_openclose.option_values" :key="data.id" :value="data.id"  @change="order_fill_out_id.door_openclose = data.id">
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
                    v-model="set_name(order_data.door_openclose,order_fill_out_id.door_openclose).value"
                     />
                    <VeeErrorMessage class="error__label" :name="`${order_data.door_openclose.code}.option_value_id`" />
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
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.upper_track_color.code}.option_value_id`] }">
                      <div class="picOption" v-for="color in order_data.upper_track_color.option_values"
                        :key="color.id">
                        <VeeField type="radio" :id="'topTrack' + color.id"
                          :name="`${order_data.upper_track_color.code}.option_value_id`"
                          v-model="order_fill_out_id.upper_track_color" :value="color.id"
                          @change="order_fill_out_id.upper_track_color = color.id" label="topTrackColor"
                          rules="required" />
                        <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.name`"
                          :value="order_data.upper_track_color.name" />
                        <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.option_id`"
                          :value="order_data.upper_track_color.id" />
                        <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.option_code`"
                          :value="order_data.upper_track_color.code" />
                        <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.type`"
                          :value="order_data.upper_track_color.type" />
                        <VeeField type="hidden" :name="`${order_data.upper_track_color.code}.value`"
                        v-model="set_name(order_data.upper_track_color,order_fill_out_id.upper_track_color).value"
                         />
                        <label :for="'topTrack' + color.id">
                          <img :src="color.thumb" :alt="color.name">
                        </label>
                        <p class="fs-xs">{{ color.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${order_data.upper_track_color.code}.option_value_id`" />
                    </div>

                  </div>
                </div>
                <div class="row mb-3 ">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ doorType_track.option_name }}
                    <i class="fas fa-question-circle"></i>
                    <div class="info_box">
                      {{ store.language_txt.order.text_note_track}}
                    </div>
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                      :class="{ 'error': errors[`${doorType_track.option_code}.option_value_id`] }">
                      <div class="picOption" v-for="(item, idx) in doorType_track.option_group_suboption_values"
                        :key="item.id">
                        <VeeField type="radio" :id="'track' + idx" :name="`${doorType_track.option_code}.option_value_id`"
                        v-model="order_fill_out_id.bottom_track" :value="item.option_value_id"
                          label="track" @change="order_fill_out_id.bottom_track = item.option_value_id"
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
                        v-model="set_name(doorType_track,order_fill_out_id.bottom_track).value"
                         />
                        <label :for="'track' + idx">
                          <img :src="item.thumb" :alt="item.name">
                        </label>
                        <p class="fs-xs">{{ item.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${doorType_track.option_code}.option_value_id`" />
                    </div>

                  </div>
                </div>
                <div class="row mb-3" v-if="!is_none_bottom_track">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    <span class="text-danger">*</span>
                    {{ order_data.lower_track_color.name }}
                  </label>
                  <div class="col-sm-8">
                    <div class="d-flex flex-wrap align-items-start  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.lower_track_color.code}.option_value_id`] }">
                      <div class="picOption" v-for="color in order_data.lower_track_color.option_values"
                        :key="color.id">
                        <VeeField type="radio" :id="'bottomTrack' + color.id"
                          :name="`${order_data.lower_track_color.code}.option_value_id`"
                          v-model="order_fill_out_id.lower_track_color" 
                          :value="color.id"
                          @change="order_fill_out_id.lower_track_color = color.id" label="bottomTrackColor"
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
                        v-model="set_name(order_data.lower_track_color,order_fill_out_id.lower_track_color).value"
                         />
                        <label :for="'bottomTrack' + color.id">
                          <img :src="color.thumb" :alt="color.name">
                        </label>
                        <p class="fs-xs">{{ color.name }}</p>
                      </div>
                      <VeeErrorMessage class="error__label" :name="`${order_data.lower_track_color.code}.option_value_id`" />
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
              {{ store.language_txt.order.text_decorative_pane }}
              <i class="fas fa-info-circle" @click="show_info_img($event)">
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
                  <div class="col-sm-10" :class="{ 'error': errors[`${order_data.decorative_pane_type.code}.option_value_id`] }">
                    <div class="picOption" v-for="data in order_data.decorative_pane_type.option_values" :key="data.id">
                      <VeeField type="radio" :id="'decorativeType' + data.id"
                        :name="`${order_data.decorative_pane_type.code}.option_value_id`"
                        v-model="order_fill_out_id.decorative_pane_type" :value="data.id"
                        @change="order_fill_out_id.decorative_pane_type = data.id" label="decorativeType"
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
                      v-model="set_name(order_data.decorative_pane_type,order_fill_out_id.decorative_pane_type).value"
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
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    {{doorType_height.option_name}}
                    <i class="fas fa-question-circle fs-xs"></i>
                        <div class="info_box">
                          {{ store.language_txt.order.text_note_panel_height}}
                        </div>
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group">
                      <VeeField type="text" :name="`${doorType_height.option_code}.value`" class="form-control"
                        v-model="doorType_height_value" disabled v-if="decorativeUserInput !== 'Y'" />
                      <VeeField type="number" :name="`${doorType_height.option_code}.value`"
                      @keydown="clearInput"
                        v-model="getProductOptionValue(doorType_height.option_code).value" class="form-control"
                        v-else />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.name`"
                        :value="doorType_height.option_name" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.option_id`"
                        :value="doorType_height.option_id" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.option_code`"
                        :value="doorType_height.option_code" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.type`"
                        :value="doorType_height.option_type" />
                      <VeeField type="hidden" :name="`${doorType_height.option_code}.option_value_id`"
                        v-model="order_fill_out_id.decorative_height" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <div class="mt-2">
                        <VeeField type="checkbox"
                          :name="`${order_data.decorative_pane_height_manually.code}.option_values[0].value`"
                          @change="decorativeUserInput = getProductOptionValue(order_data.decorative_pane_height_manually.code).value"
                          v-model="getProductOptionValue(order_data.decorative_pane_height_manually.code).value" value="Y"
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
                          :value="order_data.decorative_pane_height_manually.option_values[0].id" />
                      <label class="ms-2">{{order_data.decorative_pane_height_manually.option_values[0].name}}</label>
                      <!-- <input type="checkbox" value="" class="form-check-input me-2" v-model="decorativeUserInput" />
                      <label>{{ store.language_txt.order.text_enter_manually}}</label> -->
                    </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="label-set col-form-label col-sm-4 " for="">
                    {{ order_data.decorative_pane_corner_piece.name }}
                  </label>
                  <div class="col-sm-8">
                    <VeeField as="select" :name="`${order_data.decorative_pane_corner_piece.code}.option_value_id`"
                    v-model="order_fill_out_id.decorative_pane_corner_piece"
                      id="decorative_pane_corner_piece"
                      class="form-select">
                      <option value="" disabled selected>{{ store.language_txt.order.text_choose_specification}}</option>
                      <option v-for="data in order_data.decorative_pane_corner_piece.option_values" :key="data.id"
                      @change="order_fill_out_id.decorative_pane_corner_piece = data.id"
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
                    v-model="set_name(order_data.decorative_pane_corner_piece,order_fill_out_id.decorative_pane_corner_piece).value"
                     />
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
                      <VeeField type="text" :name="`decorative_pane_top_depth.value`" class="form-control"
                        v-model="doorType_depth_value" disabled v-if="depthUserInput !== 'Y'" />
                      <VeeField type="number" :name="`decorative_pane_top_depth.value`"
                      @keydown="clearInput"
                        v-model="getProductOptionValue('decorative_pane_top_depth').value" class="form-control"
                        v-else />
                      <VeeField type="hidden" :name="`decorative_pane_top_depth.name`" :value="doorType_depth?.name" />
                      <VeeField type="hidden" :name="`decorative_pane_top_depth.option_id`"
                        :value="doorType_depth?.id" />
                      <VeeField type="hidden" :name="`decorative_pane_top_depth.option_code`"
                        :value="doorType_depth?.code" />
                      <VeeField type="hidden" :name="`decorative_pane_top_depth.type`" :value="doorType_depth?.type" />
                      <VeeField type="hidden" :name="`decorative_pane_top_depth.option_value_id`"
                        v-model="order_fill_out_id.decorative_depth" />
                      <span class="input-group-text">mm</span>
                    </div>
                    <div class="mt-2">
                      <VeeField type="checkbox"
                          :name="`${order_data.decorative_pane_top_depth_manually.code}.option_values[0].value`"
                          @change="depthUserInput = getProductOptionValue(order_data.decorative_pane_top_depth_manually.code).value"
                          v-model="getProductOptionValue(order_data.decorative_pane_top_depth_manually.code).value" value="Y"
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
                          :value="order_data.decorative_pane_top_depth_manually.option_values[0].id" />
                      <label class="ms-2">{{order_data.decorative_pane_top_depth_manually.option_values[0].name}}</label>

                      <!-- <input type="checkbox" name="" value="" class="form-check-input me-2" v-model="depthUserInput">
                      <span>{{ store.language_txt.order.text_enter_manually}}</span> -->
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
              {{ store.language_txt.order.text_t_post}}
            </h2>
            <div class="row flex-auto">
              <!-- T型式 -->
              <div class="col-md-12" :key="win_style_key">
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
                      <div class="picOption" v-for="data in t_post_data.option_values" :key="data.id">
                        <VeeField type="radio" :id="'t_post' + data.id"
                          :name="`${t_post_data.code}.option_value_id`" :value="data.id"
                          v-model="order_fill_out_id.pilar_type"
                          :key="t_post_data.code + 'option_value_id'"
                          @change="order_fill_out_id.pilar_type = data.id,select_T_post()"
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
                        v-model="set_name(t_post_data,order_fill_out_id.pilar_type).value"
                           />
                        <label :for="'t_post' + data.id">
                          <img :src="data.thumb" :alt="data.name">
                        </label>
                        <p class="mb-3">
                          {{ data.name }}
                        </p>
                      </div>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`${t_post_data.code}.option_value_id`" />
                  </div>
                </div>
              </div>
              <!-- T位置 -->
              <div class="col-md-12 row">
                <div class="col-md-6 d-flex mb-3 position-relative" v-for="(item,idx) in order_fill_out.t_post.position"
                  :key="'T-POST_position' + idx +1">
                  <label class="label-set col-form-label col-sm-4 pe-3" :for="'T-POST_position' + idx+1">
                    <span class="text-danger">*</span>
                    T{{ idx+1 }}{{ store.language_txt.order.text_position}}
                  </label>
                  <div class="col-xxl-8 col pe-3">
                    <VeeField type="number"
                    @keydown="clearInput"
                     :name="`${order_data.t_post_json.code}.value.height[${idx}].t_post_value`"
                      :id="'T-POST_position' + idx +1" class="form-control" v-model="item.t_post_value" rules="required"
                      :disabled="!!values[order_data.t_post_json.code]?.value?.t_post_average"
                      :class="{ 'error': errors[`${order_data.t_post_json.code}.value.height[${idx}].t_post_value`] }"
                      label="T-POST_position" />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.name`"
                      :value="order_data.t_post_json.name" />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.option_id`"
                      :value="order_data.t_post_json.id" />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.option_code`"
                      :value="order_data.t_post_json.code" />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.type`"
                      :value="order_data.t_post_json.type" />
                    <VeeField type="hidden" :name="`${order_data.t_post_json.code}.option_value_id`" value="0" />
                    <VeeErrorMessage class="error__label"
                      :name="`${order_data.t_post_json.code}.value.height[${idx}].t_post_value`" />
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="fas fa-times  close_btn btn-right-2" @click="del_t_post(idx)"></i>
                  </div>
                </div>
              </div>
              <div class="col-md-6 d-flex align-items-center mt-3" v-if="order_fill_out.t_post.position.length>0">
                <div class="col-4 label-set pe-2"></div>
                <div class="col-8">
                  <VeeField type="checkbox" :name="`${order_data.t_post_json.code}.value.t_post_average`"
                    v-model="order_fill_out.t_post.setting" class="form-check-input" value="Y" />
                  <label for=""
                    class="col-8 label-set text-start ps-2">{{ store.language_txt.order.text_divide_equally}}</label>
                </div>
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
              <i class="fas fa-info-circle" @click="show_info_img($event)">
                <div class="nav-img">
                  <img src="@/assets/images/auxiliary_info_img.jpg" alt="auxiliary_info_img">
                </div>
              </i>
            </h2>
            <div class="flex-auto">
              <div class="d-none" v-if="auxiliary.length > 0">
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
              <div class="row position-relative border-bottom p-2" v-for="(item, idx) in auxiliary"
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
                        :id="`auxiliary_length${idx + 1 }`" v-model="auxiliary[idx].auxiliary_length"
                        class="form-select">
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
                        :name="`${order_data.auxiliaries.code}.value[${idx}].auxiliary_width`"
                          :id="`auxiliary_width${idx + 1 }`" v-model="auxiliary[idx].auxiliary_width"
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
                          :name="`${order_data.auxiliaries.code}.value[${idx}].auxiliary_height`"
                          :id="`auxiliary_height${idx +1}`" v-model="auxiliary[idx].auxiliary_height"
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
                        :name="`${order_data.auxiliaries.code}.value[${idx}].auxiliary_quantity`"
                        v-model="auxiliary[idx].auxiliary_quantity" class="form-control" />
                    </div>
                  </div>
                </div>
                <i class="fas fa-times  close_btn btn-right" @click="del_auxiliary(idx)"></i>
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
            <h2 class="title">{{ store.language_txt.order.text_other}}</h2>
            <div class="row flex-auto">
              <div class="col-md-6 mb-3">
                <!-- T-POST-horizontal -->
                <div class="row mb-3" v-if="show_multilayer">
                  <label class="label-set col-form-label col-sm-4" for="layers">
                    <span class="text-danger">*</span>
                    {{ store.language_txt.order.text_layers}}
                    <!-- {{order_data.layer_json.name}} -->
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="number" 
                      @keydown="clearInput"
                      class="form-control " name="layers_json.value.layer"
                      :class="{ 'error': errors['layers_json.value.layer'] }" v-model="order_fill_out.layers"
                      id="layers" rules="required" />
                    <VeeField type="hidden" name="layers_json.name" :value="order_data.layers_json.name" />
                    <VeeField type="hidden" name="layers_json.option_id" :value="order_data.layers_json.id" />
                    <VeeField type="hidden" name="layers_json.option_code" :value="order_data.layers_json.code" />
                    <VeeField type="hidden" name="layers_json.type" :value="order_data.layers_json.type" />
                    <VeeField type="hidden" name="layers_json.option_value_id" value="0" />
                    <VeeErrorMessage class="error__label" name="layers_json.value.layer" />
                  </div>
                </div>
                <div class="row mb-3" v-for="(data,idx) in layers_value" :key="'T-POST-horizontal-' + idx"
                  v-if="show_multilayer">
                  <label class="label-set col-form-label col-sm-4" :for="'T_POST_horizontal' + idx">
                    <span class="text-danger">*</span>
                    {{ store.language_txt.order.text_vertical}}T{{idx+1}}
                  </label>
                  <div class="col-sm-8">
                    <VeeField type="number" 
                    @keydown="clearInput"
                      class="form-control" rules="required" :value="data"
                      :class="{ 'error': errors[`layers_json.value.layer_value[${idx}]`] }"
                      :name="`layers_json.value.layer_value[${idx}]`" :id="'layers_json.value' + idx" />
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
                    <VeeField type="number"   @keydown="clearInput" class="form-control "
                      :class="{ 'error': errors[`${order_data.c1_angle.code}.value`] }"
                      v-model="getProductOptionValue(order_data.c1_angle.code).value"
                      :name="`${order_data.c1_angle.code}.value`" id="c1_angle" rules="required" />
                    <VeeField type="hidden" :name="`${order_data.c1_angle.code}.name`"
                      :value="order_data.c1_angle.name" />
                    <VeeField type="hidden" :name="`${order_data.c1_angle.code}.option_id`"
                      :value="order_data.c1_angle.id" />
                    <VeeField type="hidden" :name="`${order_data.c1_angle.code}.option_code`"
                      :value="order_data.c1_angle.code" />
                    <VeeField type="hidden" :name="`${order_data.c1_angle.code}.type`"
                      :value="order_data.c1_angle.type" />
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
                    <VeeField type="number"  @keydown="clearInput" class="form-control "
                      :class="{ 'error': errors[`${order_data.c2_angle.code}.value`] }"
                      v-model="getProductOptionValue(order_data.c2_angle.code).value"
                      :name="`${order_data.c2_angle.code}.value`" id="c2_angle" rules="required" />
                    <VeeField type="hidden" :name="`${order_data.c2_angle.code}.name`"
                      :value="order_data.c2_angle.name" />
                    <VeeField type="hidden" :name="`${order_data.c2_angle.code}.option_id`"
                      :value="order_data.c2_angle.id" />
                    <VeeField type="hidden" :name="`${order_data.c2_angle.code}.option_code`"
                      :value="order_data.c2_angle.code" />
                    <VeeField type="hidden" :name="`${order_data.c2_angle.code}.type`"
                      :value="order_data.c2_angle.type" />
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
                    <div class="d-flex align-items-center  p-2 pt-0"
                      :class="{ 'error': errors[`${order_data.win_valance_box_plans.code}.option_value_id`] }">
                      <div class="picOption" v-for="data in order_data.win_valance_box_plans.option_values">
                        <VeeField type="radio" :id="'pelmet' + data.id"
                          :name="`${order_data.win_valance_box_plans.code}.option_value_id`"
                          v-model="order_fill_out_id.pelmet_id"
                          :value="data.id" @change="order_fill_out_id.pelmet_id = data.id" label="pelmet"
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
                        v-model="set_name(order_data.win_valance_box_plans,order_fill_out_id.pelmet_id).value"
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
                <div class="row mb-3" v-if="show_pelmet_plan_A && order_fill_out_id.pelmet_id">
                  <label class="label-set col-form-label col-sm-4" for="pelmet_A_width">
                    <span class="text-danger">*</span>
                    <!-- A方案 -->
                    {{order_data.win_final_width.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group" :class="{ 'error': errors[`${order_data.win_final_width.code}.value`] }">
                      <VeeField type="number"  @keydown="clearInput" class="form-control " :name="`${order_data.win_final_width.code}.value`"
                        v-model="getProductOptionValue(order_data.win_final_width.code).value" id="pelmet_A_width"
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
                <div class="row mb-3" v-if="show_pelmet_plan_A && order_fill_out_id.pelmet_id">
                  <label class="label-set col-form-label col-sm-4" for="pelmet_A_hight">
                    <!-- A方案 -->
                    <span class="text-danger">*</span>
                    {{order_data.win_final_height.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group"  :class="{ 'error': errors[`${order_data.win_final_height.code}.value`] }">
                      <VeeField type="number"  @keydown="clearInput" class="form-control " :name="`${order_data.win_final_height.code}.value`"
                        v-model="getProductOptionValue(order_data.win_final_height.code).value" id="pelmet_A_hight" />
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
                <div class="row mb-3" v-if="!show_pelmet_plan_A && order_fill_out_id.pelmet_id">
                  <label class="label-set col-form-label col-sm-4" for="pelmet_B">
                    <span class="text-danger">*</span>
                    {{order_data.winbox_horizontal_t_position.name}}
                  </label>
                  <div class="col-sm-8">
                    <div class="input-group" :class="{ 'error': errors['winbox_horizontal_t_position.value'] }">
                      <VeeField type="number"  @keydown="clearInput" class="form-control " name="winbox_horizontal_t_position.value"
                        id="pelmet_B" v-model="getProductOptionValue('winbox_horizontal_t_position').value"
                        rules="required" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.name"
                        :value="order_data.winbox_horizontal_t_position.name" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.option_id"
                        :value="order_data.winbox_horizontal_t_position.id" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.option_code"
                        :value="order_data.winbox_horizontal_t_position.code" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.type"
                        :value="order_data.winbox_horizontal_t_position.type" />
                      <VeeField type="hidden" name="winbox_horizontal_t_position.option_value_id"
                        value="0" />
                      <span class="input-group-text">mm</span>
                      <!-- <VeeErrorMessage class="error__label" name="pelmet.value" /> -->
                    </div>
                    <VeeErrorMessage class="error__label" name="winbox_horizontal_t_position.value" />
                  </div>
                </div>
              </div>
              <!-- special_img -->
              <div class="col-md-12 row">
                <label class="label-set col-form-label col-sm-2" for="pelmet_A_width">
                  {{order_data.attached_images.name}}
                </label>
                <div class="d-none">
                  <VeeField type="hidden" :name="`attached_images.name`" :value="order_data.attached_images.name" />
                  <VeeField type="hidden" :name="`attached_images.option_id`" :value="order_data.attached_images.id" />
                  <VeeField type="hidden" :name="`attached_images.option_code`"
                    :value="order_data.attached_images.code" />
                  <VeeField type="hidden" :name="`attached_images.type`" :value="order_data.attached_images.type" />
                </div>
                <div class="col-sm-10 mb-3 row">
                  <div class="col-sm-6 special_img" v-for="(item,idx) in special_windows_img">
                    <div class="special_img_box"
                      :class="{'no-img':!item.image && !item.value},{'error':errors[`attached_images.option_values[${idx}].file`]}">
                      <VeeField type="file" :name="`attached_images.option_values[${idx}].file`" class="upload-img"
                        accept="image/png,image/jpeg,image/jpg"
                        @change="Preview_img(values.attached_images.option_values[idx].file,idx)" />
                      <VeeField type="hidden" :name="`attached_images.option_values[${idx}].value`"
                        v-model="item.value" />
                      <img :src="show_Preview_img(item,$imgUrl(item.value))" alt="">
                    </div>
                    <div class="special_img_close">
                      <i class="fas fa-times close_btn none_position"
                        @click="del_special_windows_img(idx)"></i>
                    </div>
                    <VeeErrorMessage class="error__label" :name="`attached_images.option_values[${idx}].file`" />
                  </div>
                  <div class="col-12 text-center mt-4">
                    <i class="fa-solid fa-circle-plus fs-3 add_btn" @click="add_special_windows_img()"></i>
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
            <h2 class="title">{{ store.language_txt.order.text_option_section_note}}</h2>
            <div class="row flex-auto col-lg col-12">
              <div class="col-12">
                <div class="row">
                  <label class="label-set col-form-label col-sm-2 " for="">
                    {{ store.language_txt.order.text_option_section_note}}
                  </label>
                  <div class="col-sm-10">
                    <VeeField v-if="product_data.note !== 'null'" as="textarea" v-model="product_data.note"
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
              <nuxt-link :to="`/order-list/item?id=${product_data.order_id}`"
                class="btn sent_go me-4">{{ store.language_txt.default?.text_back}}</nuxt-link>
              <button type="submit" class="btn sent_go" :disabled="!order_fill_out_id.designType"
                v-if="show_save_btn">{{button_text()}}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </VeeForm>
</template>

<script setup>
// 壓縮圖片套件
import Compressor from 'compressorjs';
// watch優化(延遲)
import debounce from 'lodash/debounce'
const route = useRoute()
const router = useRouter()
const store = useStore()

const show_save_btn = ref(true)

const main_material = route.query.main

// 右側nav 收合
const step_box = ref(true);

// 警示框
const show_alart_box =ref(false)

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


const nav_links_state = computed(()=>{
  return is_track.value? link_items.value.track: link_items.value.windows
})

// 未通過驗證數量&警示框
const errors_count = (errors)=>{
  const count = Object.keys(errors).length;
  return count > 0? count:show_alart_box.value = false
}

const show_errors_txt = (count)=>{
  return store.language_txt.order.text_fields_need_to_be_confirmed.replace(':number',count)
}

const  click_find_label = (event)=>{

  event.target.click()
}


// 右側nav用
const currentItem = ref("");

// 表單資料
const order_data = ref();

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
    pane_corner_piece: "",
  },
  t_post:{
    average:"",
    position:[]
  },
  layers:"",
  win_stdwin_subtype:""
});

const order_fill_out_id = ref({
  material: "",
  styleType: "",
  designType: "",
  designTypeIdx:"",
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
  decorative_pane_corner_piece:"",
  decorative_height:"",
  decorative_depth:"",
  outerFrame_type:"",
  outer_frame_sides:"2217",
  outer_frame_cut_position:"",
  outer_frame_gasket_thickness:"",
  outer_frame_gasket_location:"",
  magnetic_options:"",
  blade_directions:"",
  pilar_type:"",
  pelmet_id:"",
  indooroutdoor:"",
  std_or_fixed:"",
  sldwood_material:"",
  sldwood_pre_drilled_hole:"",
});



// 飾板{{ store.language_txt.order.text_enter_manually}}
const decorativeUserInput = ref(false);
const depthUserInput = ref(false);

// 全鋁
const is_aluminum = computed (()=>{
  return order_fill_out_id.value.material == 2002
})
// 實木
const is_wood = computed (()=>{
  return order_fill_out_id.value.material == 2003
})

// 是軌道?
const is_track = computed(() => {
  // 2005軌道 2008摺疊門 2009 推拉門
  return order_fill_out_id.value.styleType == 2005 && order_fill_out_id.value.designType == 2009 || order_fill_out_id.value.designType == 2008;
});
// 是折疊門?
const is_folding_door = computed(() => {
  // 2008摺疊門
  return order_fill_out_id.value.designType == 2008;
});


// 重新渲染窗型子選項用
const win_style_key = ref(1)

// 帶出窗型子選項的option_code
const selected_win_style = computed(() => {
  const type_id = order_fill_out_id.value.styleType
    if(type_id == 2005 && order_data.value){
      return design_data.value.type.find(item => item.option_id == 1004)?.option_code
    }else if(type_id == 2004 && order_data.value){
      return design_data.value.type.find(item => item.option_id == 1003)?.option_code
    }
})


const is_IM = computed(()=>{
  return order_fill_out_id.value.imom_option_value_id == 2013
})

// 是無拉桿?
const is_none_win_lever = computed(() => {
  const win_lever = order_fill_out_id.value.win_lever
  return win_lever == 2095 || win_lever == 2344
});
// 無把手
const is_none_handle = computed (()=>{
  return order_fill_out_id.value.door_handle_type == 2215 || !order_fill_out_id.value.door_handle_type
})
// 無鎖
const is_none_lock = computed(()=>{
  return order_fill_out_id.value.lock_type == 2214 || !order_fill_out_id.value.lock_type
})
// 無下軌道
const is_none_bottom_track = computed(()=>{
  return order_fill_out_id.value.bottom_track == 2193
})
// 無飾板
const is_none_decorative_pane = computed(()=>{
  return order_fill_out_id.value.decorative_pane_type == 2165
})

const is_none_post = computed(()=>{
  return order_fill_out_id.value.pilar_type == 2209 || order_fill_out_id.value.pilar_type == 2348
})

// 不保固區塊
const show_not_warranty = ref(false)

// 異型窗
const is_special_windows = computed(()=>{
  return order_fill_out_id.value.designType == 2007
})

// 無墊片
const is_none_gasket_thickness = computed(()=>{
  return order_fill_out_id.value.outer_frame_gasket_thickness == 2202
})

// 無鑽孔
const is_none_pre_drilled_hole = computed(()=>{
  return order_fill_out_id.value.sldwood_pre_drilled_hole == 2343
})

// 葉片組數量是否<=1
const blade_numbers_1 = computed(()=>{
  const blade_numbers = +order_fill_out.value.doorSet.count;
  return blade_numbers <=1
})

// 中隔備註
const partitio_note = computed(()=>{
  return is_track.value?  store.language_txt.order?.text_note_tracktype_wsms:store.language_txt.order?.text_note_wintype_wsms
})

// 顯示拉桿分段需求
const show_add_lever = computed(()=>{
  const height = order_fill_out.value.setting.height
  const partitio_length = order_fill_out.value.partitio.length
  if(height > 1800){
    return false
  }else if(partitio_length > 0){
    return false
  }
  return true
})

// 窗型類型是否包含多層窗
const show_multilayer = computed(()=>{
  const id = 2010
  return order_fill_out_id.value.win_stdwin_subtype.includes(id) && !is_special_windows.value && !is_track.value
})

// 窗型類型是否包含轉角窗
const show_corner = computed(()=>{
  const id = 2011
  return order_fill_out_id.value.win_stdwin_subtype.includes(id) && !is_special_windows.value && !is_track.value
})

// 窗型類型是否包含窗簾盒
const show_pelmet = computed(()=>{
  const id = 2012
  return order_fill_out_id.value.win_stdwin_subtype.includes(id) && !is_special_windows.value && !is_track.value
})

// 顯示窗簾盒A或B
const show_pelmet_plan_A = computed(()=>{
  const id = 2187
  
  return order_fill_out_id.value.pelmet_id == id && !is_special_windows.value
})


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

// 鉸練顏色
const hinge_color_data = computed(()=>{
  if(!is_aluminum.value){
    return order_data.value.hinge_color
  }else{
    return order_data.value.allalu_hnge_type
  }
})

// 吸鐵資料
const magnetic_data = computed(()=>{
  if(is_aluminum.value){
    return order_data.value.allalu_catcher
  }else if(is_wood.value){
    return order_data.value.sldwood_catcher
  }else{
    return order_data.value.magnetic_catcher
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

// T柱型式
const t_post_data = computed(()=>{
  if(is_aluminum.value){
    return order_data.value.allalu_t_post
  }else if(is_wood.value){
    return order_data.value.sldwood_t_post
  }else{
    return order_data.value.plsalu_t_post
  }
})

// 按鈕文字儲存/新增切換
const button_text = ()=>{
  const product_id = route.query.product
  if(product_id){
    return store.language_txt.default?.text_save
  }else{
    return store.language_txt.default?.text_add
  }
}

const json_number_only = ($event,data)=>{
  data = $event.target.value.replace(/\D/g, '')
}

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

// 款式切換主選項
const change_styleType = () => {
  // 清空所選子選項
  delete product_options.value[selected_win_style.value]
  delete product_options.value.win_style
  order_fill_out_id.value.designType = ""
};

// 款式子選項切換主選項
const change_designType = (design,id,type_data,designIdx) => {
  order_fill_out_id.value.styleType = id
  order_fill_out.value.design.styleType = design;
  order_fill_out_id.value.designType = type_data.option_value_id
  order_fill_out_id.value.designType_option_name = design_data.value.type[designIdx].option_name
  order_fill_out_id.value.designType_option_code = design_data.value.type[designIdx].option_code
  
};
// 窗型副種類選項顯示
const show_win_stdwin_sbutype = (id) =>{
  const pelmet = 2012
  if(is_aluminum.value){
    return id !== pelmet
  }else{
    return true
  }
  
}
// 顯示語言自訂名字(外框&顏色)
const show_custom_name = (item)=>{
  // 檢查 translations 是否存在且具有所需的語言
  const customName = item.custom_translations && item.custom_translations[store.language];
  const defaultName = item.name
  return customName || defaultName
}


// select用帶optinon_value_id
const select_option_value_id = (data,value)=>{
  // 用value值去帶出選項id
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


// wsms_data
const wsms_data = computed(() => {
  if (is_track.value) {
    return [order_data.value.wsms.option_values.find(item => item.id == 2016)];
  } else {
    return order_data.value.wsms.option_values;
  }
});

// 門型類別飾板高度值
const doorType_height_value  = computed(() => {
  // 設置常數
  const TOP_PARTITION_ID = 2139;
  const PLANE_TYPE_ID = 2163;
  const PATTERN_TYPE_ID = 2164;
  const VALUE_32 = 2194;
  const VALUE_53 = 2195;
  const VALUE_140 = 2196;
  const VALUE_150 = 2197;
  
  // 判斷條件
  const hasTopPartition = order_fill_out_id.value.topPartition == TOP_PARTITION_ID;
  const isPlane = order_fill_out_id.value.decorative_pane_type == PLANE_TYPE_ID;
  const isPattern = order_fill_out_id.value.decorative_pane_type == PATTERN_TYPE_ID;
  
  if (!doorType_height.value) return null;

  const data = doorType_height.value.option_group_suboption_values;

  // 幫助函數來查找值
  const findOptionName = (valueId) => {
    const option = data.find(item => item.option_value_id == valueId);
    return option ? option.name : null;
  }

  if (is_folding_door.value) {
    if (is_IM.value) {
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

// 門型類別飾板深度
const doorType_depth = computed(() => {
  if(design_data.value.design && order_data.value){
    if(is_folding_door.value){
      return order_data.value.decorative_pane_top_depth_folding_door
    }else{
      return order_data.value.decorative_pane_top_depth_sliding_door
    }
     
  }
  
});

//  門型類別飾板深度值
const doorType_depth_value = computed(() => {
   // 刀片尺寸 == 4.5
  const blade_size = order_fill_out_id.value.blade_size == 2107 ||  order_fill_out_id.value.blade_size == 2306 ;
  const value_105 = 2173
  const value_115 = 2174
  const value_normal = 2175

  if(doorType_depth.value){
    const data = doorType_depth.value.option_values
    if(is_folding_door.value){
      return blade_size? data.find(item => item.id == value_115).name:data.find(item => item.id == value_105).name
    }else{
       return data.find(item => item.id == value_normal).name
    }
  }
});

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


// 窗戶類型多選驗證
const win_stdwin_subtype_required = (values)=>{
  if(values.win_stdwin_subtype){
    const is_values = values.win_stdwin_subtype.option_values.some(item => item.value)
    return is_values?  false:"required"
  }
}

const win_stdwin_subtype_error = (errors) => {
  const res = Object.keys(errors).find((key) => {
    return key.includes('win_stdwin_subtype.option_values') &&
           /\win_stdwin_subtype\.option_values\[\d+\]\.value$/.test(key);
  });

  return res;
};


// 驗證葉片組數量與寬度
const validateWidth = () => {
  const width = +order_fill_out.value.setting.width; // 將 width 轉為數字類型
  const blade_numbers = +order_fill_out.value.doorSet.count; // 將 blade_numbers 轉為數字類型
  const maxWidth = width / blade_numbers; // 計算每片葉片的寬度
  
  if (!blade_numbers) {
    return store.language_txt.order?.text_required; // 如果沒有填葉片組數量，返回必填訊息
  } else if (is_track.value) {
    if (is_folding_door.value) {
      // 如果是摺疊門，檢查每片葉片的寬度是否在合法範圍內
      if (maxWidth <= 228 || maxWidth >= 508) {
        return store.language_txt.order?.text_note_selected_number_of_blades_exceeded;
      }
    } else {
      // 如果是推拉門，檢查每片葉片的寬度是否在合法範圍內
      if (maxWidth <= 228) {
        show_not_warranty.value = false; // 設置為不顯示不保固標誌
        return store.language_txt.order?.text_note_selected_number_of_blades_exceeded;
      } else if (maxWidth >= 1092) {
        show_not_warranty.value = true; // 設置不保固標誌
        const is_checked = product_options.value.confirm_width_limit?.option_values[0].value;
        if (is_checked) {
          return true; // 如果已確認，返回 true
        } else {
          return false; // 如果未確認，返回錯誤訊息
        }
      }
    }
  }
  show_not_warranty.value = false; // 設置為不顯示不保固標誌
  return true; // 如果所有條件都符合，返回 true
};



const doorSet_comment = computed(() => {
  if(is_track.value){
    if(is_folding_door.value){
      return store.language_txt.order?.text_note_folding_width_limit
    }else{
      return store.language_txt.order?.text_note_track_bypass_t_post_width_limit
    }
  }
});

const show_info_img = (e) => {
  const currentNavImg = e.currentTarget.querySelector('.nav-img');

  // 顯示目標圖片
  currentNavImg.classList.toggle('show-img');

  //移除其他圖片
  document.querySelectorAll('.nav-img').forEach(function (navImg) {
    if (navImg !== currentNavImg) {
      navImg.classList.remove('show-img');
    }
  });
}

// 中隔
const partitio =  ref({ 
    division_height:"", 
    division_center:"",
    division_no_move:"",
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
    partitio[0].division_height = (total_height / 2)
  }else{
    partitio[idx].division_height = (total_height - partitio[idx - 1].division_height )/2 + partitio[idx - 1].division_height
  }
}

// 監視中隔的變化
watch(() => order_fill_out.value.partitio, (newPartitio, oldPartitio) => {
  const total_height = +order_fill_out.value.setting.height
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


// T-POST---------------------------

// 選擇T柱型式起碼添加一個T位置，選擇無則取消
const select_T_post = ()=>{
  const t_post = order_fill_out.value.t_post.position
  if(!is_none_post.value && t_post.length <= 0){
    add_t_post()
  }else if(is_none_post.value){
    order_fill_out.value.t_post.position = []
  }
}

const add_t_post = ()=>{
  order_fill_out.value.t_post.position.push({t_post_value:""})
}
const del_t_post = (idx)=>{
  order_fill_out.value.t_post.position.splice(idx, 1)
}

// T-POST 均分算式
const calculate_T_POST = (idx)=>{
  const width = +order_fill_out.value.setting.width
  const t_post = order_fill_out.value.t_post.position
  if(idx == 0){
    t_post[0].t_post_value = Math.floor(width / (t_post.length + 1) )
  }else{
    t_post[idx].t_post_value = Math.floor(t_post[0].t_post_value + t_post[idx - 1].t_post_value)
  }
  
}
// WATCH均分
watch(() => order_fill_out.value.t_post, (newVal, oldVal) => {
  const checked =  newVal.setting 
  if(!!checked){
    newVal.position.map((item,idx)=>{
      calculate_T_POST(idx)
    })
  }

  }, {
    deep: true // 深度監視
  });

  watch(() => order_fill_out.value.setting.width, debounce((newVal, oldVal) => {
  if (!is_track.value) {
    const checked = order_fill_out.value.t_post.setting;
    if (!!checked) {
      order_fill_out.value.t_post.position.forEach((item, idx) => {
        calculate_T_POST(idx);
      });
    }
  }
}, 300)); // 300ms 的 debounce 時間，可根據需要調整



  // 水平
const layers_value = ref([])

// 水平T控制數量
watch(() => order_fill_out.value.layers, (newVal, oldVal) => {
  if (newVal > 0) {
    layers_value.value.length = newVal - 1;
  } else {
    layers_value.value.length = 0; 
  }
},{
    deep: true // 深度監視
})


// T-POST_end--------------------------


// 輔料需求------------
const auxiliary = ref([]);

const add_auxiliary = () => {
  const auxiliaryBlock = ref([
    { auxiliary_width: "", auxiliary_height: "", auxiliary_length: "", auxiliary_quantity: "" },
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
    const height = +order_fill_out.value.setting.height;

    // 防止重複添加中隔
    if (height > 1800 && order_fill_out.value.partitio.length < 1) {
      order_fill_out.value.partitio.push({ ...partitio.value });
    }

    // 使用 debounce 函數減少不必要的計算次數
    debounce(() => {
      // 根據新的高度調整所有中隔的位置
      order_fill_out.value.partitio.forEach((item, idx) => {
        if (item.division_center === "Y" && height > 0) {
          calculatePartitioPosition(idx);
        }
      });
    }, 300)();
  }
});

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
        special_windows_img.value[idx].image = reader.result;
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
  const note = values.note || ""
  const sqm = +values.win_width.value * values.win_height.value / 1000000
  delete values.quantity
  delete values.note

  // 將values轉成陣列並加入id
  const arr_values = Object.keys(values).map((key, idx) => {
    const order_id = main_order_id;
    // 保留key值用
    const key_id = key
    return {
        ...values[key],
        order_id,
        key_id
    }
  });

  // 重組
  const new_values = arr_values.reduce((new_obj, item) => {
    // 保留key值並帶入
    const key = item.key_id 
    // 刪除values裡面的key_id(用不到了)
    delete item.key_id;

    const is_json = json_data.find(item => item == [key])
    const is_cut_track = cut_tracks_data.find(item => item == [key])
    if (is_json) {
      // 如果是type是json格式則轉json
      item.value = JSON.stringify(item.value)
    } else if (is_cut_track) {
      // 是非必填checkbox且空值則跳過
      if (!item.option_values[0]?.value) {
        return new_obj;
      }
    } else if ([key] == 'win_stdwin_subtype') {
      // 窗型類別(只保留有value值的) 
      item.option_values = item.option_values.filter(item => item.value)
      item.option_values = item.option_values.map((v, index) => {
        if (index < order_data.value.win_stdwin_subtype.option_values.length) {
          const correspondingOption = order_data.value.win_stdwin_subtype.option_values[index];
          return {
            option_value_id: correspondingOption.id,
            value: v.value
          };
        }
        return v; // 如果索引超過範圍，保持原始對象
      });

    } else if(item.type == 'images'){
      // 圖片非必填，所以只保留有value(舊圖)或是新圖，都沒有則跳過
      if(item.option_values){
        item.option_values = item.option_values.filter(item => item.file?.size || item.value)
      }
      if(!item.option_values || item.option_values.length <= 0 ) {
        return new_obj;
      }
    }
    if([key] == `${order_fill_out_id.value.material_code}_win_frame`){
      // console.log(item);
    }
    if(!item.type){
      alert('err',[key])
      console.log([key]);
      console.log(item);
    }
    if(item.type !== 'checkbox' && item.type !== 'images' && !item.value){
      if([key] !== 'decorative_pane_corner_piece'){
        alert('err',[key])
        console.log([key]);
        console.log(item);
      }
    }
    // if(item.type !== 'checkbox' || item.type !== 'images' && !item.value){
    //   return new_obj;
    // } 
      

    // 把處理後的資料 加到新物件中
    new_obj[key] = item
    
    return new_obj;
  }, {});


  const submit_data = {
    order_id:main_order_id,
    material:order_fill_out_id.value.material_code,
    name:new_values.win_material.value + new_values.win_type.value + new_values[selected_win_style.value].value,
    quantity,
    note,
    sqm,
    order_product_options:new_values
  }
  if(product_data.value.id){
    submit_data.id = product_data.value.id
  }
  // console.log(submit_data);
  await store.add_product(submit_data)
  router.push(`/order-list/item?id=${main_order_id}`)
};




// 欄位
const get_order_data = async() => {
  const url = `${store.baseUrl}api/v2/catalog/options/list?lang=${store.language}&limit=0`
  try{
    const res = await fetch(url,{
      headers:{
        "Authorization": "Bearer " + store.userData.jwtToken
      }
    })
    if(res.ok){
      const data = await res.json()
      order_data.value = data.response.data
      Object.values(order_data.value).forEach(data =>{
        if(data.option_values){
          data.option_values.forEach(value => {
            value.name = value.name.replace(/\(/g, '\n(').replace(/\)/g, ')\n');
        });
        }
      })
      // console.log("全部",order_data.value);
    }else{
      console.log("err",err);
    }
  }catch(err){
    console.log(err);
  }
};


// 材料資料
const get_material_data = async() => {
  const url = `${store.baseUrl}api/v2/catalog/options/info?lang=${store.language}&equal_code=win_material`
  try{
    const res = await fetch(url,{
      headers:{
        "Authorization": "Bearer " + store.userData.jwtToken
      }
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

// 設計資料&
const get_design_data = async (id) => {
  order_fill_out_id.value.designType = ""
  win_style_key.value++
  design_data.value = {}
  material_color.value = []
  design_data.value.type = []
  const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=${store.language}&equal_option_value_ids=${id}`
  try {
    const response = await fetch(url,{
        headers:{
            "Authorization": "Bearer " + store.userData.jwtToken
        }
    });
    const data = await response.json();
    
    // 窗型/軌道型主選項
    design_data.value.design =
      data.response.option_group_suboptions.win_type

      get_material_color()

    
  } catch (error) {
    console.log(error);
  }
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
};

// 材質顏色
const get_material_color = async ()=>{
  const code = order_fill_out_id.value.material_code + '_color'
  const url = `${store.baseUrl}api/v2/dealers/option/list?locale=${store.language}`
  try{
    const res = await fetch(url,{
       headers:{
            "Authorization": "Bearer " + store.userData.jwtToken
        }
    })
    const data = await res.json()
    if(res.ok && !data.error){
      const colors = Object.values(data.response.data).find(item => item.code == code)
      // console.log(colors)
      if(colors){
        material_color.value = colors
      }else{
        alert('顏色未授權')
      }
    }
  }catch(err){
    console.log('error',err);
  }
}

// 外框
const get_outer_frame = async ()=>{
  const code =   order_fill_out_id.value.material_code + '_win_frame'

  const url = `${store.baseUrl}api/v2/dealers/option/list?locale=${store.language}`
  try{
    const res = await fetch(url,{
       headers:{
            "Authorization": "Bearer " + store.userData.jwtToken
        }
    })
    const data = await res.json()

    if(res.ok && !data.error){
      const outer_frames = Object.values(data.response.data).find(item => item.code == code)
      if(outer_frames){
        doorType_outerFrame.value = Object.values(data.response.data).find(item => item.code == code)
      }else{
        alert('未授權')
      }
    }
  }catch(err){
    console.log('error',err);
  }
}

// 把手顏色
const get_handle_color = async (id) => {
  handle_color.value = []
  const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=${store.language}&equal_option_value_id=${id}&equal_level=0`
  try {
    const res = await fetch(url,{
      headers:{
          "Authorization": "Bearer " + store.userData.jwtToken
      }
    });
    const data = await res.json();
    handle_color.value = data.response.option_group_suboptions.door_handle_color.option_group_suboption_values;
  
  } catch (err) {
    console.log(err);
  }
};

// 鎖顏色
const get_lock_color = async (id) => {
  lock_color.value = []
  const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=${store.language}&equal_option_value_id=${id}&equal_level=0`;
  try {
    const res = await fetch(url,{
      headers:{
            "Authorization": "Bearer " + store.userData.jwtToken
    }
    });
    const data = await res.json();
    lock_color.value = data.response.option_group_suboptions.door_lock_color.option_group_suboption_values;
  } catch (err) {
    lock_color.value =[]
    console.log(err);
  }
};

// 下軌道顏色
const get_door_track = async () => {
  try {
    const design = order_fill_out_id.value.designType;
    const url = `${store.baseUrl}api/v2/catalog/option_groups/info?lang=${store.language}&equal_option_value_ids=${design}`;
    if (design) {
      const res = await fetch(url,{
        headers:{
            "Authorization": "Bearer " + store.userData.jwtToken
        }
      });
      const data = await res.json();
      doorType_height.value = data.response.option_group_suboptions.decorative_pane_height
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
      const data = doorType_depth.value.option_values.find((item)=>item.name == doorType_depth_value.value) 
      order_fill_out_id.value.decorative_depth =  data?.id
     
  }
})

const set_default_value = ()=>{
  const product = route.query.product
  if(!product){
    // 吸鐵
    order_fill_out_id.value.magnetic_options = 2101
    if(!is_aluminum.value){
      // 鉸鍊
      order_fill_out_id.value.hinge_color = 2100
    }
  }
}



// ----------------------------------------編輯&查看
const product_data = ref({})
const product_options = ref({})
const order_material = ref()
const order_status = ref()
const is_examine = route.query.mode

const get_product_data = async()=>{
  const product_id = route.query.product
  const order_id = route.query.id
  if(order_id && product_id){
    const url = `${store.baseUrl}api/v2/sales/orders/info?locale=${store.language}&equal_id=${order_id}`
    try{
      const res = await fetch(url,{
        headers:{
          "Authorization": "Bearer " + store.userData.jwtToken
        }
      })
      const data = await res.json()
      if(res.ok){
        order_material.value = data.response.material
        order_status.value = data.response.status_code
        product_data.value = data.response.order_products.find(item => item.id == product_id)
        product_options.value = product_data.value.order_product_options
        Object.keys(product_data.value.order_product_options).map(key =>{
          const is_json = product_data.value.order_product_options[key].type == "json"
          if(is_json){
            product_data.value.order_product_options[key].value = JSON.parse(product_data.value.order_product_options[key].value)
          }
        })
        // console.log( product_options.value);
        // console.log('商品',product_data.value);
      }
    }catch(err){
      console.log('error',err);
      router.push("/error")
    }
  }
}

// 有訂單資料賦予欄位資料ID&value
watch(() => product_options.value, async (newVal, oldVal) => {
  if(newVal.win_material){
    // console.log("執行");
    order_fill_out_id.value.material = newVal.win_material.option_value_id
    order_fill_out_id.value.material_code = order_material.value
    await get_design_data(product_options.value.win_material.option_value_id)
    order_fill_out_id.value.styleType = newVal.win_type.option_value_id
    let subtype
    let subtype_idx
    if(newVal.win_win_subtype){
      subtype = newVal.win_win_subtype
      subtype_idx = 0
    }else if(newVal.win_track_subtype){
      subtype = newVal.win_track_subtype
      subtype_idx = 1
    }
    order_fill_out_id.value.designType = subtype.option_value_id
    order_fill_out_id.value.designTypeIdx = subtype_idx
    order_fill_out_id.value.designType_option_name = subtype.name

  // 基本設定
    if(is_aluminum.value){
      // 室內室外
      if(newVal.indooroutdoor){
        order_fill_out_id.value.indooroutdoor = newVal.indooroutdoor.option_value_id
      }
      // 標準固定
      if(newVal.std_or_fixed){
        order_fill_out_id.value.std_or_fixed = newVal.std_or_fixed.option_value_id
      }
    }
    // 寬
    order_fill_out.value.setting.width = newVal.win_width.value
    // 高
    order_fill_out.value.setting.height = newVal.win_height.value
    // wsms
    order_fill_out_id.value.wsms_option_value_id = newVal.wsms.option_value_id
    order_fill_out.value.setting.sizeStandards = newVal.wsms.value
    // imom
    order_fill_out_id.value.imom_option_value_id = newVal.imom.option_value_id
    order_fill_out.value.setting.measurementStandards = newVal.imom.value
    // 材質顏色
    order_fill_out_id.value.setting_color = newVal[`${order_fill_out_id.value.material_code}_color`].option_value_id
    // 實木材質
    if(newVal.sldwood_material){
      order_fill_out_id.value.sldwood_material = newVal.sldwood_material.option_value_id
    }
  
    
  // 門片
    // 拉桿
    order_fill_out_id.value.win_lever = newVal[win_lever_data.value.code].option_value_id
    // 葉片尺寸
    order_fill_out_id.value.blade_size =  newVal[blade_size_data.value.code].option_value_id
    // 葉片數量
    order_fill_out.value.doorSet.count = newVal.blade_numbers.value
    // 鉸練
    order_fill_out_id.value.hinge_color = newVal[hinge_color_data.value.code].option_value_id
    // 把手
    if(!is_aluminum.value){
      order_fill_out.value.doorSet.lockHandle.title = newVal.door_handle_type.value
      order_fill_out_id.value.door_handle_type = newVal.door_handle_type.option_value_id
    }

    // 把手顏色
    if(newVal.door_handle_color){
      await get_handle_color(newVal.door_handle_type.option_value_id)
      order_fill_out_id.value.lockHandle_color = newVal.door_handle_color.option_value_id
    }

    // 邊框類型
    if(newVal.window_frame_type){
      order_fill_out_id.value.door_frame = newVal.window_frame_type.option_value_id
    }
    
    // 折疊方式
    if(newVal.folding_method){
      order_fill_out_id.value.folding_method = newVal.folding_method.option_value_id
    }
    // 中隔
    if(newVal.dividers_json){
      order_fill_out.value.partitio = newVal.dividers_json.value
    }
    
    // 輔料
    if(newVal.auxiliaries){
      auxiliary.value = newVal.auxiliaries.value
    }
    
  // 窗型
    if(!is_track.value){
      if(!is_special_windows.value){
      // 窗類型
        await set_win_subtype(newVal.win_stdwin_subtype)
      }
    // 外框
      // 框型
      order_fill_out_id.value.outerFrame_type = newVal[`${order_fill_out_id.value.material_code}_win_frame`].option_value_id
      // 邊數
      order_fill_out_id.value.outer_frame_sides = newVal.outer_frame_sides.option_value_id
      // 切窗台
      order_fill_out_id.value.outer_frame_cut_position = newVal.outer_frame_cut_position.option_value_id
      // 厚度
      order_fill_out_id.value.outer_frame_gasket_thickness = newVal.outer_frame_gasket_thickness.option_value_id
      // 墊片位置
      if(newVal.outer_frame_gasket_location){
        order_fill_out_id.value.outer_frame_gasket_location = newVal.outer_frame_gasket_location.option_value_id
      }
      // 鑽孔
      if(newVal.sldwood_pre_drilled_hole){
        order_fill_out_id.value.sldwood_pre_drilled_hole = newVal.sldwood_pre_drilled_hole.option_value_id
      }



    // 門片
      order_fill_out_id.value.blade_arrangement = newVal.blade_arrangement.option_value_id
      order_fill_out_id.value.magnetic_options = newVal[magnetic_data.value.code].option_value_id
      // 葉片組開合方向
      if(newVal.blade_directions){
        order_fill_out_id.value.blade_directions = newVal.blade_directions.option_value_id

      }
       // 鎖
       order_fill_out_id.value.lock_type = newVal[door_lock_type_data.value.code].option_value_id
      if(newVal.door_lock_color){
        await get_lock_color(newVal.door_lock_type.option_value_id)
        order_fill_out_id.value.door_lock_color = newVal.door_lock_color.option_value_id
      }
      // T柱
      order_fill_out_id.value.pilar_type = newVal[t_post_data.value.code].option_value_id
      if(newVal.t_post_json){
        order_fill_out.value.t_post.position = newVal.t_post_json.value.height
        order_fill_out.value.t_post.setting = newVal.t_post_json.value.t_post_average
      }
      // 其他
      // 層數+水平T
      if(newVal.layers_json){
        order_fill_out.value.layers = newVal.layers_json.value.layer
        if(newVal.layers_json.value.layer > 1){
          layers_value.value = newVal.layers_json.value.layer_value
        }
      }
      // 窗簾盒方案
      if(newVal.win_valance_box_plans){
        order_fill_out_id.value.pelmet_id = newVal.win_valance_box_plans.option_value_id
      } 
      // console.log('窗型end'); 

    }
    
    // 軌道
    if(is_track.value){
      // console.log('軌道');
      // 軌道樣式
      order_fill_out_id.value.topPartition = newVal.win_option_top_track.option_value_id
      order_fill_out_id.value.side_partition = newVal.win_option_side.option_value_id
      order_fill_out_id.value.bottom_partition = newVal.win_option_bottom.option_value_id
      order_fill_out_id.value.upper_track_color = newVal.upper_track_color.option_value_id
      order_fill_out_id.value.bottom_track = newVal.door_down_track.option_value_id
      if(newVal.lower_track_color){
        order_fill_out_id.value.lower_track_color = newVal.lower_track_color.option_value_id
      }
      if(!is_folding_door.value){
        order_fill_out_id.value.track_fixed = newVal.is_uplow_track_fixed.option_value_id
        order_fill_out_id.value.door_openclose = newVal.door_openclose.option_value_id
      }

      // 飾板
      order_fill_out_id.value.decorative_pane_type = newVal.decorative_pane_type.option_value_id
      if(newVal.decorative_pane_corner_piece){
         order_fill_out_id.value.decorative_pane_corner_piece = newVal.decorative_pane_corner_piece.option_value_id
      }
      // 深度自行輸入
      if(newVal.decorative_pane_top_depth_manually){
        depthUserInput.value = newVal.decorative_pane_top_depth_manually.option_values[0].value
      }
      // 高度自行輸入
      if(newVal.decorative_pane_height_manually){
        decorativeUserInput.value = newVal.decorative_pane_height_manually.option_values[0].value
      }

      
      // console.log('軌道end');
    }

    // 圖片
    if(newVal.attached_images){
      special_windows_img.value = newVal.attached_images.option_values
    }
    store.show_loading(false)
  }
  
});
// 有訂單資料賦予欄位資料ID&value
watch(() => product_options.value, async (newVal, oldVal) => {
  if(newVal.win_width){
    order_fill_out.value.setting.width = newVal.win_width.value
  }
  if(newVal.win_height){
    order_fill_out.value.setting.height = newVal.win_height.value
  }
  if(newVal.blade_numbers){
    order_fill_out.value.doorSet.count = newVal.blade_numbers.value
  }
  
  
},{
    deep: true // 深度監視
})

// 設置已選窗型類型(多型窗、窗簾盒...)
const set_win_subtype = (item)=>{
  let temp = []
  Object.values(item.option_values).map(subtype => {
        if(subtype.option_value_id && subtype.value){
          temp.push(subtype.option_value_id)
        }
        order_fill_out_id.value.win_stdwin_subtype = temp
  })
}

// 帶資料的值 v-model
const getProductOptionValue = (code, idx) => {
  return computed({
    // 獲取值
    get: () => {
      const checkbox_item = ['win_option_bottom_cut_track','win_option_top_cut_track','confirm_bay_window','confirm_width_limit','decorative_pane_top_depth_manually','decorative_pane_height_manually','sldwood_build_out_thickness_manually']
      // 窗型類別帶值
      if (code === 'win_stdwin_subtype') {
        return product_options.value[code] ? product_options.value[code].option_values[idx]?.value : "";
      // checkbox
      } else if (checkbox_item.find(item => item == code)) {
        return product_options.value[code] ? product_options.value[code].option_values[0]?.value : "";
      } else {
        return product_options.value[code] ? product_options.value[code].value : "";
      }
    },
    // 設置新值
    set: (newValue) => {
      const checkbox_item = ['win_option_bottom_cut_track','win_option_top_cut_track','confirm_bay_window','confirm_width_limit','decorative_pane_top_depth_manually','decorative_pane_height_manually','sldwood_build_out_thickness_manually']
     
      // 如果product沒有該欄位則新增並給值
      if (!product_options.value[code]) {
        if (code === 'win_stdwin_subtype') {
          // product_options.value[code] = [];
          // product_options.value[code].option_values[idx] = { value: newValue };
          product_options.value[code] = { option_values: [{ value: newValue }] };
        } else if (checkbox_item.find(item => item == code)) {
          product_options.value[code] = { option_values: [{ value: newValue }] };
        } else if(code == 'blade_arrangement'){
          product_options.value[code] = {value:newValue.toUpperCase()};
        }else {
          product_options.value[code] = { value: newValue };
        }
      // 有的話直接給新值
      } else {
        if (code === 'win_stdwin_subtype') {
          if (!product_options.value[code].option_values[idx]) {
            product_options.value[code].option_values[idx] = { value: newValue };
          } else {
            product_options.value[code].option_values[idx].value = newValue;
          }
        } else if (checkbox_item.find(item => item == code)) {
          if (!product_options.value[code].option_values) {
            product_options.value[code].option_values = [{ value: newValue }];
          } else {
            product_options.value[code].option_values[0].value = newValue;
          }
        } else if(code == 'blade_arrangement'){
          product_options.value[code].value = newValue.toUpperCase();
        }else {
          product_options.value[code].value = newValue;
        }
      }
    }
  });
};

// 設置欄位value(根據所選id帶出選項的value)
const set_name = (data,id) => {
  return computed({
    // 獲取值
    get: () => {
      if(!id || !data){
        return ''
      }
      if(data.option_id == '1002' || data.option_id == '1003' || data.option_id == '1004' || data.option_id == '1071'){
        const value = data.option_group_suboption_values.find(item => item.option_value_id == id)
      
        return value? value.name:""
      }else if(data.code == order_fill_out_id.value.material_code + '_color'){   //材質顏色
        const value = data.option_values.find(item => item.id == id);
        if(value){
          const new_value = value.code + ' ' + show_custom_name(value)
          return new_value
        }else{
          return ""
        }
      }else{
        const test = data.option_values.find(item => item.id == id);
        return test ? test.name : "";
      }
    },
    // 設置新值
    set: (newValue) => {
      
    }
  });
}



// 顯示主要材質
const show_main_material = (item)=>{ 
  const is_none_status = !order_status.value
  const Draft = order_status.value == 'Draft'
  const Pending = order_status.value == 'Pending'
  const view_mode = route.query.view
  // 確認中狀態-- 只有經銷商可改
  if(Pending && !store.is_dealer && !is_none_status || view_mode){
    examine_mode()
    show_save_btn.value = false
    // 草稿、確認中以外都不能改
  }else if(!Draft && !Pending && !is_none_status){
    examine_mode()
    show_save_btn.value = false
  }
  
  // 如果有帶商品id則只顯示主要材質，如沒有則全顯示
  const product = route.query.product
  if(main_material || product){
    return order_fill_out_id.value.material_code == item.code ||main_material == item.code
  }else{
    return true
  }
 
}


// 全部更改成disabled
const examine_mode = ()=>{
  nextTick(()=>{
    $('.main_form input').attr('disabled',true)
    $('.main_form select').attr('disabled',true)
    $('.main_form textarea').attr('disabled',true)
    $('.main_form .close_btn').hide()
    $('.main_form .add_btn').hide()
  })
}


store.show_loading(true)
onMounted(async() => {
  window.addEventListener("scroll", handleScroll);
  await get_order_data();
  get_product_data()
  get_material_data();
  set_default_value()

  // 沒有的話則在watch賦予值之後才關
  const product = route.query.product
  if(main_material || !product){
    store.show_loading(false)
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

