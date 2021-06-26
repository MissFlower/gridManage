/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-26 14:05:01
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-26 17:53:17
 */
import { store } from 'src/store'
import { getToken } from 'src/utils/cookie'
import { message } from 'ant-design-vue'
const whitePathList = ['/login']

export function createPermissionGuard(router) {
	router.beforeEach(async (to, from, next) => {
		// 判断用户是否登录
		const hasToken = getToken()

		if (hasToken) {
			// 登录状态
			console.log(to.path)
			if (to.path === '/login') {
				next({ path: '/' })
			} else {
				const addRoutes = store.getters.addRoutes.length
				if (addRoutes) {
					next()
				} else {
					try {
						// 获取用户信息
						await store.dispatch('user/getUserInfo')
						// 获取权限路由
						const accessRoutes = await store.dispatch('permission/generateRoutes')
						accessRoutes.forEach(route => {
							router.addRoute(route)
						})
						console.log({ ...to, replace: true })
						next({ ...to, replace: true })
					} catch (error) {
						// 清除token重新登录
						await store.dispatch('user/resetToken')
						message.error(error || 'Has Error')
						next(`/login?redirect=${to.path}`)
					}
				}
			}
		} else {
			// 白名单通行
			if (whitePathList.includes(to.path)) {
				next()
			} else {
				next(`/login?redirect=${to.path}`)
			}
		}
	})
}
