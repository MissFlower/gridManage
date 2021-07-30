/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 11:01:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-30 10:42:33
 */
import { createApp } from 'vue'
import App from './App.vue'
// import 'default-passive-events'
import 'src/styles/index.scss'
import 'src/styles/tailwind.css'

import { router, setupRouter } from 'src/router'
import { setupStore } from 'src/store'
import { setupRouterGuard } from 'src/router/guard'
import { registerGlobComp } from 'src/components/registerGlobComp'
import { setupGlobDirectives } from '/@/directives'

if (import.meta.env.DEV) {
	import('ant-design-vue/dist/antd.css')
}

const bootstrap = async () => {
	const app = createApp(App)

	// configure store
	setupStore(app)

	// configure router
	setupRouter(app)

	// register global components
	registerGlobComp(app)

	// router-guard
	setupRouterGuard(router)

	// Register global directive
	setupGlobDirectives(app)

	// Mount when the route is ready
	await router.isReady()

	app.mount('#app')
}
bootstrap()
