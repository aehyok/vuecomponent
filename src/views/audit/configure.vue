<template>
  <div>
    <el-form>
      <el-form-item>
        <el-switch v-model="form.noticeMessage" active-text="弹窗消息">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-switch v-model="form.scrollMessage" active-text="滚动消息">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-switch v-model="form.categoryTree" active-text="栏目树">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-switch v-model="form.formatContent" active-text="栏目内容">
        </el-switch>
      </el-form-item>
    </el-form>
    <el-row></el-row>
    <el-row style="text-align: start">
      <el-button type="primary" @click="save">保 存</el-button>
    </el-row>
  </div>
</template>

<script>
import { auditGetAuditConfig, auditSetAuditConfig } from '@/services/audit'
export default {
  data() {
    return {
      form: {
        noticeMessage: false, // 弹窗消息 开关，true开，false关
        scrollMessage: false, // 滚动消息
        categoryTree: false, // 栏目树
        formatContent: false, // 栏目内容
      },
    }
  },
  async mounted() {
    const res = await auditGetAuditConfig()
    if (res.code === 200) {
      this.form = res.data
    }
  },
  methods: {
    async save() {
      const res = await auditSetAuditConfig(this.form)
      if (res.code === 200) {
        this.$message.success('配置保存成功')
      }
    },
  },
}
</script>
