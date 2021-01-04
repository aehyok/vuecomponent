<template>
  <div>
    <div style="margin-bottom: 20px;">
      <span>提交人：{{ $route.query.auditor }}</span>
      <span style="margin-left: 30px;"
        >变更时间：{{ $route.query.updatedAt | formatDate }}</span
      >
    </div>
    <div class="flexbox">
      <!-- 变更后 -->
      <div class="afterbox box">
        <div class="boxtitle">变更后</div>
        <columnTreeHistoryContent :direction="2" />
      </div>
      <!-- 变更前 -->
      <div class="beforebox box">
        <div class="boxtitle">变更前</div>
        <columnTreeHistoryContent :direction="1" />
      </div>
    </div>
  </div>
</template>

<script>
import columnTreeHistoryContent from './columnTreeHistoryContent'
import { format } from 'date-fns'
export default {
  components: {
    columnTreeHistoryContent,
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
.container {
  position: relative;
  height: 100%;
}
.left-tree {
  float: left;
  width: 300px;
  min-height: 100%;
  border-right: 1px solid #ccc;
  overflow: auto;
  &::-webkit-scrollbar {
    height: 12px;
  }
}
.right-content {
  margin-left: 320px;
}
.flexbox {
  display: flex;
  min-height: 100vh;
  .afterbox {
    border-right: 1px solid #ccc;
  }
  .box {
    flex: 1;
    &:first-child {
      margin-right: 20px;
    }
  }
}
.boxtitle {
  margin-bottom: 10px;
  padding: 10px 0;
  background: #e2e2e2;
  text-align: center;
}
</style>
