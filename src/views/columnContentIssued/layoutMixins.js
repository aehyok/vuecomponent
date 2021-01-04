import IssuedRange from '@/components/IssuedRange'

export default {
  components: {
    IssuedRange,
  },
  props: {
    setTitle: {
      type: String,
    },
    thisType: {
      type: String,
      default: 'add',
    },
    categoryId: {
      type: String,
      required: false,
    },
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rangeVisible: false,
      beginPickerOptions: {
        disabledDate: time => {
          if (this.formData.endDate) {
            return (
              time.getTime() > this.formData.endDate ||
              time.getTime() < Date.now() - 8.64e7
            )
          }
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      endPickerOptions: {
        disabledDate: time => {
          if (this.formData.startDate) {
            return time.getTime() < this.formData.startDate
          }
          return time.getTime() < Date.now() - 8.64e7
        },
      },
    }
  },
  computed: {
    title() {
      if (this.setTitle) {
        return this.setTitle
      }
      return this.source.id ? '编辑内容' : '创建内容'
    },
  },
  methods: {
    validateDateRange(rule, value, cb) {
      if (!value) {
        cb(new Error('请选择开始日期'))
      } else {
        if (this.alwaysOn) {
          cb()
        } else {
          if (!this.formData.endDate) {
            cb(new Error('请选择结束日期'))
          }
          cb()
        }
      }
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.alwaysOn = false
    },
    handleRangeConfirm() {},
  },
}
