/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 13:35:40
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-29 11:49:21
 */
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import configStyleImportPlugin from './styleImport'

import { configHtmlPlugin } from './html'

export function createVitePlugins(viteEnv, isBuild) {
	const vitePlugins = [
		// 解析vue template组件
		vue(),
		// 解析vueJsx组件
		vueJsx()
	]

	// vite-plugin-style-import
	vitePlugins.push(configStyleImportPlugin(isBuild))

	// vite-plugin-html
	vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

	return vitePlugins
}
