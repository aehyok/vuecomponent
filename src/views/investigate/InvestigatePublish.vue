<template>
  <el-dialog
    append-to-body
    v-bind="$attrs"
    v-on="$listeners"
    :title="dialogTitle"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <el-form class="form" :model="formData" label-width="160px" ref="form">
      <el-form-item label="发布方式：" prop="client">
        <el-checkbox-group v-model="formData.client">
          <el-checkbox :label="1">电视端弹窗消息</el-checkbox>
          <el-checkbox :label="2">电视端民意调查栏目</el-checkbox>
          <el-checkbox :label="3">公众号民意调查模块</el-checkbox>
        </el-checkbox-group>
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
      <el-form-item
        label="发布范围："
        prop="issuedRanges"
      >
        <IssuedRange
          :visible.sync="rangeVisible"
          @confirm="data => (formData.issuedRanges = data)"
          :checked-keys="formData.issuedRanges"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import IssuedRange from '@/components/IssuedRange'
import { setWeChatClient } from '@/services/investigate'
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
  data() {
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
        client: 1,
        issuedRanges: [],
        startDate: Date.now(), // 有效开始日期
        endDate: Date.now(),   // 有效结束日期
        transmitTime: ['00:00', '23:59'],  // 展示时间
        allDay: 2,
        alwaysOn: 2,
      },
    }
  },
  computed: {
    dialogTitle() {
      return '发布设置'
    },
  },
  methods: {
    handleOpen() {
      this.formData = {
        id: this.source.id,
        client: this.source.client,
        issuedRanges: this.source.distributeOrgs,
      }
    },
    handleClosed() {},
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const startDate = new Date(this.formData.startDate)
          startDate.setHours(0, 0, 0, 0)
          const endDate = new Date(this.formData.endDate)
          endDate.setHours(0, 0, 0, 0)
          // TODO 发布公众号设置（接口是否改名字）
          const res = await setWeChatClient({
            ...this.formData,
            id: this.source.id,
            client: this.formData.client,
            distributeOrgs: this.formData.issuedRanges,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
          })
          if (res.code === 200) {
            this.$refs.form.resetFields()
            this.$message.success('发布成功')
            this.$emit('update:visible', false)
            this.$emit('saved')
          }
        }
      })
    },
  },
}
</script>
