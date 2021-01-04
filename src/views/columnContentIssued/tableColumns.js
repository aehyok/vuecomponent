import { format } from 'date-fns'
export default [
  // {
  //   prop: '',
  //   label: 'ID',
  //   display: [],
  // },
  {
    prop: 'name',
    label: '内容名称',
    display: [],
  },
  {
    prop: 'images',
    label: '缩略图',
    display: [1, 2, 5],
    render(h, { row }) {
      let src = ''
      if (row.formatType === 2) {
        src = row.coverInfo ? row.coverInfo.url : ''
      } else {
        if (row.imageUrls) {
          src = row.imageUrls.length > 0 ? row.imageUrls[0].url : ''
        }
      }
      if (src) {
        return <el-image src={src} />
      } else {
        return '--'
      }
    },
  },
  {
    prop: '',
    label: '起止日期',
    render(h, { row }) {
      const { beginDate, endDate } = row
      if (endDate === -1) {
        return '永不过期'
      }
      return (
        <span>
          {format(new Date(beginDate), 'yyyy-MM-dd')} 至
          {format(new Date(endDate), 'yyyy-MM-dd')}
        </span>
      )
    },
    display: [],
  },
  {
    prop: '',
    label: '发布范围',
    render(h, { row }) {
      const { distributeOrgNames } = row
      return <span>{distributeOrgNames.join(', ')}</span>
    },
    display: [],
  },
  {
    prop: 'createdByOrgName',
    label: '来源组织',
    display: [],
  },
  {
    prop: 'updatedBy',
    label: '修改人',
    display: [],
  },
  {
    prop: 'updatedAt',
    label: '修改时间',
    display: [],
    render: (h, { row }) => {
      return format(new Date(row.updatedAt), 'yyyy-MM-dd HH:mm:ss')
    },
  },
]
