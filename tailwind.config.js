/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-29 17:57:17
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-04 11:28:22
 */
module.exports = {
	mode: 'jit',
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
