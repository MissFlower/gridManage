/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 18:06:03
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-24 11:32:52
 */
import { Layout } from 'src/router/constant'

const route = {
	path: '/about',
	component: Layout,
	children: [
		{
			path: '',
			name: 'About',
			component: () => import('src/views/About/index.vue'),
			meta: {
				title: 'About',
				icon: 'iconsafetycertificate',
				noCache: true
			}
		}
	]
}

export default {
	orderNo: 100,
	route
}
