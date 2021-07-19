/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-19 15:36:36
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-19 15:40:49
 */
import compressPlugin from 'vite-plugin-compression'

export function configCompressPlugin(compress, deleteOriginFile = false) {
	const compressList = compress.split(',')
	const plugins = []

	if (compressList.includes('gzip')) {
		plugins.push(
			compressPlugin({
				ext: '.gz',
				deleteOriginFile
			})
		)
	}

	if (compressList.includes('brotli')) {
		plugins.push(
			compressPlugin({
				ext: '.br',
				algorithm: 'brotliCompress',
				deleteOriginFile
			})
		)
	}

	return plugins
}
