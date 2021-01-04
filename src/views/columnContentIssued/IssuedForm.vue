<template>
  <el-dialog v-on="$listeners" v-bind="$attrs" title="发布">
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="内容名称：" prop="name">
        <el-input
          v-model.trim="formData.name"
          maxlength="50"
          placeholder="请输入内容名称，不超过50字符"
        />
      </el-form-item>
      <el-form-item label="图片选取：" prop="images">
        <PictureGroup />
      </el-form-item>
      <NavigatorItems
        :navigate="formData.navigate"
        :videos="formData.navigateVedios"
        :text="formData.navigateText"
        :pictures="formData.navigateImages"
        :onFieldChange="handleNavigateChange"
      />
      <el-form-item label="有效日期：" prop="date">
        <div class="formItem">
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :disabled="alwaysOn"
          />
          <el-checkbox :label="true" class="checkItem" v-model="alwaysOn">
            从不过期
          </el-checkbox>
        </div>
      </el-form-item>
      <el-form-item label="发布范围：" prop="issuedRanges"></el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import NavigatorItems from './NavigatorItems'
import PictureGroup from '@/components/pictureGroup'

export default {
  components: {
    NavigatorItems,
    PictureGroup,
  },
  data() {
    return {
      alwaysOn: false,
      formData: {
        date: [],
        name: '',
        images: [],
        navigate: 1,
        navigateText: '',
        navigateImages: [],
        navigateVedios: [],
        issuedRanges: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // 当天之后的时间可选
        },
      },
      rules: {
        name: [{ required: true, message: '请输入内容名称' }],
        images: [{ required: true, message: '请选择封面图' }],
        navigate: [{ required: true, message: '请选择跳转内容版式' }],
        navigateText: [{ required: true, message: '请输入文字内容' }],
        navigateImages: [{ required: true, message: '请选择图片' }],
        navigateVedios: [{ required: true, message: '请选择视频' }],
        issuedRanges: [{ required: true, message: '请选择发布范围' }],
      },
    }
  },
  methods: {
    handleNavigateChange(navigateField) {
      Object.assign(this.formData, navigateField)
    },
  },
}
</script>
