<!--radio 单选框-->
<template>
  <div>
    <el-form-item :label="column.title" :prop="column.name" :rules="rules">
      <el-radio-group v-model="value" @change="radioChange">
        <el-radio v-for="item in list" :label="item.id" :key="item.id">
          {{ item.text }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-for="(control, index) in column.controls" :key="index">
      <div v-if="value === control.value">
        <FormView :columnList="control.showCondition" :formData="formData" />
      </div>
    </div>
  </div>
</template>
<script>
import { getContentTypeList } from '@/mock/api'
export default {
  // 组件嵌套如何引用的问题
  components: {
    FormView: () => import('@/components/input/formView'),
  },
  props: {
    column: {
      type: [Object],
      default: () => {},
    },
    formData: {
      type: [Object],
      default: () => {},
    },
    data: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      list: [],
      rules: [
        {
          // 加上双？？，防止出现选中后提示请选择"this.column.title"
          required: this.column.required ?? false,
          message: '请选择' + this.column.title,
          trigger: 'change',
        },
      ],
    }
  },
  created() {
    this.getList()
    console.log(this.column, 'this.radioView')
    console.log(this.column.required, 'required')
  },
  computed: {
    value: {
      get: function() {
        return this.data
      },
      set: function(val) {
        console.log(val, typeof val, 'this.radioView.val')
        this.$emit('update:data', val)
      },
    },
  },
  methods: {
    getList() {
      getContentTypeList().then(res => {
        this.list = res.data
        console.log(res.data, 'getContentTypeList')
      })
    },
    // radio change事件去切换控制其他组件，或者其他几个组件（先考虑控制一个）
    // 要通过一个字段控制，如果是这个字段，则可以进行控制切换状态
    radioChange(e) {
      console.log(e, this.column, 'this.radioChange')
    },
  },
}
</script>
