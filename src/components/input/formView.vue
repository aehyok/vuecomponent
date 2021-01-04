<template>
  <div>
    <div
        v-for="(item,index) in columnList"
        :key="index"
      >
      <!--文本框Input-->
      <TextView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='string'" />
      <!--文本框Input-->
      <TextAreaView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='textarea'" />
      <!--数值框Number-->
      <NumberView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='number'" />
      <!--日期控件调用--->
      <DateView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='date'" />
      <!--日期控件调用--->
      <DateRangeView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='daterange'" />
      <!--单选框Radio-->
      <RadioView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='radio'" />
      <!--多选框CheckBox-->
      <CheckBoxView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='checkbox'" />
      <!--多选框CheckBox-->
      <SelectView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='select'" />
      <!--上传图片组件-->
      <ImageUploadView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='image'" />
      <!--上传图片组件-->
      <VideoUploadView
        :column="item"
        :data.sync="formData[item.name]"
        v-if="item.type.toLowerCase() ==='video'" />
    </div>
  </div>
</template>
<script>
import TextView  from '@/components/input/item/textView'
import TextAreaView from '@/components/input/item/textAreaView'
import NumberView  from '@/components/input/item/numberView'
import DateView  from '@/components/input/item/dateView'
import RadioView  from '@/components/input/item/radioView'
import CheckBoxView from '@/components/input/item/checkboxView'
import DateRangeView from '@/components/input/item/dateRangeView'
import SelectView from '@/components/input/item/selectView'
import ImageUploadView from '@/components/input/item/imageUploadView'
import VideoUploadView from '@/components/input/item/videoUploadView'
export default {
  components: {
    TextView,
    TextAreaView,
    NumberView,
    DateView,
    RadioView,
    CheckBoxView,
    DateRangeView,
    SelectView,
    ImageUploadView,
    VideoUploadView,
  },
  props:{
    columnList: {
      type: Array,
      default:() => [],
    },
    formData: {
      type: Object,
      default:() => {},
    },
  },
  created(){
    console.log(this,'this.formView')
  },
  data() {
    return {
      formListItem: [

      ],
    }
  },
}
</script>
<style scoped>

</style>
