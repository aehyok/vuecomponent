<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="dialogTitle"
    @closed="resetFields"
  >
    <el-form
      class="messageForm"
      :model="formData"
      label-width="120px"
      ref="form"
      :rules="rules"
    >
      <el-form-item prop="id"></el-form-item>
      <el-form-item label="消息名称：" prop="title">
        <el-input
          v-model="formData.title"
          type="text"
          maxlength="30"
          placeholder="请输入消息名称"
          @input="formData.title = formData.title.replace(/\s+/g, '')"
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
          >
          </el-date-picker>
          <div v-if="formData.alwaysOn === 2" style="display: inline-block;">
            <span>至</span>
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              :picker-options="endPickerOptions"
              value-format="timestamp"
              placeholder="选择结束日期"
            >
            </el-date-picker>
          </div>
          <el-checkbox
            :true-label="1"
            :false-label="2"
            class="checkItem"
            v-model="formData.alwaysOn"
          >
            从不过期
          </el-checkbox>
        </div>
      </el-form-item>
      <el-form-item prop="endDate"></el-form-item>
      <el-form-item prop="alwaysOn" style="display:none;" />

      <el-form-item
        class="formItem"
        label="滚动时间："
        prop="transmitTime"
        style="position:relative;"
      >
        <div class="formItem">
          <el-time-picker
            is-range
            v-model="formData.transmitTime"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :editable="false"
            placeholder="选择时间范围"
            v-if="formData.allDay === 2"
          />
          <el-form-item prop="allDay" style="display:none;" />
          <el-checkbox
            class="checkItem"
            v-model="formData.allDay"
            :true-label="1"
            :false-label="2"
          >
            全天
          </el-checkbox>
        </div>
      </el-form-item>
      <el-form-item class="formItem" label="滚动次数：" prop="scrollTimes">
        <div class="formItem">
          <el-input
            v-model.number="formData.scrollTimes"
            type="number"
            maxlength="9"
            placeholder="请输入播放次数"
            v-if="formData.noLimit === 2"
            style="width: auto;"
          />
          <el-form-item prop="noLimit" style="display:none;" />
          <el-checkbox
            class="checkItem"
            v-model="formData.noLimit"
            :true-label="1"
            :false-label="2"
          >
            不限次数
          </el-checkbox>
        </div>
      </el-form-item>
      <el-form-item label="消息内容:" prop="content">
        <el-input
          v-model.trim="formData.content"
          type="textarea"
          maxlength="2000"
          placeholder="请输入消息内容"
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
import { saveScrollMessage, auditScrollMessage } from '@/services/message'
import IssuedRange from '@/components/IssuedRange'

export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    IssuedRange,
  },
  computed: {
    dialogTitle() {
      return this.source.id ? '修改滚动消息' : '创建滚动消息'
    },
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
    /**
     * @param {string} filed - 字段名称
     */
    const createValidateFn = (field, errorMessage) => {
      return (rule, value, callback) => {
        if (this.formData[field] === 1) {
          callback()
        } else {
          // debugger
          if (!value) {
            callback(new Error(errorMessage))
          }
          callback()
        }
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
      formData: {
        title: '',
        content: '',
        scrollTimes: '', // 播放次数
        startDate: Date.now(),
        endDate: Date.now(),
        transmitTime: ['00:00', '23:59'], // 播放时间
        noLimit: 2,
        allDay: 2,
        alwaysOn: 2,
        ranges: [],
      },
      rules: {
        title: [{ required: true, message: '请输入消息名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择消息类型' }],
        content: [{ required: true, message: '请输入消息内容' }],
        scrollTimes: [
          {
            required: true,
            validator: createValidateFn('noLimit', '请输入播放次数'),
          },
        ],
        transmitTime: [
          {
            validator: createValidateFn('allDay', '请输入滚动时间'),
            required: true,
          },
        ],
        startDate: [{ validator: validateDateRange, required: true }],

        ranges: [
          { required: true, message: '请选择发布范围', trigger: 'change' },
        ],
      },
    }
  },
  watch: {
    source(data) {
      const {
        messageName,
        messageText,
        startDate,
        endDate,
        permanent,
        playStartTime,
        playEndTime,
        allDay,
        noLimit,
        distributeOrgs,
        scrollTimes,
        id,
      } = data

      if (!id) return

      setTimeout(() => {
        this.formData = {
          title: messageName,
          scrollTimes: parseInt(scrollTimes),
          allDay,
          content: messageText,
          startDate,
          endDate: endDate || '',
          transmitTime: [playStartTime, playEndTime],
          ranges: distributeOrgs,
          noLimit,
          alwaysOn: permanent,
        }
      }, 100)
    },
  },
  methods: {
    async save(audit) {
      console.log(this.formData)
      this.$refs.form.validate(async valid => {
        if (valid) {
          const startDate = new Date(this.formData.startDate)
          startDate.setHours(0, 0, 0, 0)
          const endDate = new Date(this.formData.endDate)
          endDate.setHours(0, 0, 0, 0)
          const res = await saveScrollMessage({
            id: this.source.id,
            ...this.formData,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
          })
          if (res.code === 200) {
            if (audit) {
              const res2 = await auditScrollMessage({
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
              this.$message.success(this.source.id ? '修改成功' : '创建成功')
              this.$emit('update:visible', false)
              this.$emit('saved')
            }
          }
        }
      })
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
  },
}
</script>
<style lang="scss" scoped>
.messageForm {
  .formItem {
    // display: flex;
    // align-items: center;
    .checkItem {
      margin-left: 10px;
    }
  }
}
</style>
