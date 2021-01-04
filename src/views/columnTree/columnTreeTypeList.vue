<template>
  <div v-loading="loading">
    <div class="filter-wrapper">
      <div class="filter-buttons">
        <el-button type="primary" @click="handleEdit()" v-permission="'create'">
          添加栏目类型
        </el-button>
      </div>
      <el-form inline class="filter-options">
        <el-form-item>
          <el-input
            class="search"
            clearable
            placeholder="请输入名称搜索"
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
    <ColumnTreeTypeForm
      :visible.sync="visible"
      :source="editItem"
      @saved="getList"
    />
  </div>
</template>
<script>
import { format } from 'date-fns'
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import ButtonWithConfirm from '@/components/ButtonWithConfirm'
import ColumnTreeTypeForm from './ColumnTreeTypeForm'

import {
  getCategoryTypeList,
  removeCategoryTypeList,
} from '@/services/category'

export default {
  components: {
    TablePanel,
    Pagination,
    ColumnTreeTypeForm,
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
      editItem: {},
      columns: [
        {
          label: '栏目类型名称',
          prop: 'name',
        },
        {
          label: '关联动作',
          prop: 'relativeActive',
        },
        {
          label: '关联信息',
          prop: 'relativeExtends',
        },
        {
          label: '内容类型',
          prop: '',
          render(h, { row }) {
            const types = {
              1: '无内容',
              2: '全屏图片',
              3: '全屏视频',
              4: '图文信息',
              5: '文字列表',
              6: '图片列表',
              7: '民意调查',
            }
            return <span>{types[row.contentType]}</span>
          },
        },
        {
          label: '修改人',
          prop: 'updatedBy',
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
                  disabled={row.auditStatus === 2}
                  type="text"
                  {...{ directives: [{ name: 'permission', value: 'update' }] }}
                  onClick={() => this.handleEdit(row)}
                >
                  编辑
                </el-button>
                <ButtonWithConfirm
                  type="text"
                  {...{ directives: [{ name: 'permission', value: 'delete' }] }}
                  onConfirm={() => this.handleRemove(row)}
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

      const res = await getCategoryTypeList({
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
    handleEdit(row) {
      const loading = this.$loading({
        fullscreen: true,
        background: 'transparent',
      })

      loading.close()
      this.editItem = row
      this.visible = true
    },
    async handleRemove({ id }) {
      const res = await removeCategoryTypeList({ id })
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.getList()
      }
    },
  },
}
</script>
