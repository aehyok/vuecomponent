<template>
  <div>
    <TablePanel :data="list" :columns="columns" />
  </div>
</template>

<script>
import TablePanel from '@/components/TablePanel'
import { format } from 'date-fns'
import { auditStatusTxt } from '@/utils/currency'
export default {
  components: {
    TablePanel,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      columns: [
        {
          label: '内容名称',
          prop: 'name',
        },
        {
          label: '提交人',
          prop: 'submitter',
        },
        {
          label: '发布范围',
          prop: 'distributeOrgNames',
          render: (h, { row }) => {
            return <span>{row.distributeOrgNames.join(', ')}</span>
          },
        },
        {
          label: '提交审核时间',
          prop: 'submitDateTime',
          render: (h, { row }) => {
            return format(new Date(row.submitDateTime), 'yyyy-MM-dd HH:mm:ss')
          },
        },
        {
          label: '审核状态',
          prop: 'auditStatus',
          render: (h, { row }) => {
            return (
              <el-tag type={auditStatusTxt[row.auditStatus].type}>
                {auditStatusTxt[row.auditStatus].text}
              </el-tag>
            )
          },
        },
        {
          label: '审核人',
          prop: 'auditor',
        },
        {
          label: '审核完成时间',
          prop: 'auditDateTime',
          render: (h, { row }) => {
            return format(new Date(row.auditDateTime), 'yyyy-MM-dd HH:mm:ss')
          },
        },
        {
          label: '审核意见',
          prop: 'auditReason',
        },
        {
          label: '操作',
          width: 120,
          render: (h, { row }) => {
            return (
              <div>
                <el-button type="text" onClick={() => this.getDetail(row)}>
                  详情
                </el-button>
              </div>
            )
          },
        },
      ],
    }
  },
  methods: {
    getDetail(row) {
      this.$emit('getDetail', row)
    },
  },
}
</script>
