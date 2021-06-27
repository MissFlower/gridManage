/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 17:52:09
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-26 21:36:15
 */
import { Layout, REDIRECT_NAME } from 'src/router/constant'
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
		path: '/redirect',
		name: REDIRECT_NAME,
		component: Layout,
		hidden: true,
		children: [
			{
				path: '/redirect/:path(.*)',
				name: REDIRECT_NAME,
				component: () => import('src/views/System/Redirect/index.vue'),
				meta: {
					title: REDIRECT_NAME,
					breadcrumb: false
				}
			}
		]
	},
	{
		path: '/:path(.*)*',
		redirect: '/404',
		hidden: true
	}
]
export default basic
