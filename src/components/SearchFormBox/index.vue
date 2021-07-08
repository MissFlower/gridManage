<!--
 * @Description: 搜索容器组件
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-06 18:22:28
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-08 14:59:45
-->
<template>
	<div class="search-form-container">
		<slot />

		<div class="search-button-box">
			<slot name="searchBtn" />
		</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: 'SearchFormBox',
		setup() {}
	})
</script>

<style lang="scss" scoped>
	.search-form-container :deep {
		padding-bottom: 12px;
		// margin-bottom: 12px;
		background: #fdfdfd;
		border-radius: 6px;
		// box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

		.ant-form {
			display: flex;
			padding: 12px;
			// padding-bottom: 0;
			flex-wrap: wrap;
			gap: 0 24px;
		}

		.ant-form-item {
			margin-right: 0;
			// margin-bottom: 18px;
			flex: 0 1 calc((100% - 72px) / 4);
		}

		.ant-form-item__content,
		.ant-santect {
			width: 100%;
		}

		.search-button-box {
			text-align: center;

			.ant-btn + .ant-btn {
				margin-left: 24px;
			}
		}

		.ant-range-editor--medium.ant-input__inner {
			width: 100%;
		}
	}
</style>
