<!--radio 单选框-->
<template>
  <el-form-item
  :label="column.title"
  :prop="column.name">
    <el-radio-group
    v-model="value">
      <el-radio
        v-for="item in list"
        :label="item.id"
        :key="item.id">
        {{item.text}}
      </el-radio>
    </el-radio-group>
</el-form-item>
</template>
<script>
import { formItemMixin } from '@/components/input/item/formItemMixins.js'
export default {
  mixins: [formItemMixin],
  props:{
    column:{
      type: [Object],
      default: () => {},
    },
    data: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    value: {
      get: function() {
        return this.data
      },
      set: function(val) {
        this.$emit('update:data',val)
      },
    },
  },
}
</script>
