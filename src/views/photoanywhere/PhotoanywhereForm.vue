<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    @closed="handleClose"
  >
    <el-form class="form" label-width="120px" ref="form">
      <el-form-item label="发布者：">{{ source.realName }} </el-form-item>
      <el-form-item label="认证手机号：">{{ source.mobile }} </el-form-item>
      <el-form-item label="认证地址：">{{ source.address }} </el-form-item>
      <el-form-item label="问题类别：">{{ source.type }} </el-form-item>
      <el-form-item label="发布位置：">{{ source.position }} </el-form-item>
      <el-form-item label="文字描述：">{{ source.descript }} </el-form-item>
      <el-form-item label="提交时间："
        >{{ source.createdAt | formatTime }}
      </el-form-item>
      <el-form-item label="图片描述：">
        <el-row class="containter">
          <el-popover
            class="image"
            placement="right"
            trigger="hover"
            v-for="img in source.imageIds"
            :key="img"
          >
            <img :src="img" class="bigImg" />
            <img slot="reference" :src="img" style="width:100%; height:100%" />
          </el-popover>
        </el-row>
      </el-form-item>
      <el-form-item label="视频描述：">
        <el-row class="containter">
          <video
            class="video"
            v-for="img in source.videoIds"
            :key="img"
            :src="img"
            controls="controls"
          ></video>
        </el-row>
      </el-form-item>
      <el-form-item label="回复文字:" v-if="source.isReply === 2"
        >{{ source.replyDesc }}
      </el-form-item>
      <el-form-item label="回复时间:" v-if="source.isReply === 2"
        >{{ source.replyDateTime | formatTime }}
      </el-form-item>
      <el-form-item label="回复图片:" v-if="source.isReply === 2">
        <el-row class="containter">
          <img
            v-for="img in source.replyImageIds"
            :key="img"
            :src="img"
            class="image"
          />
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { changeStatusWechatuser } from '@/services/wechat'
export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  computed: {
    title() {
      return '详情'
    },
  },
  data() {
    return {
      expert: {},
      status: {
        1: '启用',
        2: '停用',
      },
    }
  },
  watch: {
    source(data) {
      if (data && data.experts && data.experts.length > 0)
        this.expert = data.experts[0]
    },
  },
  methods: {
    handleClose() {},
    async save() {
      if (!this.expert.status) return
      switch (this.expert.status) {
        case 1:
          this.$prompt('', '请输入停用原因', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            const res = this.changeStatusWechatuser({
              id: this.source.id,
              expertid: this.expert.id,
              status: 2,
              reason: value,
            })
            if (res.code === 200) {
              this.$message.success('停用成功')
            } else {
              this.$message.error('停用失败')
            }
          })
          break
        case 2:
          {
            const res = this.changeStatusWechatuser({
              id: this.source.id,
              expertid: this.expert.id,
              status: 1,
            })
            if (res.code === 200) {
              this.$message.success('启用成功')
            } else {
              this.$message.error('启用失败')
            }
          }
          break
      }
    },
    async changeStatusWechatuser(data) {
      return await changeStatusWechatuser({
        data,
      })
    },
    resetFields() {
      // this.$refs.form.resetFields()
    },
  },
}
</script>
<style lang="scss" scoped>
.containter {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  // justify-content: space-between;
  .video {
    height: 100%;
    max-height: 200px;
  }
  .image {
    width: 162px;
    height: 170px;
    margin-right: 2px;
    margin-bottom: 2px;
  }
  .bigImg {
    width: auto;
    height: 300px;
  }
}
</style>
