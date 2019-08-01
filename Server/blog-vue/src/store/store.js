import Vue from 'vue'
import Vuex from 'vuex'
import {asyncRouterMap} from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  // 设置属性
  state: {
    isLogin: false,
    username: null,
    roles: [],
    addRouters: []
  },

  // 获取属性的状态
  getters: {
    // 获取登录状态
    isLogin: state => state.isLogin,
    addRouters: state => state.addRouters,
    username: state => state.username,
    roles: state => state.roles
  },

  // 设置属性状态
  mutations: {
    // 保存登录状态
    userStatus (state, user) {
      if (user != null) {
        state.username = user
        state.isLogin = true
        state.roles = []
        // Vuex在用户刷新的时候userLogin会回到默认值false，所以我们需要用到HTML5储存
        // 我们设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
        localStorage.setItem('Flag', 'isLogin')
        localStorage.setItem('UserName', user)
      } else {
        state.isLogin = false
        localStorage.removeItem('Flag')
        localStorage.removeItem('UserName')
      }
    },
    addRouters (state, otherRouters) {
      state.addRouters = otherRouters
    },
    setRoles (state, roles) {
      state.roles = roles
    }
  },

  // 应用mutations
  actions: {
    // 设置登陆状态
    SetUser ({commit}, user) {
      commit('userStatus', user)
    },
    GenerateRoutes ({commit}, roles) {
      var newRouters = []
      for (var i = 0; i < asyncRouterMap.length; i++) {
        if (asyncRouterMap[i].meta.role.indexOf('all') !== -1)newRouters.push(asyncRouterMap[i])
        else {
          for (var j = 0; j < asyncRouterMap[i].meta.role.length; j++) {
            if (roles.indexOf(asyncRouterMap[i].meta.role[j]) !== -1) { newRouters.push(asyncRouterMap[i]); continue }
          }
        }
      }
      commit('addRouters', newRouters)
    }
  }
})
