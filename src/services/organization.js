import request from '@/utils/request'

// 组织树请求 懒加载
export const getOrgTree = (data = {}) => {
  return request('/organization/getOrgTree', {
    method: 'post',
    data,
  })
}

/**
 * 获取组织树
 * @param {Object} data
 * @param {string} data.orgId
 */
export const getFullOrgTree = data => {
  return request('/organization/getNodesTree', {
    method: 'post',
    data,
  })
}

// 保存修改组织树
export const saveOrg = (data = {}) => {
  return request('/organization/saveOrg', {
    method: 'post',
    data,
  })
}

// 获取组织详情
export const getOrgDetail = (data = {}) => {
  return request('/organization/getOrgDetail', {
    method: 'post',
    data,
  })
}

// 删除组织
export const deleteOrg = (data = {}) => {
  return request('/organization/deleteOrg', {
    method: 'post',
    data,
  })
}

export const getRegionTree = (data = {}) => {
  return request('/region/getRegionTree', {
    method: 'post',
    data,
  })
}
