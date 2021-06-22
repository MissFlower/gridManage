/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 18:06:03
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 18:12:06
 */
import { Layout } from 'src/router/constant'

const about = {
	path: '/about',
	name: 'About',
	component: Layout,
	children: [
		{
			path: 'index',
			name: 'Index',
			component: () => import('/@/components/HelloWorld.vue'),
			meta: {
				title: '关于',
				icon: 'simple-icons:about-dot-me'
			}
		}
	]
}

export default about
