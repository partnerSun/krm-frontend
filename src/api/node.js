import {API_CONFIG} from '../config/index.js'
import request from './index.js'

//  获取某个集群下的节点列表，该后端接口并没有实现此需求
export const getNodeListHandler = (clusterId) =>{
    console.log("获取%s集群下的节点信息",clusterId)
    return request(API_CONFIG.getNodeListApi,{clusterId},'get',2000)
}


//  获取某个集群下的节点列表，该后端接口并没有实现此需求
export const updateNodeHandler = (clusterId,name,labels,taints) =>{
    console.log("更新%s集群下的节点信息",clusterId)
    return request(API_CONFIG.updateNodeApi,{clusterId,name,labels,taints},'post',2000)
}