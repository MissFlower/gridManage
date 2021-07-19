/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-16 15:32:29
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-19 09:49:11
 */
module.exports = {
	// ignores: [commit => commit.includes('init')],
	extends: ['@commitlint/config-conventional'],
	rules: {
		'body-leading-blank': [2, 'always'],
		'footer-leading-blank': [1, 'always'],
		'header-max-length': [2, 'always', 108],
		'subject-empty': [2, 'never'], // 提交不符合规范时,也可以提交,但是会有警告
		'type-empty': [2, 'never'], // 提交不符合规范时,也可以提交,但是会有警告
		'type-enum': [
			2,
			'always',
			['feat', 'fix', 'perf', 'style', 'docs', 'test', 'refactor', 'build', 'ci', 'chore', 'revert', 'wip', 'workflow', 'types', 'release']
		]
	}
}
