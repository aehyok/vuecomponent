<template>
  <el-button v-bind="$attrs" v-on="$listeners" @click="handleClick">{{
    tips[textType].buttonName
  }}</el-button>
</template>
<script>
export default {
  props: {
    textType: {
      type: String,
      default: 'delete',
    },
  },
  data() {
    return {
      tips: {
        delete: {
          title: '是否删除',
          buttonName: '删除',
          content: '删除后，该数据将无法恢复',
        },
        open: {
          title: '是否启用',
          buttonName: '启用',
          content: '启用后，该数据将变成可用状态',
        },
        stop: {
          title: '是否停用',
          buttonName: '停用',
          content: '停用后，该数据将无法使用，如需使用，需要重新启用该数据',
        },
        audit: {
          title: '是否提交审核',
          buttonName: '提交审核',
          content: '确认后，该条数据将进入审核状态',
        },
        questionDelete: {
          title: '是否删除',
          buttonName: '删除',
          content: '删除后已经发布EPG、公众号的内容将不再显示',
        },
      },
    }
  },
  methods: {
    handleClick() {
      this.$confirm(
        `${this.tips[this.textType].content}`,
        `${this.tips[this.textType].title}`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          this.$emit('confirm')
        })
        .catch(() => {
          // 取消报错
          this.$message({
            type: 'info',
            message: `已取消${this.tips[this.textType].buttonName}`,
          })
        })
    },
  },
}
</script>
