import request from '@/utils/request'

/**
 * 获取栏目树内容列表
 * @param {Object} param0
 * @param {number} param0.page - 页码
 * @param {number} param0.limit - 每页数据量
 * @param {string} param0.keyword - 搜索关键字
 * @param {string} param0.isSelf - 搜索关键字
 * @param {string} param0.categoryId - 栏目id
 * @param {string} param0.orgId - 组织id
 */
export const getColumnContentList = ({
  page,
  limit,
  keyword,
  isSelf,
  categoryId,
  orgId,
}) => {
  return request('/format/list', {
    method: 'post',
    data: {
      page,
      limit,
      keyword,
      isSelf,
      categoryId,
      orgId,
    },
  })
}

/**
 * 获取栏目树内容详情
 * @param {Object} data
 * @param {string} data.id - 栏目内容id
 */
export const getContentDetail = data => {
  return request('/format/getDetail', {
    method: 'post',
    data,
  })
}

/**
 * 获取组织使用的栏目树
 * @param {Object} data
 * @param {string} data.orgId
 */
export const getCurrentCategoryTree = data => {
  return request('/categoryTree/getOrgDefaultTree', {
    method: 'post',
    data,
  })
}

/**
 * 保存图片栏目版式
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.id
 * @param {string[]} data.images
 * @param {string} data.categoryId
 * @param {string} data.beginDate
 * @param {string} data.endDate
 * @param {string[]} data.distributeOrgs
 */
export const savePictureLayout = data => {
  return request('/format/saveImageFormat', {
    method: 'post',
    data,
  })
}

/**
 * 保存图片栏目版式
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.id
 * @param {string[]} data.images
 * @param {string} data.categoryId
 * @param {string} data.beginDate
 * @param {string} data.endDate
 * @param {string[]} data.distributeOrgs
 */
export const saveVideoLayout = data => {
  return request('/format/saveVideoFormat', {
    method: 'post',
    data,
  })
}

/**
 * 保存文字列表版式
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.categoryId
 * @param {string} data.name
 * @param {number} data.navigateType - 跳转类型
 * @param {string} data.navigateText
 * @param {string[]} data.navigateImages
 * @param {string[]} data.navigateVideos
 * @param {string} data.beginDate
 * @param {string} data.endDate
 * @param {string[]} data.distributeOrg
 */
export const saveTextListLayout = data => {
  return request('/format/saveTextListFormat', {
    method: 'post',
    data,
  })
}

/**
 * 保存图文版式
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.categoryId
 * @param {string} data.name
 * @param {string} data.text
 * @param {string[]} data.images
 * @param {string} data.beginDate
 * @param {string} data.endDate
 * @param {string[]} data.distributeOrgs
 */
export const saveImageTextLayout = data => {
  return request('/format/saveImageTextFormat', {
    method: 'post',
    data,
  })
}

/**
 *
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.categoryId
 * @param {string} data.name
 * @param {string} data.text
 * @param {string} data.cover - 封面图id
 * @param {string} data.beginDate
 * @param {string} data.endDate
 * @param {string[]} data.distributeOrgs
 */
export const saveImageListLayout = data => {
  return request('/format/saveImageListFormat', {
    method: 'post',
    data,
  })
}

/**
 * 栏目树内容停用启用
 * @param {Object} data
 * @param {string} data.id - 栏目内容id
 * @param {number} data.status - 1: 启用 2: 停用
 */
export const setLayoutContentStatus = data => {
  return request('/format/setStatus', {
    method: 'post',
    data,
  })
}

/**
 * 删除栏目内容
 * @param {Object} data
 * @param {string} data.id
 */
export const deleteLayoutContent = data => {
  return request('/format/delete', {
    method: 'post',
    data,
  })
}

/**
 * 提交审核
 * @param {Object} data
 * @param {string} data.id
 * @param {number} data.status
 */
export const submitAudit = data => {
  return request('/format/changeAuditStatus', {
    method: 'post',
    data,
  })
}

/**
 * #### 保存民意调查版式
 */
export const saveInvestigateFormat = data => {
  return request('/format/saveInvestigateFormat', {
    method: 'post',
    data,
  })
}
