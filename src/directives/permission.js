import { actionMap } from '@/store/modules/permission'

export const permission = {
  inserted(el, binding, vnode) {
    const permissions = vnode.context.$route.meta.permissions
    const isExist = permissions & actionMap[binding.value]

    if (isExist === 0) {
      el.parentNode.removeChild(el)
    }
  },
}
