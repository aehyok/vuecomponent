<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    @opened="handleOpen"
    @closed="handleClose"
  >
    <el-form label-width="120px">
      <el-form-item label="名称：">{{ source.name }}</el-form-item>
      <el-form-item label="内容：">{{ source.description }}</el-form-item>
      <el-form-item label="更新时间：">{{
        source.updatedAt | formatDate
      }}</el-form-item>
      <el-form-item label="提交人：">{{ source.updatedBy }}</el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { format } from 'date-fns'
export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },

  components: {},
  filters: {
    formatDate(data) {
      if (data) {
        return format(new Date(data), 'yyyy-MM-dd')
      }
      return ''
    },
  },
  data() {
    return {}
  },
  computed: {
    title() {
      return '民意调查详情'
    },
  },

  methods: {
    handleOpen() {
      console.log(this.source)
    },
    handleClose() {},

    save() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
