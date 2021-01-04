import request from '@/utils/request'

/**
 * 栏目树审核列表
 * @param {Object} data
 * @param {Number} data.auditStatus - 审核状态  1待审核，2审核中，3审核通过，4审核不通过
 * @param {Number} data.page
 * @param {Number} data.limit
 * @param {String} data.keyword
 * @param {Number} data.beginDateTime
 * @param {Number} data.endDateTime
 */
export const getCategoryTreeList = data => {
  return request('/audit/getCategoryTreeList', {
    method: 'post',
    data,
  })
}

/**
 * 栏目内容审核
 * @param {Object} data
 * @param {String} data.auditStatus -  审核状态  1待审核，2审核中，3审核通过，4审核不通过
 * @param {Number} data.page
 * @param {Number} data.limit
 * @param {String} data.keyword
 * @param {Number} data.beginDateTime
 * @param {Number} data.endDateTime
 */
export const getFormatList = data => {
  return request('/audit/getFormatList', {
    method: 'post',
    data,
  })
}

/**
 * 栏目树审核详情
 * @param {Object} data
 * @param {String} data.id
 * @param {String} data.name - 名称
 * @param {Number} data.auditStatus - 审核状态  3审核通过，4审核不通过
 * @param {String} data.auditReason - 审核意见
 */
export const auditCategoryTree = data => {
  return request('/audit/auditCategoryTree', {
    method: 'post',
    data,
  })
}

/**
 * 栏目内容审核动作
 * @param {Object} data
 * @param {String} data.id
 * @param {Number} data.auditStatus - 审核状态  3审核通过，4审核不通过
 * @param {String} data.auditReason - 审核意见
 */
export const auditFormatPost = data => {
  return request('/audit/auditFormat', {
    method: 'post',
    data,
  })
}

/**
 * 审核历史列表
 * @param {Object} data
 * @param {String} data.contentId
 * @param {Number} data.page
 * @param {Number} data.limit
 * @param {String} data.keyword
 */
export const getAuditRecordList = data => {
  return request('/audit/getAuditRecordList', {
    method: 'post',
    data,
  })
}

/**
 * 审核历史栏目树栏目节点
 * @param {Object} data
 * @param {Number} data.direction // 1更新前，2更新后
 * @param {String} data.recordId // 历史记录Id
 * @param {String} data.id // 栏目id
 */
export const getAuditSubCategorys = data => {
  return request('/audit/getAuditSubCategorys', {
    method: 'post',
    data,
  })
}

/**
 * 审核历史栏目树详情信息
 * @param {Object} data
 * @param {Number} data.direction
 * @param {String} data.recordId
 * @param {String} data.id
 */
export const getAuditCategoryDetail = data => {
  return request('/audit/getAuditCategoryDetail', {
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
