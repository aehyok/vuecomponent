import { format } from 'date-fns'

export const transformFalsy = value => {
  if (Array.isArray(value)) {
    return value.length ? value : '--'
  }
  return value || '--'
}

export const validDateText = item => {
  if (!item || !item.endDate) return ''
  if (item.permanent !== 1) {
    return (
      format(
        new Date(item.startDate ? item.startDate : item.beginDate),
        'yyyy-MM-dd',
      ) +
      ' ~ ' +
      format(new Date(item.endDate), 'yyyy-MM-dd')
    )
  }
  return '永不过期'
}

export const playTimeText = item => {
  if (!item || !item.playStartTime) return ''
  if (item.allDay !== 1) {
    return item.playStartTime + ' ~ ' + item.playEndTime
  }
  return '全天'
}

export const formatTime = item => {
  if (item) {
    return format(new Date(item), 'yyyy-MM-dd HH:mm:ss')
  }
  return ''
}

export const formatDate = item => {
  if (item) {
    return format(new Date(item), 'yyyy-MM-dd')
  }
  return ''
}
