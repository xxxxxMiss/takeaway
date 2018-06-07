export default {
  install (Vue) {
    Vue.prototype.$showToast = function (msg) {
      let options = {
        title: '请求出错~',
        icon: 'none',
        duration: 3000,
        mask: false
      }
      if (typeof msg === 'string') { options.title = msg }
      if (typeof msg === 'object') { options = msg }
      wx.showToast(options)
    }

    Vue.prototype.$showModal = function (msg, callback) {
      let options = {
        title: '提示',
        showCancel: false,
        confirmColor: '#ff7a3d'
      }
      if (typeof msg === 'string') { options.content = msg }
      if (typeof msg === 'object') { options = msg }
      if (typeof callback === 'function') options.success = callback
      if (typeof callback === 'object') {
        options = Object.assign(options, callback)
      }
      wx.showModal(options)
    }
  }
}
