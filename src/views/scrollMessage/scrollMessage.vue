<template>
  <div v-loading="loading">
    <div class="filter-wrapper">
      <div class="filter-buttons">
        <el-button
          type="primary"
          @click="visible = true"
          v-permission="'create'"
        >
          添加滚动消息
        </el-button>
      </div>
      <el-form inline class="filter-options">
        <el-form-item label="发布来源：">
          <el-select v-model="filters.isSelf" clearable @change="filterChange">
            <el-option :value="1" label="本组织发布"></el-option>
            <el-option :value="2" label="非本组织发布"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="filters.status" clearable @change="filterChange">
            <el-option :value="1" label="启用"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select
            v-model="filters.auditStatus"
            clearable
            @change="filterChange"
          >
            <el-option :value="1" label="未提交审核"></el-option>
            <el-option :value="2" label="审核中"></el-option>
            <el-option :value="3" label="审核通过"></el-option>
            <el-option :value="4" label="审核不通过"></el-option>
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

    <ScrollMessageForm
      :source="editMessage"
      :visible.sync="visible"
      @saved="getList"
    />

    <MessageHistory
      :contentId="contentId"
      :dialogVisible.sync="historyVisible"
      @history="history"
    />
  </div>
</template>
<script>
import { formatTime, validDateText, playTimeText } from '@/filters'
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import ScrollMessageForm from './ScrollMessageForm'
import ButtonWithConfirm from '@/components/ButtonWithConfirm'
import MessageHistory from '@/components/MessageHistory'

import {
  getScrollMessageList,
  getScrollMessageDetail,
  auditScrollMessage,
  scrollMessageDelete,
  updateScrollMessageStatus,
} from '@/services/message'

export default {
  components: {
    TablePanel,
    Pagination,
    ScrollMessageForm,
    MessageHistory,
  },
  data() {
    return {
      contentId: '',
      historyVisible: false,
      filters: {
        keyword: '',
        status: '',
        auditStatus: '',
        isSelf: '',
      },
      visible: false,
      loading: false,
      list: [],
      page: 1,
      total: 0,
      limit: 10,
      editMessage: {},
      columns: [
        {
          label: '消息名称',
          prop: 'messageName',
        },
        {
          label: '有效日期',
          prop: '',
          render: (h, { row }) => {
            return <span>{validDateText(row)}</span>
          },
        },
        {
          label: '播放时间',
          prop: '',
          render: (h, { row }) => {
            return <div>{playTimeText(row)}</div>
          },
        },
        {
          label: '播放次数',
          prop: '',
          render: (h, { row }) => {
            return (
              <div>{row.noLimit === 1 ? '不限次数' : `${row.scrollTimes}`}</div>
            )
          },
        },
        {
          label: '消息内容',
          prop: 'messageText',
        },
        {
          label: '修改人',
          prop: 'updatedBy',
        },
        {
          label: '修改时间',
          prop: '',
          render(h, { row }) {
            return <span>{formatTime(row.updatedAt)}</span>
          },
        },
        {
          label: '发布范围',
          prop: '',
          render(h, { row }) {
            return <span>{row.distributeOrgNames.join(',')}</span>
          },
        },
        {
          label: '发布来源',
          prop: '',
          render(h, { row }) {
            return <span>{row.createdByOrgName}</span>
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
                onClick={() => this.handleAuditHistory(row)}
                style="cursor:pointer"
              >
                {auditMap[row.auditStatus].text}
              </el-tag>
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
                  disabled={row.auditStatus === 2 || !row.isSelf}
                  type="text"
                  {...{ directives: [{ name: 'permission', value: 'update' }] }}
                  onClick={() => this.handleEdit(row)}
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.audit(row)}
                  {...{
                    directives: [{ name: 'permission', value: 'submitAudit' }],
                  }}
                  disabled={row.auditStatus !== 1 || !row.isSelf}
                >
                  提交审核
                </el-button>
                <ButtonWithConfirm
                  textType={row.status === 1 ? 'stop' : 'open'}
                  type="text"
                  {...{ directives: [{ name: 'permission', value: 'stop' }] }}
                  disabled={row.auditStatus <= 2 || !row.isSelf}
                  onConfirm={() => this.changeStatus(row)}
                />
                <ButtonWithConfirm
                  type="text"
                  {...{ directives: [{ name: 'permission', value: 'delete' }] }}
                  onConfirm={() => this.deleteMessage(row)}
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

      const res = await getScrollMessageList({
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
    async audit({ id }) {
      const res = await auditScrollMessage({ id, status: 2 })
      if (res.code === 200) {
        this.$message.success('提交审核成功')
        this.getList()
      }
    },
    async handleEdit({ id }) {
      const loading = this.$loading({
        fullscreen: true,
        background: 'transparent',
      })

      const res = await getScrollMessageDetail({ id })

      loading.close()
      if (res.code === 200) {
        this.editMessage = res.data
        this.visible = true
      }
    },
    async changeStatus({ id, status }) {
      const res = await updateScrollMessageStatus({
        id,
        status: status === 1 ? 2 : 1,
      })
      if (res.code === 200) {
        this.$message.success(status === 1 ? '停用成功' : '启用成功')
        this.getList()
      }
    },
    async deleteMessage({ id }) {
      const res = await scrollMessageDelete({ id })
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.getList()
      }
    },
    handleAuditHistory({ id }) {
      this.contentId = id
      this.historyVisible = true
    },
    history(id) {
      const { href } = this.$router.resolve({
        path: `/scroll-message-history-detail?id=${id}`,
      })
      window.open(href, '_blank')
    },
  },
}
</script>
