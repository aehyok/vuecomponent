<template>
  <el-row class="messageView" v-loading="loading">
    <el-row>
      <span>提交人：{{ item.auditor }}</span>
      <span style="margin-left:60px"
        >更新时间：{{ item.updatedAt | formatDate }}</span
      >
    </el-row>
    <el-col :span="11">
      <el-row style="text-align:center">变更后</el-row>
      <el-row>消息名称：{{ afterContent.messageName }}</el-row>
      <el-row>有效日期：{{ afterContent | validDateText }}</el-row>
      <el-row>弹出时间：{{ afterContent | playTimeText }}</el-row>
      <el-row>内容类型：{{ typeMap[afterContent.type] }}</el-row>
      <p>弹窗内容：</p>
      <el-image :src="afterContent.imageUrl"></el-image>
    </el-col>
    <el-col :span="12" class="right">
      <el-row style="text-align:center">变更前</el-row>
      <el-row>消息名称：{{ frontContent.messageName }}</el-row>
      <el-row>有效日期：{{ frontContent | validDateText }}</el-row>
      <el-row>弹出时间：{{ frontContent | playTimeText }}</el-row>
      <el-row>内容类型：{{ typeMap[frontContent.type] }}</el-row>
      <p>弹窗内容：</p>
      <el-image :src="frontContent.imageUrl"></el-image>
    </el-col>
  </el-row>
</template>

<script>
import { format } from 'date-fns'
import { getAuditRecordDetail } from '@/services/audit'
export default {
  filters: {
    formatDate(data) {
      if (data) {
        return format(new Date(data), 'yyyy-MM-dd')
      }
      return ''
    },
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      item: {},
      afterContent: {},
      frontContent: {},
      typeMap: {
        1: '图片',
        2: '问卷',
        3: '文字',
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await getAuditRecordDetail({ id: this.id })
      this.loading = false
      if (res.code === 200) {
        this.item = res.data
        this.afterContent = res.data.afterContent
        this.frontContent = res.data.frontContent
          ? res.data.frontContent
          : res.data.afterContent
      }
    },
    resetFields() {},
  },
}
</script>

<style lang="scss" scoped>
.messageView {
  padding-left: 10px;
  * {
    margin-top: 20px;
  }
  .right {
    padding-left: 30px;
    border-left: 1px solid #2bae85;
  }
}
</style>
