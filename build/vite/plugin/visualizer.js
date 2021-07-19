/*
 * @Description: 包文件卷分析
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-19 14:05:46
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-19 14:11:29
 */
import visualizer from 'rollup-plugin-visualizer'
import { isReportMode } from '../../utils'

export function configVisualizerConfig() {
	if (isReportMode()) {
		return visualizer({
			filename: './node_modules/.cache/visualizer/stats.html',
			open: true,
			gzipSize: true,
			brotliSize: true
		})
	}
	return []
}
