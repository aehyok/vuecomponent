import { transformFalsy } from '@/filters'

export default {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
  },
  render(h) {
    const props = {
      props: { ...this.$attrs, border: true },
    }

    const on = {
      on: this.$listeners,
    }
    const { default: defaultSlot } = this.$scopedSlots
    const actionSlot = {
      scopedSlots: {
        default: scope => {
          if (defaultSlot) {
            return defaultSlot({ ...scope })
          }
        },
      },
    }
    return (
      <el-table {...props} {...on}>
        {this.columns
          .filter(col => !col.disable)
          .map(col => this.renderColumn(h, col))}
        {defaultSlot && <el-table-column {...actionSlot} label="操作" />}
      </el-table>
    )
  },
  methods: {
    /**
     * 渲染el-tabl-column
     * @param {*} h vue createElement
     * @param {*} column el-table-column props
     */
    renderColumn(h, column) {
      const props = {
        props: column,
      }
      const { render, type } = column
      let slotScope = {}

      if (!type) {
        slotScope = {
          scopedSlots: {
            default(scope) {
              return typeof render === 'function'
                ? render(h, scope)
                : transformFalsy(scope.row[column.prop])
            },
          },
        }
      }

      return <el-table-column {...props} {...slotScope} />
    },
  },
}
