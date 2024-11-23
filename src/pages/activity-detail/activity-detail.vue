<template>
	<loading v-if="isLoading"></loading>
	<view class="detail" v-else>
		<!-- 		<up-lazy-load threshold="0" border-radius="10" :image="activityDetail.backgroundUrl" img-mode="aspectFill"
			:height="211"></up-lazy-load> -->
		<image class="top" :src="activityDetail.backgroundUrl"></image>
		<button open-type="share" @click="showShare()">
			<image class="ab-right" src="/static/image/fenxiang.png"></image>
		</button>
		<view class="box">
			<image class="title" src="/static/image/baomingxinxi.png" mode=""></image>
			<view class="desc1">
				<image class="left" src="/static/image/yuandian.png" mode=""></image>
				<view class="right">
					<text>报名时间：</text>
					<text>{{activityDetail.enterStartTime}}</text>
				</view>
			</view>
			<view class="desc">
				<image class="left" src="/static/image/yuandian.png" mode=""></image>
				<view class="right">
					<text>联系人：</text>
					<text>{{activityDetail.contractPerson}}</text>
					<text style="margin-left: 20rpx;color: #3D70B7;"
						@click="callPhone(activityDetail.phone)">{{activityDetail.phone}}</text>
				</view>
			</view>
			<view class="desc">
				<image class="left" src="/static/image/yuandian.png" mode=""></image>
				<view class="right">
					<text>主办方：</text>
					<text>{{activityDetail.sponsor}}</text>
				</view>
			</view>
			<view class="desc2">
				<image class="left" src="/static/image/yuandian.png" mode=""></image>
				<view class="right">
					<text>承办方：</text>
					<text>{{activityDetail.organizer}}</text>
				</view>
			</view>
			<!-- 			<view class="desc">
				<image class="left" src="/static/image/yuandian.png" mode=""></image>
				<view class="right">
					<text>费用：</text>
					<text>{{activityDetail.charge}}</text>
				</view>
			</view> -->
		</view>
		<view class="box">
			<image class="title" src="/static/image/huodongjieshao.png" mode=""></image>
			<view class="desc3">
				<rich-text :nodes="activityDetail.introduce.replace(/\s/g, '')" space="true"></rich-text>
			</view>
			<!-- <scroll-view :scroll-top="scrollTop" scroll-y="true" class="content" @scrolltoupper="upper" -->
			<!-- @scrolltolower="lower" @scroll="scroll"> -->
			<!-- <text user-select="false">{{activityDetail.introduce}}</text> -->
			<!-- </scroll-view> -->
		</view>
		<view class="box1">
			<image class="title" src="/static/image/huodongxuzhi.png" mode=""></image>
			<view class="content">
				<rich-text :nodes="activityDetail.notice.replace(/\s/g, '')" space="true"></rich-text>
			</view>
		</view>
		<view class="bottom">
			<view class="fav" @click="collection()">
				<up-icon name="star-fill" color="#347DFF" size="24" v-if="activeCollection"></up-icon>
				<up-icon name="star" size="24" v-else></up-icon>
				<view :class="activeCollection ? 'text-color':'text'">收藏</view>
			</view>
			<button class="fixed-color" :disabled="isButton" @click="goSignUp(activityDetail)"
				v-if="isButton">我要报名</button>
			<button class="fixed-color" :disabled="isButton" @click="goSignUp(activityDetail)" v-else>我要报名</button>
		</view>
		<!-- 		<up-popup :show="isShowShare" @close="closeShare" @open="openShare">
			<view class="share">
				<button class="left" style="background-color: transparent;" open-type="share">
					<up-icon color="#00b70c" size="40" name="weixin-fill"></up-icon>
					<view class="text">好友</view>
				</button>
				<button class="right" open-type="share">
					<image :show-loading="true" src="../../../../static/icons/pengyouquan.svg" width="60rpx"
						height="60rpx" @click="click"></image>
					<view class="text">
						朋友圈
					</view>
				</button>
			</view>
		</up-popup> -->
		<up-gap height="76"></up-gap>
	</view>
</template>

