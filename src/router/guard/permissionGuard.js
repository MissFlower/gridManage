/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-26 14:05:01
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-07 16:42:16
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
			if (to.path === '/login') {
				next({ path: '/' })
			} else {
				const menuList = store.getters.menuList?.length
				const userId = store.getters.userInfo.userId
				if (userId || menuList.length) {
					next()
				} else {
					try {
						// 获取用户信息
						await store.dispatch('user/getUserInfo')
						// 获取权限路由
						const permissionList = await store.dispatch('user/getMenuList')
						const accessRoutes = await store.dispatch('permission/generateRoutes', permissionList)
						accessRoutes.forEach(route => {
							router.addRoute(route)
						})
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
