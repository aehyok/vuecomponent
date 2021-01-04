import Layout from '@/layout'
import ParentView from '@/components/ParentView'
// import routerReplaceSelf from './routerReplaceSelf'
export default {
  path: '/generalContent',
  name: 'generalContent',
  component: Layout,
  meta: {
    title: '通用内容管理',
  },
  children: [
    {
      path: '/investigate',
      name: 'investigate',
      component: () => import('@/views/investigate/investigate'),
      meta: {
        title: '民意调查',
        hidden: false,
      },
    },
    {
      path: '/agriculturalExperts',
      name: 'management',
      meta: {
        title: '农技达人',
        hidden: false,
      },
      component: ParentView,
      children: [
        {
          path: '/agriculturalExperts/verify',
          name: 'usersof',
          component: () => import('@/views/management/usersof'),
          meta: {
            title: '身份认证审核',
            hidden: false,
          },
        },
        {
          path: '/agriculturalExperts/content',
          name: 'managementcontent',
          component: () => import('@/views/management/managementcontent'),
          meta: {
            title: '内容管理',
            hidden: false,
          },
        },
      ],
    },
    {
      path: '/village-moment',
      name: 'villageMoment',
      meta: {
        title: '村友圈',
        hidden: false,
      },
      component: () => import('@/views/villageMoment'),
    },
  ],
}
