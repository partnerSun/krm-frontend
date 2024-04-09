const Layout = () => import('../views/layout/Layout.vue')
// const userAdd = () => import('../views/user/Add.vue')
const clusterList = () => import('../views/cluster/List.vue')

const nodeList = () => import('../views/cluster/NodeList.vue')

export const clusterRoutes = {
        path: '/cluster/', 
        component: Layout,
        redirect: "/cluster/list",
        children: [
            // {path: 'add', component: userAdd},
            {path: 'list', component: clusterList},
        ]

}

export const nodeRoutes = {
    path: '/node/', 
    component: Layout,
    redirect: "/node/list",
    children: [
        // {path: 'add', component: userAdd},
        {path: 'list', component: nodeList},
    ]

}