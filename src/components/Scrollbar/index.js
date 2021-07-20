/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-20 13:05:53
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-20 15:31:49
 */

import { withInstall } from 'src/utils'
import scrollContainer from './src/index.vue'
import Scrollbar from './src/Scrollbar.vue'

export { Scrollbar }
const ScrollContainer = withInstall(scrollContainer)
export default ScrollContainer
