<template>
  <el-dialog
    v-on="$listeners"
    v-bind="$attrs"
    :title="title"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <el-form ref="form" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="IPTV账号：" prop="iptvAccount">
        <el-input placeholder="请输入iptv账号" v-model="form.iptvAccount" />
      </el-form-item>
      <el-form-item label="运营商：" prop="operatorId">
        <el-select v-model="form.operatorId">
          <el-option
            v-for="i in operators"
            :key="i.id"
            :value="i.operatorId"
            :label="i.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名：" prop="contactUser">
        <el-input placeholder="请输入用户姓名" v-model="form.contactUser" />
      </el-form-item>
      <el-form-item label="手机号：" prop="contactPhone">
        <el-input placeholder="请输入手机号" v-model="form.contactPhone" />
      </el-form-item>
      <el-form-item label="地址：" prop="contactAddress">
        <el-input placeholder="请输入地址" v-model="form.contactAddress" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button @click="save" type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { saveIPTVAccount } from '@/services/iptv'
export default {
  props: {
    operators: {
      type: Array,
      default: () => [],
    },
    account: {
      type: Object,
      default: () => ({}),
    },
    currentOrgId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rules: {
        iptvAccount: [
          { required: true, message: '请填写IPTV账号' },
          {
            pattern: /^[0-9a-zA-Z_]+$/g,
            message: '仅支持大小写字母、数字、下划线',
          },
        ],
        operatorId: [{ required: true, message: '请选择运营商' }],
        contactPhone: [{}],
      },
      form: {
        id: '',
        iptvAccount: '',
        orgId: '',
        operatorId: '',
        contactUser: '',
        contactPhone: '',
        contactAddress: '',
      },
    }
  },
  computed: {
    title() {
      return `${this.mode}账号`
    },
    mode() {
      return this.account.id ? '编辑' : '新建'
    },
  },
  methods: {
    handleOpen() {
      this.form = {
        id: this.account.id,
        iptvAccount: this.account.iptvAccount,
        orgId: this.account.orgId,
        operatorId: this.account.operatorId,
        contactPhone: this.account.contactPhone,
        contactAddress: this.account.contactAddress,
        contactUser: this.account.contactUser,
      }
    },
    handleClosed() {
      this.$refs.form.resetFields()
    },
    async save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const operator = this.operators.find(
            o => o.operatorId === this.form.operatorId,
          )
          const res = await saveIPTVAccount({
            ...this.form,
            orgId: this.account.orgId || this.currentOrgId,
            operatorName: operator.name,
          })

          if (res.code === 200) {
            this.$message.success(`${this.mode}成功`)
            this.$emit('update:visible', false)
            this.$emit('saved')
          }
        }
      })
    },
  },
}
</script>
