<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="dialogTitle"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <el-form
      class="messageForm"
      :model="formData"
      label-width="120px"
      ref="form"
      :rules="rules"
    >
      <el-form-item label="名称：" prop="title">
        <el-input
          v-model.trim="formData.title"
          type="text"
          maxlength="30"
          placeholder="请输入消息名称，30个字符内"
        />
      </el-form-item>

      <el-form-item label="有效日期：" prop="startDate">
        <div class="formItem">
          <el-date-picker
            v-model="formData.startDate"
            type="date"
            value-format="timestamp"
            :picker-options="beginPickerOptions"
            placeholder="选择开始日期"
          ></el-date-picker>
          <div v-if="formData.alwaysOn === 2" style="display: inline-block;">
            <span>至</span>
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              :picker-options="endPickerOptions"
              value-format="timestamp"
              placeholder="选择结束日期"
            ></el-date-picker>
          </div>
          <el-form-item prop="alwaysOn" style="display:none;" />
          <el-checkbox
            :true-label="1"
            :false-label="2"
            class="checkItem"
            v-model="formData.alwaysOn"
            >永不过期</el-checkbox
          >
        </div>
      </el-form-item>
      <el-form-item prop="endDate"></el-form-item>
      <el-form-item
        class="formItem"
        label="展示时间："
        prop="transmitTime"
        style="position:relative;"
      >
        <el-form-item prop="allDay" style="display:none;"></el-form-item>
        <!-- <div class="formItem"> -->
        <el-time-picker
          is-range
          v-model="formData.transmitTime"
          value-format="HH:mm"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :editable="false"
          :disabled="formData.allDay === 1"
          placeholder="选择时间范围"
        />
        <el-checkbox
          v-model="formData.allDay"
          :true-label="1"
          :false-label="2"
          style="margin-left: 20px;"
          >全天</el-checkbox
        >
        <!-- </div> -->
      </el-form-item>
      <el-form-item class="formItem" label="开机内容类型：" prop="type">
        <el-select v-model="formData.type">
          <el-option
            v-for="i in popupTypes"
            :key="i.value"
            :label="i.label"
            :value="i.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开机内容：" prop="image">
        <el-checkbox style="display:none;" v-model="formData.image" />
        <PictureGroup
          :limitCount="1"
          @add="handlePictureSeclection"
          @remove="handlePictureRemove"
          :receivefatData="formData.image"
        />
      </el-form-item>
      <el-form-item label="发布范围：" prop="ranges">
        <el-checkbox-group v-model="formData.ranges"></el-checkbox-group>
        <IssuedRange
          :visible.sync="rangeVisible"
          @confirm="data => (formData.ranges = data)"
          :checked-keys="formData.ranges"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="save(false)">暂存</el-button>
      <el-button type="primary" @click="save(true)">提交审核</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { createPopupMessage, auditPopupMessage } from '@/services/message'
import IssuedRange from '@/components/IssuedRange'
import PictureGroup from '@/components/pictureGroup'

export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    IssuedRange,
    PictureGroup,
  },
  data() {
    const validateDateRange = (rule, value, cb) => {
      if (!value) {
        cb(new Error('请选择开始日期'))
      } else {
        if (this.formData.alwaysOn === 1) {
          cb()
        } else {
          if (!this.formData.endDate) {
            cb(new Error('请选择结束日期'))
          }
          cb()
        }
      }
    }
    const validateTimeRange = (rule, value, callback) => {
      if (this.formData.allDay === 1) {
        callback()
      } else {
        if (!value || !value.length) {
          callback(new Error('请选择弹出时间'))
        }
        callback()
      }
    }
    return {
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
      rangeVisible: false,
      popupTypes: [{ label: '图片', value: 1 }],
      formData: {
        /**
         * 消息名称
         */
        title: '',
        image: [],
        /**
         * 播放次数
         */
        scrollTimes: '',
        startDate: Date.now(),
        endDate: Date.now(),
        /**
         * 播放时间
         * @type {string[]}
         */
        transmitTime: ['00:00', '23:59'],
        allDay: 2,
        /**
         * 弹窗类型 - 1：图片、2：问卷:、3：文字
         * @type {1|2|3}
         */
        type: 1,
        /**
         * 发布范围
         */
        ranges: [],
        alwaysOn: 2,
      },
      rules: {
        title: [{ required: true, message: '请输入消息名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择消息类型' }],
        content: [{ required: true, message: '请输入消息内容' }],
        image: [{ required: true, message: '请选择图片' }],
        scrolltimes: [
          { required: true, message: '请输入播放次数' },
          { pattern: /^\d+$/, message: '请输入正整数' },
        ],
        transmitTime: [{ validator: validateTimeRange, required: true }],
        startDate: [{ validator: validateDateRange, required: true }],
        ranges: [
          { required: true, message: '请选择发布范围', trigger: 'change' },
        ],
      },
    }
  },
  watch: {
    image(value) {
      this.formData.imageId = value.id || ''
    },
  },
  computed: {
    dialogTitle() {
      return this.source.id ? '修改开机画面' : '创建开机画面'
    },
    imageId() {
      if (this.imageList.length) {
        return this.imageList[0].id
      }
      return ''
    },
  },
  methods: {
    handleOpen() {
      const {
        noticeText,
        messageName,
        startDate,
        endDate,
        permanent,
        playStartTime,
        playEndTime,
        type,
        allDay,
        distributeOrgs,
        id,
        imageId,
        imageUrl,
      } = this.source

      if (!id) return

      this.formData = {
        title: messageName,
        content: noticeText,
        type: Number(type),
        allDay,
        image: [{ id: imageId, url: imageUrl }],
        startDate,
        endDate: endDate === -1 ? '' : endDate,
        transmitTime: [playStartTime, playEndTime],
        ranges: distributeOrgs,
        alwaysOn: permanent,
      }
    },
    handleClosed() {
      this.$refs.form.resetFields()
      this.image = {}
    },
    handlePictureSeclection(data) {
      this.formData.image = data
    },
    handlePictureRemove({ id }) {
      this.formData.image = this.formData.image.filter(i => i.id !== id)
    },
    save(audit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const startDate = new Date(this.formData.startDate)
          startDate.setHours(0, 0, 0, 0)
          const endDate = new Date(this.formData.endDate)
          endDate.setHours(0, 0, 0, 0)
          const [img] = this.formData.image
          const res = await createPopupMessage({
            ...this.formData,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            imageId: img.id,
            id: this.source.id,
          })

          if (res.code === 200) {
            if (audit) {
              const res2 = await auditPopupMessage({
                id: res.data.id ? res.data.id : this.source.id,
                status: 2,
                reason: '',
              })
              if (res2.code === 200) {
                this.$refs.form.resetFields()
                this.$message.success('提交审核成功')
                this.$emit('update:visible', false)
                this.$emit('saved')
              }
            } else {
              this.$refs.form.resetFields()
              this.$message.success(this.source.id ? '修改成功' : '创建成功')
              this.$emit('update:visible', false)
              this.$emit('saved')
            }
          }
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
// .messageForm {
//   padding-right: 100px;
//   .formItem {
//     position: relative;
//     .checkItem {
//       position: absolute;
//       left: 100%;
//       margin-left: 10px;
//     }
//   }
// }
</style>
