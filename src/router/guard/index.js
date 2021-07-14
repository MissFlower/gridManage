/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-26 13:56:12
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-27 00:20:00
 */
import { router } from 'src/router'
import { createPermissionGuard } from './permissionGuard'
import { createMessageGuard } from './messageGuard'

export function setupRouterGuard() {
	createPermissionGuard(router)
	createMessageGuard(router)
}