<template>
	<view class="sigin">
		<view class="banner">
			<image class="bottom" src="https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1810976905915551745.png"
				mode="widthFix"></image>
			<image class="upper" src="/static/image/logo.png"></image>
		</view>
		<view class="box">
			<view class="phone">欢迎登录</view>
			<view class="desc">一键授权快速注册登录</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="img">
				<image :src="avatarUrl ? avatarUrl : '/static/image/avare-defa.png'" mode="aspectFill" />
			</view>
			<view class="avatar">
				<button open-type="chooseAvatar" @chooseavatar="chooseAvatar">获取微信头像</button>
				<view class="line"></view>
			</view>
			<view class="nickname">
				<view class="borde">
					<view class="nick">
						<image class="icons" src="../../static/image/nickname.png"></image>
					</view>
					<view class="inputs">
						<input type="nickname" placeholder="请输入昵称" v-model="nickName" @input="replaceInput"
							maxlength="8" @blur="nicknameBlur" />
					</view>
				</view>
			</view>
			<view class="login">
				<button hover-class="none" open-type="getPhoneNumber" @getphonenumber="handleWxLogin">立即登录</button>
			</view>
			<!-- #endif -->

			<!-- #ifdef MP-TOUTIAO -->
			<view class="login-view">
<!-- 				<view class="input-f">
					<image src="/static/icons/phone.png"></image>
					<input class="cus-input" type="number" confirm-type="确认" v-model="phoneNum" placeholder="请输入手机号" />
				</view> -->
				<button @click="handleDyLogin" class="loginBtn" type="primary" :disabled="btnDisabled">抖音一键登录</button>
			</view>
			<!-- #endif -->
		</view>

		<view class="bot">
			<checkbox value="cb1" :checked="isCheckAgreement" color="#347DFF" style="transform:scale(0.7)"
				@click="selectChecked" />
			<view>
				<text class="tit">我已阅读并同意</text>
				<text class="blue" @click="goPrivacy()">《隐私政策》</text>
			</view>
		</view>
		<wprivacy :onNeed="showPrivacy" title="隐私保护指引" predesc="..." subdesc="..." />
	</view>
</template>

<script>
import { get, post } from '@/common/request.js';
import config from '@/common/config';

export default {
	data() {
		return {
			phone: '',
			userInfo: {},
			hasUserInfo: false,
			canIUseGetUserProfile: false,
			openId: "",
			sessionKey: "",
			avatarUrl: "",
			nickName: "",
			showPrivacy: true,
			isCheckAgreement: false,
			isSelect: true,
			hasLocation: false,
			formUserPage: false,
			phoneNum: '',
			btnDisabled: false
		};
	},

	onShow() {
		const pages = getCurrentPages();
		const prevPage = pages[pages.length - 2];
		if (prevPage && prevPage.route === 'pages/user/user') {
			this.formUserPage = true;
		}
	},

	methods: {
	    // 获取头像
	    chooseAvatar(e) {
	        this.avatarUrl = e.detail.avatarUrl;
	        uni.setStorageSync('avatarUrl', e.detail.avatarUrl);
	    },
	
	    replaceInput(e) {
	        this.nickName = e.detail.value;
	    },
	
	    // 获取昵称
	    nicknameBlur(e) {
	        this.nickName = e.detail.value;
	    },
	
	    selectChecked() {
	        this.isCheckAgreement = !this.isCheckAgreement;
	    },
	
	    // 短信验证码
	    async sendCode(phone) {
	        const res = await get('postSms', {
	            phone: phone
	        });
	    },
	
	    async handleLoginSuccess(res, beforePage) {
	        uni.setStorageSync('token', res.token);
	        uni.setStorageSync('userId', res.userId);
	        uni.setStorageSync('nickName', res.ssoLoginCode);
	        uni.showToast({
	            title: '登录成功',
	            icon: 'none',
	            duration: 1800,
	            mask: true,
	        });
	        setTimeout(() => {
	            if (this.formUserPage) {
	                uni.navigateBack({
	                    success: () => beforePage.onLoad(),
	                });
	            } else {
	                uni.navigateBack();
	            }
	        }, 1600);
	    },
	
	    checkAgreementAndToast(isCheckAgreement) {
	        if (!isCheckAgreement) {
	            uni.showToast({
	                icon: 'none',
	                title:"请勾选隐私协议",
	            });
	            return false;
	        }
	        return true;
	    },
	
	    // 微信登录
	    async handleWxLogin(e) {
	        const beforePage = getCurrentPages()[getCurrentPages().length - 2];
	        if (!this.checkAgreementAndToast(this.isCheckAgreement)) return;
	        if (e.detail.errMsg === "getPhoneNumber:ok") {
	            this.handleLogin("weixin", e, beforePage);
	        }
	    },
	
	    // 抖音登录
	    handleDyLogin() {
			const beforePage = getCurrentPages()[getCurrentPages().length - 2];
	        if (!this.checkAgreementAndToast(this.isCheckAgreement)) return;
	        this.handleLogin("toutiao", {}, beforePage);
	    },
	
	    async handleLogin(provider, e, beforePage) {
	        uni.login({
	            provider: provider,
	            onlyAuthorize: true,
	            success: async (loginRes) => {
	                const code = loginRes.code;
	                const res = await post(`${provider}Login`, {
	                    code: code,
	                    ...(provider === "weixin" ? {
	                        encryptedData: encodeURIComponent(e.detail.encryptedData),
	                        iv: encodeURIComponent(e.detail.iv)
	                    } : {})
	                });
	                if (res.token) {
	                    await this.handleLoginSuccess(res, beforePage);
	                } else {
	                    uni.showToast({
	                        icon: 'none',
	                        title: '登录失败',
	                    });
	                }
	            },
	            fail: (err) => {
	                console.error(err);
	            }
	        });
	    },
	
	    goPrivacy() {
	        this.showPrivacy = true;
	    }
	}
};
</script>

