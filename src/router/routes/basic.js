/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 17:52:09
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-24 18:31:59
 */
import { REDIRECT_NAME } from 'src/router/constant'
const basic = [
	{
		path: '/login',
		name: 'Login',
		component: () => import('src/views/System/Login/index.vue'),
		hidden: true,
		meta: {
			title: '登录'
		}
	},
	{
		path: '/403',
		component: () => import('src/views/System/ErrorPage/403.vue'),
		hidden: true
	},
	{
		path: '/404',
		component: () => import('src/views/System/ErrorPage/404.vue'),
		hidden: true
	},
	{
		path: '/:path(.*)*',
		redirect: '/404',
		hidden: true
	},
	{
		path: '/redirect/:path(.*)',
		name: REDIRECT_NAME,
		hidden: true,
		component: () => import('src/views/System/ErrorPage/404.vue'),
		meta: {
			title: REDIRECT_NAME,
			breadcrumb: false
		}
	}
]
export default basic
