// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    token: '',
    branch: {},
    cartinfo: []
  },
  mutations: {
    setToken: (state, token) => {
      state.token = token
    },
    setUser: (state, user) => {
      state.user = user
    },
    setBranch (state, branch) {
      state.branch = branch
    },
    setCartinfo (state, goods) {
      state.cartinfo = goods
    }
  }
})

export default store
