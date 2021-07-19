/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-19 16:00:11
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-19 18:05:30
 */

import SvgIconsPlugin from 'vite-plugin-svg-icons'
import path from 'path'

export function configSvgIconsPlugin(isBuild) {
	const svgIconsPlugin = SvgIconsPlugin({
		iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
		svgoOptions: isBuild,
		// default
		symbolId: 'icon-[dir]-[name]'
	})
	return svgIconsPlugin
}
