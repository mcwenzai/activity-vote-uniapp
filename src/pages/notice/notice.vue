<template>
	<block v-if="noticeList.length">
		<view class="container" v-for="(item,index) in noticeList" :key="indx">
			<view class="notice">
				<view class="u-avatar-item">
					<up-avatar icon="bell-fill" fontSize="22" bg-color="#3c9cff"></up-avatar>
				</view>
				<view class="content">
					<view class="ceter">
						<text class="title">通知公告</text>
						<text class="time">{{item.publishTime}}</text>
					</view>
					<view class="desc">{{item.noticeTitle}}</view>
				</view>
			</view>
			<view class="see" @click="goDetail(item.id)">
				<up-cell title="查看详情" :border="false" :isLink="true"></up-cell>
			</view>
		</view>
		<up-loadmore :status="loadStatus" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" color="#c0c7e2" lineColor="#d8e0ff" :dashed="false" line />
		<up-gap height="10" bgColor="#f6f6f6"></up-gap>
	</block>
	<!-- <up-empty mode="news" text="暂无通知公告" v-else></up-empty> -->
	<empty typeText="通知公告" v-else></empty>
</template>

<script>
	import {
		get
	} from '@/common/request.js';
	export default {
		data() {
			return {
				noticeList: [],
				isLoading: true,
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
			this.getNoticeList()
		},
		onReachBottom() {
			if (!this.isLoading && this.pageNo < this.totalPage) {
				this.loadStatus = "loading"
				this.pageNo++
				this.getNoticeList();
			} else {
				this.loadStatus = "nomore"
			}
		},
		methods: {
			async getNoticeList() {
				const res = await get('getNoticeList');
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
				this.noticeList = [...this.noticeList, ...rows]
				this.isLoading = false
			},
			goDetail(id) {
				uni.navigateTo({
					url: '/pages/notice-detail/notice-detail?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f6f6f6;

		.container {
			width: 710rpx;
			margin-left: 20rpx;
			background-color: #ffffff;
			margin-top: 20rpx;
			border-radius: 30rpx;

			.notice {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 20rpx;

				.title {
					font-size: 32rpx;
				}

				.content {
					width: 100%;
					font-size: 24rpx;
					padding: 20rpx;

					.ceter {
						display: flex;
						justify-content: space-between;
					}
				}
			}

			.see {
				border-top: 2rpx solid #dedede;
			}
		}
	}
</style>