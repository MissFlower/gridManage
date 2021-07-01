/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 17:42:00
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-28 18:00:41
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { basicRoutes } from './routes'

const WHITE_NAME_LIST = []

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
	console.log('reset Router')
	router.getRoutes().forEach(route => {
		const { name } = route
		if (name && !WHITE_NAME_LIST.includes(name)) {
			router.hasRoute(name) && router.removeRoute(name)
		}
	})
}

// config router
export function setupRouter(app) {
	app.use(router)
}
