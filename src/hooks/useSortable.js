/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-26 14:59:31
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-26 15:00:02
 */
import { nextTick, unref } from 'vue'

export function useSortable(el, options = {}) {
	function initSortable() {
		nextTick(async () => {
			if (!el) return

			const Sortable = (await import('sortablejs')).default
			Sortable.create(unref(el), {
				animation: 500,
				delay: 400,
				delayOnTouchOnly: true,
				...options
			})
		})
	}

	return { initSortable }
}
