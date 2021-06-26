<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:49:10
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-24 18:20:11
-->
<template>
	<Breadcrumb :routes="routes">
		<template #itemRender="{ route, routes, paths }">
			<span v-if="!hasRedirect(routes, route)">
				{{ route.meta.title }}
			</span>
			<RouterLink
				v-else
				tag="div"
				to=""
				class="route-text"
				@click.prevent="handleLink(route, paths, $event)"
			>
				{{ route.meta.title }}
			</RouterLink>
		</template>
	</Breadcrumb>
</template>

<script>
	import { defineComponent, ref, watchEffect } from 'vue'
	import { Breadcrumb } from 'ant-design-vue'
	import { useRouter } from 'vue-router'
	import { REDIRECT_NAME } from 'src/router/constant'
	export default defineComponent({
		name: 'LayoutBreadcrumb',
		components: {
			Breadcrumb
		},
		setup() {
			const router = useRouter()
			const { currentRoute } = router
			const routes = ref([])
			watchEffect(() => {
				if (currentRoute.value.name === REDIRECT_NAME) {
					return
				}
				// only show routes with meta.title
				let routeMatched = currentRoute.value.matched.filter(item => item.meta?.title)
				const first = routeMatched[0]
				if (!isHome(first)) {
					routeMatched = [
						{
							path: 'home',
							meata: {
								title: 'home'
							}
						}
					].concat(routeMatched)
				}
				routes.value = routeMatched.filter(
					item => item.meta?.title && item.meta.breadcrumb !== false
				)
			})
			function isHome(route) {
				if (route?.name) {
					return false
				}
				return route?.name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase()
			}

			function hasRedirect(routes, route) {
				if (routes.indexOf(route) === routes.length - 1) {
					return false
				}
				return true
			}
			function pathCompile(paths) {
				return paths.map(path => (/^\//.test(path) ? path : `/${path}`)).join('')
			}
			function handleLink(route, paths, e) {
				const { children, redirect } = route
				if (children?.length && !redirect) {
					e?.stopPropagation()
					return
				}
				if (redirect) {
					router.push(redirect)
					return
				} else {
					let goPath = ''
					if (paths.length === 1) {
						goPath = paths[0]
					} else {
						const ps = paths.slice(-2)
						goPath = pathCompile(ps)
					}
					router.push(goPath)
				}
			}
			return {
				routes,
				hasRedirect,
				handleLink
			}
		}
	})
</script>
