<template>
  <el-dialog
    title="审核历史"
    @open="handOpened"
    @close="$emit('update:dialogVisible', false)"
    :visible="dialogVisible"
  >
    <el-table :data="gridData" border v-loading="isLoading">
      <el-table-column prop="auditStatus" label="审核进展">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.auditStatus === 1" type="info"
            >未提交审核</el-tag
          >
          <el-tag v-if="scope.row.auditStatus === 2" type="warning"
            >审核中</el-tag
          >
          <el-tag v-if="scope.row.auditStatus === 3" type="success"
            >审核通过</el-tag
          >
          <el-tag v-if="scope.row.auditStatus === 4" type="danger"
            >审核不通过</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="auditor" label="操作人"></el-table-column>
      <el-table-column prop="auditDateTime" label="操作时间">
        <template slot-scope="scope">
          {{ scope.row.auditDateTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="auditReason" label="审核意见">
        <template slot-scope="scope">
          <span>{{ scope.row.auditReason | isHasCon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="getAuditHistory(scope.row)"
            >变更详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :page.sync="page"
      :limit.sync="limit"
      :total="total"
      @pagination="pagination"
    />
  </el-dialog>
</template>

<script>
import { getAuditRecordList } from '@/services/columnReview'
import { format } from 'date-fns'
import Pagination from '@/components/Pagination'
export default {
  props: {
    contentId: {
      type: String,
      default: '',
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    formatDate(val) {
      return format(new Date(val), 'yyyy-MM-dd HH:mm:ss')
    },
    isHasCon(val) {
      const txt = !val ? '--' : val
      return txt
    },
  },
  components: {
    Pagination,
  },
  data() {
    return {
      isLoading: false,
      gridData: [],
      page: 1,
      limit: 10,
      total: 0,
      keyword: '',
    }
  },
  methods: {
    getAuditHistory({ id }) {
      console.log(id)
      this.$emit('update:dialogVisible', false)
      this.$emit('history', id)
    },
    async getAuditList() {
      const res = await getAuditRecordList({
        contentId: this.contentId,
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
      })
      if (res.code === 200) {
        this.gridData = res.data.docs
        this.total = res.data.total
      }
      this.isLoading = false
      console.log(res)
    },
    handOpened() {
      this.isLoading = true
      this.gridData = []
      this.page = 1
      this.limit = 10
      this.total = 0
      this.keyword = ''
      this.getAuditList()
    },
    pagination() {
      this.getAuditList()
    },
  },
}
</script>

<style lang="scss" scoped></style>
