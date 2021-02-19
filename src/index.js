// 引入相关的组件
import FormView from './components/input/formView.vue'
import EtVerifyCode from './components/et-verify-code.vue'
FormView.install = Vue => Vue.component(FormView.name, FormView)
EtVerifyCode.install = Vue => Vue.component(EtVerifyCode.name, EtVerifyCode)
// export default EtVerifyCode
// export default FormView
export { EtVerifyCode, FormView }
