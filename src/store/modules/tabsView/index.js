/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-21 17:07:26
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-26 16:00:16
 */
import {
	ADD_VISITED_VIEW,
	ADD_CACHED_VIEW,
	DEL_VISITED_VIEW,
	DEL_CACHED_VIEW,
	DEL_OTHERS_VISITED_VIEWS,
	DEL_OTHERS_CACHED_VIEWS,
	DEL_ALL_VISITED_VIEWS,
	DEL_ALL_CACHED_VIEWS,
	UPDATE_VISITED_VIEW,
	DEL_LEFT_VISITED_VIEWS,
	DEL_LEFT_CACHED_VIEWS,
	DEL_RIGHT_VISITED_VIEWS,
	DEL_RIGHT_CACHED_VIEWS,
	SORT_TABS,
	addView,
	addVisitedView,
	addCachedView,
	delView,
	delVisitedView,
	delCachedView,
	delOthersViews,
	delOthersVisitedViews,
	delOthersCachedViews,
	delAllViews,
	delAllVisitedViews,
	delAllCachedViews,
	updateVisitedView,
	delLeftViews,
	delLeftVisitedViews,
	delLeftCachedViews,
	delRightViews,
	delRightVisitedViews,
	delRightCachedViews,
	sortTabs
} from './types'
const state = {
	visitedViews: [],
	cachedViews: [],
	lastDragEndIndex: 0
}

const mutations = {
	[ADD_VISITED_VIEW]: (state, view) => {
		if (state.visitedViews.some(v => v.fullPath === view.fullPath)) return

		state.visitedViews.push(
			Object.assign({}, view, {
				title: view.meta.title || 'no-name'
			})
		)
	},
	[ADD_CACHED_VIEW]: (state, view) => {
		if (state.cachedViews.includes(view.name)) return
		if (!view.meta?.noCache) {
			state.cachedViews.push(view.name)
		}
	},

	[DEL_VISITED_VIEW]: (state, view) => {
		for (const [i, v] of state.visitedViews.entries()) {
			if (v.fullPath === view.fullPath) {
				state.visitedViews.splice(i, 1)
				break
			}
		}
	},
	[DEL_CACHED_VIEW]: (state, view) => {
		const index = state.cachedViews.indexOf(view.name)
		index > -1 && state.cachedViews.splice(index, 1)
	},

	[DEL_OTHERS_VISITED_VIEWS]: (state, view) => {
		state.visitedViews = state.visitedViews.filter(v => {
			return v.meta.affix || v.fullPath === view.fullPath
		})
	},
	[DEL_OTHERS_CACHED_VIEWS]: (state, view) => {
		const index = state.cachedViews.indexOf(view.name)
		if (index > -1) {
			state.cachedViews = state.cachedViews.slice(index, index + 1)
		} else {
			// if index = -1, there is no cached tags
			state.cachedViews = []
		}
	},

	[DEL_ALL_VISITED_VIEWS]: state => {
		// keep affix tags
		const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
		state.visitedViews = affixTags
	},
	[DEL_ALL_CACHED_VIEWS]: state => {
		state.cachedViews = []
	},

	[UPDATE_VISITED_VIEW]: (state, view) => {
		for (let v of state.visitedViews) {
			if (v.fullPath === view.fullPath) {
				v = Object.assign(v, view)
				break
			}
		}
	},
	[DEL_LEFT_VISITED_VIEWS]: (state, view) => {
		let index = state.visitedViews.length
		state.visitedViews = state.visitedViews.filter(item => {
			if (item.name === view.name) index = state.visitedViews.indexOf(item)
			return item.meta.affix || index <= state.visitedViews.indexOf(item)
		})
	},
	[DEL_LEFT_CACHED_VIEWS]: (state, view) => {
		let index = state.cachedViews.length
		state.cachedViews = state.cachedViews.filter(item => {
			if (item.name === view.name) index = state.cachedViews.indexOf(item)
			return index <= state.cachedViews.indexOf(item)
		})
	},
	[DEL_RIGHT_VISITED_VIEWS]: (state, view) => {
		let index = state.visitedViews.length
		state.visitedViews = state.visitedViews.filter(item => {
			if (item.name === view.name) index = state.visitedViews.indexOf(item)
			return item.meta.affix || index >= state.visitedViews.indexOf(item)
		})
	},
	[DEL_RIGHT_CACHED_VIEWS]: (state, view) => {
		let index = state.cachedViews.length
		state.cachedViews = state.cachedViews.filter(item => {
			if (item.name === view.name) index = state.cachedViews.indexOf(item)
			return index >= state.cachedViews.indexOf(item)
		})
	},
	[SORT_TABS]: (state, { oldIndex, newIndex }) => {
		const currentTab = state.visitedViews[oldIndex]
		state.visitedViews.splice(oldIndex, 1)
		state.visitedViews.splice(newIndex, 0, currentTab)
		state.lastDragEndIndex = state.lastDragEndIndex + 1
	}
}

