<!--
 * @Description: 门店信息
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 17:25:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-10 11:11:35
-->
<template>
	<div class="shop-info-wrapper" :class="[isShow ? 'active' : '']">
		<div class="shop-info-content">
			<div class="base-info">
				<Avatar src="src/assets/images/shop_default.png" shape="square" :size="48" class="shop-img" />
				<div class="common-info">
					<div class="info-header">
						<span class="info-title">{{ infoData.name }}</span>
						<span class="info-id">门店ID: {{ infoData.id }}</span>
					</div>
					<span class="info-address">{{ infoData.locate }}</span>
				</div>
			</div>
			<div class="other-info">
				<span v-for="(info, key) of infoData.otherInfo" :key="key" class="other-info-item"> {{ info.title }}: {{ info.text }} </span>
			</div>
		</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Avatar } from 'ant-design-vue'
	export default defineComponent({
		name: 'ShopInfo',
		components: {
			Avatar
		},
		props: {
			infoData: {
				type: Object,
				required: true
			},
			isShow: {
				type: Boolean,
				default: false
			}
		},
		setup() {}
	})
</script>

<style lang="scss" scoped>
	.shop-info-wrapper {
		position: absolute;
		top: 10px;
		left: 10px;
		width: 0;
		overflow: hidden;
		font-size: 12px;
		background-color: #fff;
		border: 0 solid #ddd;
		border-radius: 2px;
		opacity: 0;
		transition: 0.3s all ease-in-out;

		.shop-info-content {
			padding: 12px;
		}

		.shop-img {
			margin-right: 8px;
		}

		.base-info {
			display: flex;

			.common-info {
				flex: 1;
			}

			.info-header {
				display: flex;
			}

			.info-title,
			.info-id {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				flex: 1;
			}

			.info-address {
				width: 100%;
			}
		}

		.other-info {
			display: flex;
			flex-wrap: wrap;
			gap: 0 12px;

			&-item {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				flex: 0 1 calc(50% - 6px);
			}
		}
	}

	.active {
		width: 320px;
		border-width: 1px;
		opacity: 1;
	}
</style>
