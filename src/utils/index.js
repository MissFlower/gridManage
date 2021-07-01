/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-01 15:51:26
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-01 15:55:03
 */
export function is(val, type) {
	return Object.prototype.toString.call(val).slice(8, -1) === type
}
