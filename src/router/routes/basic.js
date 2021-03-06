/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 17:52:09
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-03 10:53:52
 */
import { Layout, REDIRECT_NAME } from 'src/router/constant'
export const PAGE_ERROR_ROUTES = [
	{
		path: '/system',
		component: Layout,
		hidden: true,
		children: [
			{
				path: '403',
				name: 'Error403',
				component: () => import('src/views/System/ErrorPage/403.vue'),
				meta: {
					hideTab: true
				}
			}
		]
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
	}
]

export const REDIRECT_ROUTE = {
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
				hideTab: true
			}
		}
	]
}
