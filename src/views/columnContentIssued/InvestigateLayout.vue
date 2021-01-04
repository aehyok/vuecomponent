<template>
  <div>
    <el-dialog
      v-on="$listeners"
      v-bind="$attrs"
      :title="title"
      @opened="handleOpen"
      @closed="handleClose"
    >
      <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="内容标题：" prop="name">
          <el-input
            v-model.trim="formData.name"
            maxlength="50"
            placeholder="请输入内容名称，不超过50字符"
            v-if="thisType !== 'detail'"
          />
          <span v-else>{{ formData.name }}</span>
        </el-form-item>
        <el-form-item label="选取内容：">
          <el-button type="primary" @click="handleDataList">选取内容</el-button>
          <span
            v-if="source.questionInfos && source.questionInfos.length > 0"
            style="margin-left: 6px;"
            >选取了{{ source.questionInfos.length }}个内容</span
          >
        </el-form-item>
        <el-form-item label="有效日期：" prop="startDate">
          <div class="formItem" v-if="thisType !== 'detail'">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              value-format="timestamp"
              :picker-options="beginPickerOptions"
              placeholder="选择开始日期"
            >
            </el-date-picker>
            <div v-if="!alwaysOn" style="display: inline-block;">
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
              :label="true"
              class="checkItem"
              v-model="alwaysOn"
              style="margin-left: 6px;"
            >
              从不过期
            </el-checkbox>
          </div>
          <div class="formItem" v-else>
            <span>{{
              formData.startDate || formData.beginDate | formatDate
            }}</span>
            <span v-if="!alwaysOn">
              至 {{ formData.endDate | formatDate }}</span
            >
            <span v-else> 至 永久</span>
          </div>
        </el-form-item>
        <el-form-item prop="endDate"></el-form-item>
        <el-form-item label="发布范围：" prop="issuedRanges">
          <el-checkbox-group
            v-model="formData.issuedRanges"
          ></el-checkbox-group>
          <IssuedRange
            :visible.sync="rangeVisible"
            @confirm="data => (formData.issuedRanges = data)"
            :checked-keys="formData.issuedRanges"
            :thisType="thisType"
          />
        </el-form-item>
      </el-form>
      <template #footer v-if="thisType !== 'detail'">
        <el-button @click="$emit('update:visible', false)">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
      <slot></slot>
    </el-dialog>
    <InvestigateLayoutDataList
      :visible.sync="dataListVisible"
      :thisType="thisType"
      :source="source"
    ></InvestigateLayoutDataList>
  </div>
</template>
<script>
import layoutMixins from './layoutMixins'
import InvestigateLayoutDataList from './InvestigateLayoutDataList'
import { saveInvestigateFormat } from '@/services/columnIssued'
import { format } from 'date-fns'

export default {
  components: { InvestigateLayoutDataList },
  mixins: [layoutMixins],
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      alwaysOn: false,
      dataListVisible: false,
      formData: {
        date: [],
        name: '',
        startDate: Date.now(),
        issuedRanges: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // 当天之后的时间可选
        },
      },
      rules: {
        name: [{ required: true, message: '请输入内容名称' }],
        startDate: [
          {
            required: true,
            validator: this.validateDateRange,
          },
        ],
        issuedRanges: [{ required: true, message: '请输入发布范围' }],
      },
    }
  },
  filters: {
    formatDate(val) {
      if (val) return format(new Date(val), 'yyyy-MM-dd')
      return ''
    },
  },
  methods: {
    handleOpen() {
      console.log('handleOpen', this.source)
      if (!this.source.id) return

      let { name, startDate, endDate, distributeOrgs } = this.source
      if (!startDate) {
        startDate = Date.now()
      }
      if (endDate === -1) {
        this.alwaysOn = true
      }
      setTimeout(() => {
        this.formData = {
          name: name,
          startDate,
          endDate: endDate === -1 ? '' : endDate,
          issuedRanges: distributeOrgs,
        }
      }, 0)
    },
    handleClose() {},
    handleDataList() {
      this.dataListVisible = true
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        let endDate = ''
        let permanent = 2
        if (this.alwaysOn) {
          endDate = -1
          permanent = 1
        } else {
          endDate = this.formData.endDate
        }

        // TODO 保存民意调查
        const res = await saveInvestigateFormat({
          name: this.formData.name,
          id: this.source.id,
          categoryId: this.categoryId,
          distributeOrgs: this.formData.issuedRanges,
          endDate,
          navigateType: 1,
          beginDate: this.formData.startDate,
          permanent,
          questions: this.source.questionInfos.map(v => v.id),
        })
        if (res.code === 200) {
          const msg = this.source.id ? '修改成功' : '创建成功'
          this.$message.success(msg)
          this.$emit('update:visible', false)
          this.$emit('saved')
        }
      })
    },
  },
  created() {
    this.handleOpen()
  },
}
</script>
