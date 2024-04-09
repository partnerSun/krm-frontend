import {createWebHashHistory,createRouter} from 'vue-router'
import {CONFIG} from '../config/index.js'
import {userRoutes} from './user.js'
import {clusterRoutes,nodeRoutes} from './cluster.js'
import { namespaceRoutes } from './namespace.js'




//定义懒加载路由
const Login = () => import('../views/Login.vue');
// const Index = () => import('../views/Index.vue');
const Layout = () => import('../views/layout/Layout.vue')
// 2. 定义一些路由
const routes = [
    { path: '/login', component: Login },
    { path: '/', component: Layout },
    userRoutes,
    clusterRoutes,
    nodeRoutes,
    namespaceRoutes
]

// 3. 创建路由实例 并传递 `routes` 配置
const router = createRouter({
    // 使用 hash 模式。
    history: createWebHashHistory(),
    routes: routes,
  })

//全局守卫：实现页面未登录的请求拦截
  router.beforeEach((to, from, next) => {
    //1. to.path == login, 没有携带token, next()
    //2. to.path == login, 携带token, next('/')
    //3. to.path != login, 携带token, next('')
    //4. to.path != login, 没有携带token,next('login')
    //获取访问路径
    const toPath = to.path
    //判断是否有token
    const tokenStatus = window.localStorage.getItem(CONFIG.TOKEN_NAME)
    // console.log("前置守卫-访问路径：",toPath)
    // console.log("前置守卫-token：",tokenStatus)
    if (toPath  === '/login' && tokenStatus == null){
      // 放行
      next()
    }else if (toPath  === '/login' && tokenStatus != null){
      next('/')
    }else if (toPath  !== '/login' && tokenStatus != null){
      next()
    }else if (toPath  !== '/login' && tokenStatus == null){
      next('/login')
    } else {
      next()
    }
  })

//4.导出
export default router
