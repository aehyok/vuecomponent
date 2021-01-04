<template>
  <el-dialog
    :title="displayInfo.title"
    v-on="$listeners"
    v-bind="$attrs"
    @opened="handleOpened"
    @closed="handleClosed"
  >
    <el-form
      :model="form"
      :rules="rules"
      label-width="120px"
      ref="form"
      v-loading="saving"
    >
      <el-form-item label="栏目树名称：" prop="name">
        <el-input
          v-model="form.name"
          maxlength="50"
          placeholder="请输入栏目树名称, 50个字符内"
        />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input
          type="textarea"
          resize="none"
          v-model="form.remark"
          maxlength="200"
          placeholder="请输入备注，最多200字符"
          rows="5"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClosed">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { saveCategoryTree, categoryTreeCopy } from '@/services/category'
export default {
  props: {
    orgId: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'create',
    },
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        name: '', // 栏目树名
        remark: '', // 备注
      },
      saving: false,
      modeMap: {
        create: {
          title: '创建栏目树',
          saveMethod: saveCategoryTree,
          successMsg: '创建成功',
        },
        edit: {
          title: '编辑栏目树',
          saveMethod: saveCategoryTree,
          successMsg: '修改成功',
        },
        copy: {
          title: '复制栏目树',
          saveMethod: categoryTreeCopy,
          successMsg: '复制成功',
        },
      },
      rules: {
        name: [
          { required: true, message: '请输入栏目树名称', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    displayInfo() {
      return this.modeMap[this.mode]
    },
  },
  methods: {
    handleOpened() {
      if (this.mode === 'create') return
      const { id, name, remark, status } = this.source
      this.form = {
        id,
        name,
        remark,
        status,
      }
    },
    handleClosed() {
      console.log('关闭')
      this.form.name = ''
      this.form.remark = ''
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.saving = true
          const res = await this.displayInfo.saveMethod({
            id: this.source.id,
            name: this.form.name,
            status: this.source.status,
            orgId: this.orgId,
            remark: this.form.remark,
          })

          this.saving = false
          if (res.code === 200) {
            this.$message.success(this.displayInfo.successMsg)
            this.$emit('saved')
            this.$emit('update:visible', false)
          }
        }
      })
    },
  },
}
</script>
