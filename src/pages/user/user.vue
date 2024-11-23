<template>
	<view class="main">
		<image class="banner" src="https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1810976734951526401.png"
			mode="widthFix"></image>
		<view class="user-bar">
			<view class="avatar">
				<image mode="aspectFill" :src="user.imageUrl ? user.imageUrl : avatarUrl" />
			</view>
			<view class="user" v-if="isLogin">
				<view class="name">{{user.nickName?user.nickName:nickName}}</view>
				<view class="bgra" @click="goNavigateTo('/pages/user-edit/user-edit')">
					<up-icon name="arrow-right"></up-icon>
				</view>
			</view>
			<view class="user" v-else>
				<view class="name" @click="goLogin">登录/注册</view>
			</view>
		</view>

		<view class="huodong" @click="goNavigateTo('/pages/user-activity/user-activity')">
			<image class="bg" src="../../static/icons/huodong-bg.png" mode=""></image>
			<text class="ab">已报名的活动</text>
		</view>

		<view class="box">
			<up-cell icon="../../../../static/icons/toupiao.png" :iconStyle="iconStyle" title="我参与的投票" :border="false"
				:isLink="true" arrow-direction="right" @click="goNavigateTo('/pages/user-vote/user-vote')"></up-cell>
			<up-cell icon="../../../../static/icons/xiaoxi.png" :iconStyle="iconStyle" title="我的消息" :border="false"
				:isLink="true" arrow-direction="right"
				@click="goNavigateTo('/pages/user-message/user-message')"></up-cell>
			<up-cell icon="../../../../static/icons/shoucang.png" :iconStyle="iconStyle" title="我的收藏" :border="false"
				:isLink="true" arrow-direction="right" @click="goNavigateTo('/pages/user-fav/user-fav')"></up-cell>
		</view>
	</view>
</template>

<script>
	import {
		get
	} from '@/common/request.js';
	export default {
		data() {
			return {
				isLogin: false,
				user: {},
				avatarUrl: '/static/image/avare-defa.png',
				nickName: "",
				token: "",
				userId: "",
				iconStyle: {
					'width': "40rpx",
					'height': "40rpx",
					'font-size': "300rpx"
				}
			};
		},
		onLoad() {
			this.getUserInfo();
		},
		methods: {
			getUserInfo() {
				let token = uni.getStorageSync('token')
				if (token) {
					this.isLogin = true
					this.token = token
					this.avatarUrl = uni.getStorageSync('avatarUrl')
					this.nickName = uni.getStorageSync('nickName')
					let userId = uni.getStorageSync('userId')
					this.getUserDetail(userId)
				} else {
					this.isLogin = false
				}
			},
			async getUserDetail(userId) {
				const res = await get('getUserDetail', {
					id: userId
				})
				this.user = res;
			},
			goNavigateTo(e) {
				if (this.token) {
					uni.navigateTo({
						url: e
					})
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},
			goLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f6f6f6;

		.main {
			padding: 0;

			.banner {
				width: 750rpx;
				height: 500rpx;
			}

			.user-bar {
				width: 100%;
				height: 200rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding-left: 40rpx;
				position: sticky;
				margin-top: -380rpx;

				.avatar {
					height: 144rpx;
					width: 144rpx;
					margin-right: 20rpx;
					font-size: 80rpx;
					border-radius: 50%;
					background-color: #dbe8ff;
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						height: 136rpx;
						width: 136rpx;
						border-radius: 136rpx;
					}
				}

				.user {
					.name {
						font-size: 36rpx;
						width: 380rpx;
						margin-left: 0rpx;
						margin-right: 40rpx;
						color: #333333;
						font-weight: 700;
					}

					.bgra {
						background-color: #ffffff;
						border-radius: 40rpx;
						width: 40rpx;
						height: 40rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-top: 20rpx;
					}
				}



				.edit {
					padding: 8rpx 12rpx;
					border: 1rpx solid #eeeeee;
					background-color: #eeeeee;
					border-radius: 8rpx;
					font-size: 26rpx;
					margin-top: 15rpx;
					color: #333333;
				}
			}

			.huodong {
				position: sticky;
				margin-top: 20rpx;
				margin-left: 20rpx;
				margin-right: 20rpx;
				background-color: #ffffff;
				border-radius: 20rpx 20rpx 0 0;
				background: rgba(255, 255, 255, 0.8);

				.bg {
					margin: 20rpx 28rpx;
					width: 654rpx;
					height: 112rpx;
					border: 1rpx solid #e0ecff;
					border-radius: 24rpx;
					box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.1);
					background-color: #ffffff;
				}

				.ab {
					position: absolute;
					left: 120rpx;
					top: 54rpx;
				}
			}

			.box {
				box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.1);
				margin: 0rpx 20rpx 0 20rpx;
				border-radius: 24rpx;
				background-color: #ffffff;
				position: sticky;
				padding: 0 30rpx;
			}

			.sign-out {
				width: 670rpx;
				margin: 40rpx 30rpx;

			}
		}
	}
</style>