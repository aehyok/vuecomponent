import { asyncRoutes } from '@/router'
import { getPermissionTree } from '@/services/user'
import { Message } from 'element-ui'

function filterLeftMenu(data) {
  return data.reduce((pre, current) => {
    if (!current.meta.hidden) {
      if (current.children && current.children.length) {
        return pre.concat({
          ...current,
          children: filterLeftMenu(current.children),
        })
      }
      return pre.concat(current)
    }
    return pre
  }, [])
}

// routers 本地定义，menus接口获取
function filterByMenu(routes, menus) {
  if (!routes || !menus) return []
  console.log(routes, menus, 'routes--menus')
  return routes.reduce((pre, current) => {
    const menuItem = menus.find(m => m.url === current.path)
    if (menuItem && menuItem.name) {
      current.meta.title = menuItem.name
    }

    if (current.meta.hidden) {
      pre.push(current)
    }

    if (!menuItem || !menuItem.isShow) return pre

    if (menuItem.childrens && menuItem.childrens.length) {
      pre.push({
        ...current,
        redirect: menuItem.childrens[0].url,
        children: filterByMenu(current.children, menuItem.childrens),
      })
    } else {
      pre.push({
        ...current,
        meta: {
          ...current.meta,
          permissions: menuItem.actions,
        },
      })
    }
    return pre
  }, [])
}

export const actionMap = {
  create: 1,
  delete: 2,
  update: 4,
  detail: 8,
  settingTree: 16,
  treeConfig: 32,
  submitAudit: 64,
  copy: 128,
  share: 256,
  stop: 512,
  importAcc: 1024,
  audit: 2048,
  pushOaSet: 4096,
  reply: 8192,
}

export const actionDisplay = {
  1: '创建',
  2: '删除',
  4: '修改',
  8: '详情',
  16: '设置当前栏目树',
  32: '栏目树配置',
  64: '提交审核',
  128: '复制',
  256: '共享',
  512: '停用',
  1024: '导入账号',
  2048: '审核',
  4096: '发布公众号设置',
  8192: '回复',
}

export default {
  namespaced: true,
  state: {
    menus: [],
    leftMenus: [],
  },
  getters: {
    hasMenu(state) {
      return state.menus.length > 0
    },
    permitedRoutes(state) {
      return filterByMenu(asyncRoutes, state.menus)
    },
    displayMenuTree(state) {
      const newLeftMenus = filterLeftMenu(state.leftMenus)
      // return state.leftMenus
      return newLeftMenus
    },
  },
  mutations: {
    setMenus(state, menus) {
      state.menus = menus
    },
    setLeftMenus(state, data) {
      state.leftMenus = data
    },
  },
  actions: {
    async fetchMenu({ commit }) {
      try {
        const res = await getPermissionTree()
        commit('setMenus', res.data)
      } catch (error) {
        Message.error(error.message)
      }
    },
  },
}
