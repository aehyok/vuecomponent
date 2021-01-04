import request from '@/utils/request'

// 列表
export const getBannerList = data => {
  return request('/banner/getBannerList', {
    method: 'post',
    data,
  })
}

// 详情
export const getBannerDetail = data => {
  return request('/banner/getBannerDetail', {
    method: 'post',
    data,
  })
}

// 编辑添加
export const saveBanner = data => {
  return request('/banner/saveBanner', {
    method: 'post',
    data,
  })
}

// 删除
export const deleteBanner = data => {
  return request('/banner/deleteBanner', {
    method: 'post',
    data,
  })
}

// 功能列表
export const getModuleList = data => {
  return request('/module/getModuleList', {
    method: 'post',
    data,
  })
}
