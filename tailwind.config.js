/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-29 17:57:17
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-30 16:04:21
 */
module.exports = {
	purge: {
		enable: process.env.NODE_ENV === 'production',
		content: ['./index.html', './src/**/*.{vue,ts,tsx}']
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			zIndex: {
				'-1': '-1'
			},
			backgroundImage: () => ({
				'login-image': "url('src/assets/images/login-background.jpg')"
			})
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
}
