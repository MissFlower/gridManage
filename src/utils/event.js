/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-20 13:15:32
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-20 13:18:42
 */
import ResizeObserver from 'resize-observer-polyfill'

const isServer = typeof window === 'undefined'

function resizeHandler(entries) {
	for (const entry of entries) {
		const listeners = entry.target.__resizeListeners__ || []
		if (listeners.length) {
			listeners.forEach(fn => {
				fn()
			})
		}
	}
}

export function addResizeListener(element, fn) {
	if (isServer) return
	if (!element.__resizeListeners__) {
		element.__resizeListeners__ = []
		element.__ro__ = new ResizeObserver(resizeHandler)
		element.__ro__.observe(element)
	}
	element.__resizeListeners__.push(fn)
}

export function removeResizeListener(element, fn) {
	if (!element || !element.__resizeListeners__) return
	element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1)
	if (!element.__resizeListeners__.length) {
		element.__ro__.disconnect()
	}
}

export function triggerWindowResize() {
	const event = document.createEvent('HTMLEvents')
	event.initEvent('resize', true, true)
	event.eventType = 'message'
	window.dispatchEvent(event)
}
