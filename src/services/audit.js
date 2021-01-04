import request from '@/utils/request'

// 获取滚动消息审核列表
export const auditGetScrollMessageList = data => {
  return request('/audit/getScrollMessageList', {
    method: 'post',
    data,
  })
}

// 获取弹窗消息审核列表
export const auditGetPopupMessageList = data => {
  return request('/audit/getNoticeMessageList', {
    method: 'post',
    data,
  })
}

// 滚动消息审核
export const auditScrollMessageAction = data => {
  return request('/audit/auditScrollMessage', {
    method: 'post',
    data,
  })
}

// 滚动消息审核
export const auditPopupMessageAction = data => {
  return request('/audit/auditNoticeMessage', {
    method: 'post',
    data,
  })
}

// 获取审核配置
export const auditGetAuditConfig = data => {
  return request('/audit/getAuditConfig', {
    method: 'post',
    data,
  })
}

// 保存审核配置
export const auditSetAuditConfig = data => {
  return request('/audit/setAuditConfig', {
    method: 'post',
    data,
  })
}

/**
 * 审核历史栏目内容详情
 * @param {Object} data
 * @param {String} data.id
 */
export const getAuditRecordDetail = data => {
  return request('/audit/getAuditRecordDetail', {
    method: 'post',
    data,
  })
}
