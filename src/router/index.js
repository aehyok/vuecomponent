import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'
import ParentView from '@/components/ParentView'
// import routerReplaceSelf from './routerReplaceSelf'
import NotFound from '@/components/NotFound'
import User from '@/views/user'

import examine from './examine'
import EPGmanage from './EPGmanage'
import Commoncontentmanagement from './Commoncontentmanagement'
import mpoa from './mpoa'
Vue.use(VueRouter)

// 基础路由
export const asyncRoutes = [
  {
    path: '/basic',
    name: 'basic',
    component: Layout,
    meta: {
      title: '基础管理',
    },
    children: [
      {
        path: '/organization-manage',
        name: 'organizationManage',
        component: () => import('@/views/organizationManage'),
        meta: {
          title: '组织管理',
          hidden: false,
        },
      },
      {
        path: '/iptv-account',
        name: 'iptvAccount',
        component: () => import('@/views/iptvAccount'),
        meta: {
          title: 'IPTV账号管理',
          hidden: false,
        },
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '用户管理',
          // 是否在菜单显示
          hidden: false,
        },
        component: ParentView,
        redirect: { name: 'role' },
        children: [
          {
            path: '/user/role',
            name: 'role',
            component: User,
            meta: {
              title: '角色管理',
              hidden: false,
            },
          },
          {
            path: '/user/admin',
            name: 'admin',
            component: () => import('@/views/admin'),
            meta: {
              title: '管理员管理',
              hidden: false,
            },
          },
        ],
      },
      {
        path: '/componentManage',
        name: 'componentManage',
        meta: {
          title: '组件管理',
          // 是否在菜单显示
          hidden: false,
        },
        component: ParentView,
        children: [
          {
            path: '/component/table',
            name: 'componentTable',
            component: () => import('@/views/componentManage/table'),
            meta: {
              title: 'Table管理',
              hidden: false,
            },
          },
          {
            path: '/component/form',
            name: 'componentForm',
            component: () => import('@/views/componentManage/form'),
            meta: {
              title: 'Form管理',
              hidden: false,
            },
          },
          {
            path: '/component/formcreate',
            name: 'componentFormCreate',
            component: () => import('@/views/componentManage/formcreate'),
            meta: {
              title: 'FormCreate管理',
              hidden: false,
            },
          },
          {
            path: '/component/image',
            name: 'componentImage',
            component: () => import('@/views/componentManage/image'),
            meta: {
              title: 'Image管理',
              hidden: false,
            },
          },
          {
            path: '/component/formnormal',
            name: 'componentformnormal',
            component: () => import('@/views/componentManage/formnormal'),
            meta: {
              title: 'form常规',
              hidden: false,
            },
          },
        ],
      },

      {
        path: '/system',
        name: 'systemManagement',
        component: ParentView,
        meta: {
          title: '系统管理',
          hidden: false,
        },
        redirect: '/system/parameter',
        children: [
          {
            path: '/system/parameter',
            name: 'systemParameter',
            component: () => import('@/views/systemManagement/systemParameter'),
            meta: {
              title: '系统参数管理',
              hidden: false,
            },
          },
          {
            path: '/system/images',
            name: 'systemImgs',
            component: () => import('@/views/systemManagement/systemImgs'),
            meta: {
              title: '系统图片管理',
              hidden: false,
            },
          },
          {
            path: '/system/popupmessage-audit',
            name: 'popupMessageAudit',
            component: () => import('@/views/audit/popupMessage'),
            meta: {
              title: '弹窗消息审核',
              hidden: false,
            },
          },
        ],
      },
      {
        path: '/region-manager',
        name: 'region-manager',
        component: () => import('@/views/region'),
        meta: {
          title: '行政区域管理',
          hidden: false,
        },
      },
      {
        path: '/sensitive-word',
        name: 'sensitive-word',
        component: () => import('@/views/sensitiveWord'),
        meta: {
          title: '敏感词管理',
          hidden: false,
        },
      },
      {
        path: '/system/logs',
        name: 'logs',
        component: () => import('@/views/logs'),
        meta: {
          title: '操作日志',
          hidden: false,
        },
      },
    ],
  },
  {
    ...EPGmanage,
  },
  {
    ...mpoa,
  },
  {
    ...Commoncontentmanagement,
  },
  {
    ...examine,
  },
]

// 审核管理
// export const asyncExamine = [
//   {
//     ...examine,
//   },
// ]

// EPG管理
// export const asyncEPGmanage = [
//   {
//     ...EPGmanage,
//   },
// ]

export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录页',
    },
    component: () => import('@/views/login'),
  },
]
export const notFoundRoute = [
  { path: '/404', component: NotFound },
  { path: '*', redirect: '/404' },
]

// const recursionHelper = list => {
//   return list.map(r => {
//     if (r.children) {
//       return {
//         name: r.meta.title,
//         url: r.path,
//         children: recursionHelper(r.children),
//       }
//     } else {
//       return {
//         name: r.meta.title,
//         url: r.path,
//       }
//     }
//   })
// }
// console.log(JSON.stringify(recursionHelper(asyncRoutes)))

const router = new VueRouter({
  routes: [...constantRoutes],
})

export default router
