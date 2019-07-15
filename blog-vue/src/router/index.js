import Vue from 'vue'
import store from '@/store/store'
import Router from 'vue-router'
import Login from '@/components/Login'
import Regist from '@/components/Regist'
import Home from '@/components/Home'
import Blog from '@/components/Blog'
import NewBlog from '@/components/NewBlog'
import EditBlog from '@/components/EditBlog'
import AllBlogs from '@/components/AllBlogs'
import ManageBlogs from '@/components/ManageBlogs'
import ManageABlog from '@/components/ManageABlog'
import MyComments from '@/components/MyComments'
import ERROR404 from '@/components/404'

Vue.use(Router)

var whiteList = ['/login', '/regist']

export const constantRouter =
[
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录博客'
      // isLogin: false
    }
  },
  {
    path: '/regist',
    name: 'Regist',
    component: Regist,
    meta: {
      title: '注册帐号'
      // isLogin: false
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '博客主页'
      // isLogin: true
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '博客主页'
      // isLogin: true
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: {
      title: '博客内容'
    }
  },
  {
    path: '/newblog',
    name: 'NewBlog',
    component: NewBlog,
    meta: {
      title: '新博客'
    }
  },
  {
    path: '/editblog',
    name: 'EditBlog',
    component: EditBlog,
    meta: {
      title: '编辑博客'
    }
  },
  {
    path: '/allblogs',
    name: 'AllBlogs',
    component: AllBlogs,
    meta: {
      title: '博客园'
    }
  },
  {
    path: '/mycomments',
    name: 'MyComments',
    component: MyComments,
    meta: {
      title: '我的评论'
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: ERROR404,
    meta: {
      title: 'NotFound'
    }
  }
]

var router = new Router({
  mode: 'history',
  routes: constantRouter
})

function addRouters (to, next) {
  if (store.getters.isLogin) { // 判断是否登录
    if (whiteList.indexOf(to.path) !== -1) {
      Vue.prototype.$message('请先退出登录')
      const roles = store.getters.roles
      if (!roles || roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        Vue.prototype.$http.get('http://localhost:3000/api/getinfo').then(
          res => { // 拉取info
            const roles = res.data.roles
            store.commit('setRoles', roles)
            store.dispatch('GenerateRoutes', roles).then(() => { // 生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              if (to.path === '/home' || to.path === '/') {
                document.title = '博客主页'
                next()
              } else {
                // document.title = to.meta.title
                next(to.fullPath)
              }
            })
          }
          ,
          err => {
            console.log(err)
            store.commit('userStatus', null)
            document.title = '登录博客'
            next('/login')
          })
      } else {
        document.title = '博客主页'
        next('/home')
      }
      // next('/home')
    } else {
      const roles = store.getters.roles
      if (!roles || roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        Vue.prototype.$http.get('http://localhost:3000/api/getinfo').then(
          res => { // 拉取info
            const roles = res.data.roles
            store.commit('setRoles', roles)
            store.dispatch('GenerateRoutes', roles).then(() => { // 生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              if (to.path === '/home' || to.path === '/') {
                document.title = '博客主页'
                next()
              } else {
                // document.title = to.meta.title
                next(to.fullPath)
              }
            })
          }
          ,
          err => {
            if (to.path === '/home' || to.path === '/') {
              document.title = '博客主页'
              next()
            } else {
              // document.title = to.meta.title
              next(to.fullPath)
            }
            console.log(err)
          })
      } else {
        document.title = to.meta.title
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      if (to.meta.title) {
        document.title = to.meta.title
      }
      next()
    } else {
      Vue.prototype.$message('请先登录')
      document.title = '登录博客'
      next('/login') // 否则全部重定向到登录页
    }
  }
}

router.beforeEach((to, from, next) => {
  if (!store.getters.isLogin && localStorage.getItem('UserName')) {
    Vue.prototype.$http.post('http://localhost:3000/api/checkstate', {username: localStorage.getItem('UserName')}).then(
      res => {
        if (res.data.isLogin)store.dispatch('SetUser', localStorage.getItem('UserName'))
        else store.dispatch('SetUser', null)
        addRouters(to, next)
      },
      err => {
        store.dispatch('SetUser', null)
        document.title = '登录博客'
        next('/login')
        console.log(err)
      }
    )
  } else next()
  // } else addRouters(to, next)
})

router.afterEach(route => {
  window.scroll(0, 0)
})

export default router

export const asyncRouterMap = [
  {
    path: '/manageblogs',
    component: ManageBlogs,
    name: 'manageblogs',
    meta: {role: ['admin'], title: '管理博客'}
  },
  {
    path: '/manageablog',
    component: ManageABlog,
    name: 'manageablog',
    meta: {role: ['admin'], title: '管理博客'}
  },
  { path: '*', redirect: '/404', meta: {role: ['all']}, hidden: true }
]
