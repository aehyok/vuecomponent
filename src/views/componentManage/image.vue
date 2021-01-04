<template>
<div>
    <image-drag
         :list="file_list"
         :multiple="true"
         :action="uploadUrl"
         :on-error="uploadError"
         :on-success="bannerPicSuccess"
         :before-upload="beforeAvatarUpload"
         @update="updateFile">
    </image-drag>
</div>
</template>
<script>
import ImageDrag from "@/components/imageDrag";
import { Loading } from "element-ui";
export default {
  components: {
    ImageDrag,
  },
  data() {
    return {
      banner_list: [], // ele用的
      file_list: [], // 自己用的
      bargain: {
        share_image: "",
      },
      number: "",
    }
  },
  created() {
    this.file_list.push('http://dvs-dev.sunlight-tech.com/material/image/202011/23/file-e0c246d5-9f9d-4566-bd84-d953ed8b8b31.png')
    this.file_list.push('http://dvs-dev.sunlight-tech.com/material/image/202011/25/file-ea0bef32-f5ab-48a4-b2b4-3dcbdec6b220.jpg')
    this.file_list.push('http://dvs-dev.sunlight-tech.com/material/image/202011/23/file-3511b097-7bed-445a-b219-31cbfc26144b.jpg')
        this.file_list.push('http://dvs-dev.sunlight-tech.com/material/image/202011/23/file-e0c246d5-9f9d-4566-bd84-d953ed8b8b31.png')
    this.file_list.push('http://dvs-dev.sunlight-tech.com/material/image/202011/25/file-ea0bef32-f5ab-48a4-b2b4-3dcbdec6b220.jpg')
    this.file_list.push('http://dvs-dev.sunlight-tech.com/material/image/202011/23/file-3511b097-7bed-445a-b219-31cbfc26144b.jpg')
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 上传图片路径
    uploadUrl() {
      return `${process.env.VUE_APP_API_ROOT}upload`
    },
    // 图片长传-之前
    beforeAvatarUpload(file) {
      const self = this
      const typeArr = ["image/jpeg", "image/png"]
      const type = file.type;
      if (!typeArr.includes(type)) {
        this.$message.error("图片格式不正确,只支持jpg和png类型图片")
        return false
      }
      const isSize = new Promise((resolve, reject) => {
        const width = 1280
        const height = 720
        const img = new Image()
        img.src = window.URL.createObjectURL(file)
        img.onload = () => {
          const valid = img.width === width && img.height === height
          if (valid) {
            //  Loading.service({ fullscreen: true, text: "图片上传中，请稍后" })
            resolve(file)
          } else {
            self.$message.error("请上传400*320px大小的图片!")
            reject(file)
          }
        }
      })
      return isSize
    },
    // Banner图-成功
    bannerPicSuccess(res) {
      this.bargain.share_image = res.data
      // Loading.service({ fullscreen: true }).close()
      this.file_list.push(res.data);
    },
    // Banner图片上传报错
    uploadError() {
      this.$message.error("上传失败，请重新上传");
      Loading.service({ fullscreen: true }).close()
    },
    updateFile(val) {
      this.file_list = val
      console.log(this.file_list)
    },
  },
}
</script>
