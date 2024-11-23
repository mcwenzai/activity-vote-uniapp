<template>
	<loading v-if="isLoading"></loading>
	<view v-else>
		<image class="top" src="/static/image/banner.png" mode="widthFix"></image>
		<view class="banner">
			<view class="ranking">
				<text class="text">NO.</text>
				<text class="num">{{troupeDetailData.top}}</text>
			</view>
			<view class="avater">
				<up-avatar :size="80"
					:src="troupeDetailData.collegeImageUrl?troupeDetailData.collegeImageUrl:'/static/image/avare-defa.png'"></up-avatar>
			</view>
			<view class="vote-num">
				<text class="num">{{troupeDetailData.likes}}</text>
				<text class="text">赞</text>
			</view>
		</view>

		<view class="line">
			<view class="name">{{troupeDetailData.unitName}}</view>
		</view>
		<view class="box">
			<view class="title">{{troupeDetailData.programName}}</view>
			<view class="box-ch">
				<view class="ma">
					<up-read-more class="desc" showHeight="200" :shadowStyle="shadowStyle" :toggle="true" openText="关闭"
						closeText="展开">
						<rich-text :nodes="troupeDetailData.programBlurb"></rich-text>
					</up-read-more>
					<video class="video" id="myVideo" :src="troupeDetailData.programVideoUrl" autoplay controls></video>
				</view>
			</view>
		</view>
		<up-gap height="100" bgColor="#ffffff"></up-gap>
		<view class="bottom">
			<thumbs-up :throttle="100" :large="2" :duration="3000">
				<up-button type="primary" text="给TA点赞" :customStyle="customStyle"
					@click="troupesTap(troupeDetailData)"></up-button>
			</thumbs-up>
			<up-button :plain="true" text="分享" openType="share" color="#347DFF" iconColor="#347DFF" @click="voteShare"
				:customStyle="customStyle">分享</up-button>
		</view>
	</view>
</template>

<script>
	import {
		get,
		post
	} from '@/common/request.js';
	export default {
		data() {
			return {
				title: "",
				troupeDetailData: null,
				showButton: true,
				isLoading: true,
				shadowStyle: {
					backgroundImage: "none",
					paddingTop: "0",
					marginTop: "20rpx"
				},
				customStyle: {
					width: '700rpx',
					marginBottom: '20rpx',
					borderRadius: '20rpx 8rpx 20rpx 8rpx'
				},
				
			};
		},
		onLoad(e) {
			this.getCollegeDetail(e);
		},

		onReady: function(res) {
			this.videoContext = uni.createVideoContext('myVideo')
		},

		methods: {
			async getCollegeDetail(id) {
				const res = await get('getCollegeDetail', id)
				this.troupeDetailData = res;
				this.isLoading = false
			},

			async troupesTap(data) {
				try {
					await get('getAddLikes', {
						id: data.id
					});
					this.troupeDetailData.likes++
				} catch(err) {
					console.log(err)
					if (!err.success && err.message=='今日点赞数已用完') {
						this.showButton = false
						uni.showToast({
							title: err.message,
							icon: 'none'
						})
					}
				}
			},
			// #ifdef MP-WEIXIN
			voteShare() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 1,
					summary: "我正在参与艺术正青春投票活动，快来围观吧！",
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			},
			// #endif
			// #ifdef MP-TOUTIAO
			voteShare() {
				uni.share({
					provider: "toutiao",
					scene: "WXSceneSession",
					type: 1,
					summary: "我正在参与艺术正青春投票活动，快来围观吧！",
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			}
			// #endif
		}
	}
</script>

<style lang="scss">
	.top {
		width: 750rpx;
	}

	.banner {
		position: sticky;
		display: flex;
		justify-content: space-between;
		margin-top: -130rpx;
		color: #ffffff;

		.ranking {
			padding-left: 52rpx;
			font-size: 34rpx;
			font-weight: 600;
		}

		.avatar {
			width: 160rpx;
			height: 160rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.vote-num {
			padding-right: 52rpx;
			font-size: 34rpx;
			font-weight: 600;
		}
	}

	.line {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		margin: 10rpx 0;

		.name {
			font-size: 40rpx;
			color: $title-main-color;
			font-weight: 600;
		}
	}

	.box {
		background: #F1F9FF;
		box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(20, 47, 96, 0.2);
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		margin: 24rpx;


		.title {
			padding: 24rpx;

			font-size: 36rpx;
			color: #3A2A2A;
		}

		.box-ch {
			background: #eaf5ff;
			border-radius: 20rpx 20rpx 20rpx 20rpx;

			.ma {
				margin: 0 24rpx;

				rich-text {
					font-size: 28rpx;
					color: #5E5555;
					line-height: 52rpx;
				}

				.video {
					margin: 20rpx 0 10rpx 0;
					border-radius: 20rpx;
					width: 658rpx;
					height: 364rpx;
				}
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		padding: 30rpx;

		.four {
			width: 702rpx;
			height: 80rpx;
			background: #347DFF;
			border-radius: 20rpx 8rpx 20rpx 8rpx;
		}
	}
</style>