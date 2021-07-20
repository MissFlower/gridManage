/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-20 13:11:18
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-20 13:12:02
 */
export const BAR_MAP = {
	vertical: {
		offset: 'offsetHeight',
		scroll: 'scrollTop',
		scrollSize: 'scrollHeight',
		size: 'height',
		key: 'vertical',
		axis: 'Y',
		client: 'clientY',
		direction: 'top'
	},
	horizontal: {
		offset: 'offsetWidth',
		scroll: 'scrollLeft',
		scrollSize: 'scrollWidth',
		size: 'width',
		key: 'horizontal',
		axis: 'X',
		client: 'clientX',
		direction: 'left'
	}
}

export function renderThumbStyle({ move, size, bar }) {
	const style = {}
	const translate = `translate${bar.axis}(${move}%)`

	style[bar.size] = size
	style.transform = translate
	style.msTransform = translate
	style.webkitTransform = translate

	return style
}

function extend(to, _from) {
	return Object.assign(to, _from)
}

export function toObject(arr) {
	const res = {}
	for (let i = 0; i < arr.length; i++) {
		if (arr[i]) {
			extend(res, arr[i])
		}
	}
	return res
}
