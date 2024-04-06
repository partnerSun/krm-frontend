const Layout = () => import('../views/layout/Layout.vue')
// const userAdd = () => import('../views/user/Add.vue')
const clusterList = () => import('../views/cluster/List.vue')


export const clusterRoutes = {

        path: '/cluster/', 
        component: Layout,
        redirect: "/cluster/list",
        children: [
            // {path: 'add', component: userAdd},
            {path: 'list', component: clusterList},
        ]


}