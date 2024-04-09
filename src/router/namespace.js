const Layout = () => import('../views/layout/Layout.vue')
// const userAdd = () => import('../views/user/Add.vue')
const NamespaceList = () => import('../views/namespace/List.vue')



export const namespaceRoutes = {
        path: '/Namespace/', 
        component: Layout,
        redirect: "/Namespace/list",
        children: [
            // {path: 'add', component: userAdd},
            {path: 'list', component: NamespaceList},
        ]

}

