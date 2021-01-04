<template>
  <div v-loading="loading">
    <div class="filter-wrapper">
      <div class="filter-buttons"></div>
      <el-form inline class="filter-options">
        <el-form-item label="内容类型：">
          <el-select
            v-model="filters.contentType"
            clearable
            @change="filterChange"
          >
            <el-option :value="1" label="图文"></el-option>
            <el-option :value="2" label="视频"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="filters.status" clearable @change="filterChange">
            <el-option
              :value="s.value"
              :label="s.label"
              :key="s.value"
              v-for="s in statusList"
            ></el-option>
          </el-select>
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

    <table-panel :columns="columns" :data="list" />

    <pagination
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="getList"
    />

    <moment-detail :visible.sync="detailVisible" :detail="detailData" />
    <el-dialog :visible.sync="visible" @closed="handleOff" title="下线">
      <el-form ref="offline" :model="offlineForm">
        <el-form-item
          label="下线原因："
          prop="reason"
          :rules="[{ required: true, message: '请输入下线原因' }]"
        >
          <el-input
            placeholder="请输入下线原因，将在公众号展示给内容发布者"
            type="textarea"
            maxlength="200"
            v-model="offlineForm.reason"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="changeStatus">下线</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import { formatTime, transformFalsy } from '@/filters'
import { getMomentContentList, changeMomentStatus } from '@/services/moment'
import MomentDetail from './VillageMomentDetail'
import { statusMap, status } from './index'

export default {
  components: {
    TablePanel,
    MomentDetail,
    Pagination,
  },
  data() {
    const statusList = Object.keys(statusMap).map(s => ({
      value: s,
      label: statusMap[s],
    }))
    return {
      filters: {
        contentType: '',
        status: '',
        dateRange: [],
        keyword: '',
      },
      statusList,
      visible: false,
      loading: false,
      list: [],
      page: 1,
      limit: 10,
      total: 0,
      detailVisible: false,
      detailData: {},
      offlineForm: {
        reason: '',
        status: 7,
      },
      columns: [
        {
          label: '内容',
          prop: 'text',
        },
        {
          label: '内容类型',
          render: (h, { row }) => {
            return row.type === 1 ? '图文' : '视频'
          },
        },
        {
          label: '发布人',
          prop: 'createdByName',
        },
        {
          label: '发布时间',
          prop: 'createdDateTime',
          render: (h, { row }) => {
            return transformFalsy(formatTime(row.createdDateTime))
          },
        },
        {
          label: '状态',
          render: (h, { row }) => {
            return (
              <el-tag size="small" type={status[row.status].type}>
                {transformFalsy(status[row.status].text)}
              </el-tag>
            )
          },
        },
        {
          label: '操作',
          render: (h, { row }) => {
            return (
              <div>
                <el-button type="text" onClick={() => this.handleDetail(row)}>
                  详情
                </el-button>
                {this.canOffline(row) && (
                  <el-button type="text" onClick={() => this.offline(row)}>
                    下线
                  </el-button>
                )}
              </div>
            )
          },
        },
      ],
    }
  },

  created() {
    this.getList()
  },
  methods: {
    canOffline(row) {
      const OFFLINE = 7
      const DELETED = 4
      return row.status !== OFFLINE && row.status !== DELETED
    },
    async getList() {
      const [start, end] = this.filters.dateRange
      this.loading = true
      const res = await getMomentContentList({
        page: this.page,
        limit: this.limit,
        type: this.filters.contentType,
        status: this.filters.status,
        keyword: this.filters.keyword,
        beginDate: start,
        endDate: end,
      })
      this.loading = false
      this.list = res.data.docs
      this.total = res.data.total
    },
    filterChange() {
      this.page = 1
      this.getList()
    },
    handleDetail(row) {
      this.detailData = row
      this.detailVisible = true
    },
    handleOff() {
      this.$refs.offline.resetFields()
      this.detailData = {}
    },
    offline(row) {
      this.detailData = row
      this.visible = true
    },
    changeStatus() {
      this.$refs.offline.validate(async valid => {
        if (valid) {
          const res = await changeMomentStatus({
            id: this.detailData.id,
            ...this.offlineForm,
          })
          this.visible = false
          if (res.code === 200) {
            this.$message.success('下线成功')
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }
      })
    },
  },
}
</script>
