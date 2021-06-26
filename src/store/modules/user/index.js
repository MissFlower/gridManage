/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 11:09:24
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-26 14:59:26
 */
import { resetRouter } from 'src/router'
import { getToken, removeToken } from 'src/utils/cookie'
import { getUserInfo } from 'src/api/System'
import * as types from './types'
const state = {
	userInfo: {},
	token: getToken()
}

const mutations = {
	[types.SET_USERINFO]: (state, userInfo) => {
		state.userInfo = userInfo
	},
	[types.SET_TOKEN]: (state, token) => {
		state.token = token
	}
}

const actions = {
	getUserInfo({ commit }) {
		// 获取用户信息
		return new Promise((resolve, reject) => {
			getUserInfo()
				.then(res => {
					if (!res) {
						reject('Verification failed, Please Login Aligin!')
					}
					const { trueName, avatar } = res
					commit(types.SET_USERINFO, { username: trueName, avatar })
					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			this.logout(state.token)
				.then(() => {
					commit(types.SET_TOKEN, '')
					removeToken()
					resetRouter()
					// reset visited views and cached views
					// dispatch('tagsView/delAllViews', null, { root: true })

					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	resetToken({ commit }) {
		// 重置token
		return new Promise(resolve => {
			commit(types.SET_TOKEN, '')
			removeToken()
			resolve()
		})
	}
}
export default {
	name: 'user',
	namespaced: true,
	state,
	mutations,
	actions
}
