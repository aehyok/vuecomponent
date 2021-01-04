import request from '@/utils/request'

/**
 * @typedef {object} LoginParams
 * @property {string} account - 账号
 * @property {string} password - 密码
 * @property {string} code - 验证码
 */

/**
 * 用户登录
 * @param {LoginParams} data
 */
export const userLogin = data =>
  request('/passport/login', {
    method: 'post',
    data: {
      ...data,
    },
  })

/**
 * 重置密码
 * @param {Object} data
 * @param {string} data.password - 密码
 * @param {string} data.mobile -手机号
 * @param {string} data.messageCode - 短信验证码
 */
export const resetPassword = data =>
  request('/system/resetPassword', {
    method: 'post',
    data,
  })

/**
 * 获取角色列表
 * @param {Object} params rquest body
 * @param {number} params.page
 * @param {number} params.limit
 * @param {string} params.keyword
 */
export const getRoleList = params =>
  request('/role/getlist', {
    method: 'post',
    data: params,
  })

/**
 * 创建角色
 * @param {Object} data request body
 * @param {string} data.name 角色名称
 * @param {string[]} data.permission 角色权限
 */
export const createRole = data =>
  request('/role/create', {
    method: 'post',
    data,
  })

/**
 * 修改角色
 * @param {Object} data request body
 * @param {string} data.name 角色名称
 * @param {string[]} data.permission 角色权限
 */
export const updateRole = data =>
  request('/role/update', {
    method: 'post',
    data,
  })

/**
 * 删除角色
 * @param {Object} data
 * @param {string} data.id
 */
export const deleteRole = data =>
  request(`/role/delete/${data.id}`, {
    method: 'post',
    data: data,
  })

/**
 * 获取PC权限树
 */
export const getPermissionTree = () =>
  request('/module/gettree', {
    method: 'post',
  })


export const getTestList = () =>
request('/module/getTestList', {
  method: 'post',
})
/**
 * 获取APP菜单
 */
export const getApptreeData = () =>
  request('/module/gettreeforapp', {
    method: 'post',
  })

/**
 * 获取管理员列表
 * @param {Object} data request body
 * @param {number} data.page
 * @param {number} data.limit
 * @param {string} data.keyword
 * @param {string} data.status
 */
export const getUsers = data =>
  request('/user/getlist', {
    method: 'post',
    data,
  })

/**
 * 创建管理员
 * @param {Object} data
 * @param {string} data.realName
 * @param {string} data.mobile
 * @param {string} data.orgId
 * @param {string[]} data.roles
 */
export const createUser = data =>
  request('/user/create', {
    method: 'post',
    data,
  })

/**
 * 修改管理员
 * @param {Object} data
 * @param {string} data.realName
 * @param {string} data.id - 管理员id
 * @param {string} data.orgId - 所属组织
 * @param {string[]} data.roles - 角色
 */
export const updateUser = data =>
  request('/user/update', {
    method: 'post',
    data,
  })

/**
 * 删除管理员
 * @param {Object} data
 * @param {string[]} data.ids
 */
export const removeUser = data =>
  request('/user/remove', {
    method: 'post',
    data,
  })

/**
 * 修改管理员状态
 * @param {Object} data
 * @param {string} data.id
 * @param {1|2} data.status - 1: 启用，2：停用
 */
export const changeUserStatus = data =>
  request('/user/changeStatus', {
    method: 'post',
    data,
  })
