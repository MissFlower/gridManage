/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-27 16:46:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-27 16:48:43
 */
/**
 * Configure and register global directives
 */
import { setupPermissionDirective } from './permission'

export function setupGlobDirectives(app) {
	setupPermissionDirective(app)
}
