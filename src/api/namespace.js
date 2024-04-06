import {API_CONFIG} from '../config/index.js'
import request from './index.js'


export const getNamespaceListHandler = () =>{

    return request(API_CONFIG.getNamespaceListApi,{},'get',2000)
}

