<template>
  <div class="imglistbox">
      <el-upload
        :action="uploadUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="1"
        accept=".mp3"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        v-if="showAudio">
        <el-button size="small" type="primary">上传语音</el-button>
      </el-upload>
      <div class="audio-content" v-if="!showAudio">
        <audio ref="audio" :src="url" controls>
            不支持播放
        </audio>
        <el-button
          type="danger"
          class="btn"
          @click="showAudio = true">
            删除
        </el-button>
      </div>
  </div>
</template>
<script>

// emit event
const ADD = 'add'
const REMOVE = 'remove'

export default {
  props: {
    showUpLoadBtn: {
      type: Boolean,
      default: false,
    },
    thisType: {
      type: String,
      default: 'add',
    },
    limitCount: {
      type: Number,
      default: 1,
    },
    source: {
      type: [Object, Array],
      default: () => [],
    },
    sizeLimit: {
      type: Number,
      default: 2048, // kb
    },
    url: {
      type: String,
      default:'http://www.170mv.com/kw/other.web.rj01.sycdn.kuwo.cn/resource/n3/2/63/3890495760.mp3',
    },
    showAudio: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    receiveData() {
      return this.source
    },
    limit() {
      return this.limitCount - this.source.length
    },
    videoData(){
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
      uploadUrl: '', // 上传地址
    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem('loginInfo'))
    console.log(user, 'this.localStorage.user')
    this.headers = {
      Authorization: user.token,
    }
    const prefix = process.env.NODE_ENV === 'development' ? '/infra' : ''

    this.uploadUrl = `${prefix}/api/console/system/upload`
    console.log(this.uploadUrl, 'this.uploadUrl')
  },
  methods: {
      handleSuccess(response, file, fileList){
          console.log(file,fileList, 'file-fileList')
          this.showAudio=false
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },



    // 移除图片
    remove(item) {
      this.$emit(REMOVE, item)
    },
    // 选择图片
    selectMaterial(data) {
      this.$emit(ADD, data)
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
      this.$emit(ADD, res, 'local')

      if (isFinish) {
        this.showBox = false
      }
    },
    beforeAvatarUpload(file) {
      return true
    },
    getSystemList() {
      this.showBox = false
      this.materialVisible = true
    },
    handleClosed() {
      this.$refs.upload.clearFiles()
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
.audio-content{
  margin-top:20px;
  display:flex;
  justify-content: space-between;
  audio{
    flex:1;
    // height: 13.6vw;
  }
  .btn{
    // width:120px;
    // height:9.6vw;
    margin:0 0 0 20px;
  }
}
</style>
