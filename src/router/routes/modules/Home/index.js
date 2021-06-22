/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 18:05:56
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 18:12:32
 */
import { Layout } from 'src/router/constant'

const home = {
	path: '/',
	name: 'Home',
	component: Layout,
	redirect: '/home',
	children: [
		{
			path: 'home',
			name: 'Home1',
			component: () => import('/@/components/HelloWorld.vue'),
			meta: {
				title: '首页',
				icon: 'ion:grid-outline'
			}
		}
	]
}

export default home
