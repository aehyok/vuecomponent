<template>
  <div>
    <avue-form
      :option="option"
      v-model="form"
      @submit="handleSubmit"
    ></avue-form>
  </div>
</template>
<script>
var baseUrl = 'https://cli.avuejs.com/api/area'
export default {
  data() {
    return {
      form: {
        province: '110000',
        city: '110100',
        area: '110101',
      },
      option: {
        column: [
          {
            label: '省份',
            prop: 'province',
            type: 'select',
            props: {
              label: 'name',
              value: 'code',
            },
            cascaderItem: ['city', 'area'],
            dicUrl: `${baseUrl}/getProvince`,
            dicFormatter: res => {
              return res.data // 返回字典的层级结构
            },
            rules: [
              {
                required: true,
                message: '请选择省份',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '文本框1',
            prop: 'text1',
          },
          {
            label: '城市',
            prop: 'city',
            type: 'select',
            props: {
              label: 'name',
              value: 'code',
            },
            row: true,
            cascaderIndex: 0,
            dicUrl: `${baseUrl}/getCity/{{key}}?province={{province}}`,
            rules: [
              {
                required: true,
                message: '请选择城市',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '文本框2',
            prop: 'text2',
          },
          {
            label: '文本框3',
            prop: 'text3',
          },
          {
            label: '地区',
            prop: 'area',
            type: 'select',
            props: {
              label: 'name',
              value: 'code',
            },
            cascaderIndex: 0,
            dicUrl: `${baseUrl}/getArea/{{key}}?city={{city}}`,
            rules: [
              {
                required: true,
                message: '请选择地区',
                trigger: 'blur',
              },
            ],
          },
        ],
      },
    }
  },
  methods: {
    handleSubmit(form) {
      this.$message.success(JSON.stringify(this.form))
    },
  },
}
</script>
