<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    @opened="handleOpen"
    @closed="handleClose"
  >
    <el-row style="min-height: 400px">
      <el-col :span="12">
        <el-row style="text-align:right; margin-bottom:2px">
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
        </el-row>
        <el-table
          ref="leftTtableRef"
          :data="list"
          :border="true"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="选择" type="selection" width="55">
          </el-table-column>
          <el-table-column label="名称" prop="name"> </el-table-column>
        </el-table>
        <Pagination
          :total="total"
          :page.sync="page"
          :limit.sync="limit"
          @pagination="getList"
        />
      </el-col>
      <el-col :span="11" style="margin-left: 6px">
        <el-row style="text-align:right; margin-bottom:2px">
          <el-input
            class="search"
            clearable
            placeholder="请输入名称搜索"
            style="width:250px;"
            @keyup.native.enter="filterChange2"
            v-model="filters2.keyword"
          >
            <el-button
              @click="filterChange2"
              slot="append"
              icon="el-icon-search"
            />
          </el-input>
        </el-row>
        <el-table
          ref="rightTtableRef"
          :data="questionInfos2"
          :border="true"
          style="width: 100%"
        >
          <el-table-column label="名称" prop="name"> </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="handleDelete(scope.row)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import Pagination from '@/components/Pagination'
import { format } from 'date-fns'
import { getQuestionList } from '@/services/investigate'
export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { Pagination },
  data() {
    return {
      filters: {
        keyword: '',
      },
      filters2: {
        keyword: '',
      },
      loading: false,
      questionInfos: [],
      list: [],
      page: 1,
      total: 0,
      limit: 10,
      columns: [
        {
          label: '内容名称',
          prop: 'name',
        },
      ],
    }
  },
  filters: {
    formatDate(val) {
      return format(new Date(val), 'yyyy-MM-dd')
    },
  },
  computed: {
    title() {
      return '选取内容'
    },
    questionInfos2() {
      if (this.questionInfos) {
        return this.questionInfos.filter(
          item => item.name.indexOf(this.filters2.keyword) >= 0,
        )
      }
      return []
    },
  },
  watch: {
    source() {},
  },
  methods: {
    handleOpen() {
      this.getList()
      this.questionInfos = this.source.questionInfos
    },
    handleClose() {},
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
        this.$nextTick(() => {
          let tmp
          if (this.source?.questionInfos) {
            this.source.questionInfos.forEach(item => {
              tmp = this.list.find(k => k.id === item.id)
              if (tmp) this.$refs.leftTtableRef.toggleRowSelection(tmp, true)
            })
          }
        })
      }
    },
    save() {
      this.source.questionInfos = this.questionInfos
      this.$emit('update:visible', false)
      this.$emit('success')
    },
    handleSelectionChange(items) {
      this.questionInfos = items
    },

    filterChange() {
      this.page = 1
      this.getList()
    },
    filterChange2() {},
    handleDelete(row) {
      if (!row.id) return

      this.questionInfos = this.questionInfos.filter(item => item.id !== row.id)
      this.$refs.leftTtableRef.toggleRowSelection(row)
    },
  },
}
</script>
