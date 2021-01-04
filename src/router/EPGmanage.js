import Layout from '@/layout'
import ParentView from '@/components/ParentView'
import routerReplaceSelf from './routerReplaceSelf'
export default {
  path: '/epg',
  name: 'EPG',
  component: Layout,
  meta: {
    title: 'EPG管理',
  },
  children: [
    {
      path: '/column-tree',
      name: 'columnTreeManagement',
      meta: {
        title: '栏目树管理',
        hidden: false,
      },
      component: ParentView,
      children: [
        {
          path: '/column-tree/list',
          name: 'columnTreeList',
          component: routerReplaceSelf(() =>
            import('@/views/columnTree/columnTreeList'),
          ),
          meta: {
            title: '栏目树列表',
            hidden: false,
          },
          children: [
            {
              path: '/column-tree/list/config',
              name: 'columnTreeConfig',
              component: () => import('@/views/columnTree/columnTreeConfig'),

              meta: {
                title: '栏目树配置',
                hidden: true,
                activeMenu: '/column-tree/list',
              },
            },
            {
              path: '/column-tree-history',
              name: '/columnTreeHistory',
              component: () => import('@/views/columnTreeHistory'),
              meta: {
                title: '栏目树审核历史',
                hidden: true,
                activeMenu: '/column-tree/list',
              },
            },
          ],
        },
        {
          path: '/column-tree/column-issued',
          name: 'columnIssued',
          component: routerReplaceSelf(() =>
            import('@/views/columnContentIssued'),
          ),
          meta: {
            title: '栏目内容发布',
            hidden: false,
          },
          children: [
            {
              path: '/column-content-history',
              name: '/columnContentHistory',
              component: () => import('@/views/columnContentHistory'),
              meta: {
                title: '栏目内容审核历史',
                hidden: true,
                activeMenu: '/column-tree/column-issued',
              },
            },
            {
              path: '/investigate-history',
              name: '/investigate-history',
              component: () =>
                import('@/views/columnContentIssued/InvestigateLayoutHistory'),
              meta: {
                title: '民意调查内容审核历史',
                hidden: true,
                activeMenu: '/column-tree/column-issued',
              },
            },
          ],
        },
        {
          path: '/column-tree/column-type',
          name: 'columnType',
          component: routerReplaceSelf(() =>
            import('@/views/columnTree/columnTreeTypeList'),
          ),
          meta: {
            title: '栏目类型列表',
            hidden: false,
          },
        },
      ],
    },
    {
      path: '/scroll-message',
      name: 'scrollMessage',
      component: () => import('@/views/scrollMessage'),
      meta: {
        title: '滚动消息管理',
        hidden: false,
      },
    },
    {
      path: '/popup-message',
      name: 'popupMessage',
      component: () => import('@/views/popupMessage/popupMessage'),
      meta: {
        title: '弹窗消息管理',
        hidden: false,
      },
    },
    {
      path: '/material-management',
      name: 'materialManagement',
      component: () => import('@/views/materialManagement'),
      meta: {
        title: '素材管理',
        hidden: false,
      },
    },
    {
      path: '/occupy-screen-news',
      name: 'occupy-screen-news',
      component: () => import('@/views/occupyScreenNews'),
      meta: {
        title: '霸屏消息',
        hidden: false,
      },
    },
    {
      path: '/megaphone-manager',
      name: 'megaphone-manager',
      component: () => import('@/views/megaPhoneManager'),
      meta: {
        title: '大喇叭管理',
        hidden: false,
      },
    },
    {
      path: '/boot-screen',
      name: 'boot-screen',
      component: () => import('@/views/bootScreen'),
      meta: {
        title: '开机画面',
        hidden: false,
      },
    },
    {
      path: '/popup-message-history-detail',
      name: 'popup-message-history-detail',
      component: () => import('@/views/popupMessage/popupMessageHistoryDetail'),
      meta: {
        title: '弹窗消息审核历史',
        hidden: true,
      },
    },
    {
      path: '/scroll-message-history-detail',
      name: 'scroll-message-history-detail',
      component: () =>
        import('@/views/scrollMessage/scrollMessageHistoryDetail'),
      meta: {
        title: '滚动消息审核历史',
        hidden: true,
      },
    },
  ],
}
