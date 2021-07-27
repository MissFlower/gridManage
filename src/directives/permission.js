/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-27 16:49:05
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-27 17:05:41
 */
import { store } from 'src/store'
const btnPermissionList = store.getters.buttonList

function hasPermission(code) {
	return btnPermissionList.includes(code)
}
function isAuth(el, binding) {
	const value = binding.value
	if (!value) return
	if (!hasPermission(value)) {
		el.parentNode?.removeChild(el)
	}
}

const mounted = (el, binding) => {
	isAuth(el, binding)
}

const authDirective = {
	mounted
}

export function setupPermissionDirective(app) {
	app.directive('p', authDirective)
}

export default authDirective
