<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="dialogTitle"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <el-form inline class="filter-options" style="text-align: left;">
      <el-form-item>
        <span>开始日期：</span>
        <el-date-picker
          lab
          v-model="filters.beginDateTime"
          type="date"
          placeholder="开始日期"
          style="width: 150px"
          @change="dataChange"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <span>结束日期：</span>
        <el-date-picker
          v-model="filters.endDateTime"
          type="date"
          placeholder="结束日期"
          style="width: 150px"
          @change="dataChange"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="10">
        <ve-pie
          :data="chart.pie"
          :settings="chart.pie.settings"
          v-if="chart.pie.rows.length > 0"
        ></ve-pie>
      </el-col>
      <el-col :span="14">
        <ve-line
          :data="chart.line"
          :settings="chart.line.settings"
          v-if="chart.line.rows.length > 0"
        ></ve-line>
      </el-col>
    </el-row>

    <el-form inline class="filter-options" style="text-align: right">
      <el-form-item label="选项：">
        <el-select
          style="width: 120px"
          v-model="filters.answerOptionName"
          clearable
          @change="filterChange"
        >
          <el-option
            v-for="(o, index) in source.options"
            :key="index"
            :value="o.optionName"
            :label="o.optionName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search"
          clearable
          placeholder="请输入内容/反馈人/手机号搜索"
          style="width: 300px"
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
    <TablePanel :data="list" :columns="columns" />
    <Pagination
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script>
import { format } from 'date-fns'
import Pagination from '@/components/Pagination'
import TablePanel from '@/components/TablePanel'
import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
import {
  getQuestionDataList,
  getQuestionDataPie,
  getQuestionDataLine,
} from '@/services/investigate'
export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { TablePanel, Pagination, VeLine, VePie },
  data() {
    return {
      chart: {
        pie: {
          columns: ['name', 'value'],
          settings: {
            labelMap: {
              name: '反馈选择',
              value: '支持人数',
            },
          },
          rows: [],
        },
        line: {
          columns: ['name', 'value'],
          settings: {
            labelMap: {
              name: '日期',
              value: '反馈人数',
            },
          },
          rows: [],
        },
      },
      rangeVisible: true,
      filters: {
        keyword: '',
        answerOptionName: '',
        beginDateTime: Date.now() - 1000 * 60 * 60 * 24 * 30,
        endDateTime: Date.now(),
      },
      loading: false,
      list: [],
      page: 1,
      total: 0,
      limit: 10,
      columns: [
        {
          label: '选项',
          prop: 'answerOptionName',
        },
        {
          label: '反馈内容',
          prop: 'answerContent',
        },
        {
          label: '时间',
          prop: '',
          render(h, { row }) {
            return (
              <span>
                {format(new Date(row.answerDateTime), 'yyyy-MM-dd HH:mm:ss')}
              </span>
            )
          },
        },
        {
          label: '反馈人',
          prop: 'nickName',
        },
        {
          label: '手机号',
          prop: 'mobile',
        },
      ],
    }
  },
  computed: {
    dialogTitle() {
      return '查看数据'
    },
  },
  methods: {
    async handleOpen() {
      await this.getList()
    },
    handleClosed() {
      this.list = []
      this.filters = {
        keyword: '',
        answerOptionName: '',
        beginDateTime: Date.now() - 1000 * 60 * 60 * 24 * 30,
        endDateTime: Date.now(),
      }
      this.chart.pie.rows = []
      this.chart.line.rows = []
    },
    dataChange() {
      this.getList()
    },
    async filterChange() {
      this.page = 1
      this.getList()
    },
    async getList() {
      this.loading = true

      const filters = {
        id: this.source.id,
        page: this.page,
        limit: this.limit,
        ...this.filters,
      }
      const res = await getQuestionDataList(filters)
      if (res.code === 200) {
        this.list = res.data.docs
        this.total = res.data.total
      }
      const pie = await getQuestionDataPie(filters)
      if (pie.code === 200) {
        this.$set((this.chart.pie.rows = pie.data))
      }
      const line = await getQuestionDataLine(filters)
      if (line.code === 200) {
        this.chart.line.rows = [...line.data]
      }
      this.loading = false
    },
  },
}
</script>
