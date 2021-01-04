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
      <el-form-item label="类型名称：" prop="name">
        <el-input
          v-model="formData.name"
          type="text"
          maxlength="30"
          placeholder="请输入类型名称"
          @input="formData.name = formData.name.replace(/\s+/g, '')"
        />
      </el-form-item>
      <el-form-item label="关联动作：" prop="relativeActive">
        <el-input
          v-model="formData.relativeActive"
          type="text"
          maxlength="30"
          placeholder="请输入关联动作"
          @input="
            formData.relativeActive = formData.relativeActive.replace(
              /\s+/g,
              '',
            )
          "
        />
      </el-form-item>
      <el-form-item label="关联信息：" prop="relativeExtends">
        <el-input
          v-model="formData.relativeExtends"
          type="text"
          placeholder="请输入关联信息"
          @input="
            formData.relativeExtends = formData.relativeExtends.replace(
              /\s+/g,
              '',
            )
          "
        />
      </el-form-item>
      <el-form-item label="栏目类型：" prop="contentType">
        <el-select v-model="formData.contentType" placeholder="请选择">
          <el-option
            :label="m.label"
            :value="m.value"
            v-for="m in contentTypes"
            :key="m.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { saveCategoryTypeList } from '@/services/category'

export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  computed: {
    dialogTitle() {
      return this.source.id ? '修改栏目类型' : '新建栏目类型'
    },
  },
  data() {
    return {
      rangeVisible: false,
      formData: {
        name: '',
        relativeActive: '',
        relativeExtends: '',
        contentType: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入栏目类型名称', trigger: 'blur' },
        ],
        relativeActive: [
          { required: true, message: '请输入关联动作', trigger: 'blur' },
        ],
        contentType: [
          { required: true, message: '请选择栏目类型', trigger: 'blur' },
        ],
      },
      contentTypes: [
        { label: '无内容', value: 1 },
        { label: '全屏图片', value: 2 },
        { label: '全屏视频', value: 3 },
        { label: '图文信息', value: 4 },
        { label: '文字列表', value: 5 },
        { label: '图片列表', value: 6 },
        { label: '民意调查', value: 7 },
      ],
    }
  },
  watch: {
    source(data) {
      const { name, relativeActive, relativeExtends, contentType } = data

      // if (!id) return

      setTimeout(() => {
        this.formData = {
          name,
          relativeActive,
          relativeExtends,
          contentType,
        }
      }, 100)
    },
  },
  methods: {
    handleOpen() {},
    async save() {
      console.log(this.formData)
      this.$refs.form.validate(async valid => {
        if (valid) {
          const action = this.source.id ? 'update' : 'create'
          const res = await saveCategoryTypeList(
            {
              id: this.source.id,
              ...this.formData,
            },
            action,
          )
          if (res.code === 200) {
            this.$message.success(this.source.id ? '修改成功' : '创建成功')
            this.$emit('update:visible', false)
            this.resetFields()
            this.$emit('saved')
          } else {
            this.$message.success(`保存失败，${res.message}`)
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
