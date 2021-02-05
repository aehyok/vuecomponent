// 引入相关的组件
import formView from './components/input/formView.vue'
const components = [
  formView,
  // 还可以再写别的组件
]
const componentList = {}
componentList.install = function(Vue) {
  components.map(component => {
    Vue.component(component.name, component)
    componentList[component.name] = component
  })
}

// // if (typeof window !== 'undefined' && window.Vue) {
// //   install(window.Vue)
// // }
export default componentList
export { formView }
