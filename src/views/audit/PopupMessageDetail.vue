<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="source.auditStatus === 2 ? '弹窗消息审核' : '弹窗消息详情'"
    @closed="resetFields"
  >
    <div class="messageView">
      <el-row>消息名称：{{ source.messageName }}</el-row>
      <el-row>有效日期：{{ source | validDateText }}</el-row>
      <el-row>弹出时间：{{ source | playTimeText }}</el-row>
      <el-row
        ><span>弹窗内容：</span><el-image :src="source.imageUrl"></el-image
      ></el-row>
      <IssuedRange
        :visible.sync="rangeVisible"
        :checked-keys="source.distributeOrgs"
        :thisType="'detail'"
      />
      <el-row style="text-align: center" v-if="source.auditStatus === 2">
        <el-radio v-model="auditState" label="3">审核通过</el-radio>
        <el-radio v-model="auditState" label="4">审核不通过</el-radio>
      </el-row>
      <el-row style="margin-top: 4px" v-if="source.auditStatus === 2">
        <el-input
          v-model.trim="auditReason"
          type="textarea"
          maxlength="2000"
          placeholder="请输入审核意见"
        />
      </el-row>
    </div>
    <template #footer v-if="source.auditStatus === 2">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="audit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { auditPopupMessageAction } from '@/services/audit'
import IssuedRange from '@/components/IssuedRange'
export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    IssuedRange,
  },
  data() {
    return {
      typeMap: {
        1: '图片',
        2: '问卷',
        3: '文字',
      },
      auditState: '3',
      auditReason: '',

      rangeVisible: false,
    }
  },
  watch: {
    source(data) {
      const {
        noticeText,
        messageName,
        startDate,
        endDate,
        permanent,
        playStartTime,
        playEndTime,
        type,
        allDay,
        distributeOrgs,
        id,
        imageId,
        imageUrl,
      } = this.source

      if (!id) return

      this.formData = {
        title: messageName,
        content: noticeText,
        type: Number(type),
        allDay,
        image: [{ id: imageId, url: imageUrl }],
        startDate,
        endDate: endDate === -1 ? '' : endDate,
        transmitTime: [playStartTime, playEndTime],
        ranges: distributeOrgs,
        alwaysOn: permanent,
      }
    },
  },
  methods: {
    async audit() {
      const res = await auditPopupMessageAction({
        id: this.source.id,
        contentId: this.source.contentId,
        name: this.source.messageName,
        auditStatus: parseInt(this.auditState),
        auditReason: this.auditReason,
      })
      if (res.code === 200) {
        // this.$message.success('提交成功')
        this.$message({
          duration: 1200,
          message: '提交成功',
          type: 'success',
        })
        this.$emit('update:visible', false)
        this.$emit('audited')
      }
    },
    resetFields() {},
  },
}
</script>

<style lang="scss" scoped>
.messageView {
  padding-left: 10px;
  * {
    margin-top: 20px;
  }
}
</style>
