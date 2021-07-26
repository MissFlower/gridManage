/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 18:03:13
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-26 10:45:52
 */
import { PAGE_ERROR_ROUTES, REDIRECT_ROUTE } from './basic'
const modules = import.meta.globEager('./modules/**/*.js')

const routeModuleList = []
const modList = Object.keys(modules).map(key => modules[key].default || {})

const sortModList = modList.sort((a, b) => {
	return (a.orderNo || 0) - (b.orderNo || 0)
})

sortModList.forEach(mod => {
	const route = mod.route || {}
	const routeList = Array.isArray(route) ? [...route] : [route]
	routeModuleList.push(...routeList)
})

export const RootRoute = {
	path: '/',
	name: 'Root',
	redirect: '/grid',
	hidden: true
}

export const LoginRoute = {
	path: '/login',
	name: 'Login',
	component: () => import('src/views/System/Login/index.vue'),
	hidden: true,
	meta: {
		title: '登录',
		hideTab: true
	}
}

// not found route
export const PAGE_NOT_FOUND_ROUTE = {
	path: '/:pathMatch(.*)*',
	name: '404NoFountPage',
	redirect: '/404',
	hidden: true
}

// Basic routing without permission
export const basicRoutes = [RootRoute, LoginRoute, REDIRECT_ROUTE, ...PAGE_ERROR_ROUTES]

// Async routing with permission
export const asyncRoutes = [...routeModuleList]
