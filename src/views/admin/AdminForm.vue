<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="isEdit ? '编辑管理员' : '创建管理员'"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <el-form label-width="120px" ref="form" :rules="rules" :model="form">
      <el-form-item prop="realName">
        <template #label>成员姓名：</template>
        <el-input placeholder="请输入成员姓名" v-model="form.realName" />
      </el-form-item>
      <el-form-item prop="mobile">
        <template #label>手机号：</template>
        <el-input
          :disabled="isEdit"
          placeholder="请输入成员手机号，该手机号将作为登录账号"
          v-model="form.mobile"
        />
      </el-form-item>

      <el-form-item prop="roles">
        <template #label>角色：</template>
        <el-select v-model="form.roles" multiple>
          <el-option
            v-for="role in roleList"
            :key="role.id"
            :value="role.id"
            :label="role.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="orgId">
        <template #label>所属组织：</template>
        <OrgTree
          lazy
          highlight
          :show-tool="false"
          :showCheckbox="false"
          ref="orgTree"
          :normalOrgId="normalOrgId"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeFun">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import OrgTree from '@/components/organizationTree'
import { createUser, updateUser, getRoleList } from '@/services/user'
import { sendSMSCode } from '@/services'

export default {
  props: {
    normalOrgId: {
      type: String,
    },
    editData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    OrgTree,
  },
  computed: {
    isEdit() {
      return Boolean(this.editData.id)
    },
    tree() {
      return this.$refs.orgTree.$refs.tree
    },
  },
  data() {
    const validatePass = (rule, value, cb) => {
      if (value === this.form.password) {
        cb()
      } else {
        cb(new Error('两次密码不一致'))
      }
    }
    return {
      value: '',
      roleList: [],
      codeText: '获取验证码',
      form: {
        realName: '',
        mobile: '',
        roles: [],
        orgId: '',
      },
      rules: {
        realName: [{ required: true, message: '请填写成员姓名' }],
        verifyCode: [{ required: true, message: '请填写验证码' }],
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号' },
        ],
        roles: [{ required: true, message: '请选择角色' }],
        orgId: [{ required: true, message: '请选择所属组织' }],
        password: [
          { required: true, message: '密码不能为空' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{8,16}$/,
            message: '密码由8-16位数字+字母组成',
          },
        ],
        repassword: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getRoles()
    this.handleOpen()
  },
  methods: {
    closeFun() {
      this.$emit('closeFun')
    },
    async getRoles() {
      const res = await getRoleList({ page: 1, limit: 10000 })
      this.roleList = res.data.docs
    },
    handleOpen() {
      console.log(this.editData, 'editData')
      if (this.editData.id) {
        setTimeout(() => {
          this.form = {
            realName: this.editData.realName,
            mobile: this.editData.mobile,
            roles: this.editData.roles.map(r => r.id),
            orgId: this.editData.organization.id,
          }
        }, 200)
      }
    },
    handleClosed() {
      this.$refs.form.resetFields()
    },
    async getCode() {
      const res = await sendSMSCode({
        mobile: this.form.mobile,
      })

      if (res.code === 200) {
        this.countDown()
      }
    },
    getSMSCode() {
      this.$refs.form.validateField('mobile', error => {
        if (!error) {
          this.getCode()
        }
      })
    },
    countDown() {
      let duration = 60
      let timer = null

      timer = setInterval(() => {
        if (duration === 0) {
          clearInterval(timer)
          this.codeText = '获取验证码'
        } else {
          duration--
          this.codeText = `${duration}s后重新发送`
        }
      }, 1000)
    },
    save() {
      const orgId = this.tree.getCurrentKey()
      this.form.orgId = orgId
      this.$refs.form.validate(async valid => {
        if (!valid) return

        const res = this.isEdit
          ? await updateUser({ ...this.form, id: this.editData.id })
          : await createUser(this.form)

        if (res.code === 200) {
          this.$message.success(this.isEdit ? '修改成功' : '创建成功')
          this.$emit('update:visible', false)
          this.$emit('saved')
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
