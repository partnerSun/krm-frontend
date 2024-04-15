
const BASE_URL = import.meta.env.VITE_BASE_URL
console.log("base url",BASE_URL)
export const API_CONFIG  = {
    // loginApi: "https://mock.mengxuegu.com/mock/65cf63a8351bbd02cf3398ab/api/auth/login",
    loginApi: `${BASE_URL}/auth/login`,
    logoutApi: "https://mock.mengxuegu.com/mock/65cf63a8351bbd02cf3398ab/api/auth/logout",
    userListApi: "https://mock.mengxuegu.com/mock/65d498da351bbd02cf339bad/vueapi/user/list",
    userDelApi: "https://mock.mengxuegu.com/mock/65d498da351bbd02cf339bad/vueapi/user/delete",
    userAddApi: "https://mock.mengxuegu.com/mock/65d498da351bbd02cf339bad/vueapi/user/add",
    userUpdateApi: "https://mock.mengxuegu.com/mock/65d498da351bbd02cf339bad/vueapi/user/update",
    getClusterListApi: `${BASE_URL}/cluster/list`,
    getClusterApi: `${BASE_URL}/cluster/get `,
    addClusterApi: `${BASE_URL}/cluster/add`,
    updateClusterApi: `${BASE_URL}/cluster/update`,
    deleteClusterApi: `${BASE_URL}/cluster/delete`,
    // 节点
    getNodeListApi: `${BASE_URL}/node/list`,
    updateNodeApi: `${BASE_URL}/node/update`,
    // ns
    getNamespaceListApi: `${BASE_URL}/namespace/list`,
    addNamespaceApi: `${BASE_URL}/namespace/create`,
    updateNamespaceApi: `${BASE_URL}/namespace/update`,
    deleteNamespaceApi: `${BASE_URL}/namespace/delete`,
}

export const CONFIG = {
    TOKEN_NAME: "Authorization"
}