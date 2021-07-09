/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 17:42:00
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-09 13:19:15
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { basicRoutes, LoginRoute, RootRoute } from './routes'
import { REDIRECT_NAME } from './constant'

const WHITE_NAME_LIST = [LoginRoute.name, RootRoute.name, REDIRECT_NAME]

// app router
export const router = createRouter({
	history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
	routes: basicRoutes,
	scrollBehavior: () => ({
		left: 0,
		top: 0
	})
	// strict: true
})

// reset router
export function resetRouter() {
	router.getRoutes().forEach(route => {
		const { name } = route
		if (name && !WHITE_NAME_LIST.includes(name)) {
			console.log(name)
			router.hasRoute(name) && router.removeRoute(name)
		}
	})
	console.log(router.getRoutes())
}

// config router
export function setupRouter(app) {
	app.use(router)
}