<script>
	import {
		get
	} from '@/common/request.js';
	import {
		timeToTimestamp
	} from '@/util/util.js';
	export default {
		data() {
			return {
				activityDetail: {},
				loading: true,
				activityId: '',
				id: "",
				statusList: [],
				activeCollection: false,
				remainingDays: 0,
				remainingHours: 0,
				remainingMinute: 0,
				remainingSecond: 0,
				isCheck: false,
				isLoading: true,
				isShowShare: false,
				isButton: false
			}
		},
		onLoad(e) {
			this.getActivityDetail(e);
		},
		//分享到朋友圈
		onShareTimeline(res) {
			return {
				title: `#艺术正青春共创大赛#我报名参加了${this.activityDetail.name}，点击进来围观吧！`,
				path: '/page/activity-detail/activity-detail?id=' + this.id
			}
		},
		methods: {
			async getActivityDetail(id) {
				const favList = uni.getStorageSync('favList');
				try {
					const res = await get('getActivityDetail', id);
					for (let i = 0; i < favList.length; i++) {
						if (favList[i].id === id.id) {
							this.activeCollection = true
						}
					}
					this.id = id.id
					this.activityDetail = res;
					this.isLoading = false
				} catch (error) {
					uni.showToast({
						title: error,
						icon: 'none'
					})
				}
			},

			collection() {
				let token = uni.getStorageSync('token')
				if (token) {
					let activeCollection = this.activeCollection;
					let list = this.activityDetail;
					let favData = uni.getStorageSync('favList') ? uni.getStorageSync('favList') : [];
					if (activeCollection) {
						let id = this.id
						this.activeCollection = false
						uni.showToast({
							title: '取消成功'
						})
						let favList = favData.filter(item => item.id !== id);
						uni.setStorageSync('favList', favList)
					} else {
						this.activeCollection = true
						uni.showToast({
							title: '收藏成功'
						})
						favData.push(list)
						uni.setStorageSync('favList', favData)
					}
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},

			goSignUp(data) {
				let token = uni.getStorageSync('token');
				if (token) {
					let objStr = JSON.stringify(data)
					let time = this.activityDetail.enterEndTime;
					const timeNow = Math.floor(Date.now() / 1000);
					if (timeToTimestamp(time) > timeNow) {
						uni.navigateTo({
							url: '/pages/sign-up/sign-up?data=' + encodeURIComponent(objStr)
						});
						this.isButton = false
					} else {
						uni.showToast({
							title: '此活动已截止报名！',
							icon: 'none'
						});
						this.isButton = true
					}
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},

			onShareAppMessage() {
				const promise = new Promise(resolve => {
					setTimeout(() => {
						resolve({
							title: '艺术正青春共创大赛'
						})
					}, 2000)
				})
				return {
					title: activityDetail.title,
					path: '/page/activity-detail/activity-detail?id=' + this.id,
					promise
				}
			},

			closeShare() {
				this.isShowShare = false
			},

			callPhone(number) {
				uni.makePhoneCall({
					phoneNumber: number,
					success: function() {
						console.log('拨打电话成功');
					},
					fail: function() {
						console.log('拨打电话失败');
					}
				});
			},

			shareClick() {
				this.showShare = true
			},

			friendShare() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 1,
					summary: "我正在参与艺术正青春活动，快来围观吧！",
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: linear-gradient(91deg, #D2D6EC 0%, #F9E8EE 100%);

		.top {
			width: 750rpx;
			height: 422rpx;
		}

		.ab-right {
			position: fixed;
			top: 80rpx;
			right: 0;
			width: 36rpx;
			height: 36rpx;
			background-color: #c8cad8;
			border-radius: 36rpx 0 0 36rpx;
			padding: 10rpx;
			z-index: 99;
			padding-right: 20rpx;
		}

		.box {
			background: linear-gradient(91deg, #E0E2F2 0%, #F8FAFC 100%);
			margin: 24rpx 24rpx 30rpx 24rpx;
			border-radius: 20rpx;

			.title {
				width: 452rpx;
				height: 154rpx;
			}

			.desc {
				line-height: 66rpx;
				display: flex;
				padding: 0 20rpx;

				.left {
					width: 37rpx;
					height: 37rpx;
					padding-top: 16rpx;
				}

				.right {
					width: 100%;
					font-size: 28rpx;
				}
			}

			.desc1 {
				position: sticky;
				margin-top: -92rpx;
				display: flex;
				padding: 20rpx;

				.left {
					width: 37rpx;
					height: 37rpx;
				}

				.right {
					width: 100%;
					font-size: 28rpx;
				}
			}

			.desc2 {
				line-height: 66rpx;
				display: flex;
				padding: 0 20rpx 20rpx 20rpx;

				.left {
					width: 37rpx;
					height: 37rpx;
					padding-top: 16rpx;
				}

				.right {
					width: 100%;
					font-size: 28rpx;
				}
			}

			.desc3 {
				position: sticky;
				margin-top: -96rpx;
				display: flex;
				align-items: center;
				padding: 20rpx;
				font-size: 28rpx;
				line-height: 60rpx;
			}

			.title-p {
				position: sticky;
				margin-left: 30rpx;
				margin-top: -40rpx;
				width: 192rpx;
				height: 48rpx;
				background: linear-gradient(90deg, #3D70B7 0%, #00468D 99%);
				border-radius: 24rpx 4rpx 4rpx 4rpx;
				line-height: 48rpx;

				.col {
					padding-left: 20rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					line-height: 45rpx;
				}
			}

			.content {
				position: sticky;
				padding: 0 20rpx 20rpx 20rpx;
				margin-top: -80rpx;
				width: 670rpx;
				height: 360rpx;

				text {
					font-size: 28rpx;
					color: #313232;
					line-height: 56rpx;
				}
			}
		}


		.box1 {
			margin: 30rpx 24rpx;
			background: linear-gradient(91deg, #E0E2F2 0%, #F8FAFC 100%);
			border-radius: 20rpx;

			.title {
				width: 452rpx;
				height: 154rpx;
			}

			.desc {
				line-height: 76rpx;
				display: flex;
				padding: 0 20rpx;

				.left {
					width: 37rpx;
					height: 37rpx;
					padding-top: 22rpx;
				}

				.right {
					width: 100%;
					font-size: 28rpx;
				}
			}

			.desc1 {
				position: sticky;
				margin-top: -74rpx;
				line-height: 76rpx;
				display: flex;
				align-items: center;
				padding: 0 20rpx;

				.left {
					width: 37rpx;
					height: 37rpx;
				}

				.right {
					width: 100%;
					font-size: 28rpx;
				}
			}

			.title-p {
				position: sticky;
				margin-left: 30rpx;
				margin-top: -40rpx;
				width: 192rpx;
				height: 48rpx;
				background: linear-gradient(90deg, #3D70B7 0%, #00468D 99%);
				border-radius: 24rpx 4rpx 4rpx 4rpx;
				line-height: 48rpx;

				.col {
					padding-left: 20rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					line-height: 45rpx;
				}
			}

			.content {
				position: sticky;
				padding: 20rpx;
				margin-top: -90rpx;
				width: 670rpx;
				font-size: 28rpx;
				line-height: 60rpx;

				text {
					font-size: 28rpx;
					color: #313232;
					line-height: 60rpx;
				}
			}
		}

		.bottom {
			width: 100%;
			height: auto;
			border-top: 2rpx solid #f1f1f1;
			background-color: #ffffff;
			bottom: 0;
			z-index: 99;
			position: fixed;
			display: flex;
			padding: 20rpx 30rpx;
			justify-content: space-between;

			.fav {
				padding-bottom: 20rpx;
				padding-left: 20rpx;
				font-size: 30rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.text {
					color: #444444;
				}

				.text-color {
					color: #4088fd;
					font-weight: bold;
				}

				.uni-fav {
					display: block;
				}
			}

			.fixed-color {
				width: 540rpx;
				height: 96rpx;
				line-height: 96rpx;
				background: #347DFF;
				box-shadow: 1rpx 2rpx 6rpx 0rpx rgba(84, 135, 189, 0.17), 2rpx 0rpx 0rpx 0rpx #FFFFFF, 3rpx 0rpx 0rpx 0rpx rgba(228, 228, 228, 0.42), -2rpx 0rpx 0rpx 0rpx rgba(123, 170, 219, 0.5), -4rpx 0rpx 0rpx 0rpx rgba(255, 255, 255, 0.83), -4rpx -6rpx 4rpx 0rpx rgba(255, 255, 255, 0.28), -3rpx 0rpx 0rpx 0rpx rgba(255, 255, 255, 0.83), -4rpx -2rpx 0rpx 0rpx rgba(51, 84, 164, 0.27), -5rpx -3rpx 3rpx 0rpx rgba(255, 255, 255, 0.3), 13rpx 10rpx 21rpx 0rpx rgba(255, 255, 255, 0.48);
				border-radius: 10rpx;
				color: #ffffff;
			}

			button[disabled] {
				color: #ffffff;
				background: #999999 !important;
			}
		}
		/* #ifdef MP-TOUTIAO */
		button {
			position: unset;
		}
		/* #endif */

		.share {
			display: flex;
			justify-content: space-between;
			width: 550rpx;
			margin-left: 100rpx;

			button::after {
				border: none;
				background: none;
				background-color: none;
				position: unset;
			}

			.left {
				border: none;
				background-color: none;

				.text {
					text-align: center;
				}
			}

			.right {
				flex-direction: column;
				align-items: center;
				display: flex;
				justify-content: flex-end;

				image {
					width: 52rpx;
					height: 52rpx;
				}

				.text {
					margin-top: 10rpx;
					text-align: center;
				}
			}
		}
	}
</style>