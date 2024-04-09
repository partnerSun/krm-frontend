import {API_CONFIG} from '../config/index.js'
import request from './index.js'


export const getNamespaceListHandler = () =>{
    return request(API_CONFIG.getNamespaceListApi,{},'get',2000)
}

export const getNamespaceHandler = (id) =>{
    return request(API_CONFIG.getNamespaceApi,{id},'get',2000)
}

export const delNamespaceHandler = (name) =>{
     console.log('删除集群：',name)
    return request(API_CONFIG.deleteNamespaceApi,{name},'get',2000)
}

export const addNamespaceHandler = (data) =>{
    console.log("添加集群",data)
   return request(API_CONFIG.addNamespaceApi,data,'post',2000)
}


export const updateNamespaceHandler = (data) =>{
    console.log("更新集群",data)
    return request(API_CONFIG.updateNamespaceApi,data,'post',2000)
 }

