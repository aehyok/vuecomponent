import NProgress from 'nprogress' // progress bar
import router, { constantRoutes, notFoundRoute } from '@/router'
import store from '@/store'
import { Message } from 'element-ui'

NProgress.configure({ showSpinner: false })
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const info = localStorage.getItem('loginInfo')
  const token = info ? JSON.parse(info) : ''

  if (token) {
    if (to.path === '/login') {
      await store.dispatch('permission/fetchMenu')

      router.addRoutes(
        store.getters['permission/permitedRoutes'].concat(notFoundRoute),
      )
      const firstPage = store.getters['permission/permitedRoutes'].length
        ? store.getters['permission/permitedRoutes'][0].path
        : '/404'
      next({ path: firstPage, replace: true })
      NProgress.done()
    } else {
      const hasPermitedRoute =
        store.getters['permission/permitedRoutes'].length > 0

      if (hasPermitedRoute) {
        next()
        NProgress.done()
      } else {
        try {
          await store.dispatch('permission/fetchMenu')

          router.addRoutes(
            store.getters['permission/permitedRoutes'].concat(notFoundRoute),
          )
          next({ ...to, replace: true })
        } catch (error) {
          Message.error(error.message)
        }
      }
    }
  } else {
    const isConstant = constantRoutes.some(r => r.path === to.path)
    if (isConstant) {
      next()
    } else {
      next({ path: '/login' })
    }
    NProgress.done()
  }
})
router.afterEach(() => {
  NProgress.done()
})
