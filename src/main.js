import '@/utils/css/common.css'
import '~/font/iconfont.css'
import Vue from 'vue'
import App from './App'
import request from '@/utils/js/request'
import wx from '@/utils/js/wx'
Vue.use(request)
Vue.use(wx)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: [
      'pages/logs/logs',
      '^pages/index/index',
      'pages/phone-bind/phone-bind',
      'pages/order/order',
      'pages/buy/buy',
      'pages/map/map',
      'pages/convert-coffeepoint/convert-coffeepoint',
      'pages/address-edit/address-edit',
      'pages/address-select/address-select',
      'pages/redpacket-mine/redpacket-mine',
      'pages/redpacket-select/redpacket-select',
      'pages/payment/payment',
      'pages/shopping-mall/shopping-mall',
      'pages/vendor-detail/vendor-detail',
      'pages/remark/remark',
      'pages/grab-redpacket/grab-redpacket'
    ], // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
}
