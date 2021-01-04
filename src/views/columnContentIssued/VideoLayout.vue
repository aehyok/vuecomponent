<template>
  <el-dialog
    v-on="$listeners"
    v-bind="$attrs"
    :title="title"
    @opened="handleOpen"
    @closed="handleClose"
  >
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="内容名称：" prop="name">
        <el-input
          v-model.trim="formData.name"
          maxlength="50"
          placeholder="请输入内容名称，不超过50字符"
          v-if="thisType !== 'detail'"
        />
        <span v-else>{{ formData.name }}</span>
      </el-form-item>
      <el-form-item label="视频选取：" prop="videos">
        <el-checkbox-group v-model="formData.videos" />

        <VideoPicker
          :thisType="thisType"
          :limit-count="10"
          @add="handleVideoSelection"
          @remove="handleVideoRemove"
          :source="formData.videos"
          v-bind="$attrs"
          :showUpLoadBtn="true"
        />
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
          <el-checkbox :label="true" class="checkItem" v-model="alwaysOn">
            从不过期
          </el-checkbox>
        </div>
        <div class="formItem" v-else>
          <span>{{ formData.startDate | formatDate }}</span>
          <span v-if="!alwaysOn"> 至 {{ formData.endDate | formatDate }}</span>
          <span v-else> 至 永久</span>
        </div>
      </el-form-item>
      <el-form-item prop="endDate"></el-form-item>

      <el-form-item label="发布范围：" prop="issuedRanges">
        <el-checkbox-group v-model="formData.issuedRanges" />
        <IssuedRange
          :thisType="thisType"
          :visible.sync="rangeVisible"
          @confirm="data => (formData.issuedRanges = data)"
          :checked-keys="formData.issuedRanges"
        />
      </el-form-item>
    </el-form>
    <template #footer v-if="thisType !== 'detail'">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
    <slot></slot>
  </el-dialog>
</template>

<script>
import VideoPicker from '@/components/VideoPicker'
import layoutMixins from './layoutMixins'
import { saveVideoLayout } from '@/services/columnIssued'
import { format } from 'date-fns'

export default {
  name: 'VideoLayout',
  components: {
    VideoPicker,
  },
  mixins: [layoutMixins],
  data() {
    return {
      alwaysOn: false,
      formData: {
        startDate: '',
        endDate: '',
        name: '',
        videos: [],
        issuedRanges: [],
      },

      rules: {
        name: [{ required: true, message: '请输入内容名称' }],
        videos: [{ required: true, message: '请选择封面图' }],
        navigate: [{ required: true, message: '请选择跳转内容版式' }],
        navigateText: [{ required: true, message: '请输入文字内容' }],
        navigateImages: [{ required: true, message: '请选择图片' }],
        navigateVedios: [{ required: true, message: '请选择视频' }],
        issuedRanges: [{ required: true, message: '请选择发布范围' }],
        startDate: [
          {
            required: true,
            validator: this.validateDateRange,
          },
        ],
      },
    }
  },
  filters: {
    formatDate(val) {
      return format(new Date(val), 'yyyy-MM-dd')
    },
  },
  computed: {
    pictureProps() {
      return []
    },
  },
  methods: {
    handleOpen() {
      console.log('handleOpen')
      if (!this.source.id) return
      const { beginDate, endDate, distributeOrgs } = this.source

      if (endDate === -1) {
        this.alwaysOn = true
      }
      this.formData = {
        name: this.source.name,
        text: this.source.text,
        videos: this.source.videoUrls,
        startDate: beginDate,
        endDate: endDate === -1 ? '' : endDate,
        issuedRanges: distributeOrgs,
      }
    },
    handleVideoSelection(data, type) {
      console.log(data, type)
      if (type === 'local') {
        this.formData.videos = this.formData.videos.concat(data)
      } else {
        this.formData.videos = data
      }
    },
    handleVideoRemove(data) {
      const idx = this.formData.videos.findIndex(i => i.id === data.id)
      this.formData.videos.splice(idx, 1)
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
        const obj = {}
        if (this.source.id) {
          obj.id = this.source.id
        }
        const res = await saveVideoLayout({
          name: this.formData.name,
          videos: this.formData.videos.map(i => i.id),
          categoryId: this.categoryId,
          distributeOrgs: this.formData.issuedRanges,
          endDate: endDate,
          beginDate: this.formData.startDate,
          permanent,
          ...obj,
        })
        if (res.code === 200) {
          if (!this.source.id) {
            this.$message.success('创建成功')
          } else {
            this.$message.success('修改成功')
          }
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
