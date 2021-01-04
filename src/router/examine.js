import Layout from '@/layout'
// import ParentView from '@/components/ParentView'
// import routerReplaceSelf from './routerReplaceSelf'
export default {
  path: '/AuditManage',
  name: 'AuditManage',
  component: Layout,
  meta: {
    title: '审核管理',
  },
  children: [
    {
      path: '/audit-configure',
      name: 'audit-configure',
      component: () => import('@/views/audit/configure'),
      meta: {
        title: '审核配置',
        hidden: false,
      },
    },
    {
      path: '/columntreereview/list',
      name: '/columntreereviewlist',
      component: () => import('@/views/columnTreeReview/columnTreeReviewList'),
      meta: {
        title: '栏目树审核',
        hidden: false,
      },
    },
    {
      path: '/columntreereview/detail',
      name: '/columntreereviewdetail',
      component: () =>
        import('@/views/columnTreeReview/columnTreeReviewDetail'),
      meta: {
        title: '栏目树审核详情',
        hidden: true,
      },
    },
    {
      path: '/columntreereview/content',
      name: '/columnTreeReviewDetailContent',
      component: () =>
        import('@/views/columnTreeReview/columnTreeReviewDetailContent'),
      meta: {
        title: '栏目树审核详情内容',
        hidden: true,
      },
    },
    {
      path: '/columncontentreview/list',
      name: '/columncontentreviewList',
      component: () => import('@/views/columnContentReview'),
      meta: {
        title: '栏目内容审核',
        hidden: false,
      },
    },
    {
      path: '/scroll-message-audit',
      name: 'scroll-message-audit',
      component: () => import('@/views/audit/scrollMessage'),
      meta: {
        title: '滚动消息审核',
        hidden: false,
      },
    },
    {
      path: '/popup-message-audit',
      name: 'popup-message-audit',
      component: () => import('@/views/audit/popupMessage'),
      meta: {
        title: '弹窗消息审核',
        hidden: false,
      },
    },
    {
      path: '/contentreview',
      name: 'managementtoexamine',
      component: () => import('@/views/management/managementtoexamine'),
      meta: {
        title: '内容审核',
        hidden: false,
      },
    },
  ],
}
