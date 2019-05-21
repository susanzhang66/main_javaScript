import tipMain from './tip'

let Tip = {}

Tip.install = function (Vue) {
  Vue.prototype.$tip = {}
  let TipMainCom = Vue.extend(tipMain)
  let instance = new TipMainCom({
    el: document.createElement('div')
  })
  document.body.appendChild(instance.$el)

  Vue.prototype.$tip.show = (settings = {}) => {
    instance.show = true
    instance.message = settings.message
    setTimeout(() => {
      instance.show = false
      settings.callback && settings.callback()
    }, 2000)
  }
}
export default Tip
