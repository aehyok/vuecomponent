import request from '@/utils/request'

/**
 *  获取村友圈内容列表
 * @param {object} data
 * @param {string} data.keyword
 * @param {string} data.type
 * @param {string} data.status
 * @param {string} data.beginDate
 * @param {string} data.endDate
 * @param {number} data.page
 * @param {number} data.limit
 */
export const getMomentContentList = data => {
  return request('/moment/list', {
    data,
    method: 'post',
  })
}

/**
 * 修改状态
 * @param {object} data
 * @param {string} data.id
 * @param {string} data.reason
 * @param {number} data.status
 */
export const changeMomentStatus = data => {
  return request('/moment/changeStatus', {
    method: 'post',
    data,
  })
}
