<template>
  <div v-loading="loading">
    <TablePanel :data="list" :columns="columns" />

    <Pagination
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="getList"
    />

    <WechatUserForm :visible.sync="visible" :source="detail" @saved="getList" />
  </div>
</template>
<script>
import { formatTime } from '@/filters'
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import WechatUserForm from './WechatUserForm'
import { getWechatList, getWechatDetail } from '@/services/wechat'

export default {
  components: {
    TablePanel,
    Pagination,
    WechatUserForm,
  },
  data() {
    return {
      filters: {
        keyword: '',
      },
      visible: false,
      loading: false,
      list: [],
      page: 1,
      total: 0,
      limit: 10,
      detail: {},
      columns: [
        {
          label: '手机号',
          prop: 'mobile',
        },
        {
          label: '姓名',
          prop: 'realName',
        },
        {
          label: '行政区域',
          prop: 'region',
        },
        {
          label: '注册时间',
          prop: '',
          render: (h, { row }) => {
            return <span>{formatTime(row.createdAt)}</span>
          },
        },
        {
          label: '认证情况',
          prop: 'experts',
          render: (h, { row }) => {
            if (row.experts.length > 0) {
              const types = {
                1: '农技达人',
                2: '审核不通过',
              }
              const expert = row.experts[0]
              const text = types[expert.type]

              return expert.status === 2 ? (
                <el-tag type="danger" onClick={() => this.handleDetail(row)}>
                  {text}
                </el-tag>
              ) : (
                <el-tag type="success" onClick={() => this.handleDetail(row)}>
                  {text}
                </el-tag>
              )
            }
          },
        },
      ],
    }
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

      const res = await getWechatList({
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
    async handleDetail({ id }) {
      const res = await getWechatDetail({ id })
      if (res.code === 200) {
        this.visible = true
        this.detail = res.data
      }
    },
  },
}
</script>
