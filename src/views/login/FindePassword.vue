<template>
  <el-dialog
    v-on="$listeners"
    v-bind="$attrs"
    title="找回密码"
    append-to-body
    :close-on-click-modal="false"
    width="500px"
    @closed="handleClosed"
  >
    <el-form
      :model="verifyForm"
      ref="verifyForm"
      v-show="!verified"
      :rules="verifyFormRules"
    >
      <el-form-item prop="mobile">
        <el-input placeholder="手机号" v-model="verifyForm.mobile"></el-input>
      </el-form-item>
      <el-form-item prop="messageCode">
        <div style="display: flex;align-items: center;">
          <el-input placeholder="验证码" v-model="verifyForm.messageCode" />
          <el-button type="primary" @click="getSMSCode">
            {{ codeText }}
          </el-button>
        </div>
      </el-form-item>
      <el-button
        style="display: block; margin-top: 20px;width:100%;"
        type="primary"
        @click="handleNextClick"
      >
        下一步
      </el-button>
    </el-form>
    <el-form
      v-show="verified"
      ref="passwordForm"
      :model="passwordForm"
      :rules="passwordFormRules"
    >
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="请输入密码，密码由8-16位数字+字母组成"
          v-model="passwordForm.password"
        />
      </el-form-item>
      <el-form-item prop="password2">
        <el-input
          type="password"
          v-model="passwordForm.password2"
          placeholder="确认密码"
        />
      </el-form-item>
      <el-button
        style="display: block; margin-top: 20px;width:100%;"
        type="primary"
        @click="confirm"
      >
        确认
      </el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { sendSMSCode } from '@/services'
import { resetPassword } from '@/services/user'

export default {
  data() {
    const samePass = (rule, value, cb) => {
      const { password } = this.passwordForm

      if (password !== value) {
        cb(new Error('两次输入的密码不一致'))
      }
      cb()
    }
    return {
      verified: false,
      verifyForm: {
        mobile: '',
        messageCode: '',
      },
      codeText: '获取验证码',
      passwordFormRules: {
        password: [
          { required: true, message: '请输入密码' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{8,16}$/g,
            message: '密码由8-16位数字+字母组成',
          },
        ],
        password2: [
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{8,16}$/g,
            message: '密码由8-16位数字+字母组成',
          },
          { validator: samePass },
        ],
      },
      verifyFormRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号' },
        ],
        messageCode: [{ required: true, message: '请输入验证码' }],
      },
      passwordForm: {
        password: '',
        password2: '',
      },
    }
  },
  methods: {
    handleClosed() {
      this.$refs.verifyForm.resetFields()
      this.$refs.passwordForm.resetFields()
      this.verified = false
    },
    handleNextClick() {
      this.$refs.verifyForm.validate(valid => {
        this.verified = valid
      })
    },
    async getCode() {
      const res = await sendSMSCode({
        mobile: this.verifyForm.mobile,
        type: 'ForgetPassword',
      })

      if (res.code === 200) {
        this.countDown()
      }
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
    getSMSCode() {
      this.$refs.verifyForm.validateField('mobile', error => {
        if (!error) {
          this.getCode()
        }
      })
    },
    confirm() {
      this.$refs.passwordForm.validate(async valid => {
        const res = await resetPassword({
          password: this.passwordForm.password,
          type: 'ForgetPassword',
          messageCode: this.verifyForm.messageCode,
          mobile: this.verifyForm.mobile,
        })

        if (res.code === 200) {
          this.$emit('update:visible', false)
          this.$message.success('密码已重置')
        }
      })
    },
  },
}
</script>