<style lang="scss" scoped>
	page {
		background-color: #ffffff;
		width: 92%;
		margin-left: 4%;

		.sigin {
			background-color: #fff;

			.banner {
				width: 750rpx;
				height: 315rpx;

				.bottom {
					width: 100%;
					height: 100%;
				}

				.upper {
					position: absolute;
					width: 240rpx;
					height: 68rpx;
					top: 86rpx;
					left: 54rpx;
				}
			}

			.box {
				background: #ffffff;
				border-radius: 40rpx 40rpx 0 0;
				position: sticky;
				margin-top: -70rpx;
				padding: 20rpx 40rpx;

				.phone {
					font-size: 40rpx;
					color: #3D3D3D;
				}

				.desc {
					color: #A19B9A;
					font-size: 28rpx;
					padding: 20rpx 0;
				}

				.img {
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 160rpx;
						height: 160rpx;
						color: #999999;
						margin-top: 20rpx;
					}
				}

				.avatar {
					display: flex;
					justify-content: center;
					align-items: center;

					button {
						background-color: #ffffff;
						color: #4088fd;
					}

					button::after {
						border: none;
					}

					.line {
						border-bottom: 1rpx solid #4088fd;
					}
				}

				.nickname {
					margin-top: 20rpx;
					display: flex;
					justify-content: center;
					width: 100%;

					.borde {
						display: flex;
						align-items: center;
						border: 1rpx solid #c8c8c8;
						border-radius: 20rpx;
						padding: 18rpx 20rpx;
						width: 100%;

						.nick {
							width: 40rpx;
							height: 40rpx;

							.icons {
								width: 40rpx;
								height: 40rpx;
							}
						}

						.inputs {
							margin-left: 10rpx;
							color: #333333;
							font-size: 32rpx;
						}
					}
				}

				.login {
					display: flex;
					justify-content: center;
					margin-top: 50rpx;

					button {
						width: 100%;
						height: 88rpx;
						line-height: 80rpx;
						border: 1rpx solid #cbcbcb;
						border-radius: 20rpx;
						background-color: #347DFF;
						color: #ffffff;
						font-size: 32rpx;
					}
				}

				@if TOUTIAO {
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

						.loginBtn {
							margin-top: 40rpx;
							background-color: #4088fd;
							color: #ffffff;
						}

						.loginBtn:disabled {
							background-color: #D1E1FF;
						}
					}
				}

			}

			.bot {
				display: flex;
				justify-content: center;
				margin: 40rpx 80rpx;
				padding-bottom: 40rpx;

				.tit {
					color: #333333;
					font-size: 32rpx;
				}

				.blue {
					color: #347DFF;
					font-size: 32rpx;
				}
			}
		}
	}
</style>