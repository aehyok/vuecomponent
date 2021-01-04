<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    @closed="handleClose"
  >
    <el-form class="form" label-width="120px" ref="form">
      <el-form-item label="姓名：">{{ source.realName }} </el-form-item>
      <el-form-item label="状态：">{{ status[expert.status] }} </el-form-item>
      <el-form-item label="停用原因：" v-if="expert.status === 2"
        >{{ expert.reason }}
      </el-form-item>
      <el-form-item label="手机号：">{{ source.mobile }} </el-form-item>
      <el-form-item label="行政区域：">{{ source.region }} </el-form-item>
      <el-form-item label="个人简介：">{{ expert.descript }} </el-form-item>
      <el-form-item
        label="身份证照片："
        v-if="expert.idCardFrontImage && expert.idCardFrontImage.url"
      >
        <el-col :span="12" style="text-align: center">
          <el-row>
            <img class="image" :src="expert.idCardFrontImage.url" />
          </el-row>
          <el-row>
            身份证正面
          </el-row>
        </el-col>
        <el-col :span="12" style="text-align: center; padding-left: 2px">
          <el-row>
            <img class="image" :src="expert.idCardbackImage.url" />
          </el-row>
          <el-row>
            身份证反面
          </el-row>
        </el-col>
      </el-form-item>
      <el-form-item
        label="正面照："
        v-if="expert.authImage && expert.authImage.url"
      >
        <el-col :span="12" style="text-align: center">
          <el-row>
            <img class="image" :src="expert.authImage.url" />
          </el-row>
          <el-row>
            正面照
          </el-row>
        </el-col>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">{{
        status[3 - expert.status]
      }}</el-button>
    </template>
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
      return '农技达人身份认证hjghfj详情'
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
      if (data && data.experts.length > 0) this.expert = data.experts[0]
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
          }).then(async ({ value }) => {
            const res = await this.changeStatusWechatuser({
              id: this.source.id,
              expertid: this.expert.id,
              status: 2,
              reason: value,
            })
            if (res.code === 200) {
              this.$message.success('停用成功')
              this.$emit('update:visible', false)
              this.$emit('saved')
            } else {
              this.$message.error('停用失败')
            }
          })
          break
        case 2:
          {
            const res = await this.changeStatusWechatuser({
              id: this.source.id,
              expertid: this.expert.id,
              status: 1,
            })
            if (res.code === 200) {
              this.$message.success('启用成功')
              this.$emit('update:visible', false)
              this.$emit('saved')
            } else {
              this.$message.error('启用失败')
            }
          }
          break
      }
    },
    async changeStatusWechatuser(data) {
      return await changeStatusWechatuser(data)
    },
    resetFields() {
      // this.$refs.form.resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.image {
  height: 100%;
  max-height: 200px;
}
</style>
