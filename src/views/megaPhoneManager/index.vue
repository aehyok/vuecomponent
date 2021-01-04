<template>
  <div v-loading="loading">
    <div class="filter-wrapper">
      <div class="filter-buttons">
        <!-- <el-button
          type="primary"
          @click="visible = true"
          v-permission="'create'"
        > -->
       <!--// TODO 按钮权限未控制---->
        <el-button
          type="primary"
          @click="visible = true"
        >
          添加大喇叭
        </el-button>
      </div>
      <el-form inline class="filter-options">
        <el-form-item label="是否本组织发布：">
          <el-select v-model="filters.isSelf" clearable @change="filterChange">
            <el-option :value="1" label="本组织发布"></el-option>
            <el-option :value="2" label="非本组织发布"></el-option>
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

    <PopupMessageForm
      @close="editMessage = {}"
      @saved="handleSaved"
      :source="editMessage"
      :visible.sync="visible"
    />
    <MessageHistory
      :contentId="contentId"
      :dialogVisible.sync="historyVisible"
      @history="history"
    />
  </div>
</template>
<script>
import { format } from 'date-fns'
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import ButtonWithConfirm from '@/components/ButtonWithConfirm'
import PopupMessageForm from './megaPhoneForm'
import MessageHistory from '@/components/MessageHistory'

import {
  getPopupMessageList,
  updatePopupMessageStatus,
  deletePopupMessage,
  auditPopupMessage,
  getPopupMessageDetail,
} from '@/services/message'

export default {
  components: {
    TablePanel,
    Pagination,
    PopupMessageForm,
    MessageHistory,
  },
  data() {
    // 1：图片、2：问卷:、3：文字
    const typeMap = {
      1: '图片',
      2: '问卷',
      3: '文字',
    }
    return {
      contentId: '',
      historyVisible: false,
      visible: false,
      list: [],
      page: 1,
      limit: 10,
      total: 0,
      filters: {
        keyword: '',
        status: '',
        auditStatus: '',
        isSelf: '',
      },
      keyword: '',
      loading: false,
      editMessage: {},
      columns: [
        {
          label: '消息名称',
          prop: 'messageName',
        },
        {
          label: '霸屏内容类型',
          prop: 'type',
          render: (h, { row }) => {
            return typeMap[row.type]
          },
        },
        {
          label: '有效日期',
          render: (h, { row }) => {
            return (
              <span>
                {row.permanent === 1
                  ? '永不过期'
                  : `${format(row.startDate, 'yyyy-MM-dd')}
                  至
                  ${format(row.endDate, 'yyyy-MM-dd')}`}
              </span>
            )
          },
        },
        {
          label: '播放时间',
          prop: '',
          render: (h, { row }) => {
            return (
              <div>
                {row.allDay === 1
                  ? '全天'
                  : `${row.playStartTime}-${row.playEndTime}`}
              </div>
            )
          },
        },

        {
          label: '霸屏内容',
          render: (h, { row }) => {
            const contentMap = {
              1: <el-image src={row.imageUrl} />,
              2: '',
              3: row.messageText,
            }
            return <div>{contentMap[row.type]}</div>
          },
        },
        {
          label: '修改人',
          prop: 'updatedBy',
        },
        {
          label: '修改时间',
          prop: 'updatedAt',
          render(h, { row }) {
            return (
              <span>
                {format(new Date(row.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
              </span>
            )
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
                  {...{ directives: [{ name: 'permission', value: 'update' }] }}
                  type="text"
                  disabled={row.auditStatus === 2 || !row.isSelf}
                  onClick={() => this.handleEdit(row)}
                >
                  编辑
                </el-button>
                <el-button
                  disabled={row.auditStatus !== 1 || !row.isSelf}
                  type="text"
                  {...{
                    directives: [{ name: 'permission', value: 'submitAudit' }],
                  }}
                  onClick={() => this.audit(row)}
                >
                  提交审核
                </el-button>
                <ButtonWithConfirm
                  textType={row.status === 1 ? 'stop' : 'open'}
                  type="text"
                  disabled={row.auditStatus <= 2 || !row.isSelf}
                  {...{ directives: [{ name: 'permission', value: 'stop' }] }}
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
    async getList() {
      this.loading = true
      const res = await getPopupMessageList({
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
    filterChange() {
      this.page = 1
      this.getList()
    },
    async audit({ id }) {
      const res = await auditPopupMessage({ id, status: 2, reason: '' })
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
      const res = await getPopupMessageDetail({ id })
      loading.close()
      if (res.code === 200) {
        this.editMessage = res.data
        this.visible = true
      }
    },
    handleSaved() {
      this.visible = false
      this.getList()
    },
    async changeStatus({ id, status }) {
      const res = await updatePopupMessageStatus({
        id,
        status: status === 1 ? 2 : 1,
      })
      if (res.code === 200) {
        this.$message.success(status === 1 ? '停用成功' : '启用成功')
        this.getList()
      }
    },
    async deleteMessage({ id }) {
      const res = await deletePopupMessage({ id })

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
        path: `/popup-message-history-detail?id=${id}`,
      })
      window.open(href, '_blank')
    },
  },
}
</script>
