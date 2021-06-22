/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 11:01:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 17:59:40
 */
import { createApp } from 'vue'
import App from './App.vue'
import 'src/styles/reset.scss'

import { router, setupRouter } from 'src/router'

const bootstrap = async () => {
	const app = createApp(App)

	// configure router
	setupRouter(app)

	await router.isReady()

	app.mount('#app')
}
bootstrap()
