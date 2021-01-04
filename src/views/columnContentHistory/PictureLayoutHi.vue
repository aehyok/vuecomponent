<template>
  <div>
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

      <el-form-item label="图片选取：" prop="images">
        <el-checkbox-group v-model="formData.images" />
        <div style="color: #999;">
          不超过20张，图片建议尺寸454x416px，支持jpg、jpeg、png，每张大小不超过2M
        </div>
        <PictureGroup
          :picType="thisType"
          :limit-count="20"
          @add="handlePictureSeclection"
          @remove="handlePictureRemove"
          :receivefatData="formData.images"
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
          :visible.sync="rangeVisible"
          @confirm="data => (formData.issuedRanges = data)"
          :checked-keys="formData.issuedRanges"
          :thisType="thisType"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PictureGroup from '@/components/pictureGroup'
import IssuedRange from '@/components/IssuedRange'
import layoutMixins from './layoutMixins'
import { savePictureLayout } from '@/services/columnIssued'
import { format } from 'date-fns'

export default {
  name: 'PictureLayoutHi',
  components: {
    PictureGroup,
    IssuedRange,
  },
  mixins: [layoutMixins],
  data() {
    return {
      alwaysOn: false,
      formData: {
        startDate: '',
        endDate: '',
        name: '',
        images: [],
        issuedRanges: [],
      },

      rules: {
        name: [{ required: true, message: '请输入内容名称' }],
        images: [{ required: true, message: '请选择封面图' }],
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
      // if (!this.source.id) return
      const { beginDate, endDate, distributeOrgs } = this.source

      if (endDate === -1) {
        this.alwaysOn = true
      }

      this.formData = {
        name: this.source.name,
        images: this.source.imageUrls,
        startDate: beginDate,
        endDate: endDate === -1 ? '' : endDate,
        issuedRanges: distributeOrgs,
      }
    },
    handleNavigateChange(navigateField) {
      Object.assign(this.formData, navigateField)
    },
    handlePictureSeclection(data) {
      this.formData.images = data
    },
    handlePictureRemove(data) {
      const idx = this.formData.images.findIndex(i => i.id === data.id)
      this.formData.images.splice(idx, 1)
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (!valid) return

        const res = await savePictureLayout({
          id: this.source.id,
          name: this.formData.name,
          images: this.formData.images.map(i => i.id),
          categoryId: this.categoryId,
          distributeOrgs: this.formData.issuedRanges,
          endDate: this.alwaysOn ? -1 : this.formData.endDate,
          beginDate: this.formData.startDate,
          permanent: this.alwaysOn ? 1 : 2,
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
