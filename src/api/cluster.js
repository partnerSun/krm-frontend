import {API_CONFIG} from '../config/index.js'
import request from './index.js'


export const getClusterListHandler = () =>{

    return request(API_CONFIG.getClusterListApi,{},'get',2000)
}

export const getClusterHandler = (id) =>{

    return request(API_CONFIG.getClusterApi,{id},'get',2000)
}

export const delClusterHandler = (id) =>{
     console.log('删除集群：',id)
    return request(API_CONFIG.deleteClusterApi,{id},'post',2000)
}

export const addClusterHandler = (data) =>{
    console.log("添加集群",data)
   return request(API_CONFIG.addClusterApi,data,'post',2000)
}


export const updateClusterHandler = (data) =>{
    console.log("更新集群",data)
    return request(API_CONFIG.updateClusterApi,data,'post',2000)
 }

//  节点
export const getNodeListHandler = () =>{
    console.log("获取节点")
    return request(API_CONFIG.getNodeListApi,{},'get',2000)
}