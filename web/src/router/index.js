import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Home from '../views/Home.vue'
import News from '../views/News.vue'
import Newdetail from '../views/NewsDetail.vue'
import Product from '../views/Product.vue'
import Model from '../views/ModelList.vue'
import TresJSLoad from '../views/3DTresJS.vue'


const routes = [
    {
      path:'/',
      name:'home',
      component:Home
    },
    {
      path:'/news',
      name:'news',
      component:News
    },
    {
      path:'/product',
      name:'product',
      component:Product
    },
    {
      path:'/news/:id',
      name:'new',
      component:Newdetail
    },
    {
      path:'/model',
      name:'model',
      component:Model
    },
    {
      path:'/model/:id',
      name:'modeldetail',
      component:TresJSLoad
    },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
//进度条
router.beforeEach((to,from,next)=>{
  NProgress.start();
  next()
})

router.afterEach(()=>{
  NProgress.done();
  
})
export default router
