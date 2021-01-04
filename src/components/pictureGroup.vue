<template>
  <div class="imglistbox">
    <MoviePoster
      v-for="item in receiveData"
      name="选取图片"
      :key="item.id"
      :editable="isAdd"
      :url="item.url"
      class="inline"
      @clear="removeImgs(item)"
    />
    <MoviePoster
      v-if="receiveData.length < limitCount"
      name="选取图片"
      :editable="isAdd"
      @click="handlePostClick"
      class="inline"
    />
    <el-dialog
      title="素材选择"
      :visible.sync="showBox"
      width="40%"
      append-to-body
      @closed="handleClosed"
      :close-on-click-modal="false"
    >
      <div class="uploadInfo">本地上传的素材需要递交给运营商审核</div>
      <div class="local">
        <el-button
          @click="getSystemList"
          type="primary"
          class="uploadBtn"
        >
          选择素材
        </el-button>

        <el-upload
          ref="upload"
          :action="upLoadUrl"
          :on-success="handleUploadSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="headers"
          :limit="limit"
          list-type="picture"
          accept=".jpg,.jpeg,.png, .bmp"
          v-if="showUpLoadBtn"
          :data="formData"
          class="uploadClass"
        >
          <el-button type="primary" :disabled="limit === 0">本地上传</el-button>
        </el-upload>
      </div>
    </el-dialog>
    <SelectMaterialMulti
      :dialogVisible.sync="materialVisible"
      :limitNum="limitCount"
      @confirm="selectPicture"
      :receiveData="receiveData"
      :serviceProvider="serviceProvider"
    />
  </div>
</template>

<script>
import MoviePoster from '@/components/SelectMaterialButton'
import SelectMaterialMulti from '@/components/SelectMaterialMulti'

export default {
  components: {
    MoviePoster,
    SelectMaterialMulti,
  },
  props: {
    showUpLoadBtn: {
      type: Boolean,
      default: false,
    },
    limitCount: {
      type: Number,
      default: 1,
    },
    picType: {
      type: String,
      default: 'add',
    },
    /**
     * 适用运营商
     */
    serviceProvider: {
      default: 0,
    },
    receivefatData: {
      type: [Object, Array],
      default: () => [],
    },
    /**
     * 0全部，1图片，2视频
     */
    type: {
      type: Number,
      default: 1,
    },
    sizeLimit: {
      type: Number,
      default: 2048, // kb
    },
  },
  computed: {
    receiveData() {
      console.log(this.receivefatData, 'this.receivefatData+++++++++++++')
      return this.receivefatData
    },
    isAdd() {
      return this.picType === 'add'
    },
    limit() {
      return this.limitCount - this.receivefatData.length
    },
    formData(){
     if(this.showUpLoadBtn){
       return {
        isMaterial: true,
       }
     }else{
       return {}
     }
    },
  },
  data() {
    return {
      headers: {},
      materialVisible: false,
      showBox: false,
      upLoadUrl: '', // 上传地址
    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem('loginInfo'))
    this.headers = {
      Authorization: user.token,
    }
    const prefix = process.env.NODE_ENV === 'development' ? '/infra' : ''

    this.upLoadUrl = `${prefix}/api/console/system/upload`
  },
  methods: {
    // 移除图片
    removeImgs(item) {
      this.$emit('remove', item)
    },
    // 选择图片
    selectPicture(data) {
      this.$emit('add', data)
    },
    // 点击图块
    handlePostClick() {
      this.showBox = true
    },
    handleUploadSuccess(response, file, fileList) {
      const isFinish = fileList.reduce((result, file) => {
        return file.percentage === 100
      }, false)

      const res = fileList
        .filter(f => f.percentage === 100)
        .map(f => f.response.data)
      this.$emit('add', res.concat(this.receivefatData))

      if (isFinish) {
        this.showBox = false
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const oversize = file.size / 1024 / 1024 < this.sizeLimit / 1000

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg 、jpeg 、png 格式!')
      }
      if (!oversize) {
        this.$message.error(`上传图片大小不能超过 ${this.sizeLimit}KB!`)
      }
      return isJPG && oversize
    },
    getSystemList() {
      this.showBox = false
      this.materialVisible = true
    },
    handleClosed() {
      if (this.showUpLoadBtn) this.$refs.upload.clearFiles()
    },
  },
}
</script>

<style lang="scss" scoped>
.imglistbox:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.imglistbox {
  *zoom: 1;
}
.inline {
  float: left;
  margin-right: 16px;
  margin-bottom: 10px;
}
.local{
  display: flex;
}
.uploadInfo{
  line-height:60px
}
.uploadBtn{
  width:98px;
  height:36px;
  margin-right:30px;
}
.uploadClass{
  display: inline-block;
  flex:1
}
</style>
