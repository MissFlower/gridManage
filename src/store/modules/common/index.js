/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-25 14:30:46
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-25 17:24:06
 */
import * as types from './types'

const state = {
	// 请求记数
	requestCount: 0
}

const mutations = {
	// 修改引用计数
	[types.UPDATE_REQUEST_COUNT](state, amount) {
		state.requestCount += amount
	}
}

const actions = {}
export default {
	name: 'common',
	state,
	mutations,
	actions
}
