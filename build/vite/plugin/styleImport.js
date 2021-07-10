/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 13:38:55
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-10 17:21:34
 */
/**
 * 按需引入组件库样式
 * https://github.com/anncwb/vite-plugin-style-import
 */
import styleImport from 'vite-plugin-style-import'

export function configStyleImportPlugin(isBuild) {
	if (!isBuild) {
		return []
	}

	const styleImportPlugin = styleImport({
		libs: [
			{
				libraryName: 'ant-design-vue',
				esModule: true,
				resolveStyle: name => {
					return `ant-design-vue/es/${name}/style/index.css`
				}
			}
		]
	})

	return styleImportPlugin
}
