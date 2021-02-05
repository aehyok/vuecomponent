import { asyncRoutes } from '@/router'
// import { getPermissionTree } from '@/services/user'
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
        // const res = await getPermissionTree()
        const res = {
          code: 200,
          message: 'success',
          data: [
            {
              id: '5f39fdb405c378432462671d',
              name: '基础管理',
              icon: 'role',
              url: '/basic',
              isShow: true,
              actions: 0,
              disabled: false,
              childrens: [
                {
                  id: '5f363a51fdc8520013e923b3',
                  name: '组织管理',
                  icon: 'role',
                  url: '/organization-manage',
                  isShow: true,
                  actions: 7,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f363a51fdc8520013e923b4',
                  name: 'IPTV账号管理',
                  icon: 'role',
                  url: '/iptv-account',
                  isShow: true,
                  actions: 1543,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f363a51fdc8520013e923b5',
                  name: '用户管理',
                  icon: 'role',
                  url: '/user',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [
                    {
                      id: '5f363a51fdc8520013e923b7',
                      name: '角色管理',
                      icon: 'role',
                      url: '/user/role',
                      isShow: true,
                      actions: 7,
                      disabled: false,
                      childrens: [],
                    },
                    {
                      id: '5f363a51fdc8520013e923b6',
                      name: '管理员管理',
                      icon: 'role',
                      url: '/user/admin',
                      isShow: true,
                      actions: 519,
                      disabled: false,
                      childrens: [],
                    },
                  ],
                },
                {
                  id: '5f363a51fdc8520013e923b8',
                  name: '系统管理',
                  icon: 'role',
                  url: '/system',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [
                    {
                      id: '5f363a51fdc8520013e923b9',
                      name: '系统参数管理',
                      icon: 'role',
                      url: '/system/parameter',
                      isShow: true,
                      actions: 13,
                      disabled: false,
                      childrens: [],
                    },
                    {
                      id: '5f363a51fdc8520013e923ba',
                      name: '系统图片管理',
                      icon: 'role',
                      url: '/system/images',
                      isShow: true,
                      actions: 5,
                      disabled: false,
                      childrens: [],
                    },
                  ],
                },
                {
                  id: '5f363a51fdc8520013e923cc',
                  name: '敏感词管理',
                  icon: 'role',
                  url: '/sensitive-word',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f363a51fdc8520013e923bb',
                  name: '操作日志',
                  icon: 'role',
                  url: '/system/logs',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f55c76f037cd22a3c61c6b4',
                  name: '行政区域管理',
                  icon: 'role',
                  url: '/region-manager',
                  isShow: true,
                  actions: 10,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5fbe54433843e151b86eba1f',
                  name: '组件管理',
                  icon: 'role',
                  url: '/componentManage',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
              ],
            },
            {
              id: '5f3a1bfb05c3784324626722',
              name: 'EPG 管理',
              icon: 'role',
              url: '/epg',
              isShow: true,
              actions: 0,
              disabled: false,
              childrens: [
                {
                  id: '5f363a51fdc8520013e923ae',
                  name: '栏目树管理',
                  icon: 'role',
                  url: '/column-tree',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [
                    {
                      id: '5f363a51fdc8520013e923af',
                      name: '栏目树列表',
                      icon: 'role',
                      url: '/column-tree/list',
                      isShow: true,
                      actions: 503,
                      disabled: false,
                      childrens: [],
                    },
                    {
                      id: '5f363a51fdc8520013e923b0',
                      name: '栏目内容发布',
                      icon: 'role',
                      url: '/column-tree/column-issued',
                      isShow: true,
                      actions: 583,
                      disabled: false,
                      childrens: [],
                    },
                    {
                      id: '5f4f455dfbb24b7086e9471b',
                      name: '栏目类型配置',
                      icon: 'role',
                      url: '/column-tree/column-type',
                      isShow: true,
                      actions: 7,
                      disabled: true,
                      childrens: [],
                    },
                  ],
                },
                {
                  id: '5f363a51fdc8520013e923b1',
                  name: '滚动消息管理',
                  icon: 'role',
                  url: '/scroll-message',
                  isShow: true,
                  actions: 583,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f363a51fdc8520013e923b2',
                  name: '弹窗消息管理',
                  icon: 'role',
                  url: '/popup-message',
                  isShow: true,
                  actions: 583,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f363a51fdc8520013e923a1',
                  name: '霸屏消息',
                  icon: 'role',
                  url: '/occupy-screen-news',
                  isShow: true,
                  actions: 583,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f3a5a1705c378432462674b',
                  name: '素材管理',
                  icon: 'role',
                  url: '/material-management',
                  isShow: true,
                  actions: 75,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f363a51fdc8520013e923a2',
                  name: '大喇叭管理',
                  icon: 'role',
                  url: '/megaphone-manager',
                  isShow: true,
                  actions: 519,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f363a51fdc8520013e923a3',
                  name: '开机画面',
                  icon: 'role',
                  url: '/boot-screen',
                  isShow: true,
                  actions: 583,
                  disabled: false,
                  childrens: [],
                },
              ],
            },
            {
              id: '5f3a1ca605c3784324626723',
              name: '公众号管理',
              icon: 'role',
              url: '/thePublic',
              isShow: true,
              actions: 0,
              disabled: false,
              childrens: [
                {
                  id: '5f45de22e63b2429a01638df',
                  name: 'banner管理',
                  icon: 'role',
                  url: '/bannerManager',
                  isShow: true,
                  actions: 7,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f55c800037cd22a3c61c6b5',
                  name: '随手拍',
                  icon: 'role',
                  url: '/photoanywhere-manager',
                  isShow: true,
                  actions: 10,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f45f52be63b2429a01638e2',
                  name: '公众号用户管理',
                  icon: 'role',
                  url: '/wechat-user-manager',
                  isShow: true,
                  actions: 8200,
                  disabled: false,
                  childrens: [],
                },
              ],
            },
            {
              id: '5f3a1cde05c3784324626724',
              name: '通用内容管理',
              icon: 'role',
              url: '/generalContent',
              isShow: true,
              actions: 0,
              disabled: false,
              childrens: [
                {
                  id: '5f45bfd7b51dd63048325e6b',
                  name: '民意调查',
                  icon: 'role',
                  url: '/investigate',
                  isShow: true,
                  actions: 4103,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f45fdb1db1b925698fd20aa',
                  name: '农技达人',
                  icon: 'role',
                  url: '/agriculturalExperts',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [
                    {
                      id: '5f45fe27db1b925698fd20ab',
                      name: '身份认证审核',
                      icon: 'role',
                      url: '/agriculturalExperts/verify',
                      isShow: true,
                      actions: 0,
                      disabled: false,
                      childrens: [],
                    },
                    {
                      id: '5f45fe33db1b925698fd20ac',
                      name: '内容管理',
                      icon: 'role',
                      url: '/agriculturalExperts/content',
                      isShow: true,
                      actions: 10,
                      disabled: false,
                      childrens: [],
                    },
                  ],
                },
                {
                  id: '5f45fdb1db1b925698fd20ad',
                  name: '村友圈',
                  icon: 'role',
                  url: '/village-moment',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
              ],
            },
            {
              id: '5f3a1d0e05c3784324626725',
              name: '审核管理',
              icon: 'role',
              url: '/AuditManage',
              isShow: true,
              actions: 0,
              disabled: false,
              childrens: [
                {
                  id: '5f3f2f6cb51dd63048325e5a',
                  name: '审核配置',
                  icon: 'role',
                  url: '/audit-configure',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f3a5cc505c3784324626752',
                  name: '栏目树审核',
                  icon: 'role',
                  url: '/columntreereview/list',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f3a5c0d05c3784324626751',
                  name: '栏目内容审核',
                  icon: 'role',
                  url: '/columncontentreview/list',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f3b4b7305c378432462675a',
                  name: '滚动消息审核',
                  icon: 'role',
                  url: '/scroll-message-audit',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f3b4bae05c378432462675b',
                  name: '弹窗消息审核',
                  icon: 'role',
                  url: '/popup-message-audit',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5f505140fbb24b7086e9472a',
                  name: '农技达人内容审核',
                  icon: 'role',
                  url: '/contentreview',
                  isShow: true,
                  actions: 2048,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5fad1fec8c38dd431c172953',
                  name: '霸屏消息审核',
                  icon: 'role',
                  url: '/occupy-screen-news-audit',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
                {
                  id: '5fad1fea8c38dd431c172952',
                  name: '开机画面审核',
                  icon: 'role',
                  url: '/boot-screen-audit',
                  isShow: true,
                  actions: 0,
                  disabled: false,
                  childrens: [],
                },
              ],
            },
          ],
        }
        console.log(res, 'res-------fetchMenu')
        commit('setMenus', res.data)
      } catch (error) {
        Message.error(error.message)
      }
    },
  },
}
