/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 11:13:17
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 15:52:04
 */
// 提取环境变量并转换
export function wrapperEnv(envConf) {
	const ret = {}

	for (const envName of Object.keys(envConf)) {
		let realName = envConf[envName].replace(/\\n/g, '\n')
		realName = realName === 'true' ? true : realName === 'false' ? false : realName

		if (envName === 'VITE_PORT') {
			realName = Number(realName)
		}

		if (envName === 'VITE_PROXY') {
			try {
				realName = JSON.parse(realName)
			} catch (error) {
				// error
			}
		}

		ret[envName] = realName
		process.env[envName] = realName
	}

	return ret
}
