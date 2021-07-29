<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 18:01:50
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-29 18:42:01
-->
<template>
	<div class="login-container">
		<div class="login-wrapper">
			<h2 class="title">速绿运营管理后台</h2>
			<Form :label-col="labelCol" :wrapper-col="wrapperCol" class="form-wrap">
				<FormItem label="登录账号" v-bind="validateInfos.username">
					<Input ref="usernameRef" v-model:value.trim="modelRef.username" placeholder="请输入登录账号" @focus="clearValidateHandle" />
				</FormItem>

				<FormItem label="登录密码" v-bind="validateInfos.password">
					<InputPassword
						ref="passwordRef"
						v-model:value.trim="modelRef.password"
						autocomplete="on"
						placeholder="请输入登录密码"
						@focus="clearValidateHandle"
					/>
				</FormItem>

				<FormItem label="验证码" v-bind="validateInfos.code" class="verify">
					<Input v-model:value.trim="modelRef.code" @focus="clearValidateHandle" @pressEnter="loginHandle" />
					<Image v-if="modelRef.verifyImage" :width="100" :height="32" :src="modelRef.verifyImage" :preview="false" @click="verifyCodeHandle" />
					<RedoOutlined v-else @click="verifyCodeHandle" />
				</FormItem>
				<!-- <Button type="link">忘记密码？</Button> -->
				<Button type="primary" block class="login-btn" @click.prevent="loginHandle">登录</Button>
			</Form>
		</div>
	</div>
</template>

<script>
	import { defineComponent, ref, reactive, onMounted, watch } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { useStore } from 'vuex'
	import { Form, Image, Input, Button } from 'ant-design-vue'
	import { RedoOutlined } from '@ant-design/icons-vue'
	import { getVerifyCode } from 'src/api/System'
	export default defineComponent({
		name: 'Login',
		components: {
			Form,
			Input,
			Button,
			FormItem: Form.Item,
			Image,
			InputPassword: Input.Password,
			RedoOutlined
		},
		setup() {
			const router = useRouter()
			const route = useRoute()
			const store = useStore()
			const usernameRef = ref(null)
			const passwordRef = ref(null)
			const useForm = Form.useForm

			const redirectRef = reactive({
				redirect: '',
				otherQuery: {}
			})
			const modelRef = reactive({
				username: 'aa04',
				password: 'Ycb@13',
				code: '',
				verifyImage: '',
				uuid: ''
			})

			const rulesRef = reactive({
				username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur ' }],
				code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
			})

			onMounted(() => {
				if (modelRef.username === '') {
					usernameRef.value.focus()
				} else if (modelRef.password === '') {
					passwordRef.value.focus()
				}
			})

			const verifyCodeHandle = async () => {
				const { img, uuid } = await getVerifyCode()
				modelRef.verifyImage = `data:image/gif;base64,${img}`
				modelRef.uuid = uuid
			}

			const { clearValidate, validate, validateInfos } = useForm(modelRef, rulesRef)

			const loginHandle = async () => {
				try {
					await validate()
					const { username, password, code, uuid } = modelRef
					store
						.dispatch('user/login', {
							data: {
								username,
								password
							},
							params: {
								code,
								uuid
							}
						})
						.then(() => {
							router.push({ path: redirectRef.redirect || '/', query: redirectRef.otherQuery })
						})
						.catch(error => {
							modelRef.code = ''
							verifyCodeHandle()
							console.log(error)
						})
				} catch (error) {
					console.log(error)
				}
			}

			const clearValidateHandle = () => {
				clearValidate(['username', 'password', 'code'])
			}

			const formatVerifyCode = (val, preVal) => {
				const reg = /^-?\d*(\.\d*)?$/

				modelRef.code = (!isNaN(+val) && reg.test(val)) || val === '' || val === '-' ? val : preVal
			}

			const getOtherQuery = query => {
				return Object.keys(query).reduce((acc, cur) => {
					if (cur !== 'redirect') {
						acc[cur] = query[cur]
					}
					return acc
				}, {})
			}

			watch(
				() => modelRef.code,
				(val, preVal) => {
					formatVerifyCode(val, preVal)
				},
				{
					immediate: true
				}
			)

			watch(route, ({ query }) => {
				if (query) {
					redirectRef.redirect = query.redirect
					redirectRef.otherQuery = getOtherQuery(query)
				}
			})

			verifyCodeHandle()

			return {
				modelRef,
				labelCol: { span: 4 },
				wrapperCol: { span: 20, offset: 1 },
				validateInfos,
				clearValidateHandle,
				loginHandle,
				verifyCodeHandle,
				usernameRef,
				passwordRef
			}
		}
	})
</script>

<style lang="scss" scoped>
	.login-container {
		position: relative;
		height: 100%;
		background-image: url('src/assets/images/login-background.jpg');
		background-repeat: no-repeat;
		background-size: cover;
		background-origin: right;
	}

	.login-wrapper {
		position: absolute;
		top: 40%;
		left: 50%;
		width: 450px;
		text-align: right;
		transform: translate(-50%, -50%);

		.title {
			margin-bottom: 24px;
			font-size: 30px;
			font-weight: bold;
			letter-spacing: 1px;
			color: #fff;
			text-align: center;
		}

		.form-wrap {
			padding: 48px 24px 32px;
			background-color: #fff;
			border-radius: 10px;

			.login-btn {
				margin-top: 12px;
			}
		}

		.verify :deep {
			.ant-form-item-control-input-content {
				display: flex;

				.ant-input {
					width: calc(100% - 112px);
				}

				.ant-image-img {
					height: 100%;
					margin-left: 12px;
					cursor: pointer;
				}

				.anticon-redo {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100px;
					margin-left: 12px;
					cursor: pointer;
					background-color: #ddd;
				}
			}
		}
	}
</style>
