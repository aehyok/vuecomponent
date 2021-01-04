<template>
  <div v-loading="loading">
    <div class="filter-wrapper">
      <div class="filter-buttons">
        <el-button type="primary" @click="addItem" v-permission="'create'"
          >添加调查内容</el-button
        >
      </div>
      <el-form inline class="filter-options">
        <el-form-item label="是否发布到公众号：">
          <el-select v-model="filters.client" clearable @change="filterChange">
            <el-option :value="1" label="已发布"></el-option>
            <el-option :value="2" label="未发布"></el-option>
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

    <TablePanel :data="list" :columns="columns" />

    <Pagination
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="getList"
    />

    <InvestigateForm
      :source="editMessage"
      :visible.sync="visible"
      @saved="getList"
    ></InvestigateForm>

    <InvestigatePublish
      :source="editMessage"
      :visible.sync="publishVisible"
      @saved="getList"
    ></InvestigatePublish>

    <InvestigateChart
      :source="editMessage"
      :visible.sync="chartVisible"
      @saved="getList"
    ></InvestigateChart>
  </div>
</template>
<script>
import { format } from 'date-fns'
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import ButtonWithConfirm from '@/components/ButtonWithConfirm'
import InvestigateForm from './InvestigateForm'
import InvestigatePublish from './InvestigatePublish'
import InvestigateChart from './InvestigateChart'
import {
  getQuestionList,
  getQuestionDetail,
  deleteQuestion,
} from '@/services/investigate'

export default {
  components: {
    TablePanel,
    Pagination,
    InvestigateForm,
    InvestigatePublish,
    InvestigateChart,
  },
  data() {
    return {
      filters: {
        keyword: '',
        client: '',
      },
      visible: false,
      publishVisible: false,
      chartVisible: false,
      loading: false,
      list: [],
      page: 1,
      total: 0,
      limit: 10,
      editMessage: {},
      columns: [
        {
          label: '名称',
          prop: 'name',
        },
        {
          label: '内容形式',
          prop: '',
          render: (h, { row }) => {
            return (
              <span>
                {row.contentType === 1
                  ? '图文'
                  : row.contentType === 3
                  ? '图片'
                  : '文字'}
              </span>
            )
          },
        },
        {
          label: '是否发布到公众号',
          prop: '',
          render: (h, { row }) => {
            return <div>{row.client === 1 ? '已发布' : '未发布'}</div>
          },
        },
        {
          label: '修改人',
          prop: '',
          render: (h, { row }) => {
            return <div>{row.updatedBy}</div>
          },
        },
        {
          label: '修改时间',
          prop: '',
          render(h, { row }) {
            return (
              <span>
                {format(new Date(row.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
              </span>
            )
          },
        },
        {
          label: '操作',
          width: 240,
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  {...{ directives: [{ name: 'permission', value: 'update' }] }}
                  disabled={row.auditStatus === 2}
                  type="text"
                  onClick={() => this.handleEdit(row)}
                >
                  编辑
                </el-button>
                <el-button type="text" onClick={() => this.handleChart(row)}>
                  查看数据
                </el-button>
                <el-button
                  {...{
                    directives: [{ name: 'permission', value: 'pushOaSet' }],
                  }}
                  type="text"
                  onClick={() => this.handlePublish(row)}
                >
                  发布设置
                </el-button>
                <ButtonWithConfirm
                  {...{
                    directives: [{ name: 'permission', value: 'delete' }],
                  }}
                  textType="questionDelete"
                  type="text"
                  onConfirm={() => this.handleDelete(row)}
                />
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
    filterChange() {
      this.page = 1
      this.getList()
    },
    async getList() {
      this.loading = true

      const res = await getQuestionList({
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
    addItem() {
      this.editMessage = {}
      this.visible = true
    },
    async handleEdit({ id }) {
      const loading = this.$loading({
        fullscreen: true,
        background: 'transparent',
      })

      const res = await getQuestionDetail({ id })

      loading.close()
      if (res.code === 200) {
        this.editMessage = res.data
        this.visible = true
      }
    },
    async handlePublish({ id }) {
      const loading = this.$loading({
        fullscreen: true,
        background: 'transparent',
      })

      const res = await getQuestionDetail({ id })
      loading.close()
      if (res.code === 200) {
        this.editMessage = res.data
        this.publishVisible = true
      }
    },
    async handleChart(row) {
      this.editMessage = row
      this.chartVisible = true
    },
    async handleDelete({ id }) {
      const res = await deleteQuestion({ id })
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.getList()
      }
    },
  },
}
</script>
