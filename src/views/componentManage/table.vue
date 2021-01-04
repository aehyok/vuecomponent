<template>
  <div class="table-page">
    <sl-table
      :list="list"
      @handleSelectionChange="handleSelectionChange"
      :options="options"
      :columns="columns"
      :operates="operates"
    >
    </sl-table>
  </div>
</template>
<script>
import slTable from '@/components/table'
export default {
  components: { slTable },
  data() {
    return {
      list: [
        {
          id: '24',
          title: '编号3',
          state: 0,
        },
        {
          id: '23',
          title: '编号3',
          state: 1,
        },
        {
          id: '23',
          title: '编号3',
          state: 2,
        },
        {
          id: '2',
          title: '编号3',
          state: 0,
        },
        {
          id: '223',
          title: '编号3',
          state: 1,
        },
        {
          id: '2444',
          title: '编号3',
          state: 1,
        },
      ], // table数据
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        mutiSelect: true, // 是否支持列表项选中功能
      }, // table 的参数
      columns: [
        {
          prop: 'id',
          label: '编号',
          align: 'center',
        },
        {
          prop: 'title',
          label: '标题',
          align: 'center',
          formatter: (row, column, cellValue) => {
            return `<span style="white-space: nowrap;color: dodgerblue;">${row.title}</span>`
          },
        },
        {
          prop: 'state',
          label: '状态',
          align: 'center',
          render: (h, params) => {
            return h(
              'el-tag',
              {
                props: {
                  type:
                    params.row.state === 0
                      ? 'success'
                      : params.row.state === 1
                      ? 'info'
                      : 'danger',
                }, // 组件的props
              },
              params.row.state === 0
                ? '上架'
                : params.row.state === 1
                ? '下架'
                : '审核中',
            )
          },
        },
      ], // 需要展示的列
      operates: {
        width: 200,
        fixed: 'right',
        list: [
          {
            id: '1',
            label: '编辑',
            type: 'warning',
            show: true,
            icon: 'el-icon-edit',
            plain: true,
            disabled: false,
            method: (index, row) => {
              this.handleEdit(index, row)
            },
          },
          {
            id: '2',
            label: '删除',
            type: 'danger',
            icon: 'el-icon-delete',
            show: true,
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.handleDel(index, row)
            },
          },
        ],
      }, // 列操作按钮
    }
  },
  methods: {
    // 选中行
    handleSelectionChange(val) {
      console.log('val:', val)
    },
    // 编辑
    handleEdit(index, row, idx) {
      console.log('index:', index, idx)
      console.log('row:', row)
    },
    // 删除
    handleDel(index, row) {
      console.log(' index:', index)
      console.log(' row:', row)
    },
  },
}
</script>
