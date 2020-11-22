// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {getAuth} from "@/api/role";

const axios = require('axios')
// 设置反向代理，前端请求默认发送到 http://localhost:8443/api
axios.defaults.baseURL = 'http://localhost:8443/api'
axios.defaults.timeout = 2000
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios

Vue.config.productionTip = false
axios.defaults.withCredentials = true

Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
    console.log('beforeEach')
    if (to.meta.requireAuth) {
      let username = store.state.role.username
      if (username) {
        getAuth().then(resp => {
          if (resp) {
            let role = resp.data.data
            store.commit('updateRoleType', role.roleType)
            console.log('authGet resp: ' + role.roleType)
            next()
          }
        }).catch(failResp => {
          console.log('fail in beforeEach :' + failResp.message)
        })
      } else {
        next({
          name: 'Login',
          query: {redirect: to.fullPath}
        })
      }
    } else {
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
