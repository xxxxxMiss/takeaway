function request (options, showLoading) {
  let { url, data, method } = options
  if (typeof url === 'object') {
    if (typeof data === 'boolean') {
      showLoading = data
    }
    data = url
    url = 'https://m.escoffee.net/'
  }

  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({
        title: '正在加载...',
        mask: true
      })
    }
    wx.request({
      url,
      data,
      method,
      success ({ data }) {
        showLoading && wx.hideLoading()
        const { code, errormsg, info } = data
        if (code == 0) {
          resolve(info)
        } else {
          resolve(null)
          wx.showToast({
            icon: 'none',
            duration: 3000,
            title: errormsg || '请求错误~'
          })
        }
      },
      fail () {
        showLoading && wx.hideLoading()
        const failMsg = '请求出了一点问题~'
        reject(new Error(failMsg))
        wx.showToast({
          icon: 'none',
          duration: 3000,
          title: failMsg
        })
      }
    })
  })
}

export function get (url, data, showLoading) {
  return request({ url, data, method: 'GET' }, showLoading)
}

export function post (url, data, showLoading) {
  return request({ url, data, method: 'POST' }, showLoading)
}

export default {
  install (Vue) {
    Vue.prototype.$get = function (url, data, showLoading) {
      return get(url, data, showLoading)
    }
    Vue.prototype.$post = function (url, data, showLoading) {
      return post(url, data, showLoading)
    }
  }
}
