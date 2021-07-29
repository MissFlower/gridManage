/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 11:01:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-29 15:12:34
 */

import { loadEnv } from 'vite'
import { resolve } from 'path'
import { wrapperEnv } from './build/utils'
import { createProxy } from './build/vite/proxy'
import { createVitePlugins } from './build/vite/plugin'
import { OUTPUT_DIR } from './build/constant'

function pathResolve(dir) {
	return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default ({ command, mode }) => {
	const root = process.cwd()

	const env = loadEnv(mode, root)

	// 转换布尔值
	const viteEnv = wrapperEnv(env)
	const isBuild = command === 'build'

	const { VITE_PORT, VITE_PROXY, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE } = viteEnv

	return {
		base: VITE_PUBLIC_PATH,
		root,
		server: {
			// Listening on all local IPs
			host: true,
			open: true,
			port: VITE_PORT,
			// 从.env.development中加载环境配置
			proxy: createProxy(VITE_PROXY)
		},
		resolve: {
			alias: [
				{
					find: /\/@\//,
					replacement: pathResolve('src') + '/'
				},
				{
					find: 'src/',
					replacement: pathResolve('src') + '/'
				}
			]
		},
		build: {
			target: 'es2015',
			outDir: OUTPUT_DIR,
			terserOptions: {
				compress: {
					keep_infinity: true,
					// 生产环境删除console
					drop_console: VITE_DROP_CONSOLE
				}
			},
			// 关闭brotliSize显示可以稍微缩短打包时间
			brotliSize: true,
			// chunk 大小警告的限制（以 kbs 为单位）默认500
			chunkSizeWarningLimit: 2000
		},
		css: {
			preprocessorOptions: {
				scss: {
					// additionalData: `@import 'src/styles/reset.scss'` // 引用公共样式，使用vite搭建项目只安装sass即可，不需要安装node-sass,sass-loader
				}
			}
		},
		// 单独提取管理vite插件
		plugins: createVitePlugins(viteEnv, isBuild)
	}
}
