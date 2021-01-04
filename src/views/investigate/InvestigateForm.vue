<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="dialogTitle"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <el-form
      class="form"
      :model="formData"
      label-width="180px"
      ref="form"
      :rules="rules"
    >
      <el-form-item label="标题：" prop="name">
        <el-input
          v-model.trim="formData.name"
          type="text"
          maxlength="30"
          placeholder="请输入标题，30个字内"
        />
      </el-form-item>
      <el-form-item label="内容形式：" prop="contentType">
        <el-select
          v-model="formData.contentType"
          placeholder="请选择"
          :disabled="edit"
        >
          <el-option label="图文" :value="1"></el-option>
          <el-option label="图片" :value="3"></el-option>
          <el-option label="文字" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="图片内容（限1张）："
        prop="imageInfos"
        v-if="formData.contentType === 1 || formData.contentType === 3"
      >
        <PictureGroup
          :limitCount="1"
          @add="handlePictureSeclection"
          @remove="handlePictureRemove"
          :receivefatData="formData.imageInfos"
        ></PictureGroup>
      </el-form-item>

      <el-form-item
        label="文字内容："
        prop="description"
        v-if="formData.contentType === 1 || formData.contentType === 4"
      >
        <el-input
          v-model="formData.description"
          type="textarea"
          rows="5"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item
        label="选项"
        v-for="(option, index) in formData.options"
        :key="index"
        :rules="{ required: true, message: '请输入选项名称', trigger: 'blur' }"
        :prop="`options[${index}].optionName`"
      >
        <el-col :span="12">
          <el-input
            v-model.trim="option.optionName"
            class="inline-input"
            type="text"
            maxlength="6"
            placeholder="选项名称，6个字以内"
            :disabled="edit"
          />
        </el-col>
        <el-col :span="10" style="margin-left:12px">
          <el-select
            v-model="option.isFeedback"
            placeholder="请选择"
            :disabled="edit"
          >
            <el-option label="支持文字反馈" :value="true"></el-option>
            <el-option label="不支持文字反馈" :value="false"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <i
            class="el-icon-delete"
            @click="removeOption(index)"
            style="padding: 6px"
            v-show="!edit"
          ></i>
        </el-col>
      </el-form-item>
      <el-form-item v-if="formData.options.length <= 4">
        <el-button type="text" @click="addOption">+添加选项</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { saveQuestion } from '@/services/investigate'
import PictureGroup from '@/components/pictureGroup'

export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    PictureGroup,
  },
  data() {
    return {
      popupTypes: [{ label: '图片', value: 1 }],
      formData: {
        imageInfos: [],
        options: [],
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入内容' }],
        imageInfos: [{ required: true, message: '请选择图片' }],
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
      return this.source.id ? '修改调查内容' : '创建调查内容'
    },
    edit() {
      if (this.source && this.source.id) return true
      return false
    },
  },
  methods: {
    handleOpen() {
      if (this.source && this.source.id) {
        const {
          name,
          description,
          contentType,
          imageInfos,
          options,
        } = this.source

        this.formData = {
          name,
          description,
          contentType,
          imageInfos,
          options,
        }
      } else {
        this.formData = {
          name: '',
          description: '',
          contentType: 1, // 内容形式 1图文，3图片 4纯文字
          imageInfos: [],
          options: [{ optionName: '', isFeedback: false }],
        }
      }
    },
    handleClosed() {
      this.$refs.form.resetFields()
      this.formData.imageInfos = []
    },
    handlePictureSeclection(data) {
      this.formData.imageInfos = data
    },
    handlePictureRemove({ id }) {
      this.formData.imageInfos = this.formData.imageInfos.filter(
        i => i.id !== id,
      )
    },
    addOption() {
      if (this.formData.options.length < 4) {
        this.formData.options.push({ optionName: '', isFeedback: false })
      } else {
        this.$message.error('最多支持4项')
      }
    },
    removeOption(index) {
      if (this.formData.options.length > 1) {
        this.formData.options.splice(index, 1)
      }
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await saveQuestion({
            id: this.source.id,
            name: this.formData.name,
            description: this.formData.description,
            contentType: this.formData.contentType,
            images: this.formData.imageInfos.map(v => {
              return v.id
            }),
            options: this.formData.options,
          })

          if (res.code === 200) {
            this.$refs.form.resetFields()
            this.$message.success(this.source.id ? '修改成功' : '创建成功')
            this.$emit('update:visible', false)
            this.$emit('saved')
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
