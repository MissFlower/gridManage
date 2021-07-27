/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-27 16:19:33
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-27 16:20:05
 */
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core'
import { useDebounceFn } from '@vueuse/core'

export function useWindowSizeFn(fn, wait = 150, options) {
	let handler = () => {
		fn()
	}
	const handleSize = useDebounceFn(handler, wait)
	handler = handleSize

	const start = () => {
		if (options && options.immediate) {
			handler()
		}
		window.addEventListener('resize', handler)
	}

	const stop = () => {
		window.removeEventListener('resize', handler)
	}

	tryOnMounted(() => {
		start()
	})

	tryOnUnmounted(() => {
		stop()
	})
	return [start, stop]
}
