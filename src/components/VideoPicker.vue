<template>
  <div class="imglistbox">
    <div>
      <el-button
        type="primary"
        @click="showBox = true"
        v-if="thisType !== 'detail'"
        >选择视频</el-button
      >
      <el-table
        style="margin: 20px 0;"
        size="mini"
        :data="receiveData"
        v-if="receiveData.length"
      >
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="操作" v-if="thisType !== 'detail'">
          <template slot-scope="{ row }">
            <el-button type="text" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
          accept=".mp4,.ts"
          v-if="showUpLoadBtn"
          :data="videoData"
          class="uploadClass"
        >
          <el-button type="primary" :disabled="limit === 0">本地上传</el-button>
        </el-upload>
      </div>
    </el-dialog>
    <SelectMaterialMulti
      :dialogVisible.sync="materialVisible"
      :limitNum="limit"
      :material-type="2"
      @confirm="selectMaterial"
      :receiveData="receiveData"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
import SelectMaterialMulti from '@/components/SelectMaterialMulti'

// emit event
const ADD = 'add'
const REMOVE = 'remove'

export default {
  components: {
    SelectMaterialMulti,
  },
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
</style>
