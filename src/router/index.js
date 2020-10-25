import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/page/Login.vue'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login,name:'Login'},
  {path:'/home',component:()=>import('../page/Home'),name:'Home',children:[
    {path:'/welcome',component:()=>import('../page/Welcome'),name:'Welcome'},
    {path:'/users',component:()=>import('../page/Users'),name:'Users'},
    {path:'/rights',component:()=>import('../page/Rights'),name:'Rights'},
    {path:'/roles',component:()=>import('../page/Roles'),name:'Roles'},
    {path:'/categories',component:()=>import('../page/GoodCates'),name:'GoodCate'},
  ],redirect:'/welcome'}
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  // console.log(to);
  if(to.path==='/login') return next()
  let token=sessionStorage.getItem('token')
  if(!token){
    return next('/login')
  }
  next()
})

export default router
