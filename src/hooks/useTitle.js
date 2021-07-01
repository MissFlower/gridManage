/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-28 17:36:07
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-29 13:26:40
 */
import { watch, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useTitle as usePageTitle } from '@vueuse/core'
import settings from 'src/settings'
import { REDIRECT_NAME } from 'src/router/constant'

export function useTitle() {
	const { title } = settings
	const { currentRoute } = useRouter()
	const pageTitle = usePageTitle()

	watch(
		() => currentRoute.value.path,
		() => {
			const route = unref(currentRoute)
			if (route.name === REDIRECT_NAME) {
				return
			}

			const mTitle = route?.meta?.title
			pageTitle.value = mTitle ? ` ${mTitle} - ${title} ` : `${title}`
		},
		{
			immediate: true
		}
	)
}
