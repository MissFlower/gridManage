/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-16 15:32:29
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-16 18:17:43
 */
module.exports = {
	// ignores: [commit => commit.includes('init')],
	extends: ['@commitlint/config-conventional'],
	rules: {
		'body-leading-blank': [2, 'always'],
		'footer-leading-blank': [1, 'always'],
		'header-max-length': [2, 'always', 108],
		'subject-empty': [2, 'never'],
		'type-empty': [2, 'never'],
		'type-enum': [
			2,
			'always',
			['feat', 'fix', 'perf', 'style', 'docs', 'test', 'refactor', 'build', 'ci', 'chore', 'revert', 'wip', 'workflow', 'types', 'release']
		]
	}
}
