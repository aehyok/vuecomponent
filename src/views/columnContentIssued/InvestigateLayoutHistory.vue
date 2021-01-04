<template>
  <el-row class="messageView" v-loading="loading">
    <el-row>
      <span>提交人：{{ item.auditor }}</span>
      <span style="margin-left:60px"
        >更新时间：{{ item.updatedAt | formatDate }}</span
      >
    </el-row>
    <el-col :span="11" style="padding-right:4px">
      <el-row style="text-align:center">变更后</el-row>
      <el-row>消息名称：{{ afterContent.name }}</el-row>
      <el-row>有效日期：{{ afterContent | validDateText }}</el-row>
      <IssuedRange
        :visible.sync="rangeVisible"
        :checked-keys="afterContent.distributeOrgs"
        :thisType="'detail'"
      />
      <TablePanel
        :columns="columns"
        :data="afterContent.questionInfos"
        style="margin-right:8px"
      />
    </el-col>
    <el-col :span="12" class="right">
      <el-row style="text-align:center">变更前</el-row>
      <el-row>消息名称：{{ frontContent.name }}</el-row>
      <el-row>有效日期：{{ frontContent | validDateText }}</el-row>
      <IssuedRange
        :visible.sync="rangeVisible2"
        :checked-keys="frontContent.distributeOrgs"
        :thisType="'detail'"
      />
      <TablePanel :columns="columns" :data="frontContent.questionInfos" />
      <InvestigateLayoutHistoryDetail
        :visible.sync="detailVisable"
        :source="detail"
      />
    </el-col>
  </el-row>
</template>

<script>
import { format } from 'date-fns'
import TablePanel from '@/components/TablePanel'
import IssuedRange from '@/components/IssuedRange'
import InvestigateLayoutHistoryDetail from './InvestigateLayoutHistoryDetail'
import { validDateText, playTimeText } from '@/filters'
import { getAuditRecordDetail } from '@/services/audit'
export default {
  components: {
    IssuedRange,
    TablePanel,
    InvestigateLayoutHistoryDetail,
  },
  filters: {
    validDateText,
    playTimeText,
    formatDate(data) {
      if (data) {
        return format(new Date(data), 'yyyy-MM-dd')
      }
      return ''
    },
  },
  data() {
    return {
      loading: false,
      rangeVisible: false,
      rangeVisible2: false,
      detailVisable: false,
      detail: {},
      id: this.$route.query.id,
      item: {},
      afterContent: {},
      frontContent: {},
      typeMap: {
        1: '图片',
        2: '问卷',
        3: '文字',
      },
      columns: [
        {
          label: '名称',
          prop: 'name',
        },
        {
          label: '操作',
          width: 120,
          render: (h, { row }) => {
            return (
              <div>
                <el-button type="text" onClick={() => this.getDetail(row)}>
                  详情
                </el-button>
              </div>
            )
          },
        },
      ],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await getAuditRecordDetail({ id: this.id })
      this.loading = false
      if (res.code === 200) {
        this.item = res.data
        this.afterContent = res.data.afterContent
        this.frontContent = res.data.frontContent
          ? res.data.frontContent
          : res.data.afterContent
        console.log(this.afterContent)
      }
    },
    resetFields() {},
    getDetail(row) {
      this.detailVisable = true
      this.detail = row
    },
  },
}
</script>

<style lang="scss" scoped>
.messageView {
  padding-left: 10px;
  * {
    margin-top: 20px;
  }
  .right {
    padding-left: 30px;
    border-left: 1px solid #2bae85;
  }
}
</style>
