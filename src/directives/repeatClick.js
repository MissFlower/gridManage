/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-27 17:24:14
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-27 17:24:55
 */
import { on, once } from 'src/utils/dom'

const repeatDirective = {
	beforeMount(el, binding) {
		let interval = null
		let startTime = 0
		const handler = () => binding?.value()
		const clear = () => {
			if (Date.now() - startTime < 100) {
				handler()
			}
			interval && clearInterval(interval)
			interval = null
		}

		on(el, 'mousedown', e => {
			if (e.button !== 0) return
			startTime = Date.now()
			once(document, 'mouseup', clear)
			interval && clearInterval(interval)
			interval = setInterval(handler, 100)
		})
	}
}

export default repeatDirective
