<template>
  <div class="login-page">
    <main class="content-wrapper">
      <div class="right">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="form"
          size="large"
          @submit.native.prevent
        >
          <el-form-item prop="account" :rules="ruless">
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
          <el-form-item label="特殊资源" prop="resource" :rules="resule">
            <el-radio-group v-model="loginForm.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="form-row"></div>
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
    </main>
  </div>
</template>

<script>
export default {
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
        resource: '',
      },
      dialogFormVisible: false,
      ruless: [{ validator: validateAccount, trigger: ['blur', 'change'] }],
      rules: {
        pass: [{ validator: validatePass, trigger: ['blur', 'change'] }],
        verifCode: [
          { validator: validatorVerCode, trigger: ['blur', 'change'] },
        ],
      },
      resule: [
        { required: false, message: '请选择活动资源', trigger: 'change' },
      ],
    }
  },
  created() {},
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
          console.log(valid, 'this.valid')
        }
      })
    },
    async getImgCode() {
      // const url = process.env.NODE_ENV === 'development' ? '/infra' : ''
      // this.imgUrl = `${url}/api/console/passport/verifycode?category=2&t=${new Date().getTime()}`
      console.log('res')
    },

    async adminLogin() {
      this.loading = true
    },
  },
}
</script>

<style lang="scss" scoped>
.login-page {
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
