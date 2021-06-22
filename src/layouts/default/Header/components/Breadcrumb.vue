<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:49:10
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 15:32:02
-->
<template>
	<Breadcrumb>
		<BreadcrumbItem v-for="(item, index) in levelList" :key="item.path">
			<span
				v-if="item.redirect === 'noRedirect' || index === levelList.length - 1"
				class="no-redirect"
			>
				{{ item.meta.title }}
			</span>
			<span v-else class="other-breadcrumn" @click.prevent="handleLink(item)">
				{{ item.meta.title }}
			</span>
		</BreadcrumbItem>
	</Breadcrumb>
</template>

<script>
	import { defineComponent, reactive, toRefs } from 'vue'
	import { Breadcrumb, BreadcrumbItem } from 'ant-design-vue'
	import { useRouter } from 'vue-router'
	import * as pathToRegexp from 'path-to-regexp'
	export default defineComponent({
		name: 'Breadcrumb',
		components: {
			Breadcrumb,
			BreadcrumbItem
		},
		setup() {
			const state = reactive({
				levelList: []
			})
			const router = useRouter()
			function getBreadcrumb() {
				// only show routes with meta.title
				let matched = router.matched.filter(item => item.meta?.title)
				const first = matched[0]

				if (!isHome(first)) {
					matched = [
						{
							path: 'home',
							meata: {
								title: 'home'
							}
						}
					].concat(matched)
				}
				state.levelList = matched.filter(item => item.meta?.title && item.meta.breadcrumb !== false)
			}
			function isHome(route) {
				if (route?.name) {
					return false
				}
				return route?.name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase()
			}

			function pathCompile(path) {
				const { params } = router
				const toPath = pathToRegexp.compile(path)
				return toPath(params)
			}

			function handleLink({ redirect, path }) {
				if (redirect) {
					router.push(redirect)
					return
				}
				router.push(pathCompile(path))
			}

			getBreadcrumb()
			return {
				...toRefs(state),
				handleLink
			}
		}
	})
</script>

<style lang="scss" scoped></style>
