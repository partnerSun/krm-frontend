import {API_CONFIG} from '../config/index.js'
import request from './index.js'

//封装的获取用户列表接口 不需要传参
export const getUserListHandler = () =>{
    /*
     {
        username: username,
        password: password
     }
     当键值名字一样时可简写为:
     {username,password}
    */ 
    return request(API_CONFIG.userListApi,{},'get',3000)
}

//封装删除用户的接口
export const delUserHandler = (id) =>{
     console.log('删除id：',id)
    return request(API_CONFIG.userDelApi,{id},'get',3000)
}

//封装添加用户的接口，传入一个object 用来包含要添加用户的信息
export const addUserHandler = (userForm) =>{
    console.log("添加用户")
   return request(API_CONFIG.userAddApi,userForm,'post',3000)
}

//封装编辑用户的接口
export const updateUserHandler = (userForm) =>{
    console.log("更新用户")
    return request(API_CONFIG.userUpdateApi,userForm,'post',3000)
 }