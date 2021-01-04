import request from '@/utils/request'

/**
 * 获取弹窗消息列表
 * @param {Object} param0
 * @param {number} param0.page
 * @param {number} param0.limit
 * @param {string} param0.keyword
 * @param {string} param0.auditStatus
 * @param {string} param0.status
 */
export const getPopupMessageList = ({
  page,
  limit,
  keyword,
  status,
  auditStatus,
}) =>
  request('/message/noticeMessage/list', {
    method: 'post',
    data: {
      page,
      limit,
      keyword,
      status,
      auditStatus,
    },
  })

/**
 * 获取弹窗消息详情
 * @param {Object} data
 * @param {string} data.id
 */
export const getPopupMessageDetail = data =>
  request('/message/noticeMessage/detail', {
    method: 'post',
    data,
  })

/**
 * 创建弹窗消息
 * @param {Object} data
 * @param {string} data.id - 创建不填，编辑时必填
 * @param {string} data.title - 消息名称
 * @param {1|2} data.allDay - 是否全天播放 1 是，2 否
 * @param {1|2} data.alwaysOn - 是否永不过期 1 是，2 否
 * @param {string} data.title - 消息名称
 * @param {string} data.iamgeId
 * @param {number} data.startDate - 开始日期 timestamp
 * @param {number} data.endDate - 结束日期 timestamp
 * @param {1|2|3} data.type - 弹窗类型 1：图片; 2：问卷; 3：文字
 * @param {string[]} data.transmitTime - 弹出时间
 * @param {string[]} data.ranges - 发布范围
 */
export const createPopupMessage = data => {
  const { startDate, endDate } = data
  const [playStartTime, playEndTime] = data.transmitTime

  return request('/message/noticeMessage/save', {
    method: 'post',
    data: {
      id: data.id,
      messageName: data.title,
      startDate,
      endDate,
      playEndTime,
      playStartTime,
      allDay: data.allDay,
      permanent: data.alwaysOn,
      type: data.type,
      imageId: data.imageId,
      distributeOrgs: data.ranges,
    },
  })
}

/**
 * 删除弹窗消息
 * @param {Object} data request body
 * @param {string} data.id
 */
export const deletePopupMessage = data =>
  request('/message/noticeMessage/delete', {
    method: 'post',
    data,
  })

// export const updatePopupMessage = data => request('')

/**
 * 修改弹窗消息状态
 * @param {Object} data request body
 * @param {string} data.id
 * @param {1|2} data.status
 */
export const updatePopupMessageStatus = data =>
  request('/message/noticeMessage/changeStatus', {
    method: 'post',
    data,
  })
/**
 * 修改弹窗消息状态
 * @param {Object} data request body
 * @param {string} data.id
 * @param {1|2} data.status
 */
export const updateScrollMessageStatus = data =>
  request('/message/scrollMessage/changeStatus', {
    method: 'post',
    data,
  })

/**
 * 获取滚动消息列表
 * @param {Object} data
 * @param {number} data.page
 * @param {number} data.limit
 * @param {string} data.keyword
 */
export const getScrollMessageList = data =>
  request('/message/scrollMessage/list', {
    method: 'post',
    data,
  })

/**
 * 创建、编辑滚动消息
 * @param {Object} data
 * @param {string} data.id - 创建不填，编辑时必填
 * @param {string} data.title - 消息名称
 * @param {1|2} data.allDay - 是否全天播放 1 是，2 否
 * @param {1|2} data.alwaysOn - 是否永不过期 1 是，2 否
 * @param {string} data.scrollTimes - 滚动次数
 * @param {string} data.content - 消息内容
 * @param {string[]} data.date - 有效日期
 * @param {1|2} data.noLimit - 不限次数 1-yes 2-no
 * @param {string[]} data.transmitTime - 滚动时间
 * @param {string[]} data.ranges - 发布范围
 */
export const saveScrollMessage = data => {
  const { startDate, endDate } = data
  const [playStartTime, playEndTime] = data.transmitTime

  return request('/message/scrollMessage/save', {
    method: 'post',
    data: {
      id: data.id,
      messageName: data.title,
      startDate,
      endDate,
      playEndTime,
      playStartTime,
      noLimit: data.noLimit,
      messageText: data.content,
      scrollTimes: data.scrollTimes,
      allDay: data.allDay,
      permanent: data.alwaysOn,
      distributeOrgs: data.ranges,
    },
  })
}

/**
 * 删除滚动消息
 * @param {String} data.id
 */
export const scrollMessageDelete = data => {
  return request('/message/scrollMessage/delete', {
    method: 'post',
    data,
  })
}

/**
 * 获取滚动消息详情
 * @param {Object} data
 * @param {string} data.id
 */
export const getScrollMessageDetail = data =>
  request('/message/scrollMessage/detail', {
    method: 'post',
    data,
  })

/**
 * 审核弹窗消息
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.reason - 审核不通过原因
 * @param {number} data.status - 1：未提交审核，2：审核中，3：审核通过，4：审核不通过
 */
export const auditPopupMessage = data => {
  return request('/message/noticeMessage/changeAuditStatus', {
    method: 'post',
    data,
  })
}

/**
 * 审核滚动消息
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.reason - 审核不通过原因
 * @param {number} data.status - 1：未提交审核，2：审核中，3：审核通过，4：审核不通过
 */
