<template>
  <div>
    <div v-for="(item, index) in columnList" :key="index">
      <!--不包含View则是npm组件库中的-->
      <component
        v-if="!item.type.includes('View')"
        :is="item.type + 'View'"
        :column="item"
        :formData="formData"
        :data.sync="formData[item.name]"
      />
      <component
        v-if="item.type.includes('View')"
        :is="item.type || registerComponent"
        :column="item"
        :formData="formData"
        :data.sync="formData[item.name]"
      />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import textView from '@/components/input/item/textView'
import textareaView from '@/components/input/item/textareaView'
import numberView from '@/components/input/item/numberView'
import dateView from '@/components/input/item/dateView'
import switchView from '@/components/input/item/switchView'
import radioView from '@/components/input/item/radioView'
import checkboxView from '@/components/input/item/checkboxView'
import daterangeView from '@/components/input/item/daterangeView'
import selectView from '@/components/input/item/selectView'
import imageView from '@/components/input/item/imageView'

Vue.use(ElementUI, {
  size: 'medium',
})
export default {
  name: 'FormView',
  components: {
    textView,
    textareaView,
    numberView,
    dateView,
    daterangeView,
    switchView,
    radioView,
    checkboxView,
    selectView,
    imageView,
  },
  props: {
    columnList: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    console.log(this, 'this.formView')
  },
  data() {
    return {
      formListItem: [],
    }
  },
  filters: {
    registerComponent(componentName) {
      console.log(componentName, 'this.componentName')
      return Vue.extend(componentName.default)
      // return import(`@/components/input/item/${componentName}.vue`).then(
      //   component => {
      //     console.log(component, 'component')
      //     return Vue.extend(component.default)
      //   },
      // )
    },
  },
  methods: {},
}
</script>
<style scoped></style>
