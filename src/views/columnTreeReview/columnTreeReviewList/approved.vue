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
          label: '栏目树名称',
          prop: 'name',
        },
        {
          label: '提交人',
          prop: 'submitter',
        },
        {
          label: '提交时间',
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
                <el-button type="text" onClick={() => this.goDetail(row)}>
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
    goDetail(row) {
      this.$emit('saveFilterData')
      this.$router.push(
        `/columntreereview/detail?recordId=${row.id}&name=${row.name}&orgId=${row.id}&submitter=${row.submitter}`,
      )
      console.log(row)
    },
  },
}
</script>
