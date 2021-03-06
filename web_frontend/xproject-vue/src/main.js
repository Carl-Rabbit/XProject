// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import {getAuth} from "@/api/role";

const axios = require('axios')
// 设置反向代理，前端请求默认发送到 http://localhost:8443/api
axios.defaults.baseURL = 'http://localhost:8443/api'
axios.defaults.timeout = 5000
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios

Vue.prototype.$store = store

Vue.config.productionTip = false
axios.defaults.withCredentials = true

Vue.use(ElementUI, {locale})

router.beforeEach((to, from, next) => {
    console.log('beforeEach')
    if (to.meta.requireAuth) {
      let username = store.state.role.username
      if (username) {
        getAuth().then(resp => {
          if (resp.data.code !== 200) {
            console.log('fail in beforeEach, resp:')
            console.log(resp)
            return
          }
          let role = resp.data.data
          store.commit('updateRoleType', role.roleType)
          // console.log('>>> resp: ')
          // console.log(resp)
          // console.log('>>> resp.data.data: ')
          // console.log(role) // i.e. resp.data.data
          if (to.name === "HomePage" && role.roleType === "Admin") {
            next({name: "Role"})
          }
          console.log(to)
          if (to.fullPath.indexOf('/project/') !== -1) {
            if (to.params.proj_id == null) {
              next({name: 'HomePage'})
            }
            console.log('use proj_id=' + to.params.proj_id)
          }

          if (to.meta.roleType) {
            if (to.meta.roleType !== role.roleType) {
              // not correct role type
              return false
            }
          }
          next()

        }).catch(failResp => {
          if (failResp.message.indexOf('Network error') !== -1) {
            this.$alert('Error ' + failResp.message, 'Tips', {
              confirmButtonText: 'OK'
            })
            return false
          }
          console.log(failResp)
          store.commit('logout')
          next({
            name: 'Login',
            query: {redirect: to.fullPath}
          })
        })
      } else {
        console.log('fail in beforeEach :')
        next({
          name: 'Login',
          query: {redirect: to.fullPath}
        })
      }
    } else {
      if (store.state.role.username) {
        if (store.state.role.roleType === "Admin") {
          store.commit('removeProj')
          next({
            name: 'Role'
          })
        } else {
          store.commit('removeProj')
          next({
            name: 'HomePage'
          })
        }
      }
      next()
    }
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
})
