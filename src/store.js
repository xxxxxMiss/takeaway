// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {},
    token: '',
    buyGoods: {}
  },
  mutations: {
    setToken: (state, token) => {
      state.token = token
    },
    setUser: (state, user) => {
      state.user = user
    },
    setBuyGoods (state, goods) {
      state.buyGoods = goods
    }
  }
})

export default store
