/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 18:05:56
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-26 17:31:19
 */
import { Layout } from 'src/router/constant'

const route = [
	{
		path: '/',
		component: Layout,
		redirect: '/home',
		children: [
			{
				path: '/home',
				name: 'Home',
				component: () => import('src/views/home/index.vue'),
				meta: {
					title: '首页',
					icon: 'iconhome'
				}
			}
		]
	},
	{
		path: '/documentation',
		component: Layout,
		children: [
			{
				path: 'index',
				name: 'Documentation',
				component: () => import('src/views/Documentation/index.vue'),
				meta: {
					title: 'Documentation',
					icon: 'iconfileprotect',
					affix: true
				}
			}
		]
	},
	{
		path: '/guide',
		component: Layout,
		// alwaysShow: true,
		// meta: {
		//   title: '导航',
		//   icon: 'iconteam'
		// },
		redirect: '/guide/index',
		children: [
			{
				path: 'index',
				name: 'Guide',
				component: () => import('src/views/Guide/index.vue'),
				meta: {
					title: 'Guide',
					icon: 'iconteam',
					noCache: true
				}
			}
		]
	},
	{
		path: '/charts',
		component: Layout,
		name: 'Charts',
		redirect: '/charts/keyboardChart',
		meta: {
			title: 'Charts',
			icon: 'iconbarchart',
			code: '002'
		},
		children: [
			{
				path: 'keyboardChart',
				name: 'KeyboardChart',
				component: () => import('src/views/KeyboardChart/index.vue'),
				meta: { title: 'Keyboard Chart', noCache: true, code: '002001' }
			},
			{
				path: 'lineChart',
				name: 'LineChart',
				component: () => import('src/views/LineChart/index.vue'),
				meta: { title: 'Line Chart', noCache: true, code: '002002' }
			},
			{
				path: 'mixChart',
				name: 'MixChart',
				component: () => import('src/views/MixChart/index.vue'),
				meta: { title: 'Mix Chart', noCache: true, code: '002003' }
			}
		]
	},
	{
		path: '/menu',
		name: 'Menu',
		component: Layout,
		redirect: '/menu/menu1',
		meta: { title: 'menu', icon: 'iconalert' },
		children: [
			{
				path: 'menu1',
				name: 'Menu1',
				component: () => import('/@/views/Menu/index.vue'),
				meta: { title: 'menu1', icon: 'iconalert' },
				children: [
					{
						path: 'menu1-1',
						name: 'Menu1-1',
						// redirect: '/menu/menu1/menu1-1/menu1-1-1',
						component: () => import('/@/views/Menu/index.vue'),
						meta: { title: 'menu1-1', icon: 'iconalert' },
						children: [
							{
								path: 'menu1-1-1',
								name: 'Menu1-1-1',
								component: () => import('/@/views/Menu/index.vue'),
								meta: { title: 'menu1-1-1', icon: 'iconalert' }
							},
							{
								path: 'menu1-1-2',
								name: 'Menu1-1-2',
								component: () => import('/@/views/Menu/index.vue'),
								meta: { title: 'menu1-1-2', icon: 'iconalert' }
							}
						]
					},
					{
						path: 'menu1-2',
						name: 'Menu1-2',
						component: () => import('/@/views/Menu/index.vue'),
						meta: { title: 'menu1-2', icon: 'iconalert' }
					}
				]
			},
			{
				path: 'menu2',
				name: 'Menu2',
				component: () => import('/@/views/Menu/index.vue'),
				meta: { title: 'menu2', icon: 'iconalert' }
			}
		]
	}
]
export default {
	order: 1,
	route
}
