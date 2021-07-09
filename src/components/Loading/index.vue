<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-28 17:51:01
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-09 16:41:05
-->
<template>
	<section v-show="loading" class="full-loading" :class="{ absolute }">
		<Spin v-bind="$attrs" :size="size" :tip="tip" :spinning="loading" />
	</section>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Spin } from 'ant-design-vue'
	import { SIZE_TYPE } from 'src/common/constant'

	export default defineComponent({
		name: 'Loading',
		components: { Spin },
		props: {
			tip: {
				type: String,
				default: ''
			},
			size: {
				type: String,
				default: SIZE_TYPE.LARGE,
				validator: v => {
					return [SIZE_TYPE.DEFAULT, SIZE_TYPE.SMALL, SIZE_TYPE.LARGE].includes(v)
				}
			},
			absolute: {
				type: Boolean,
				default: false
			},
			loading: {
				type: Boolean,
				default: false
			},
			background: {
				type: String
			}
		}
	})
</script>

<style lang="scss" scoped>
	.full-loading {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 2000;
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		background-color: rgba(240, 242, 245, 0.4);

		&.absolute {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 3000;
		}
	}
</style>
