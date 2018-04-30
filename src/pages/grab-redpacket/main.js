import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '专属红包',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#bf2c2c'
  }
}
