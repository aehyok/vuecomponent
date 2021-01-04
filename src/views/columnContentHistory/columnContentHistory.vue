<template>
  <div>
    <div>
      <span>提交人：{{ $route.query.auditor }}</span>
      <span style="margin-left: 30px;"
        >变更时间：{{ $route.query.updatedAt | formatDate }}</span
      >
    </div>
    <div style="display: flex;">
      <!-- 变更后 -->
      <div class="box">
        <div class="boxtitle">变更后</div>
        <contentHistoryTemplate historyType="after" />
      </div>
      <!-- 变更前 -->
      <div class="box">
        <div class="boxtitle">变更前</div>
        <contentHistoryTemplate historyType="before" />
      </div>
    </div>
  </div>
</template>

<script>
import contentHistoryTemplate from './contentHistoryTemplate'
import { format } from 'date-fns'
export default {
  components: {
    contentHistoryTemplate,
  },
  filters: {
    formatDate(val) {
      return format(new Date(val), 'yyyy-MM-dd HH:mm:ss')
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.box {
  flex: 1;
  &:first-child {
    margin-right: 20px;
  }
}
.boxtitle {
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 10px 0;
  background: #e2e2e2;
  text-align: center;
}
</style>
