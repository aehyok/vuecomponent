<template>
  <div>
    <div v-for="(item, index) in columnList" :key="index">
      <component
        :is="item.type + 'View'"
        :column="item"
        :formData="formData"
        :data.sync="formData[item.name]"
      />
      <!--文本框Input-->
      <!-- <TextView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'text'"
      /> -->
      <!--文本框Input-->
      <!-- <TextAreaView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'textarea'"
      /> -->
      <!--数值框Number-->
      <!-- <NumberView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'number'"
      /> -->
      <!--日期控件调用--->
      <!-- <DateView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'date'"
      /> -->
      <!--日期控件调用--->
      <!-- <DateRangeView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'daterange'"
      /> -->
      <!--开关两个值switch-->
      <!-- <SwitchView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'switch'"
      /> -->
      <!--单选框Radio--两个到五个值，五个以上用下拉-->
      <!-- <RadioView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'radio'"
      /> -->
      <!--多选框CheckBox--两个到五个值，五个以上用下拉--->
      <!-- <CheckBoxView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'checkbox'"
      /> -->
      <!--多选框CheckBox--单选--->
      <!-- <SelectView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'select'"
      /> -->
      <!--上传组件-->
      <!-- <ImageView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() === 'image'"
      /> -->
    </div>
  </div>
</template>
<script>
import textView from '@/components/input/item/textView'
import textareaView from '@/components/input/item/textareaView'
import numberView from '@/components/input/item/numberView'
import dateView from '@/components/input/item/dateView'
import switchView from '@/components/input/item/switchView'
import radioView from '@/components/input/item/radioView'
import checkboxView from '@/components/input/item/checkboxView'
import daterangeView from '@/components/input/item/daterangeView'
import selectView from '@/components/input/item/selectView'
import imageView from '@/components/input/item/imageView'

export default {
  components: {
    textView,
    textareaView,
    numberView,
    dateView,
    daterangeView,
    switchView,
    radioView,
    checkboxView,
    selectView,
    imageView,
  },
  props: {
    columnList: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    console.log(this, 'this.formView')
  },
  data() {
    return {
      formListItem: [],
    }
  },
}
</script>
<style scoped></style>
