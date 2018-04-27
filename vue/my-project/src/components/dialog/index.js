import dialogMain from './dialog'

let Dialog = {}

Dialog.install = function (Vue) {
  Vue.prototype.$dialog = {}
  let DialogMainCom = Vue.extend(dialogMain)
  let instance = new DialogMainCom({
    el: document.createElement('div')
  })
  document.body.appendChild(instance.$el)

  Vue.prototype.$dialog.show = (settings = {}) => {
    instance.show = true
    instance.msg = settings.msg
    instance.cancel = settings.cancel
    instance.confirm = settings.confirm || '我知道了'
    instance.cancelCallback = settings.cancelCallback
    instance.confirmCallback = settings.confirmCallback
  }
}
export default Dialog
