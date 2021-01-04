export { default } from './village-moment'

export const statusMap = {
  1: 'TV上线',
  2: '运营商审核中',
  3: '运营商审核不通过',
  4: '用户删除',
  5: '业务审核中',
  6: '业务审核不通过',
  7: '下线',
}

const statusColor = ['success', '', 'danger', 'danger', '', 'danger', 'info']

export const status = Object.keys(statusMap).reduce(
  (prev, cur, index) => ({
    ...prev,
    [cur]: {
      text: statusMap[cur],
      type: statusColor[index],
    },
  }),
  {},
)
