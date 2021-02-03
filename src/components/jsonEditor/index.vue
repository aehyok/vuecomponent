<template>
  <div>
    <div id="jsoneditor" style="width: 400px; height: 200px;"></div>
  </div>
</template>

<script>
export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          name: '主菜单栏目',
          total: null,
          count: null,
          createDate: 1606730360386,
          type: 1,
          requireType: undefined,
          creType: '',
          range: [],
          isExpired: false,
        }
      },
    },
  },
  data() {
    return {
      jsonEditor: null,
    }
  },
  watch: {
    value(value) {
      console.log(value, 'tjos/value')
      const editorValue = this.jsonEditor.get()
      if (value !== editorValue) {
        this.jsonEditor.set(value)
      }
    },
  },
  mounted() {
    this.initJsonEditor()
  },
  methods: {
    // 初始化jsonEditor
    initJsonEditor() {
      var container = document.getElementById('jsoneditor')
      var options = {
        mode: 'code',
        mainMenuBar: false,
      }
      var editor = new this.$jsoneditor(container, options)
      this.jsonEditor = editor
    },
    // 获取json
    getValue() {
      return this.jsonEditor.get()
    },
  },
}
</script>
