<template>
  <div class="vcWrap">
    <el-button type="primary" @click="test">Test</el-button>
  </div>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, {
  size: 'medium',
})
export default {
  name: 'EtVerifyCode',
  data() {
    return {}
  },
  methods: {
    test() {
      alert('test')
    },
  },
}
</script>
