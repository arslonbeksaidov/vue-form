import debounce from 'lodash/debounce'
const PageScrollDirective = {
  mounted (el, binding) {
    el.__PageScroll__ = debounce(() => {
      console.log('scrolling')
      binding.value()
    }, 200, { leading: true })
    document.addEventListener('scroll', el.__PageScroll__)
  },
  unmount (el, binding) {
    document.addEventListener('scroll', el.__PageScroll__)
  }
}
export default (app) => {
  app.directive('page-scroll', PageScrollDirective)
}
