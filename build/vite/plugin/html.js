/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 11:08:24
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-14 16:12:43
 */
import html from 'vite-plugin-html'

// import pkg from '../../../package.json'
// import { GLOB_CONFIG_FILE_NAME } from '../../constant'

export function configHtmlPlugin(env, isBuild) {
	const { VITE_GLOB_APP_TITLE } = env
	// console.log(VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH)

	// const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`

	// const getAppConfigSrc = () => {
	// 	return `${path || '/'}${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`
	// }

	const htmlPlugin = html({
		minify: isBuild,
		inject: {
			// 将数据注入ejs模板
			injectData: {
				title: VITE_GLOB_APP_TITLE
			}
			// 生成app.config.js文件
			// tags: isBuild
			// 	? [
			// 			{
			// 				tag: 'script',
			// 				attrs: {
			// 					src: getAppConfigSrc()
			// 				}
			// 			}
			// 	  ]
			// 	: []
		}
	})

	return htmlPlugin
}
