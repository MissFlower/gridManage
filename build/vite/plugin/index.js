/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 13:35:40
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-19 15:53:07
 */
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

import { configHtmlPlugin } from './html'
import { configStyleImportPlugin } from './styleImport'
import { configVisualizerConfig } from './visualizer'
import { configCompressPlugin } from './compress'

export function createVitePlugins(viteEnv, isBuild) {
	const { VITE_LEGACY, VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv
	const vitePlugins = [
		// 解析vue template组件
		vue(),
		// 解析vueJsx组件
		vueJsx()
	]
	// @vitejs/plugin-legacy
	VITE_LEGACY && isBuild && vitePlugins.push(legacy())

	// vite-plugin-html
	vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

	// vite-plugin-style-import
	vitePlugins.push(configStyleImportPlugin(isBuild))

	// rollup-plugin-visualizer
	vitePlugins.push(configVisualizerConfig())

	if (isBuild) {
		// rollup-plugin-gzip
		vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE))
	}

	return vitePlugins
}
