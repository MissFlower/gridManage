/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 18:03:13
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-02 09:34:32
 */
import basicRoute from './basic'
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

// Basic routing without permission
export const basicRoutes = [...basicRoute, ...routeModuleList]
// Async routing with permission
export const asyncRoutes = [...routeModuleList]
// not found route
export const PAGE_NOT_FOUND_ROUTE = {
	path: '/:pathMatch(.*)*',
	redirect: '/404',
	hidden: true
}
