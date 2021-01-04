<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    @closed="handleClose"
  >
    <el-form
      class="form"
      :model="formData"
      label-width="120px"
      ref="form"
      :rules="rules"
    >
      <el-form-item label="回复内容：" prop="reply">
        <el-input
          type="textarea"
          rows="5"
          v-model="formData.reply"
          placeholder="回复消息将通过公众号消息推送给用户"
        />
      </el-form-item>
      <el-form-item label="图片选取：" prop="images">
        <el-checkbox-group v-model="formData.images" />
        <picture-group
          :limit-count="20"
          @add="handlePictureSeclection"
          @remove="handlePictureRemove"
          :receivefatData="formData.images"
          :showUpLoadBtn="true"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import PictureGroup from '@/components/pictureGroup'
import { replyPhotoanywhere } from '@/services/photoanywhere'
export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { PictureGroup },
  computed: {
    title() {
      return '回复'
    },
  },
  data() {
    return {
      formData: {
        reply: '',
        images: [],
      },
      rules: {
        reply: [{ required: true, message: '请输入内容名称' }],
      },
    }
  },
  watch: {
    source() {},
  },
  methods: {
    handleClose() {},
    async save() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        console.log(this.formData)
        const res = await replyPhotoanywhere({
          id: this.source.id,
          content: this.formData.reply,
          imageIds: this.formData.images.map(item => item.id),
        })
        if (res.code === 200) {
          this.$message.success('回复成功')
          this.$emit('update:visible', false)
          this.$emit('saved')
        } else {
          this.$message.error('回复失败')
        }
      })
    },

    resetFields() {
      // this.$refs.form.resetFields()
    },
    handlePictureSeclection(data) {
      this.formData.images = data
    },
    handlePictureRemove(data) {
      const idx = this.formData.images.findIndex(i => i.id === data.id)
      this.formData.images.splice(idx, 1)
    },
  },
}
</script>
