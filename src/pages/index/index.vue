<template>
	<loading v-if="isLoading"></loading>
	<view class="index" v-else>
		<image class="swiper" mode="widthFix"
			src="https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1810973744303722498.png"></image>
		<up-gap height="6" bgColor="#f6f6f6"></up-gap>
		<view class="card1">
			<view class="vote-title">
				<view class="left">正在投票</view>
				<view class="right" @click="goVoteList">更多</view>
			</view>
			<view class="vote">
				<block v-for="(item, index) in voteList.slice(0,3)" :key="index">
					<view class="margins">
						<view class="list" hover-class="uni-list-cell-hover" @click="goVoteDetail(item)">
							<image class="left" :src="item.carousel.url?item.carousel.url:'/static/image/noimage.png'"
								mode="aspectFill"></image>
							<view class="right">
								<view class="title">{{ item.name }}</view>
								<view class="act">
									<up-icon size="13" name="clock"></up-icon>
									<text class="gap">{{item.start_time.slice(0,10)}}</text>~
									<text>{{ item.end_time.slice(0,10) }}</text>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<view class="yauntuan" @click="goYuantuan">
			<image src="../../static/image/yuantuan-index.png" mode="aspectFill"></image>
			<view class="desc">院团作品专题展示，诚邀您点赞！</view>
		</view>
		<view class="card2">
			<view class="hot">
				<view class="left">
					<text class="title">热门活动</text>
					<image class="icon" src="/static/icons/hot.png"></image>
				</view>
				<view class="right" @click="goActivityList">
					<text class="more">更多</text>
				</view>
			</view>
			<view class="activity">
				<empty typeText="热门活动" v-if="!activityList.length"></empty>
				<!-- <up-empty mode="list" text="暂无热门活动" v-if="!activityList.length"></up-empty> -->
				<block v-for="(item, index) in activityList" :key="index" v-else>
					<view class="margins" v-if="item.recommendFlag === 'Y'">
						<view class="list" hover-class="uni-list-cell-hover" v-if="item.status=='CLOSED'"
							@click="goDetail(item)">
							<image class="left" :src="item.imageUrl?item.imageUrl:'/static/image/noimage.png'"
								mode="aspectFill"></image>
							<view class="right">
								<view class="title">{{ item.name }}</view>
								<view class="act">
									<text class="left">报名时间: </text>
									<text>{{ item.startTime.slice(0, 10) }}</text>
									<text>~</text>
									<text>{{ item.endTime.slice(0, 10) }}</text>
								</view>
							</view>
						</view>
						<view class="list" hover-class="uni-list-cell-hover" @click="goDetail(item)" v-else>
							<image class="left" :src="item.imageUrl?item.imageUrl:'/static/image/noimage.png'"
								mode="aspectFill"></image>
							<view class="right">
								<view class="title">{{ item.name }}</view>
								<view class="act">
									<text class="left">报名时间: </text>
									<text>{{ item.startTime.slice(0, 10) }}</text>
									<text>~</text>
									<text>{{ item.endTime.slice(0, 10) }}</text>
								</view>
							</view>
						</view>
						<view class="bottom" v-if="item.status=='CLOSED'">
							<view class="left-c">
								<uni-icons type="staff-filled" color="#A19B9A" size="22"></uni-icons>
								<text class="first">已报名</text>
								<text class="second">{{item.enterCount ? item.enterCount: '0'}}</text>
								<text class="three">人</text>
							</view>
							<view class="right-c" v-if="item.signupStatus=== 'N'">我要报名</view>
							<view class="right-c" v-if="item.signupStatus=== 'Y'">已报名</view>
						</view>
						<view class="bottom" v-else>
							<view class="left">
								<uni-icons type="staff-filled" color="#FF9743" size="22"></uni-icons>
								<text class="first">已报名</text>
								<text class="second">{{item.enterCount ? item.enterCount: '0'}}</text>
								<text class="three">人</text>
							</view>
							<view class="right" v-if="item.signupStatus=== 'N'" @click="goSignUp(item)">我要报名</view>
							<view class="right" v-if="item.signupStatus=== 'Y'">已报名</view>
						</view>
					</view>
				</block>
			</view>
		</view>

		<up-gap height="10" bgColor="#f6f6f6"></up-gap>
		<view class="card3">
			<view class="notice-title">
				<view class="left">通知公告</view>
				<view class="right" @click="goNotice">更多</view>
			</view>
			<empty typeText="通知公告" v-if="!noticeList.length"></empty>
			<!-- <up-empty mode="news" text="暂无通知公告" icon="/static/image/nocomment.png" v-if="!noticeList.length"></up-empty> -->
			<view class="notice" v-for="(item,index) in noticeList" :key="index" @click="goNoticeDetail(item.id)" v-else>
				<image src="/static/icons/notic.png"></image>
				<view class="right">
					<view class="title">{{item.noticeTitle}}</view>
					<view class="date">{{item.publishTime}}</view>
				</view>
			</view>
		</view>
		<up-gap height="10" bgColor="#f6f6f6"></up-gap>

		<!-- 活动资讯 -->
		<view class="separate"></view>
		<up-cell style="background: #ffffff" size="large" title="活动资讯" value="更多" :border="false"></up-cell>
		<view class="new" hover-class="uni-list-cell-hover" v-for="(value,index) in newList" :key="index">
			<view class="list">
				<view class="body">
					<view class="title">{{ value.title }}</view>
					<view class="date">{{ value.time }}</view>
				</view>
				<image class="new-img" :src="value.img"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		get
	} from '@/common/request.js';
	import {
		timeToTimestamp
	} from '@/util/util.js';
	import config from '@/common/config';
	export default {
		data() {
			return {
				activityList: [
					{imageUrl: "https://qn.zypx888.com/carousel/20240913/09/3416-7996103047.jpg",name:"星动力2024少年篮球之星",recommendFlag:"Y",status:'OPENING',startTime:"2023-11-23",endTime:"2024-11-23",enterCount:"891",signupStatus:"N"}
				],
				newList: [],
				noticeList: [],
				isLoading: false,
				voteList: [],
				isNewOpen: false
			}
		},
		onLoad() {
			this.getActivityList();
			this.getNoticeList();
			this.getVoteList();
		},
		onShow() {
			if (this.isNewOpen) {
				this.getActivityList();
			}
		},
		onPullDownRefresh() {
			this.getActivityList();
			this.getNoticeList();
			this.getVoteList();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 200);
		},
		methods: {
			async getActivityList(sta, text) {
				const argu = {
					recommendFlag: "Y",
					pageSize: 3,
				}
				const res = await get('getActivity', argu);
				this.activityList = res.rows;
				this.isLoading = false
			},
			async getNoticeList() {
				let argu = {
					pageNo: 1,
					pageSize: 3
				}
				const res = await get('getNoticeList', argu)
				this.noticeList = res.rows;
				this.isLoading = false
			},
			async getVoteList(status) {
				const argu = {
					status: 'PROGRESSING',
					page: 1,
					perPage: 3
				}
				const res = await get('getVoteList', argu)

				this.voteList = res
			},
			goActivityList() {
				this.isNewOpen = false
				uni.switchTab({
					url: '/pages/activity-list/activity-list'
				})
			},
			goVoteList() {
				this.isNewOpen = false
				uni.switchTab({
					url: '/pages/vote/vote'
				})
			},
			goVoteDetail: function(e) {
				this.isNewOpen = false
				let token = uni.getStorageSync('token');
				if (token) {
					uni.navigateTo({
						url: `/pages/vote-list/vote-list?id=${e.id}&endTime=${e.voteEnd}`
					});
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			goDetail(item) {
				this.isNewOpen = false
				uni.navigateTo({
					url: `/pages/activity-detail/activity-detail?id=${item.id}`
				});
			},
			goSignUp(data) {
				this.isNewOpen = true
				let token = uni.getStorageSync('token');
				if (token) {
					let objStr = JSON.stringify(data)
					let time = data.endTime;
					const timeNow = Math.floor(Date.now() / 1000);
					if (timeToTimestamp(time) > timeNow) {
						uni.navigateTo({
							url: '/pages/sign-up/sign-up?data=' + encodeURIComponent(objStr)
						})
					} else {
						uni.showToast({
							title: '此活动已截止报名！',
							icon: 'none'
						})
					}
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},

			goNotice() {
				this.isNewOpen = false
				uni.navigateTo({
					url: `/pages/notice/notice`
				});
			},
			goVote() {
				this.isNewOpen = false
				uni.switchTab({
					url: '/pages/vote/vote'
				})
			},
			goNoticeDetail(id) {
				this.isNewOpen = false
				uni.navigateTo({
					url: '/pages/notice-detail/notice-detail?id=' + id
				});
			},
			goYuantuan() {
				this.isNewOpen = false
				uni.navigateTo({
					url: '/pages/troupes/troupes'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		background-color: #f6f6f6;

		.swiper {

			width: 100%;
			height: 100%;
		}

		.card1 {
			margin: 0 20rpx;
			border-radius: 20rpx;
			background-color: #ffffff;
			padding: 20rpx;

			.vote-title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-size: 34rpx;
					font-weight: 600;
				}

				.right {
					font-size: 26rpx;
					color: #606266;
				}
			}

			.vote {

				.margins {
					margin-top: 30rpx;
					margin-bottom: 10rpx;

					.list {
						background-image: url('https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1808748967669334017.png');
						background-size: 700rpx 180rpx;
						display: flex;
						border-radius: 30rpx;

						.left {
							width: 200rpx;
							height: 180rpx;
							border-radius: 10rpx;
						}

						.right {
							width: 510rpx;
							margin: 10rpx 20rpx;
							display: flex;
							flex-flow: column;
							justify-content: space-between;

							.title {
								font-size: 32rpx;
								color: #333333;
							}

							.act {
								display: flex;
								align-items: center;
								line-height: 62rpx;
								height: 62rpx;
								color: #666666;
								font-size: 26rpx;

								.gap {
									margin-left: 6rpx;
								}
							}
						}
					}
				}
			}
		}

		.yauntuan {
			display: flex;
			align-items: center;
			margin: 20rpx;
			font-size: 30rpx;
			background-color: #ffffff;
			padding: 20rpx;
			border-radius: 12rpx;

			image {
				width: 120rpx;
				height: 80rpx;
				border-radius: 8rpx;
			}

			.desc {
				margin: 20rpx;
				font-size: 32rpx;
				color: #333333;
			}
		}

		.card2 {
			margin: 0 20rpx;
			border-radius: 20rpx;
			background-color: #ffffff;
			padding: 20rpx;

			.hot {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					display: flex;
					align-items: center;

					.title {
						font-size: 34rpx;
						font-weight: 600;
					}

					.icon {
						width: 44rpx;
						height: 44rpx;
					}
				}

				.right {
					margin-left: 10rpx;

					.more {
						font-size: 26rpx;
						color: #606266;
					}
				}
			}

			.activity {
				display: block;

				.margins {
					margin-top: 30rpx;
					border-radius: 20rpx;

					.list {
						display: flex;

						image {
							width: 200rpx;
							height: 180rpx;
							border-radius: 10rpx;
						}

						.right {
							margin-left: 20rpx;
							display: flex;
							flex-flow: column;
							justify-content: space-between;
							max-width: calc(100% - 220rpx);

							.title {
								font-size: 32rpx;
								color: #333333;
								// font-weight: 600;
							}

							.sign {
								margin-top: 20rpx;
								line-height: 62rpx;
								height: 62rpx;
								color: #666666;
								font-size: 26rpx;

								.left {
									font-size: 28rpx;
								}
							}

							.act {
								line-height: 62rpx;
								height: 62rpx;
								color: #666666;
								font-size: 26rpx;

								.left {
									font-size: 28rpx;
								}
							}


							.activity-bottom {
								font-size: 26rpx;
								color: #666666;
							}

							.activity-recom {
								font-size: 24rpx;
								text-align: center;
								width: 80rpx;
								height: 40rpx;
								color: #ff704d;
								border: 1rpx solid #ff704d;
								border-radius: 10rpx;
							}
						}
					}

					.bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.left {
							display: flex;
							align-items: center;
							color: #FF9743;

							.first {
								font-size: 28rpx;
								font-weight: 400;
							}

							.second {
								font-size: 30rpx;
							}

							.three {
								font-size: 28rpx;
								font-weight: 400;
							}
						}

						.left-c {
							display: flex;
							align-items: center;
							color: #A19B9A;

							.first {
								font-size: 28rpx;
							}

							.second {
								font-size: 30rpx;
							}

							.three {
								font-size: 28rpx;
							}
						}

						.right {
							background: #347DFF;
							border-radius: 20rpx 8rpx 20rpx 8rpx;
							font-size: 26rpx;
							color: #ffffff;
							text-align: center;
							padding: 10rpx 18rpx;

							.title {
								font-size: 32rpx;
								color: #333333;
							}
						}

						.right-c {
							background: #A19B9A;
							border-radius: 20rpx 8rpx 20rpx 8rpx;
							font-size: 26rpx;
							color: #ffffff;
							text-align: center;
							padding: 10rpx 18rpx;

							.title {
								font-size: 32rpx;
								color: #333333;
							}
						}

					}
				}
			}
		}

		.card3 {
			margin: 0 20rpx;
			border-radius: 20rpx;
			background-color: #ffffff;
			padding: 20rpx;

			.notice-title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-size: 34rpx;
					font-weight: 600;
				}

				.right {
					font-size: 26rpx;
					color: #606266;
				}
			}

			.notice {
				margin-top: 20rpx;
				display: flex;
				align-items: center;

				image {
					width: 88rpx;
					height: 88rpx;
				}

				.right {
					margin-left: 20rpx;

					.title {
						font-size: 32rpx;
						color: #333333;
						line-height: 58rpx;
					}

					.date {
						color: #666666;
						font-size: 26rpx;
					}
				}
			}
		}
	}
</style>