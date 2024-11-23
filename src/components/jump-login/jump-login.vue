<template>
	<view class="login-view">
		<view class="input-f">
			<image src="/static/icons/phone.png"></image>
			<input class="cus-input" type="number" confirm-type="确认" v-model="phoneNum" placeholder="请输入手机号" />
		</view>
		<!-- 		<view class="input-s">
			<view class="left">
				<image src="/static/icons/safe.png"></image>
				<input class="cus-input" confirm-type="确认" type="number" v-model="smsCode" placeholder="请输入验证码" />
			</view>
			<up-code ref="uCode" @change="codeChange" :seconds="seconds"></up-code>
			<view @click="sendMsg" class="code-view">{{tips}}</view>
		</view> -->
		<button @click="emitLoginCall" class="loginBtn" type="primary" :disabled="btnDisabled">登录</button>
	</view>
	
</template>
<script>
	export default {
		name: "jump-login",
		props: {
			isCheckAgreement: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				btnDisabled: false,
				phoneNum: '',
				smsCode: '',
				tips: '',
				seconds: 60,
				uCode: null,
				isCheckAgreement: true
			};
		},
		methods: {
			emitSmsCall() {
				const that = this;
				if (this.phoneNum == '' || this.phoneNum == undefined) {
					uni.showToast({
						icon: 'none',
						title: "请先输入手机号"
					})
					return;
				}
				
				if (!this.validatePhoneNumber(that.phoneNum)) {
					uni.showToast({
						icon: "none",
						title: "手机号码不正确"
					})
					return;
				}
				// 传手机号码
				this.$emit('smsCall', that.phoneNum);
				this.$refs.uCode.start()
				// this.$emit('smsCall');
			},
			emitLoginCall() {
				const that = this;
				console.log(this.isCheckAgreement)
				if (!this.isCheckAgreement) {
					uni.showToast({
						icon: 'none',
						title: "请勾选隐私协议"
					})
					return;
				}
				if (that.phoneNum == '' || that.phoneNum == undefined) {
					uni.showToast({
						icon: 'none',
						title: "请输入手机号"
					})
					return;
				}
				if (!this.validatePhoneNumber(that.phoneNum)) {
					uni.showToast({
						icon: "none",
						title: "手机号码不正确"
					})
					return;
				}
				const sD = {
					"phoneNum": that.phoneNum,
					"smsCode": that.smsCode
				};
				this.$emit('loginCall', sD);
			},

			codeChange(text) {
				this.tips = text;
			},
			validatePhoneNumber(phoneNumber) {
				var pattern = /^1[3456789]\d{9}$/;
				// 验证手机号码是否符合要求
				if (pattern.test(phoneNumber)) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-view {

		.input-f {
			display: flex;
			align-items: center;
			border: 2rpx solid #D1E1FF;
			margin-top: 40rpx;
			border-radius: 20rpx;
			padding: 20rpx 30rpx;

			image {
				width: 44rpx;
				height: 44rpx;
			}

			.cus-input {
				margin-left: 10rpx;
				font-size: 30rpx;
				text-align: left;
			}

			.code-view {
				color: #4088fd;
				font-size: 30rpx;
			}

		}

		.input-s {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border: 2rpx solid #D1E1FF;
			margin-top: 40rpx;
			border-radius: 20rpx;
			padding: 20rpx 30rpx;
			white-space: nowrap;

			.left {
				display: flex;
				align-items: center;

				image {
					width: 44rpx;
					height: 44rpx;
				}

				.cus-input {
					margin-left: 10rpx;
					font-size: 30rpx;
					text-align: left;
					white-space: nowrap;
				}
			}

			.code-view {
				color: #4088fd;
				font-size: 30rpx;
			}

		}

		.loginBtn {
			margin-top: 40rpx;
			background-color: #4088fd;
			color: #ffffff;
		}

		.loginBtn:disabled {
			background-color: #D1E1FF;
		}
	}
</style>