<template>
  <el-dialog title="详情" v-bind="$attrs" v-on="$listeners">
    <el-form>
      <el-form-item label="文字内容：">
        <pre>{{ detail.text }}</pre>
      </el-form-item>

      <el-form-item label="视频：" v-if="isVideo">
        <video
          style="max-width: 100%;"
          :src="v.url"
          :key="v.id"
          v-for="v in detail.videos"
          controls
        ></video>
      </el-form-item>
      <el-form-item label="图片：" v-else>
        <el-row :gutter="10">
          <el-col :span="8" v-for="img in detail.images" :key="img.id">
            <div style="margin-bottom: 20px; height: 200px;">
              <el-image fit="contain" :src="img.url" style="height: 100%" />
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="状态：">
        <el-tag :type="statusTag">{{ statusText }}</el-tag>
      </el-form-item>
      <el-form-item label="运营商审核意见：">
        <pre>{{ detail.operatorAuditRemark }}</pre>
      </el-form-item>
      <el-form-item label="下线原因：">
        <pre>{{ detail.offlineReason }}</pre>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { status } from './index'

export default {
  props: {
    detail: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statusMap: status,
    }
  },
  computed: {
    statusText() {
      return this.statusMap[this.detail.status]?.text
    },
    statusTag() {
      return this.statusMap[this.detail.status]?.type
    },
    isVideo() {
      return this.detail.type === 2
    },
  },
}
</script>
