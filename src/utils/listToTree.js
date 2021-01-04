/**
 *
 * @param {Array} list 数组
 * @param {string} idKey
 * @param {string} parentIdKey 数据中表示父子关系的键名
 */
export const listToTree = (
  list = [],
  idKey = 'id',
  parentIdKey = 'parentId',
) => {
  const roots = []
  const map = {}

  list.forEach(i => {
    i.children = []
    map[i[idKey]] = i
  })

  list.forEach(i => {
    const parentId = i[parentIdKey]
    if (parentId) {
      const node = map[parentId]
      node.children.push(i)
    } else {
      roots.push(i)
    }
  })
  return roots
}