const actions = {
	[addView]({ dispatch }, view) {
		dispatch(addVisitedView, view)
		dispatch(addCachedView, view)
	},
	[addVisitedView]({ commit }, view) {
		commit(ADD_VISITED_VIEW, view)
	},
	[addCachedView]({ commit }, view) {
		commit(ADD_CACHED_VIEW, view)
	},

	[delView]({ dispatch, state }, view) {
		return new Promise(resolve => {
			dispatch(delVisitedView, view)
			dispatch(delCachedView, view)
			resolve({
				visitedViews: [...state.visitedViews],
				cachedViews: [...state.cachedViews]
			})
		})
	},
	[delVisitedView]({ commit, state }, view) {
		return new Promise(resolve => {
			commit(DEL_VISITED_VIEW, view)
			resolve([...state.visitedViews])
		})
	},
	[delCachedView]({ commit, state }, view) {
		return new Promise(resolve => {
			commit(DEL_CACHED_VIEW, view)
			resolve([...state.cachedViews])
		})
	},

	[delOthersViews]({ dispatch, state }, view) {
		return new Promise(resolve => {
			dispatch(delOthersVisitedViews, view)
			dispatch(delOthersCachedViews, view)
			resolve({
				visitedViews: [...state.visitedViews],
				cachedViews: [...state.cachedViews]
			})
		})
	},
	[delOthersVisitedViews]({ commit, state }, view) {
		return new Promise(resolve => {
			commit(DEL_OTHERS_VISITED_VIEWS, view)
			resolve([...state.visitedViews])
		})
	},
	[delOthersCachedViews]({ commit, state }, view) {
		return new Promise(resolve => {
			commit(DEL_OTHERS_CACHED_VIEWS, view)
			resolve([...state.cachedViews])
		})
	},

	[delAllViews]({ dispatch, state }, view) {
		return new Promise(resolve => {
			dispatch(delAllVisitedViews, view)
			dispatch(delAllCachedViews, view)
			resolve({
				visitedViews: [...state.visitedViews],
				cachedViews: [...state.cachedViews]
			})
		})
	},
	[delAllVisitedViews]({ commit, state }) {
		return new Promise(resolve => {
			commit(DEL_ALL_VISITED_VIEWS)
			resolve([...state.visitedViews])
		})
	},
	[delAllCachedViews]({ commit, state }) {
		return new Promise(resolve => {
			commit(DEL_ALL_CACHED_VIEWS)
			resolve([...state.cachedViews])
		})
	},
	[updateVisitedView]({ commit }, view) {
		commit(UPDATE_VISITED_VIEW, view)
	},
	[delLeftViews]({ dispatch, state }, view) {
		return new Promise(resolve => {
			dispatch(delLeftVisitedViews, view)
			dispatch(delLeftCachedViews, view)
			resolve({
				visitedViews: [...state.visitedViews],
				cachedViews: [...state.cachedViews]
			})
		})
	},
	[delLeftVisitedViews]({ commit, state }, view) {
		return new Promise(resolve => {
			commit(DEL_LEFT_VISITED_VIEWS, view)
			resolve([...state.visitedViews])
		})
	},
	[delLeftCachedViews]({ commit, state }, view) {
		return new Promise(resolve => {
			commit(DEL_LEFT_CACHED_VIEWS, view)
			resolve([...state.cachedViews])
		})
	},
	[delRightViews]({ dispatch, state }, view) {
		return new Promise(resolve => {
			dispatch(delRightVisitedViews, view)
			dispatch(delRightVisitedViews, view)
			resolve({
				visitedViews: [...state.visitedViews],
				cachedViews: [...state.cachedViews]
			})
		})
	},
	[delRightVisitedViews]({ commit, state }, view) {
		return new Promise(resolve => {
			commit(DEL_RIGHT_VISITED_VIEWS, view)
			resolve([...state.visitedViews])
		})
	},
	[delRightCachedViews]({ commit, state }, view) {
		return new Promise(resolve => {
			commit(DEL_RIGHT_CACHED_VIEWS, view)
			resolve([...state.cachedViews])
		})
	},
	[sortTabs]({ commit, state }, { oldIndex, newIndex }) {
		return new Promise(resolve => {
			commit(SORT_TABS, { oldIndex, newIndex })
			resolve([...state.visitedViews])
		})
	}
}
export default {
	name: 'tabsView',
	namespaced: true,
	state,
	mutations,
	actions
}
