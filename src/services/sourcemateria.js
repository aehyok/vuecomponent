import request from '@/utils/request'
export const Materiallist = data => {
  return request('/material/list', {
    method: 'post',
    data,
  })
}
// 获取标签素材
export const Querytag = data => {
  return request('/material/tag/list', {
    method: 'post',
    data,
  })
}
// 标签素材新增
export const Newmaterial = data => {
  return request('/material/tag/save', {
    method: 'post',
    data,
  })
}
// 标签素材删除功能
export const Labelmaterialdeletion = data => {
  return request('material/tag/remove', {
    method: 'post',
    data,
  })
}

// 运营商审核提交审核
export const Submitforreview = data => {
  return request('/material/submitAudit', {
    method: 'post',
    data,
  })
}
// 标签素材运营商列表
export const Operatorlist = data => {
  return request('/iptvAccount/getOperatorList', {
    method: 'post',
    data,
  })
}
// 标签素材表格详情接口
export const Formdetails = data => {
  return request('/material/detail', {
    method: 'post',
    data,
  })
}
// 标签素材详情保存接口
export const Preservationofdetails = data => {
  return request('/material/save', {
    method: 'post',
    data,
  })
}
// 标签素材表格删除接口
export const Tabledeletion = data => {
  return request('/material/remove', {
    method: 'post',
    data,
  })
}
