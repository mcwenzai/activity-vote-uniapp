<template>
	<loading v-if="isLoading"></loading>
	<view v-else>
		<image class="top" src="/static/image/banner.png" mode="widthFix"></image>
		<view class="banner">
			<view class="ranking">
				<text class="text">NO.</text>
				<text class="num">{{personDetailData.top}}</text>
			</view>
			<view class="avater">
				<up-avatar :size="80"
					:src="personDetailData.imageUrl?personDetailData.imageUrl:'/static/image/avare-defa.png'"></up-avatar>
			</view>
			<view class="vote-num">
				<text class="num">{{personDetailData.voteCount}}</text>
				<text class="text">票</text>
			</view>
		</view>

		<view class="line">
			<view class="name">{{personDetailData.personName}}</view>
			<view class="city">{{personDetailData.city}}</view>
		</view>
		<view class="school">{{personDetailData.school}}·{{personDetailData.profession}}</view>
		<view class="box">
			<view class="title">{{personDetailData.voteTitle}}</view>
			<view class="box-ch">
				<view class="ma">
					<up-read-more class="desc" showHeight="200" :shadowStyle="shadowStyle" :toggle="true" openText="关闭"
						closeText="展开">
						<rich-text :nodes="personDetailData.introduce"></rich-text>
					</up-read-more>
					<video class="video" id="myVideo" :src="personDetailData.videoUrl" autoplay controls></video>
				</view>
			</view>
		</view>
		<up-gap height="100" bgColor="#ffffff"></up-gap>

		<view class="bottom">
				<up-button type="primary" text="已投票" :customStyle="customStyle" :disabled="isVoted"
					@click="voteTap(personDetailData)" v-if="isVoted"></up-button>
					<up-button type="primary" text="给TA投票" :customStyle="customStyle"
						@click="voteTap(personDetailData)" v-else></up-button>
			<up-button plain="true" text="分享" openType="share" color="#347DFF" iconColor="#347DFF" @click="vodeShare"
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
				personDetailData: null,
				voteNum: 0,
				rankingNum: 0,
				isVoted: false,
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
				}
			};
		},
		onLoad(e) {
			this.getPersonDetail(e);
		},

		onReady: function(res) {
			this.videoContext = uni.createVideoContext('myVideo')
		},

		methods: {
			async getPersonDetail(id) {
				const res = await get('getPersonDetail', id)
				this.personDetailData = res;
				this.isLoading = false
			},
			async voteTap(e) {
				let voteId = this.personDetailData.voteId
				const data = {
					id: e.id,
					voteId: voteId
				};
				try {
					const result = await post('postPersonVote', data);
					uni.showToast({
						title: '投票成功'
					});
				} catch (err) {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
					this.isVoted = true
					return
				}
			},

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
			color: #3A2A2A;
			margin-left: 40rpx;
		}

		.city {
			background: #FDEDE4;
			border-radius: 40rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #DC9D7A;
			padding: 4rpx 8rpx;
			margin-left: 10rpx;
		}

	}

	.school {
		text-align: center;
		font-size: 28rpx;
		color: #A19B9A;
		line-height: 28rpx;
		margin-bottom: 40rpx;
	}

	.box {
		background: #F1F9FF;
		box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(20, 47, 96, 0.2);
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		margin: 24rpx;


		.title {
			padding: 24rpx;
			font-weight: 600;
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