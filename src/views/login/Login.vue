<template>
  <div class="login-page">
    <main class="content-wrapper">
      <div class="left">
        <img src="~@/assets/systhetic.jpg" alt="" />
      </div>

      <div class="right">
        <h3 class="project-name">数字乡村振兴运营平台</h3>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="form"
          size="large"
          @submit.native.prevent
        >
          <el-form-item prop="account">
            <el-input
              type="text"
              placeholder="用户名"
              name="username"
              auto-complete="off"
              v-model="loginForm.account"
            />
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              type="password"
              name="inputDom"
              placeholder="密码"
              auto-complete="new-password"
              v-model="loginForm.pass"
            />
          </el-form-item>
          <el-form-item class="smbot" prop="verifCode">
            <div class="form-row">
              <el-input
                placeholder="验证码"
                name="inputDom"
                v-model="loginForm.verifCode"
                style="flex: 1;"
              />
              <div class="verCodeImg">
                <!-- <img :src="imgUrl" /> -->
                <div class="svgbox" v-html="vcodeImg"></div>
                <span
                  @click="getImgCode"
                  style="margin-left: 20px; cursor: pointer;"
                >
                  换一张
                </span>
              </div>
            </div>
          </el-form-item>
          <div class="form-row">
            <el-checkbox v-model="rememberPasCbox" size="large">
              记住用户名和密码
            </el-checkbox>
            <el-button type="text" @click="dialogFormVisible = true">
              忘记密码
            </el-button>
          </div>
          <el-button
            size="large"
            type="primary"
            style="width: 100%;margin-top: 20px;height: 50px;"
            @click="submitForm"
            :loading="loading"
            native-type="submit"
          >
            登 录
          </el-button>
        </el-form>
      </div>
      <FindPassword :visible.sync="dialogFormVisible" />
    </main>
  </div>
</template>

<script>
import FindPassword from './FindePassword'
import { userLogin } from '@/services/user'
import { getImgCode } from '@/services'

export default {
  components: {
    FindPassword,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.loginForm.account !== '') {
          this.$refs.form.validateField('account')
        }
        callback()
      }
    }
    const validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatorVerCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginKey: '',
      vcodeImg: '',
      imgUrl: '',
      rememberPasCbox: false,
      loading: false,
      loginForm: {
        pass: '',
        account: '',
        verifCode: '',
      },
      dialogFormVisible: false,
      rules: {
        pass: [{ validator: validatePass, trigger: ['blur', 'change'] }],
        account: [{ validator: validateAccount, trigger: ['blur', 'change'] }],
        verifCode: [
          { validator: validatorVerCode, trigger: ['blur', 'change'] },
        ],
      },
    }
  },
  created() {
    this.checkRemPass()
    this.getImgCode()
  },
  methods: {
    // 判断是否已缓存账号密码
    checkRemPass() {
      const loginRemInfo = localStorage.getItem('loginRemInfo')
      if (loginRemInfo) {
        const jsonInof = JSON.parse(loginRemInfo)
        this.loginForm.account = jsonInof.account
        this.loginForm.pass = jsonInof.password
        this.rememberPasCbox = true
      }
    },
    // 判断是否需要记住账号密码
    checkNeedRemPass() {
      if (this.rememberPasCbox) {
        const info = {
          account: this.loginForm.account,
          password: this.loginForm.pass,
        }
        localStorage.setItem('loginRemInfo', JSON.stringify(info))
      } else {
        localStorage.removeItem('loginRemInfo')
      }
    },

    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.checkNeedRemPass()
          this.adminLogin()
        }
      })
    },
    async getImgCode() {
      // const url = process.env.NODE_ENV === 'development' ? '/infra' : ''
      // this.imgUrl = `${url}/api/console/passport/verifycode?category=2&t=${new Date().getTime()}`
      const res = await getImgCode()
      if (res.code === 200) {
        this.loginKey = res.data.key
        this.vcodeImg = res.data.code
      }
      console.log(res)
    },

    async adminLogin() {
      this.loading = true
      const res = await userLogin({
        account: this.loginForm.account,
        code: this.loginForm.verifCode,
        password: this.loginForm.pass,
        key: this.loginKey,
      })
      this.loading = false

      if (res?.code === 200) {
        localStorage.setItem('loginInfo', JSON.stringify(res.data))
        window.location.reload()
      } else {
        this.getImgCode()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: url('~@/assets/bg.jpg');

  ::v-deep .el-input {
    font-size: 16px;
  }

  ::v-deep .el-input__inner {
    height: 50px;
  }
}

.project-name {
  text-align: center;
  font-size: 44px;
  font-weight: 600;
  color: #099e45;
  margin-bottom: 90px;
}

.content-wrapper {
  display: flex;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 88%;
  height: 794px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .left {
    flex: 0 0 56.5%;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .right {
    flex: 1;
    padding: 7% 7% 0;
  }
}

.verCodeImg {
  margin-left: 10px;
  display: flex;
  align-items: center;
  .svgbox {
    position: relative;
    top: 6px;
  }
  img {
    height: 100%;
  }
}
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
</style>
