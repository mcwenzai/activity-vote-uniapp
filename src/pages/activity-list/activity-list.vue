<template>
	<loading v-if="isLoading"></loading>
	<block v-else>
		<up-sticky bgColor="#fff">
			<view class="fill">
				<up-search placeholder="搜索标题" bgColor="#f6f6f6" :showAction="false" :clearabled="false"
					v-model="searchText" @search="activitySeach"></up-search>
			</view>
			<up-tabs :list="activityStatus" borderColor="#fffff" :activeStyle="{color: '#303133',fontWeight: 'bold'}"
				:scrollable="false" @change="changeTab"></up-tabs>
		</up-sticky>
		<view class="margin-color"></view>
		<view class="activity" v-if="activityList.length">
			<block v-for="(item, index) in activityList" :key="index">
				<view class="margins" @click="goDetail(item)">
					<view class="list" hover-class="uni-list-cell-hover">
						<up-lazy-load threshold="0" border-radius="10" :image="item.imageUrl" img-mode="aspectFill"
							:height="90"></up-lazy-load>
						<!-- <image class="left" :src="item.imageUrl" mode="aspectFill"></image> -->
						<view class="right">
							<view class="activity-top">{{ item.name }}</view>
							<view class="act">
								<text class="left">报名时间: </text>
								<text>{{ item.enterStartTime.slice(0, 10) }}</text>
								<text>~</text>
								<text>{{ item.enterEndTime.slice(0, 10) }}</text>
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
						<view class="right" v-if="item.signupStatus=== 'N'" @click.stop="goSignUp(item)">我要报名</view>
						<view class="right" v-if="item.signupStatus=== 'Y'">已报名</view>
					</view>
				</view>
			</block>
			<up-loadmore :status="loadStatus" :loading-text="loadingText" :loadmore-text="loadmoreText"
				:nomore-text="nomoreText" color="#c0c7e2" lineColor="#d8e0ff" :dashed="false" line />
			<up-gap height="10" bgColor="#f6f6f6"></up-gap>
		</view>
		<empty typeText="活动" v-else></empty>
	</block>
</template>
<script>
	import {
		get
	} from '@/common/request.js';
	import { timeToTimestamp } from '@/util/util.js';
	import config from '@/common/config';
	export default {
		data() {
			return {
				activityList: [],
				activityStatus: [{
						name: '全部',
						value: ''
					},
					{
						name: '未开始',
						value: 'UNOPEN'
					},
					{
						name: '进行中',
						value: 'OPENING'
					},
					{
						name: '已结束',
						value: 'CLOSED'
					}
				],
				isLoading: true,
				searchText: "",
				status: "",
				isNewOpen: "",
				isFollow: false,
				pageSize: 10,
				pageNo: 1,
				totalPage: 0,
				loadStatus: "loadmore",
				loadingText: "努力加载中",
				loadmoreText: "上拉加载",
				nomoreText: "没有更多了"
			}
		},
		onLoad() {
			this.getActivityList();
		},
		onReachBottom() {
			if (!this.isLoading && this.pageNo < this.totalPage) {
				this.loadStatus = "loading"
				this.pageNo++
				this.getActivityList();
			} else {
				this.loadStatus = "nomore"
			}
			this.isFollow = true
		},
		onPullDownRefresh() {
			this.activityList = [];
			this.pageNo = 1;
			this.loadStatus = "loadmore";
			this.getActivityList();
			uni.stopPullDownRefresh();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 200);
		},
		methods: {
			activitySeach(input) {
				this.searchText = input;
				this.getActivityList(this.status, this.searchText)
			},
			changeTab(e) {
				let status = this.activityStatus[e.index].value;
				this.status = status;
				this.activityList = [];
				this.pageNo = 1;
				this.loadStatus = "loadmore";
				this.getActivityList(status, this.searchText);
			},
			async getActivityList(status, input) {
				const res = await get('getActivity', {
					status: status,
					searchText: input,
					pageSize: this.pageSize,
					pageNo: this.pageNo
				});
				const {
					rows,
					totalPage
				} = res;
				if (totalPage > this.pageNo) {
					this.loadStatus = "loadmore";
				} else {
					this.loadStatus = "nomore";
				}
				this.totalPage = totalPage;
				this.activityList = [...this.activityList, ...rows]
				this.isLoading = false
			},
			goDetail(item) {
				uni.navigateTo({
					url: `/pages/activity-detail/activity-detail?id=${item.id}`
				});
			},
			goSignUp(data) {
				let token = uni.getStorageSync('token');
				if (token) {
					let objStr = JSON.stringify(data)
					let time = data.enterEndTime;
					const timeNow =  Math.floor(Date.now() / 1000);
					if ( timeToTimestamp(time) > timeNow ) {
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
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #f6f6f6;
		.fill {
			padding: 30rpx 30rpx 20rpx 30rpx;
		}
		.margin-color {
			margin: 20rpx 0;
		}
		.activity {
			display: block;
			.margins {
				margin: 20rpx;
				background-color: #ffffff;
				border-radius: 20rpx;
				.list {
					display: flex;
					padding: 20rpx;
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
						.activity-top {
							font-size: 34rpx;
							color: #333333;
							line-height: 25px;
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
					padding: 0 20rpx 20rpx 20rpx;
					margin-top: 10rpx;
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
					}
					.right-c {
						background: #A19B9A;
						border-radius: 20rpx 8rpx 20rpx 8rpx;
						font-size: 26rpx;
						color: #ffffff;
						text-align: center;
						padding: 10rpx 18rpx;
					}
				}
			}
			.interval {
				width: 750rpx;
				height: 20rpx;
				background-color: #f6f6f6;
			}
		}
	}
</style>