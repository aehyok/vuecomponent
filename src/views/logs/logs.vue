<template>
  <div>
    <el-form inline class="controlbox">
      <el-form-item label="日期：">
        <el-date-picker
          v-model="dateVal"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="searchBtn"
        />
      </el-form-item>
      <el-form-item label="业务模块：">
        <el-select
          v-model="moduleName"
          clearable
          placeholder="请选择"
          @change="searchBtn"
        >
          <el-option
            :label="item"
            :value="item"
            v-for="(item, index) in moduleNameList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input
          style="width: 300px"
          placeholder="请输入成员名称搜索"
          v-model="keyword"
          class="input-with-select"
          @keypress.native.enter="searchBtn"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchBtn"
          ></el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="isLoading"
    >
      <el-table-column prop="createdAt" label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | forMatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="操作人员"></el-table-column>
      <el-table-column prop="moduleName" label="业务模块"></el-table-column>
      <el-table-column prop="operateDesc" label="操作事件描述" />
      <el-table-column prop="operateStatus" label="操作结果" />
    </el-table>
    <Pagination
      :page.sync="page"
      :limit.sync="limit"
      :total="total"
      @pagination="pagination"
    />
  </div>
</template>

<script>
import { logsData, getModuleNameList } from '@/services'
import { format } from 'date-fns'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination,
  },
  filters: {
    forMatDate(val) {
      const time = format(new Date(val), 'yyyy-MM-dd HH:mm:ss')
      return time
    },
  },
  data() {
    return {
      isLoading: false,
      dateVal: '',
      moduleName: '',
      keyword: '',
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      moduleNameList: [],
    }
  },
  methods: {
    // 获取业务模块
    async getModuleNameList() {
      const res = await getModuleNameList()
      if (res.code === 200) {
        this.moduleNameList = res.data
      }
    },
    // 获取列表数据
    async getLogsData() {
      this.isLoading = true
      const res = await logsData({
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
        startdate: this.dateVal ? this.dateVal[0] : '',
        enddate: this.dateVal ? this.dateVal[1] : '',
        moduleName: this.moduleName,
        sort: { createdAt: -1 },
      })
      if (res.code === 200) {
        this.tableData = res.data.docs
        this.total = res.data.total
      } else {
        this.$message.error(res.message)
      }
      this.isLoading = false
    },
    pagination() {
      this.getLogsData()
    },
    searchBtn() {
      this.page = 1
      this.getLogsData()
    },
  },
  created() {
    this.getModuleNameList()
    this.getLogsData()
  },
}
</script>

<style lang="scss" scoped>
.controlbox {
  text-align: right;
}
</style>
