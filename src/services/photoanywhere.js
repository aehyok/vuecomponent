import request from '@/utils/request'

export const getPhotoanywhereList = data => {
  return request('photoanywhere/list', {
    method: 'post',
    data,
  })
}

export const getPhotoanywhereDetail = data => {
  console.log(data)
  return request('photoanywhere/detail', {
    method: 'post',
    data,
  })
}

export const replyPhotoanywhere = data => {
  return request('photoanywhere/reply', {
    method: 'post',
    data,
  })
}
