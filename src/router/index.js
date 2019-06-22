import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/package_management/game_list',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/package_management',
    component: Layout,
    // redirect: '/example/table',
    name: 'Example',
    meta: { title: '打包管理', icon: 'example' },
    children: [
      {
        path: 'game_list',
        name: 'game',
        component: () => import('@/views/game_list/index'),
        meta: { title: '应用列表', icon: 'table',affix: true}
      },
      {
        path: 'mother_package_list',
        name: 'mother',
        component: () => import('@/views/mother_package_list/index'),
        meta: { title: '游戏母包列表', icon: 'table', }
      },
      {
        path: 'certificate_list',
        name: 'certificate',
        component: () => import('@/views/certificate_list/index'),
        meta: { title: '证书列表', icon: 'table' }
      },
      {
        path: 'channel_package_list',
        name: 'channel_package',
        component: () => import('@/views/channel_package_list/index'),
        meta: { title: '渠道包列表', icon: 'table' },
      },
      {
        path: 'channel_package_configuration',
        name: 'channel_package_configuration',
        component: () => import('@/views/channel_package_configuration/index'),
        meta: { title: '渠道包配置', icon: 'table' },
      },
      {
        path: 'configuration_template',
        name: 'configuration_template',
        component: () => import('@/views/configuration_template/index'),
        meta: { title: '渠道包配置模板', icon: 'table' },
      },
      {
        path: 'packing_list',
        name: 'packing',
        redirect: '/package_management/packing_list/mainPage',
        component: () => import('@/views/packing_list/index'),
        meta: { title: '打包列表', icon: 'table' },
        children: [
          {
            path: 'mainPage',
            name: 'mainPage',
            hidden: true,
            component: () => import('@/views/packing_list/compontents/main'),
            meta: { title: '打包列表', icon: 'table' },

          },
          {
            path: 'detailsPage',
            // name: 'detailsPage',
            hidden: true,
            component: () => import('@/views/packing_list/compontents/details'),
            // meta: { title: '配置参数', icon: 'table' },

          },
          {
            path: 'historyPage',
            // name:'historyPage',
            hidden: true,
            component: () => import('@/views/packing_list/compontents/history'),
            // meta: { title: '打包记录', icon: 'table' },

          }
        ]
      },
      // {
      //   path: 'packed_record_list',
      //   name: 'packed',
      //   component: () => import('@/views/packed_record_list/index'),
      //   meta: { title: '打包记录列表', icon: 'table' }
      // },
    ]
  }, { path: '*', redirect: '/404', hidden: true }
]

const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
// router.beforeEach((to, from, next) => {
//   // ...
//   console.log(to);
//   if (to.path === "/package_management/packing_list/detailsPage") {
//     const answer = window.confirm('当前页面数据未保存，确定要离开？')
//       if (answer) {
//           next()
//       } else {
//           next(false)
//       }
//   }else {
//     next()
//   }
// })
export default router
