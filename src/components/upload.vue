<template>
  <!-- 文件上传组件 by owen 2020-09-07 -->
  <div class="upload">
    <el-upload
      class="avatar-uploader"
      ref="upload"
      :action="upLoadUrl"
      :on-success="handleUploadSuccess"
      :before-upload="beforeAvatarUpload"
      :headers="headers"
      :limit="limit"
      list-type="text"
      :accept="accept"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    fileType: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 1,
    },
    sizeLimit: {
      type: Number,
      default: 4096, // kb
    },
    accept: {
      type: String,
      default: '', // .jpg,.jpeg,.png,.bmp
    },
  },
  computed: {},
  data() {
    return {
      headers: {},
      upLoadUrl: '', // 上传地址
    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem('loginInfo'))
    this.headers = {
      Authorization: user.token,
    }
    const prefix = process.env.NODE_ENV === 'development' ? '/infra' : ''
    this.upLoadUrl = `${prefix}/api/console/system/upload?ra=no&r=${Math.random()}`
  },
  methods: {
    handleUploadSuccess(response, file, fileList) {
      // const isFinish = fileList.reduce((result, file) => {
      //   return file.percentage === 100
      // }, false)
      if (response.code !== 200) {
        this.$message({
          type: 'error',
          message: response.message,
        })
        return
      }

      const res = fileList
        .filter(f => f.percentage === 100)
        .map(f => f.response.data)
      this.$emit('callback', res)
      this.$refs.upload.clearFiles()
    },
    beforeAvatarUpload(file) {
      if (this.fileType === 'img') {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpg 、jpeg 、png 格式!')
          return false
        }
      }
      const oversize = file.size / 1024 / 1024 < this.sizeLimit / 1000
      if (!oversize) {
        this.$message.error(`上传文件大小不能超过 ${this.sizeLimit}KB`)
      }
      return oversize
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  ::v-deep .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 260px;
    height: 145px;
    line-height: 145px;
    text-align: center;
  }
  .avatar {
    width: 260px;
    height: 145px;
    display: block;
  }
}
</style>
