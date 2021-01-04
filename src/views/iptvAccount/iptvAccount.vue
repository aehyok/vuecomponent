<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <OrgTree
        :show-tool="false"
        :lazy="true"
        :highlight="true"
        @getNode="handleNodeClick"
      />
    </el-col>
    <el-col :span="20">
      <div class="filter-wrapper">
        <div class="filter-buttons">
          <el-button
            type="primary"
            @click="visible = true"
            v-permission="'create'"
          >
            新建账号
          </el-button>
          <el-button
            @click="importVisible = true"
            type="primary"
            v-permission="'importAcc'"
          >
            导入账号
          </el-button>
          <el-button type="primary" @click="batchDelete" v-permission="'delete'"
            >删除</el-button
          >
        </div>
        <el-form inline class="filter-options">
          <el-form-item label="运营商：">
            <el-select
              v-model="filters.operatorId"
              style="width: 200px;margin-right: 10px;"
              @change="resetPageAndFetch"
              clearable
            >
              <el-option
                v-for="i in operatorList"
                :key="i.operatorId"
                :label="i.name"
                :value="i.operatorId"
              /> </el-select
          ></el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="filters.status"
              style="width: 200px;margin-right: 10px;"
              @change="resetPageAndFetch"
              clearable
            >
              <el-option :value="1" label="有效"></el-option>
              <el-option :value="2" label="无效"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input
              class="search"
              clearable
              placeholder="请输入iptv账号搜索"
              style="width:250px"
              v-model="filters.keyword"
              @keyup.native.enter="resetPageAndFetch"
            >
              <el-button
                @click="resetPageAndFetch"
                slot="append"
                icon="el-icon-search"
              /> </el-input
          ></el-form-item>
        </el-form>
      </div>

      <TablePanel
        :columns="columns"
        :data="list"
        @selection-change="handleSelectionChange"
      />

      <Pagination
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        @pagination="getList"
      />

      <AccountForm
        :visible.sync="visible"
        :currentOrgId="orgId"
        :account="editRow"
        :operators="operatorList"
        @closed="editRow = {}"
        @saved="resetPageAndFetch"
      />

      <AccountImport
        @saved="resetPageAndFetch"
        :org-id="orgId"
        :visible.sync="importVisible"
      />
    </el-col>
  </el-row>
</template>
<script>
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import ButtonWithConfirm from '@/components/ButtonWithConfirm'
import OrgTree from '@/components/organizationTree'
import AccountImport from './AccountImport'
import AccountForm from './AccountForm'
import {
  getIPTVAcountList,
  deleteAccount,
  getOperatorList,
  changeAccountStatus,
} from '@/services/iptv'
import { format } from 'date-fns'

export default {
  name: 'columnContentIssued',
  components: {
    TablePanel,
    Pagination,
    AccountForm,
    AccountImport,
    OrgTree,
  },
  data() {
    return {
      visible: false,
      importVisible: false,
      filters: {
        operatorId: '',
        status: '',
        keyword: '',
      },
      page: 1,
      limit: 10,
      total: 0,
      orgId: '',
      editRow: {},
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      columnLayout: 'picture',
      list: [],
      operatorList: [],
      selection: [],
      treeData: [],
      columns: [
        {
          type: 'selection',
        },
        {
          label: 'IPTV账号',
          prop: 'iptvAccount',
        },
        {
          label: '运营商',
          prop: 'operatorName',
        },
        {
          label: '姓名',
          prop: 'contactUser',
        },
        {
          label: '联系电话',
          prop: 'contactPhone',
        },
        {
          label: '地址',
          prop: 'contactAddress',
        },
        {
          label: '所属组织',
          prop: 'orgName',
        },
        {
          label: '状态',
          prop: 'status',
          render: (h, { row }) => {
            return <span>{row.status === 1 ? '有效' : '无效'}</span>
          },
        },
        {
          label: '创建时间',
          prop: 'createdAt',
          render: (h, { row }) => {
            return (
              <span>
                {format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm:ss')}
              </span>
            )
          },
        },
        {
          label: '操作',
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  type="text"
                  {...{ directives: [{ name: 'permission', value: 'update' }] }}
                  onClick={() => this.handleEdit(row)}
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.toggleStatus(row)}
                  {...{ directives: [{ name: 'permission', value: 'stop' }] }}
                >
                  {row.status === 1 ? '无效' : '有效'}
                </el-button>
                <ButtonWithConfirm
                  type="text"
                  {...{ directives: [{ name: 'permission', value: 'delete' }] }}
                  onConfirm={() => this.delete([row.id])}
                />
              </div>
            )
          },
        },
      ],
    }
  },
  watch: {
    orgId() {
      this.getList()
    },
  },

  created() {
    this.getOerators()
  },
  methods: {
    resetPageAndFetch() {
      this.page = 1
      this.getList()
    },
    async getList() {
      const res = await getIPTVAcountList({
        page: this.page,
        limit: this.limit,
        ...this.filters,
        parentId: this.orgId,
      })
      if (res.code === 200) {
        this.list = res.data.docs
        this.total = res.data.total
      }
    },
    async getOerators() {
      const res = await getOperatorList({
        page: 1,
        limit: 10000,
      })

      if (res.code === 200) {
        this.operatorList = res.data.docs
      }
    },
    async delete(ids) {
      const res = await deleteAccount({ ids })

      if (res.code === 200) {
        this.$message.success('删除成功')
        this.page = 1
        this.getList()
      }
    },
    batchDelete() {
      if (!this.selection.length) {
        this.$message.warning('请勾选需要删除的账号')
        return
      }
      this.$confirm('删除后，该数据将无法恢复', '是否删除', {
        confirmButtonText: '删除',
        type: 'warning',
      }).then(() => {
        this.delete(this.selection.map(i => i.id))
      })
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    handleEdit(row) {
      this.editRow = row
      this.visible = true
    },
    handleNodeClick(data) {
      this.orgId = data.id
    },
    async toggleStatus({ id, status }) {
      const validBool = !(status - 1)
      this.$confirm(
        `确定要将该账号设为${
          validBool ? '无效' : '有效'
        }吗？若状态为无效该账号将无法使用`,
        '',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(async () => {
        const res = await changeAccountStatus({
          id,
          status: validBool + 1,
        })

        if (res.code === 200) {
          this.$message.success(`状态修改成功`)
          this.getList()
        }
      })
    },
  },
}
</script>
