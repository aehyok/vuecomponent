<template>
  <div v-loading="loading">
    <div class="filter-wrapper">
      <div class="filter-buttons"></div>
      <el-form inline class="filter-options">
        <el-form-item label="审核状态：">
          <el-select v-model="filters.auditStatus" @change="filterChange">
            <el-option :value="2" label="审核中"></el-option>
            <el-option :value="3" label="审核通过"></el-option>
            <el-option :value="4" label="审核不通过"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>开始日期：</span>
          <el-date-picker lab v-model="filters.beginDateTime" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <span>结束日期：</span>
          <el-date-picker
            v-model="filters.endDateTime"
            type="date"
            placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            class="search"
            clearable
            placeholder="请输入消息名称搜索"
            style="width:250px;"
            @keyup.native.enter="filterChange"
            v-model="filters.keyword"
          >
            <el-button
              @click="filterChange"
              slot="append"
              icon="el-icon-search"
            />
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <TablePanel :data="list" :columns="tableCols" />

    <Pagination
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="getList"
    />

    <PopupMessageDetail
      :source="editMessage"
      :visible.sync="visible"
      @audited="getList"
    />
  </div>
</template>
<script>
import { format } from 'date-fns'
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import PopupMessageDetail from './PopupMessageDetail'
// import { getPopupMessageDetail } from '@/services/message'
import {
  auditGetPopupMessageList,
  getAuditRecordDetail,
} from '@/services/audit'

export default {
  components: {
    TablePanel,
    Pagination,
    PopupMessageDetail,
  },
  data() {
    return {
      filters: {
        keyword: '',
        auditStatus: 2,
        beginDateTime: Date.now() - 1000 * 60 * 60 * 24 * 30,
        endDateTime: Date.now(),
      },
      visible: false,
      loading: false,
      list: [],
      page: 1,
      total: 0,
      limit: 10,
      editMessage: {},
    }
  },
  computed: {
    tableCols() {
      const filterCols = ['审核完成时间', '审核意见']
      return [
        {
          label: '消息名称',
          prop: 'name',
        },
        {
          label: '提交人',
          prop: 'submitter',
        },
        {
          label: '提交审核时间',
          prop: '',
          render(h, { row }) {
            return (
              <span>
                {format(new Date(row.submitDateTime), 'yyyy-MM-dd HH:mm:ss')}
              </span>
            )
          },
        },
        {
          label: '审核状态',
          prop: 'auditStatus',
          render: (h, { row }) => {
            // 1：未提交审核，2：审核中，3：审核通过，4：审核不通过
            const auditMap = {
              1: {
                text: '未提交审核',
                type: 'info',
              },
              2: {
                text: '审核中',
                type: 'warning',
              },
              3: {
                text: '审核通过',
                type: 'success',
              },
              4: {
                text: '审核不通过',
                type: 'danger',
              },
            }
            return (
              <el-tag
                type={auditMap[row.auditStatus].type}
                style="cursor:pointer"
              >
                {auditMap[row.auditStatus].text}
              </el-tag>
            )
          },
        },
        {
          label: '审核人',
          prop: 'auditor',
        },
        {
          label: '审核完成时间',
          prop: '',
          render(h, { row }) {
            return (
              <span>
                {format(new Date(row.auditDateTime), 'yyyy-MM-dd HH:mm:ss')}
              </span>
            )
          },
        },
        {
          label: '审核意见',
          prop: '',
          render(h, { row }) {
            return row.auditStatus !== 2 ? (
              <span>{row.auditReason}</span>
            ) : (
              <span></span>
            )
          },
        },
        {
          label: '操作',
          width: 240,
          render: (h, { row }) => {
            return (
              <div>
                <el-button type="text" onClick={() => this.handleAudit(row)}>
                  {row.auditStatus === 2 ? '审核' : '详情'}
                </el-button>
              </div>
            )
          },
        },
      ].filter(v => {
        if (this.filters.auditStatus === 2 && filterCols.includes(v.label))
          return false
        return true
      })
    },
  },
  created() {
    this.getList()
  },
  methods: {
    filterChange() {
      this.page = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      console.log(this.filters)
      const beginDateTime = new Date(this.filters.beginDateTime)
      this.filters.beginDateTime = beginDateTime.getTime()

      const endDateTime = new Date(this.filters.endDateTime)
      this.filters.endDateTime = endDateTime.getTime()

      const res = await auditGetPopupMessageList({
        page: this.page,
        limit: this.limit,
        ...this.filters,
      })

      this.loading = false
      if (res.code === 200) {
        this.list = res.data.docs
        this.total = res.data.total
      }
    },
    async handleAudit({ id }) {
      const loading = this.$loading({
        fullscreen: true,
        background: 'transparent',
      })
      const res = await getAuditRecordDetail({ id })
      // if (auditStatus === 2) {
      //   res = await getPopupMessageDetail({ id })
      // } else {
      //   res = await getAuditRecordDetail({ id })
      // }
      loading.close()
      if (res && res.code === 200) {
        this.editMessage = res.data.afterContent || {}
        this.editMessage.contentId = this.editMessage.id
        this.editMessage.id = res.data.id
        this.visible = true
      }
    },
  },
}
</script>