export const auditScrollMessage = data => {
  return request('/message/scrollMessage/changeAuditStatus', {
    method: 'post',
    data,
  })
}



/**
 * 获取霸屏消息列表
 * @param {Object} param0
 * @param {number} param0.page
 * @param {number} param0.limit
 * @param {string} param0.keyword
 * @param {string} param0.auditStatus
 * @param {string} param0.status
 */
export const getSuperMessageList = ({
  page,
  limit,
  keyword,
  status,
  auditStatus,
}) =>
  request('/message/superMessage/list', {
    method: 'post',
    data: {
      page,
      limit,
      keyword,
      status,
      auditStatus,
    },
  })

/**
 * 获取霸屏消息详情
 * @param {Object} data
 * @param {string} data.id
 */
export const getSuperMessageDetail = data =>
  request('/message/superMessage/detail', {
    method: 'post',
    data,
  })

/**
 * 创建霸屏消息
 * @param {Object} data
 * @param {string} data.id - 创建不填，编辑时必填
 * @param {string} data.messageName - 消息名称
 * @param {number} data.startDate - 开始日期 timestamp
 * @param {number} data.endDate - 结束日期 timestamp
 * @param {1|2} data.permanent - //是否永不过期 1，是 2 否
 * @param {string[]} data.transmitTime   -播放开始时间和播放结束时间
 * @param {1|2} data.allDay - 是否全天播放 1 是，2 否
 * @param {1|2} data.type - 霸屏类型 1：图片; 2：文字
 * @param {string[]} data.images - 霸屏图片 ids
 * @param {string[]} data.videos - 霸屏视频 ids
 * @param {string[]} data.distributeOrgs - 发布范围
 */
export const createSuperMessage = data => {
  const { startDate, endDate } = data
  const [playStartTime, playEndTime] = data.transmitTime

  return request('/message/superMessage/save', {
    method: 'post',
    data: {
      id: data.id,
      messageName: data.title,
      startDate,
      endDate,
      playEndTime,
      playStartTime,
      allDay: data.allDay,
      permanent: data.alwaysOn,
      type: data.type,
      imageId: data.imageId,
      distributeOrgs: data.ranges,
    },
  })
}

/**
 * 删除霸屏消息
 * @param {Object} data request body
 * @param {string} data.id
 */
export const deleteSuperMessage = data =>
  request('/message/superMessage/delete', {
    method: 'post',
    data,
  })

/**
 * 修改霸屏消息状态
 * @param {Object} data request body
 * @param {string} data.id
 * @param {1|2} data.status
 */
export const updateSuperMessageStatus = data =>
  request('/message/superMessage/changeStatus', {
    method: 'post',
    data,
  })

/**
 * 审核霸屏消息
 * @param {Object} data
 * @param {string} data.id
 * @param {string} data.reason - 审核不通过原因
 * @param {number} data.status - 1：未提交审核，2：审核中，3：审核通过，4：审核不通过
 */
export const auditSuperMessage = data => {
  return request('/message/superMessage/changeAuditStatus', {
    method: 'post',
    data,
  })
}



/**
 * 获取大喇叭列表
 * @param {Object} param0
 * @param {number} param0.page
 * @param {number} param0.limit
 * @param {string} param0.keyword
 * @param {string} param0.auditStatus
 * @param {string} param0.status
 */
export const getSpeakerMessageList = ({
  page,
  limit,
  keyword,
  status,
  auditStatus,
}) =>
  request('/message/speakerMessage/list', {
    method: 'post',
    data: {
      page,
      limit,
      keyword,
      status,
      auditStatus,
    },
  })

/**
 * 获取大喇叭消息详情
 * @param {Object} data
 * @param {string} data.id
 */
export const getSpeakerMessageDetail = data =>
  request('/message/speakerMessage/detail', {
    method: 'post',
    data,
  })

/**
 * 删除大喇叭消息
 * @param {Object} data request body
 * @param {string} data.id
 */
export const deleteSpeakerMessage = data =>
  request('/message/speakerMessage/delete', {
    method: 'post',
    data,
  })

/**
 * 修改大喇叭消息状态
 * @param {Object} data request body
 * @param {string} data.id
 * @param {1|2} data.status
 */
export const updateSpeakerMessageStatus = data =>
  request('/message/speakerMessage/changeStatus', {
    method: 'post',
    data,
  })


/**
 * 创建大喇叭消息
 * @param {Object} data
 * @param {string} data.id - 创建不填，编辑时必填
 * @param {string} data.messageName - 消息名称
 * @param {1|2} data.audioSource - 语音来源 1、本地上传 2 文字转换
 * @param {string} data.content - 内容
 * @param {string} data.audio   -语音id
 * @param {1|2} data.backgroundImage -背景图片 id
 * @param {1|2} data.status - 状态 1启用 2 停用
 * @param {number} data.expiryDuration - 有效时长（分钟）
 * @param {string[]} data.distributeOrgs - 发布范围
 */
export const createSpeakerMessage = data => {
  const { startDate, endDate } = data
  const [playStartTime, playEndTime] = data.transmitTime

  return request('/message/speakerMessage/save', {
    method: 'post',
    data: {
      id: data.id,
      messageName: data.title,
      startDate,
      endDate,
      playEndTime,
      playStartTime,
      allDay: data.allDay,
      permanent: data.alwaysOn,
      type: data.type,
      imageId: data.imageId,
      distributeOrgs: data.ranges,
    },
  })
}
