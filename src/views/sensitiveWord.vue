<template>
  <div class="wrapper">
    <el-upload
      :headers="headers"
      :action="action"
      :limit="1"
      accept=".xls,.xlsx"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <el-button type="primary">点击导入敏感词库</el-button>
    </el-upload>
    <div class="info">
      <div>
        仅支持xls、xlsx文件导入，点击
        <el-link
          :href="href"
          target="_blank"
          style="line-height: 1; font-size: 18px;"
        >
          下载敏感词库
        </el-link>
      </div>
      <div>如需修改敏感词请先下载敏感词库，从下载的表格中修改后再导入</div>
    </div>
  </div>
</template>
<script>
import { baseUrl } from '@/utils/request'

export default {
  data() {
    const user = JSON.parse(localStorage.getItem('loginInfo'))
    return {
      href: `${baseUrl}/blacklist/downloadBlacklist`,
      action: `${baseUrl}/blacklist/importBlacklist`,
      headers: {
        Authorization: user.token,
      },
    }
  },
  methods: {
    handleSuccess(res) {
      if (res.code === 200) {
        this.$message.success('导入成功')
      } else {
        this.$message.error(res.message)
      }
    },
    handleError(res) {},
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  text-align: center;
  padding-top: 20%;
}

.info {
  line-height: 1.8;
  font-size: 18px;
  padding: 30px 0 0;
}
</style>
