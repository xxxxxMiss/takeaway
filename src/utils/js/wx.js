export default {
  install (Vue) {
    Vue.prototype.$showToast = function (msg) {
      let options = {
        title: '请求出错~',
        icon: 'none',
        duration: 3000
      }
      if (typeof msg === 'string') { options.title = msg }
      if (typeof msg === 'object') { options = msg }
      wx.showToast(options)
    }
  }
}
