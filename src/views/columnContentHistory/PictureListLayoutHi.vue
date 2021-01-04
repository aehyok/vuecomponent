<template>
  <div>
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
      <el-form-item label="图片封面：" prop="images">
        <el-checkbox-group v-model="formData.images" />
        <div style="color: #999;">
          最多1张，图片建议尺寸370X248px，支持jpg、jpeg、png，每张大小不超过2M
        </div>
        <PictureGroup
          :picType="thisType"
          :limit-count="1"
          @add="handlePictureSeclection"
          @remove="handlePictureRemove"
          :receivefatData="formData.images"
        />
      </el-form-item>
      <NavigatorItems
        :thisType="thisType"
        :navigate="formData.navigate"
        :videos="formData.navigateVideos"
        :text="formData.navigateText"
        :pictures="formData.navigateImages"
        :onFieldChange="handleNavigateChange"
      />
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
        <el-checkbox-group v-model="formData.issuedRanges"></el-checkbox-group>
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
import NavigatorItems from './NavigatorItems'
import layoutMixins from './layoutMixins'
import { saveImageListLayout } from '@/services/columnIssued'
import { format } from 'date-fns'

export default {
  name: 'PictureListLayoutHi',
  components: {
    NavigatorItems,
    PictureGroup,
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
        navigate: 1,
        navigateText: '',
        navigateImages: [],
        navigateVideos: [],
        issuedRanges: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // 当天之后的时间可选
        },
      },
      rules: {
        images: [{ required: true, message: '请选择封面' }],
        name: [{ required: true, message: '请输入内容名称' }],
        navigate: [{ required: true, message: '请选择跳转内容版式' }],
        navigateText: [{ required: true, message: '请输入文字内容' }],
        navigateImages: [{ required: true, message: '请选择图片' }],
        navigateVideos: [{ required: true, message: '请选择视频' }],
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
      // return val
      return format(new Date(val), 'yyyy-MM-dd')
    },
  },
  methods: {
    handleOpen() {
      // if (!this.source.id || !this.source._id) return
      const { beginDate, endDate, distributeOrgs } = this.source

      if (endDate === -1) {
        this.alwaysOn = true
      }

      this.formData = {
        name: this.source.name,
        images: [this.source.coverInfo],
        navigate: this.source.navigateType,
        navigateText: this.source.navigateText,
        navigateImages: this.source.navigateImageUrls || [],
        navigateVideos: this.source.navigateVideoUrls || [],
        endDate: endDate === -1 ? '' : endDate,
        startDate: beginDate,
        issuedRanges: distributeOrgs,
      }
    },
    handlePictureSeclection(data) {
      this.formData.images = data
    },
    handlePictureRemove(data) {
      const idx = this.formData.images.findIndex(i => i.id === data.id)
      this.formData.images.splice(idx, 1)
    },
    handleNavigateChange(navigateField) {
      this.formData = Object.assign(this.formData, navigateField)
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
        let cover = ''
        if (this.formData.images.length > 0) {
          cover = this.formData.images.pop()
        }
        console.log(cover, 'this.formData.images')
        // TODO 保存图片列表版式
        const res = await saveImageListLayout({
          id: this.source.id,
          name: this.formData.name,
          categoryId: this.categoryId,
          distributeOrgs: this.formData.issuedRanges,
          cover: cover.id,
          navigateType: this.formData.navigate,
          navigateText: this.formData.navigateText,
          navigateImages: this.formData.navigateImages.map(i => i.id),
          navigateVideos: this.formData.navigateVideos.map(v => v.id),
          endDate: endDate,
          beginDate: this.formData.startDate,
          permanent,
        })
        if (res.code === 200) {
          this.$message.success('创建成功')
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
