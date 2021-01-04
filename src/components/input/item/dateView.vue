<!--日期格式类型-->
<template>
  <div>
    <el-form-item :label="column.title" :prop="column.name">
        <el-date-picker
          v-model="value"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    column: {
      type: [Object],
      default: () => {},
    },
    data: {
      type: Number,
      default: 0,
    },
  },
  data(){
    return {
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() < Date.now()
        // },
      },
   }
  },
  computed: {
    value: {
      get: function() {
        return this.data
      },
      set: function(val) {
        console.log(val,'sssssss')
        this.$emit('update:data',val)
      },
    },
  },
}
</script>
