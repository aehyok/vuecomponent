// export const actionMap = {
//   create: 1,
//   delete: 2,
//   update: 4,
//   detail: 8,
// }

// export const actionDisplay = {
//   1: '创建',
//   2: '删除',
//   4: '修改',
//   8: '详情',
// }

export const layoutList = [
  { value: 1, label: '图片' },
  { value: 2, label: '图片列表' },
  { value: 3, label: '视频' },
  { value: 4, label: '文字列表' },
  // { value: 5, label: '图片文字' },
]

export const layoutListMoudel = [
  {
    label: '上导航+文字列表',
    value: 'service_single',
  },
  {
    label: '上导航+图片列表',
    value: 'servicepic_single',
  },
  {
    label: '全屏图片轮播',
    value: 'pic_detail',
  },
  {
    label: '全屏视频',
    value: 'full_play',
  },
  {
    label: '图片列表',
    value: 'pic_list',
  },
  {
    label: '文字列表',
    value: 'text_list',
  },
  {
    label: '左图右文',
    value: 'pic_text_detail',
  },
  {
    label: '空（不跳转）',
    value: 'none',
  },
]
