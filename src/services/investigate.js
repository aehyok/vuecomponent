import request from '@/utils/request'

export const getQuestionList = data => {
  return request('/investigate/getQuestionList', {
    method: 'post',
    data,
  })
}

export const getQuestionDetail = data => {
  return request('/investigate/getQuestionDetail', {
    method: 'post',
    data,
  })
}

export const saveQuestion = data => {
  return request('/investigate/saveQuestion', {
    method: 'post',
    data,
  })
}

export const deleteQuestion = data => {
  return request('/investigate/deleteQuestion', {
    method: 'post',
    data,
  })
}

export const setWeChatClient = data => {
  return request('/investigate/setWeChatClient', {
    method: 'post',
    data,
  })
}

export const getQuestionDataPie = data => {
  return request('/investigate/dataPie', {
    method: 'post',
    data,
  })
}
export const getQuestionDataLine = data => {
  return request('/investigate/dataLine', {
    method: 'post',
    data,
  })
}
export const getQuestionDataList = data => {
  return request('/investigate/dataList', {
    method: 'post',
    data,
  })
}
