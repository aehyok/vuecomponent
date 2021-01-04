<template>
  <div>
    <div class="controlbox">
      <span>审核状态：</span>
      <el-select
        v-model="auditStatus"
        placeholder="请选择"
        class="mgr20"
        @change="auditChange"
      >
        <el-option
          v-for="(item, index) in auditStatusList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>时间范围：</span>
      <el-date-picker
        class="mgr20"
        v-model="seldate"
        type="daterange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timeChange"
      >
      </el-date-picker>
      <el-input
        style="width: 300px"
        placeholder="请输入消息名称"
        v-model="keyword"
        class="input-with-select"
        @keypress.native.enter="search"
      >
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
    </div>
    <div class="mart20">
      <!-- 审核中 -->
      <InReview
        :list="list"
        v-if="auditStatus === 2"
        v-loading="isLoading"
        @saveFilterData="saveFilterData"
      />
      <!-- 审核通过 -->
      <Approved
        :list="list"
        v-if="auditStatus === 3"
        v-loading="isLoading"
        @saveFilterData="saveFilterData"
      />
      <!-- 审核不通过 -->
      <NoApproved
        :list="list"
        v-if="auditStatus === 4"
        v-loading="isLoading"
        @saveFilterData="saveFilterData"
      />
    </div>
    <Pagination
      :page.sync="page"
      :limit.sync="limit"
      :total="total"
      @pagination="pagination"
    />
  </div>
</template>

<script>
import InReview from './inReview'
import Approved from './approved'
import NoApproved from './noApproved'
import { getCategoryTreeList } from '@/services/columnReview'
import Pagination from '@/components/Pagination'
export default {
  components: {
    InReview,
    Approved,
    NoApproved,
    Pagination,
  },
  data() {
    return {
      isLoading: false,
      auditStatus: 2, // 1待审核，2审核中，3审核通过，4审核不通过
      auditStatusList: [
        { label: '审核中', value: 2 },
        { label: '审核通过', value: 3 },
        { label: '审核不通过', value: 4 },
      ],
      seldate: null, // 时间范围
      keyword: '',
      page: 1,
      limit: 10,
      total: 0,
      list: [],
    }
  },
  methods: {
    saveFilterData() {
      const {
        seldate, // 时间范围
        keyword,
        page,
        limit,
        auditStatus,
      } = this.$data
      localStorage.setItem(
        'treefilterData',
        JSON.stringify({
          auditStatus,
          seldate, // 时间范围
          keyword,
          page,
          limit,
        }),
      )
    },
    search() {
      this.page = 1
      this.getList()
    },
    auditChange() {
      this.page = 1
      this.keyword = ''
      this.seldate = null
      this.getList()
    },
    timeChange() {
      this.page = 1
      this.getList()
    },
    async getList() {
      this.isLoading = true
      const res = await getCategoryTreeList({
        auditStatus: this.auditStatus, // 审核状态  1待审核，2审核中，3审核通过，4审核不通过
        page: 1,
        limit: 10,
        keyword: this.keyword,
        beginDateTime: this.seldate ? this.seldate[0] : '', // 开始日期
        endDateTime: this.seldate ? this.seldate[1] : '', // 结束日期
      })
      if (res.code === 200) {
        this.list = res.data.docs
        this.total = res.data.total
      }
      this.isLoading = false
    },
    pagination() {
      this.getList()
      console.log(this.page, this.limit)
    },
  },
  created() {
    const hasFilterData = localStorage.getItem('treefilterData') || ''
    if (hasFilterData) {
      const filterData = JSON.parse(hasFilterData)
      this.auditStatus = filterData.auditStatus
      this.page = filterData.page
      this.limit = filterData.limit
      this.keyword = filterData.keyword
      this.seldate = filterData.seldate
      localStorage.removeItem('treefilterData')
    }
    this.getList()
  },
}
</script>

<style lang="scss" scoped>
.mgr20 {
  margin-right: 20px;
}
.mart20 {
  margin-top: 20px;
}
.controlbox {
  text-align: right;
}
</style>
