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
  return axios.post('/login',params)
}

export const menus=params=>{
  return axios.get(joinObj('/menus',params))
}

export const users=params=>{
  return axios.get(joinObj('/users',params))
}

export const userStateChange=params=>{
  return axios.put(`/changeUser/${params.id}/${params.mg_state}`)
}

export const addOneUser=params=>{
  return axios.post('/addUser',params)
}

export const getOneUser=params=>{
  return axios.get('/getUserById/'+params)
}

export const editOneUser=(id,params)=>{
  return axios.put(`/editOneUser/${id}`,params)
}

export const deleteOneUser=(params)=>{
  return axios.delete(`/deleteUserById/${params}`)
}