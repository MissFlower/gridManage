/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 17:42:00
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-26 23:29:23
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
const originalPush = router.push
router.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(app, location, onResolve, onReject)
	console.log('push')
	return originalPush.call(app, location).catch(err => err)
}

// config router
export function setupRouter(app) {
	app.use(router)
}
