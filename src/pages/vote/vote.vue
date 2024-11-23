<template>
	<loading v-if="isLoading"></loading>
	<block v-else>
		<up-sticky bgColor="#fff">
			<view class="fill">
				<up-search placeholder="搜索标题" bgColor="#f6f6f6" :showAction="false" :clearabled="false"
					v-model="searchText" @search="voteSeach"></up-search>
			</view>
			<up-tabs :list="voteCate" borderColor="#fffff" :activeStyle="{color: '#303133',fontWeight: 'bold'}"
				:scrollable="false" @change="changeTab"></up-tabs>
		</up-sticky>
		<block v-if="voteList.length">
			<block v-for="(item,index) in voteList" :key="index">
				<view class="vote-list filter-g" v-if="item.statusDesc === 'PENDING'">
					<up-lazy-load threshold="-450" border-radius="20" :image="item.imageUrl?item.imageUrl:'/static/image/noimage.png'" img-mode="aspectFill"
						:height="160"></up-lazy-load>
					<!-- <image mode="aspectFill" :src="item.imageUrl?item.imageUrl:'/static/image/noimage.png'" /> -->
					<view class="first">
						<view class="left" v-if="item.voteTitle">{{item.voteTitle}}</view>
						<view class="left" v-else>无标题</view>
						<view class="right" v-if="item.voteStatus">{{item.voteStatus}}</view>
					</view>
					<view class="line"></view>
					<view class="second">
						<view class="pending" v-if="item.statusDesc === 'PENDING'">未开始</view>
						<!-- <view class="progressing" v-if="item.statusDesc === 'PROGRESSING'">进行中</view> -->
						<!-- <view class="completed" v-if="item.statusDesc === 'COMPLETED'">已结束</view> -->
						<view class="progressing-center" v-if="item.end">
							<text>{{item.end}}</text>
							<text>截止</text>
						</view>
						<view class="progressing-right" v-if="item.voteUserCnt">
							<text>参与人数</text>
							<text>{{item.voteUserCnt}}</text>
						</view>
					</view>
				</view>
				<view class="vote-list" v-if="item.statusDesc === 'PROGRESSING'" @click="goDetail(item)">
					<up-lazy-load threshold="0" border-radius="20" :image="item.imageUrl?item.imageUrl:'/static/image/noimage.png'" img-mode="aspectFill"
						:height="160"></up-lazy-load>
					<!-- <image mode="aspectFill" :src="item.imageUrl?item.imageUrl:'/static/image/noimage.png'" /> -->
					<view class="first">
						<view class="left" v-if="item.voteTitle">{{item.voteTitle}}</view>
						<view class="left" v-else>无标题</view>
						<view class="right" v-if="item.voteStatus">{{item.voteStatus}}</view>
					</view>
					<view class="line"></view>
					<view class="second">
						<view class="progressing" v-if="item.statusDesc === 'PROGRESSING'">进行中</view>
						<view class="center" v-if="item.end">
							<text>{{item.end}}</text>
							<text>截止</text>
						</view>
						<view class="right" v-if="item.voteUserCnt">
							<text>参与人数</text>
							<text>{{item.voteUserCnt}}</text>
						</view>
					</view>
				</view>
			</block>
			<up-loadmore :status="loadStatus" :loading-text="loadingText" :loadmore-text="loadmoreText"
				:nomore-text="nomoreText" color="#c0c7e2" lineColor="#d8e0ff" :dashed="false" line />
			<up-gap height="10" bgColor="#f6f6f6"></up-gap>
		</block>
		<empty typeText="投票" v-else></empty>
	</block>
</template>

<script>
	import {
		get
	} from '@/common/request.js';
	export default {
		data() {
			return {
				current: 0,
				voteList: [],
				voteCate: [{
						name: '全部',
						value: ''
					},
					{
						name: '未开始',
						value: 'PENDING'
					},
					{
						name: '进行中',
						value: 'PROGRESSING'

					}
					// {
					// 	name: '已结束',
					// 	value: 'COMPLETED'

					// }
				],
				searchText: "",
				isLoading: true,
				status: "",
				pageSize: 20,
				pageNo: 1,
				totalPage: 0,
				loadStatus: "loadmore",
				loadingText: "努力加载中",
				loadmoreText: "加载完",
				nomoreText: "没有更多了"
			};
		},
		onLoad() {
			this.getVoteList();
		},
		onReachBottom() {
			if (!this.isLoading && this.pageNo < this.totalPage) {
				this.loadStatus = "loading"
				this.pageNo++
				this.getVoteList();
			} else {
				this.loadStatus = "nomore"
			}

		},
		methods: {
			voteSeach(input) {
				this.searchText = input;
				this.getVoteList(this.status, this.searchText)
			},

			changeTab(status) {
				this.status = status.value
				this.voteList = [];
				this.pageNo = 1;
				this.getVoteList(status.value, this.searchText)
			},
			async getVoteList(status, input) {
				const res = await get('getVoteList', {
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
				this.voteList = [...this.voteList, ...rows];
				this.isLoading = false
			},


			goDetail: function(e) {
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

		}
	}
</script>

<style lang="scss">
	page {
		background: #f6f6f6;

		.top {
			position: fixed;
			left: 0;
			top: 0;
			width: 750rpx;

			.uni-searchbar {
				background-color: #ffffff;
			}
		}

		.vote-list {
			padding: 20rpx;
			margin: 20rpx 30rpx;
			background-color: #ffffff;
			border: 2rpx solid #f1f1f1;
			border-radius: 20rpx;

			image {
				width: 650rpx;
				height: 320rpx;
				border-radius: 40rpx;
			}

			.first {
				height: 68rpx;
				line-height: 78rpx;
				display: flex;
				justify-content: space-between;

				.left {
					color: #222222;
					font-size: 34rpx;
					// font-weight: 600;
				}

				.right {
					color: #ffffff;
					padding: 10rpx 20rpx;
					background-color: #347DFF;
					border-radius: 20rpx;
				}
			}

			.line {
				height: 10rpx;
				line-height: 10rpx;
				border-bottom: 1rpx solid #eeeeee;
			}

			.second {
				display: flex;
				justify-content: space-between;
				height: 60rpx;
				line-height: 60rpx;

				.pending {
					color: #e7b15a;
					font-size: 30rpx;
				}

				.progressing {
					color: #347DFF;
					font-size: 30rpx;
				}

				.completed {
					color: #e3675e;
					font-size: 30rpx;
				}
				.center {
					font-size: 28rpx;
					height: 48rpx;
					line-height: 48rpx;
					color: #333333;
					border-radius: 30rpx;
					padding: 10rpx 20rpx;
				}
				.progressing-center {
					font-size: 28rpx;
					height: 48rpx;
					line-height: 48rpx;
					color: #999999;
					border-radius: 30rpx;
					padding: 10rpx 20rpx;
				}
				.progressing-right {
					color: #999999;
				}

				.right {}
			}
		}

		.filter-g {
			filter: grayscale(100%);
		}

		.fill {
			padding: 30rpx 30rpx 20rpx 30rpx;
		}
	}
</style>