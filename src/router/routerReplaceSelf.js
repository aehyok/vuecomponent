export default function routeReplaceSelf(component) {
  return {
    name: 'routerReplaceSelf',
    computed: {
      showChild() {
        const lastMatch = this.$route.matched.length - 1
        const deepestMatchedRoute = this.$route.matched[lastMatch]
        return deepestMatchedRoute.instances.default !== this
      },
    },
    render(h) {
      return this.showChild ? h('router-view') : h(component)
    },
  }
}
