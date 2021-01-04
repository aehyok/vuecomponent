import request from '@/utils/request'

/**
 * 验证短信验证码
 * @param {Object} data request body
 * @param {string} data.mobile 手机号
 * @param {string} data.messageCode 验证码
 */
export const verifySMSCode = data =>
  request('/system/verifySMSVerifyCode', {
    method: 'post',
    data,
  })

/**
 * 发送短信验证码
 * @param {Object} data request body
 * @param {string} data.mobile 手机号
 */
export const sendSMSCode = data =>
  request('/system/sendSMSVerifyCode', {
    method: 'post',
    data,
  })

// 操作日志
export const logsData = (data = {}) => {
  return request('/log/list', {
    method: 'post',
    data,
  })
}

// 获取业务模块
export const getModuleNameList = (data = {}) => {
  return request('/log/getModuleNameList', {
    method: 'post',
    data,
  })
}

// 修改密码
export const modifyPassword = (data = {}) => {
  return request('/system/modifyPassword', {
    method: 'post',
    data,
  })
}

// 获取版本号
export const getVersion = (data = {}) => {
  return request('/system/version', {
    method: 'post',
    data,
  })
}

// 退出登录
export const logout = (data = {}) => {
  return request('/passport/logout', {
    method: 'post',
    data,
  })
}

/**
 * 获取素材列表
 * @param {Object} data
 * @param {number} data.page
 * @param {number} data.limit
 * @param {string} data.type - 0: 全部 1: 图片 2: 视频
 * @param {string} data.orgId
 * @param {string} data.keyword
 */
export const getMaterialList = data => {
  return request('/material/list', {
    method: 'post',
    data,
  })
}

// 获取验证码
export const getImgCode = () => {
  return request(`/passport/verifycode?category=2&t=${new Date().getTime()}`, {
    method: 'get',
  })
}

// 获取栏目类型
export const getCategoryType = async (data = {}) => {
  const res = await request('/system/getCategoryType', {
    method: 'post',
    data,
  })
  if (res && res.code === 200) {
    return res.data
  }
  return []
}

// export const downloadBlackList = () => {}
