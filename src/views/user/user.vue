<template>
  <div>
    <div class="filter-wrapper">
      <div class="filter-buttons">
        <el-button
          v-permission="'create'"
          type="primary"
          @click="visible = true"
        >
          创建角色
        </el-button>
      </div>
      <div class="filter-options" style="margin-bottom: 20px;">
        <el-input
          class="search"
          clearable
          placeholder="请输入角色名称搜索"
          style="width:250px"
          v-model="keyword"
          @keyup.native.enter="resetPageThenFetch"
        >
          <el-button
            @click="resetPageThenFetch"
            slot="append"
            icon="el-icon-search"
          />
        </el-input>
      </div>
    </div>

    <TablePanel :columns="columns" :data="list" />

    <Pagination
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="getList"
    />

    <UserDialog
      :edit-role="editRole"
      :visible.sync="visible"
      @close="handleClose"
      @complete="getList"
    />
  </div>
</template>
<script>
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import ButtonWithConfirm from '@/components/ButtonWithConfirm'
import UserDialog from './UserDialog'
import { getRoleList, deleteRole } from '@/services/user'

export default {
  name: 'user',
  components: {
    TablePanel,
    Pagination,
    UserDialog,
  },
  data() {
    return {
      keyword: '',
      page: 1,
      limit: 10,
      total: 0,
      list: [],
      visible: false,
      editRole: {},
      columns: [
        {
          prop: 'name',
          label: '角色名称',
        },
        {
          prop: 'createdBy',
          label: '添加人',
        },
        {
          label: '操作',
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  {...{ directives: [{ name: 'permission', value: 'update' }] }}
                  type="text"
                  onClick={() => this.handleEdit(row)}
                >
                  编辑
                </el-button>
                <ButtonWithConfirm
                  type="text"
                  {...{ directives: [{ name: 'permission', value: 'delete' }] }}
                  onConfirm={() => this.deleteRole(row)}
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
      const res = await getRoleList({
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
      })
      if (res.code === 200) {
        this.total = res.data.total
        this.list = res.data.docs
      }
    },
    async deleteRole({ id }) {
      let res = null
      try {
        res = await deleteRole({ id })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getList()
        }
      } catch (error) {
        console.error(error)
      }
    },
    handleClose() {
      this.editRole = {}
    },
    handleEdit(role) {
      this.editRole = role
      this.visible = true
    },
    resetPageThenFetch() {
      this.page = 1
      this.getList()
    },
  },
}
</script>
