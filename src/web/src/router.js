import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Login = () => import('./views/login/Login.vue')
const Home = () => import('./views/home/Home.vue')
const Welcome = () => import('./views/home/Welcome.vue')
const Users = () => import('./views/system/users')
const Roles = () => import('./views/system/roles')
const Rights = () => import('./views/system/rights')
const Employees = () => import('./views/system/employees')
const Orgs = () => import('./views/system/orgs')

const Warehouse = () => import('./views/warehouse/warehouse')
const Region = () => import('./views/warehouse/region')

const Cabinets = () => import('./views/cabinet/cabinet')
const CabinetsRow = () => import('./views/cabinet/row')
const CabinetsColumn = () => import('./views/cabinet/column')

const routes = [
    {
        path: '/',
        redirect: "/login"
    },
    {
        path: '/login',
        component: Login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/home',
        component: Home,
        redirect: "/home/welcome",
        children: [
            // 系统管理相关页面：
            {
                path: "welcome",
                component: Welcome,
                meta: {
                    title: '首页'
                }
            },
            {
                path: "/system/users",
                component: Users,
                meta: {
                    title: '用户管理'
                }
            },
            {
                path: "/system/roles",
                component: Roles,
                meta: {
                    title: '角色管理'
                }
            },
            {
                path: "/system/rights",
                component: Rights,
                meta: {
                    title: '权限管理'
                }
            },
            {
                path: "/system/orgs",
                component: Orgs,
                meta: {
                    title: '组织管理'
                }
            },
            {
                path: "/system/employees",
                component: Employees,
                meta: {
                    title: '员工管理'
                }
            },
            // 库房管理相关页面
            {
                path: "/warehouse/warehouses",
                component: Warehouse,
                meta: {
                    title: '库房管理'
                }
            },
            {
                path: "/warehouse/regions",
                component: Region,
                meta: {
                    title: '区域管理'
                }
            },
            {
                path: "/cabinet/cabinets",
                component: Cabinets,
                meta: {
                    title: '柜子管理'
                }
            },
            {
                path: "/cabinet/rows",
                component: CabinetsRow,
                meta: {
                    title: '柜子层数'
                }
            },
            {
                path: "/cabinet/columns",
                component: CabinetsColumn,
                meta: {
                    title: '柜子格子'
                }
            },
        ]
    }
]

const router = new Router({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const token = window.sessionStorage.getItem("token")
    if (!token) return next('/login')
    // 为导航页面设置标题：
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

export default router