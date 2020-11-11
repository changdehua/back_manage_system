import instance from '../axios';
import axios from '../axios';

function joinObj(url,params){
  let str='?'
  if(!(params instanceof Object)){
    str=''
  }

  for(let key in params){
    str+=`&${key}=${params[key]}`
  }

  return url+str
}



export const login=params=>{
  return axios.post('login',params)
}

export const menus=params=>{
  return axios.get(joinObj('menus',params))
}

// export const users=params=>{
//   return axios.get(joinObj('users',params))
// }
export const users=params=>{
  return axios.get('users',{params:params})
}

export const userStateChange=params=>{
  return axios.put(`changeUser/${params.id}/${params.mg_state}`)
}

export const addOneUser=params=>{
  return axios.post('addUser',params)
}

export const getOneUser=params=>{
  return axios.get('getUserById/'+params)
}

export const editOneUser=(id,params)=>{
  return axios.put(`editOneUser/${id}`,params)
}

export const deleteOneUser=(params)=>{
  return axios.delete(`/deleteUserById/${params}`)
}

export const getAllRights=(params)=>{
  return axios.get(`getAllRights/${params}`)
}

export const getAllRoles=(params)=>{
  return axios.get(`getAllRoles`)
}


export const getAllCates=(params)=>{
  return axios.get(`getGoodCates`,{params:params})
}

export const getParentCates=(params)=>{
  return axios.get(`getParentsCates`,{params:params})
}

export const getCateByIdAndType=(params)=>{
  return axios.get(`getCate/${params.id}/${params.type}`)
}

export const getGoods=(params)=>{
  return axios.get(`goods`,{params:params})
}

export const getCateAttrs=(params)=>{
  return axios.get(`cate/${params.id}/attrs`)
}

export const getCateProps=(params)=>{
  return axios.get(`cate/${params.id}/props`)
}

export const getOrders=(params)=>{
  return axios.get(`orders`,{params:params})
}

export const getproCities=(params)=>{
  return axios.get(`proCities`,{params:params})
}


export const getLogistics=(params)=>{
  return axios.get(`logistics/${params.id}`)
}


export const getReports=(params)=>{
  return axios.get(`report`)
}