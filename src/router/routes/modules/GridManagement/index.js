/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-28 14:28:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-30 11:30:02
 */
import { Layout } from 'src/router/constant'

const route = {
	path: '/grid',
	component: Layout,
	redirect: '/grid/management',
	meta: {
		title: '网格化管理',
		icon: 'icon-wanggeshitu'
	},
	children: [
		{
			path: 'management',
			name: 'GridManagement',
			component: () => import('src/views/GridManagement/index.vue'),
			meta: {
				title: '网格管理',
				code: 100001
			}
		},
		{
			path: 'record',
			name: 'GridRecord',
			component: () => import('src/views/GridRecord/index.vue'),
			meta: {
				title: '网格变更记录',
				code: 100002
			}
		}
	]
}

export default {
	order: 1,
	route
}