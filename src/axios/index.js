import axios from 'axios'
import router from '../router';
import Vue from 'vue';

const instance=axios.create({
  baseURL:'http://localhost:5000',
})


instance.interceptors.request.use(config=>{
  // console.log(config);
  const token=localStorage.getItem('token')||sessionStorage.getItem('token')
  if(config.url==='/login'){

  }else if(config.url!=='/login'){
    if(token){
      config.headers.Authorization =token;
    }else{
      router.push({'name':'Login'})
    }
  
  }
  return config
},
err=>{
  return Promise.reject(err)
}
)


instance.interceptors.response.use(res=>{
  switch(res.data.status){
    case 1:
      Vue.prototype.$message({
        message:res.data.msg,
        type:'error'
      })
      break;

    case 200:
      if(res.data.msg){
        Vue.prototype.$message({
          message:res.data.msg,
          type:'success'
        })  
      }
      break
  

  }
  return res.data
},
err=>{
  // console.log(err);
  Vue.prototype.$message({
    message:'服务器异常',
    type:"error"
  })

  // switch(err.response.status){
  //   case 401:
  //     router.push({'path':'/login'});
  //     break;
  //     case 404:
  //       Vue.prototype.$message({
  //         message:'地址不存在'
  //       })
  //       break;
  //     case 403:
  //       router.push({'name':'403'});
  //       break;
  //     case 500:
  //     Vue.prototype.$message({
  //       message:'服务器异常'
  //     })
  //     break;
  //   }

  return Promise.reject(err.response)
})


export default instance


