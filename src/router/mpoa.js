import Layout from '@/layout'
// import ParentView from '@/components/ParentView'
// import routerReplaceSelf from './routerReplaceSelf'
export default {
  path: '/thePublic',
  name: 'thePublic',
  component: Layout,
  meta: {
    title: '公众号管理',
  },
  children: [
    {
      path: '/bannerManager',
      name: 'bannerManager',
      component: () => import('@/views/bannerManage/banner'),
      meta: {
        title: 'banner管理',
        hidden: false,
      },
    },
    {
      path: '/photoanywhere-manager',
      name: 'photoanywhere-manager',
      component: () => import('@/views/photoanywhere'),
      meta: {
        title: '随手拍管理',
        hidden: false,
      },
    },
    {
      path: '/wechat-user-manager',
      name: 'wechat-user-manager',
      component: () => import('@/views/wechat'),
      meta: {
        title: '公众号用户管理',
        hidden: false,
      },
    },
  ],
}
