import request from '@/utils/request'
export const Datalist = data => {
  return request('/article/list', {
    method: 'post',
    data,
  })
}
export const toexamine = data => {
  return request('/article/audit/list', {
    method: 'post',
    data,
  })
}
// 审核文章详情
export const articleDetail = data => {
  return request('/article/detail', {
    method: 'post',
    data,
  })
}
// 审核文章提交
export const articleAudit = data => {
  return request('/article/audit', {
    method: 'post',
    data,
  })
}
// 审核文章删除
export const articleRemove = data => {
  return request('/article/remove', {
    method: 'post',
    data,
  })
}
// 农技达人身份认证列表
export const agriculturalExpertsList = data => {
  return request('/wechatUser/agriculturalExperts/list', {
    method: 'post',
    data,
  })
}
// 农技达人身份认证审核详情
export const wechatuserDetail = data => {
  return request('/wechatuser/detail', {
    method: 'post',
    data,
  })
}
// 农技达人身份认证审核详情提交
export const wechatuserAuth = data => {
  return request('/wechatUser/agriculturalExperts/auth', {
    method: 'post',
    data,
  })
}
