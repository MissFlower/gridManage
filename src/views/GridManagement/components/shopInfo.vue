<!--
 * @Description: 门店信息
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 17:25:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-30 11:33:30
-->
<template>
	<div class="shop-info-wrapper">
		<div class="base-info">
			<Avatar :src="infoData.src" shape="square" :size="48" class="shop-img" />
			<div class="common-info">
				<div class="info-header">
					<span class="info-title">黄焖鸡米饭</span>
					<span class="info-id">门店ID: 123456</span>
				</div>
				<span class="info-address">北京市朝阳区万东国际文创园北门马路对面</span>
			</div>
		</div>
		<div class="other-info">
			<span class="other-info-item"> 门店来源：运营创建 </span>
			<span class="other-info-item"> 门店来源：运营创建 </span>
			<span class="other-info-item"> 门店来源：运营创建 </span>
			<span class="other-info-item aaa"> 门店来源：运营创建 </span>
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
		width: 300px;
		padding: 12px;
		font-size: 12px;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 2px;

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
				flex: 0 1 calc(50% - 6px);
			}
		}
	}
</style>
