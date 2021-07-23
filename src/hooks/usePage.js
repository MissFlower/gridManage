/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-22 13:41:19
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-22 20:42:22
 */
import { unref } from 'vue'
import { useRouter } from 'vue-router'
import { REDIRECT_NAME } from 'src/router/constant'

function handleError(e) {
	console.error(e)
}

/**
 * @description: 页面切换
 */
export function useGo(_router) {
	let router
	!_router && (router = useRouter())

	const { push, replace } = _router || router

	function go(opt, isReplace = false) {
		if (!opt) {
			return
		}

		isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError)
	}

	return go
}

/**
 * @description: 路由刷新重定向
 */
export const useRedo = _router => {
	let router
	!_router && (router = useRouter())

	const { push, currentRoute } = _router || router
	const { query, params } = currentRoute.value
	function redo() {
		return new Promise(resolve => {
			push({
				path: `/${REDIRECT_NAME.toLowerCase() + unref(currentRoute).fullPath}`,
				query,
				params
			}).then(() => resolve(true))
		})
	}
	return redo
}
