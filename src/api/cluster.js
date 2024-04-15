import {API_CONFIG} from '../config/index.js'
import request from './index.js'


export const getClusterListHandler = () =>{
    // console.log('集群列表')
    return request(API_CONFIG.getClusterListApi,{},'get',2000)
}

export const getClusterHandler = (id) =>{

    return request(API_CONFIG.getClusterApi,{id},'get',2000)
}

export const delClusterHandler = (clusterid) =>{
     console.log('删除集群：',clusterid)
    return request(API_CONFIG.deleteClusterApi,{clusterid},'get',2000)
}

export const addClusterHandler = (data) =>{
    console.log("添加集群",data)
   return request(API_CONFIG.addClusterApi,data,'post',2000)
}


export const updateClusterHandler = (data) =>{
    console.log("更新集群",data)
    return request(API_CONFIG.updateClusterApi,data,'post',2000)
 }

