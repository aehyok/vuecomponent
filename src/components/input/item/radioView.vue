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
  </div>
</template>
<script>
import { getContentTypeList } from '@/mock/api'
export default {
  props: {
    column: {
      type: [Object],
      default: () => {},
    },
    data: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      rules: [
        {
          required: this.column.required,
          message: '请选择' + this.column.title,
        },
      ],
      list: [],
    }
  },
  created() {
    this.getList()
  },
  computed: {
    value: {
      get: function() {
        return this.data
      },
      set: function(val) {
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
      alert(e)
      console.log(e)
    },
  },
}
</script>
