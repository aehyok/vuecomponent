import request from '@/utils/request'

export const getWechatList = data => {
  return request('wechatuser/list', {
    method: 'post',
    data,
  })
}

export const getWechatDetail = data => {
  return request('wechatuser/detail', {
    method: 'post',
    data,
  })
}

export const changeStatusWechatuser = data => {
  return request('wechatuser/changeStatus', {
    method: 'post',
    data,
  })
}
