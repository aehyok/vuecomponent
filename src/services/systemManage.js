import request from '@/utils/request'

export const systemparameter = (data = {}) => {
  return request('/systemparameter/list', {
    method: 'post',
    data,
  })
}

// 新增/编辑数据
export const systemparameterSave = (data = {}) => {
  return request('/systemparameter/save', {
    method: 'post',
    data,
  })
}

// 系统参数详情
export const systemparameterDetail = (data = {}) => {
  return request('/systemparameter/detail', {
    method: 'post',
    data,
  })
}

// 系统图片列表
export const pictureList = (data = {}) => {
  return request('/system/pictureList', {
    method: 'post',
    data,
  })
}

/**
 * 保存系统图片
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.name
 * @param {string} data.image
 * @param {string} data.remark
 * @param {number} data.usage - 使用范围 1: cms，2: epg
 * @param {nubmer} data.servicieProvider - 运营商, 1 电信， 2 移动，3 联通
 */
export const savePicture = data => {
  return request('/system/pictureSave', {
    method: 'post',
    data,
  })
}
