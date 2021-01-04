<template>
  <div>
    <div class="filter-wrapper">
      <div class="filter-buttons">
        <el-button
          v-permission="'create'"
          type="primary"
          @click="visible = true"
        >
          创建用户
        </el-button>
      </div>
      <el-form inline class="filter-options">
        <el-form-item label="状态：">
          <el-select clearable v-model="status" @change="resetPageThenFetch">
            <el-option value="1" label="启用"></el-option>
            <el-option value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input
            class="search"
            clearable
            placeholder="请输入用户姓名或账号搜索"
            @keyup.native.enter="resetPageThenFetch"
            style="width:280px"
            v-model="keyword"
          >
            <el-button
              @click="resetPageThenFetch"
              slot="append"
              icon="el-icon-search"
            />
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <TablePanel :columns="columns" :data="list" />

    <Pagination
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="getList"
    />

    <AdminForm
      @close="AdminFormClose"
      @closeFun="AdminFormClose"
      :edit-data="editUser"
      :visible.sync="visible"
      :normalOrgId="normalOrgId"
      @saved="resetPageThenFetch"
      v-if="visible"
    />
  </div>
</template>
<script>
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import ButtonWithComfirm from '@/components/ButtonWithConfirm'
import AdminForm from './AdminForm'
import { getUsers, removeUser, changeUserStatus } from '@/services/user'
import { transformFalsy } from '@/filters'

export default {
  components: {
    TablePanel,
    Pagination,
    AdminForm,
  },
  data() {
    return {
      normalOrgId: '',
      keyword: '',
      status: '',
      visible: false,
      editUser: {},
      list: [],
      total: 0,
      page: 1,
      limit: 10,
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
          label: '角色',
          prop: 'roles',
          render: (h, { row }) => {
            const text = row.roles.map(r => r.name).join('；')
            return <span>{transformFalsy(text)}</span>
          },
        },
        {
          label: '所属组织',
          render: (h, { row }) => {
            return row.organization.name || '--'
          },
        },
        {
          label: '状态',
          prop: 'status',
          render: (h, { row }) => {
            return (
              <el-tag type={row.status !== 1 ? 'danger' : 'success'}>
                {row.status === 1 ? '启用' : '停用'}
              </el-tag>
            )
          },
        },
        {
          label: '操作',
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  {...{
                    directives: [{ name: 'permission', value: 'update' }],
                  }}
                  type="text"
                  onClick={() => this.handleEdit(row)}
                >
                  编辑
                </el-button>
                <ButtonWithComfirm
                  onConfirm={() => this.changeStatus(row)}
                  {...{
                    directives: [{ name: 'permission', value: 'stop' }],
                  }}
                  type="text"
                  textType={row.status === 2 ? 'open' : 'stop'}
                />
                <ButtonWithComfirm
                  type="text"
                  {...{
                    directives: [{ name: 'permission', value: 'delete' }],
                  }}
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
    AdminFormClose() {
      console.log('关闭')
      this.editUser = {}
      this.normalOrgId = ''
      this.visible = false
    },
    async getList() {
      const res = await getUsers({
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
        status: this.status,
      })

      if (res.code === 200) {
        this.list = res.data.docs
        this.total = res.data.total
      }
    },
    async handleDelete({ id }) {
      const res = await removeUser({ ids: [id] })
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.getList()
      }
    },
    async changeStatus({ id, status }) {
      const res = await changeUserStatus({ id, status: status === 1 ? 2 : 1 })
      if (res.code === 200) {
        this.$message.success('状态修改成功')
        this.getList()
      }
    },
    resetPageThenFetch() {
      this.page = 1
      this.getList()
    },
    handleEdit(user) {
      this.editUser = user
      this.visible = true
      this.normalOrgId = user.organization.id
      console.log(this.normalOrgId, 'normalOrgId')
    },
  },
}
</script>
<style lang="scss" scoped></style>
