<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-01-22 19:02:19
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-01-22 19:03:18
-->
<template>
  <div>
    <ElButton type="primary" @click.prevent="goAnchorPage">Anchor</ElButton>
    <AnchorPanel title="基础用法">
      <div class="base">基础用法</div>
    </AnchorPanel>
    <AnchorPanel title="静态位置">
      <div class="static">静态位置</div>
    </AnchorPanel>
    <AnchorPanel title="报警详情">
      <div class="alarm">报警详情</div>
    </AnchorPanel>
    <AnchorPanel title="配置信息">
      <div class="alarm">配置信息</div>
    </AnchorPanel>
    <AnchorPanel title="指标参数">
      <div class="alarm">指标参数</div>
    </AnchorPanel>
    <AnchorPanel title="管理制度">
      <div class="alarm">管理制度</div>
    </AnchorPanel>
    <AnchorPanel title="工单列表">
      <div class="alarm">工单列表</div>
    </AnchorPanel>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AnchorPanel from 'src/components/Anchor/AnchorPanel'
export default defineComponent({
  name: 'AnchorPanel',
  components: {
    AnchorPanel
  },
  setup() {
    // goAnchorPage() {
    //   this.$router.push({
    //     path: '/edit/anchor'
    //   })
    // }
  }
})
</script>

<style lang="scss" scoped>

</style>
