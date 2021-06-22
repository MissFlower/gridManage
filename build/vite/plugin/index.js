/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 13:35:40
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 13:42:15
 */
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import configStyleImportPlugin from './styleImport'

export function createVitePlugins(viteEnv, isBuild) {
	const vitePlugins = [
		// 解析vue template组件
		vue(),
		// 解析vueJsx组件
		vueJsx()
	]

	// vite-plugin-style-import
	vitePlugins.push(configStyleImportPlugin(isBuild))

	return vitePlugins
}
