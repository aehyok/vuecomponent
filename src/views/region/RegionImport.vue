<template>
  <el-dialog title="导入行政区域" v-bind="$attrs" v-on="$listeners">
    <div style="margin-bottom: 20px;">
      点击
      <el-link
        target="_blank"
        type="primary"
        :href="baseURL + 'region/downloadRegionTemplate'"
      >
        下载模板表格
      </el-link>
      ，建议每次上传不超过1000条数据，未导入完成请勿关闭窗口
    </div>
    <el-upload
      ref="upload"
      :action="baseURL + 'region/importRegion'"
      :limit="1"
      :on-change="handleFileChange"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :auto-upload="false"
      :http-request="uploadFile"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    >
      <el-button slot="trigger" type="primary">选取文件</el-button>
    </el-upload>

    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="confirmImport">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      baseURL:
        process.env.NODE_ENV === 'development'
          ? '/infra/api/console/'
          : '/api/console/',
      fileList: [],
    }
  },
  created() {},
  computed: {},
  methods: {
    handleFileChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove() {},
    handleExceed() {},
    confirmImport() {
      if (!this.fileList.length) {
        this.$message.error('请选择文件')
        return false
      }
      this.$refs.upload.submit()
    },
    handleClosed() {
      this.fileList = []
      this.$refs.upload.clearFiles()
    },
    async uploadFile(options) {
      const formData = new FormData()
      formData.append('file', options.file)
      const res = await this.importRegion(formData)
      if (res.code === 200) {
        this.$message.success(res.data.message)
        this.$emit('update:visible', false)
        this.$emit('saved')
      } else {
        this.$message.error(res.message)
        this.fileList = []
        this.$refs.upload.clearFiles()
      }
    },
    importRegion(data) {
      return request('/region/importRegion', {
        method: 'post',
        data,
      })
    },
  },
}
</script>
