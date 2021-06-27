/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-26 13:56:26
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-26 23:59:41
 */
import { Modal, notification } from 'ant-design-vue'
import settings from 'src/settings'

/**
 * 路由切换时是否关闭消息实例
 * @param router
 */
export function createMessageGuard(router) {
	const { closeMessageOnSwitch } = settings
	router.beforeEach(async () => {
		try {
			if (closeMessageOnSwitch) {
				Modal.destroyAll()
				notification.destroy()
			}
		} catch (error) {
			console.warn('message guard error:' + error)
		}
		return true
	})
}
