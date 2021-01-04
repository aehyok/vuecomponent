import request from '@/utils/request'

// 获取栏目列表数据
export const categoryTreeList = (data = {}) => {
  return request('/categoryTree/list', {
    method: 'post',
    data,
  })
}

// 保存栏目数据
export const saveCategoryTree = (data = {}) => {
  return request('/categoryTree/saveCategoryTree', {
    method: 'post',
    data,
  })
}

// 设置为当前栏目树
export const setDefaultTree = (data = {}) => {
  return request('/categoryTree/setDefaultTree', {
    method: 'post',
    data,
  })
}

// 提交审核
export const submitAudit = (data = {}) => {
  return request('/categoryTree/submitAudit', {
    method: 'post',
    data,
  })
}

// 获取树详情
export const categoryTreeDetail = (data = {}) => {
  return request('/categoryTree/detail', {
    method: 'post',
    data,
  })
}

// 删除栏目树
export const removeCategory = (data = {}) => {
  return request('/categoryTree/remove', {
    method: 'post',
    data,
  })
}

// 停用启用栏目树
export const changeStatus = (data = {}) => {
  return request('/categoryTree/changeStatus', {
    method: 'post',
    data,
  })
}

/**
 * 复制栏目树
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.orgId
 * @param {string} data.remark
 */
export const categoryTreeCopy = (data = {}) => {
  return request('/categoryTree/copy', {
    method: 'post',
    data,
  })
}

// 查询栏目节点
export const getSubCategorys = (data = {}) => {
  return request('/category/getSubCategorys', {
    method: 'post',
    data,
  })
}

/**
 * 保存栏目信息
 * @param {Object} data
 */
export const saveCategoryInfo = data => {
  return request('/category/save', {
    method: 'post',
    data,
  })
}

/**
 * 获取栏目信息
 * @param {Object} data
 */
export const getCategoryDetail = data => {
  return request('/category/getCategoryDetail', {
    method: 'post',
    data,
  })
}

/**
 * 获取栏目信息
 * @param {Object} data
 */
export const getRefTreeList = data => {
  return request('/categoryTree/getRefTreeList', {
    method: 'post',
    data,
  })
}

/**
 * 删除栏目
 * @param {Object} data
 * @param {string[]} data.ids
 */
export const deleteCategory = data => {
  return request('/category/delete', {
    method: 'post',
    data,
  })
}

/**
 * 栏目拖拉排序
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.action - 拖拽动作 before向前、after向后、inner跨级
 * @param {number} data.index
 * @param {string} data.parentId
 */
export const dragCategory = data => {
  return request('/category/dragCategory', {
    method: 'post',
    data,
  })
}

export const getCategoryTypeList = data => {
  return request('/categoryType/getList', {
    method: 'post',
    data,
  })
}

export const removeCategoryTypeList = data => {
  return request('/categoryType/remove', {
    method: 'post',
    data,
  })
}

export const saveCategoryTypeList = (data, action) => {
  return request('/categoryType/' + action, {
    method: 'post',
    data,
  })
}
