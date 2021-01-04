import request from '@/utils/request'

/**
 * 获取IPTV账号列表
 * @param {Object} data
 * @param {number} data.page
 * @param {number} data.limit
 * @param {string} data.keyword
 * @param {string} data.status - 状态 1=有效，2=无效
 * @param {string} data.parentId
 * @param {string} data.operatorId
 */
export const getIPTVAcountList = data => {
  return request('/iptvAccount/getIptvList', {
    method: 'post',
    data,
  })
}

/**
 * 新增、修改IPTV账号
 * @param {Object} data
 * @param {string} data.id - 新增时为空、编辑时必填
 * @param {string} data.iptvAccount - iptv账号
 * @param {string} data.orgId - 组织id
 * @param {string} data.operatorId - 运营商id
 * @param {string} data.operatorName - 运营商名称
 * @param {string} data.contactUser - 联系人
 * @param {string} data.contactPhone - 联系电话
 * @param {string} data.contactAddress - 联系地址
 * @param {string} data.remark - 备注
 */
export const saveIPTVAccount = data => {
  return request('/iptvAccount/saveIptv', {
    data,
    method: 'post',
  })
}

/**
 * 修改账号状态
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.status
 */
export const changeAccountStatus = data => {
  return request('/iptvAccount/setStatus', {
    method: 'post',
    data,
  })
}

/**
 * 删除账号
 * @param {Object} data
 * @param {string[]} data.ids
 */
export const deleteAccount = data => {
  return request('/iptvAccount/deleteIptvAccount', {
    data,
    method: 'post',
  })
}

/**
 * 获取运营商列表
 * @param {Object} data
 * @param {number} data.page
 * @param {number} data.limit
 */
export const getOperatorList = data => {
  return request('/iptvAccount/getOperatorList', {
    method: 'post',
    data,
  })
}

/**
 * 导入IPTV账号
 * @param {*} data
 */
export const importAccount = data => {
  return request('/iptvAccount/importIptvAccount', {
    method: 'post',
    data,
  })
}
