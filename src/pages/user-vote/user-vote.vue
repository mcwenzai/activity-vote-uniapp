<template>
	<loading v-if="isLoading"></loading>
	<block v-else>
		<view class="vote-list" v-if="voteList.length" v-for="(item,index) in voteList" :key="index"
			@click="goDetail(item)">
			<image mode="aspectFill" :src="item.imageUrl?item.imageUrl:'/static/image/noimage.png'" />
			<view class="first">
				<view class="left">{{item.voteTitle}}</view>
				<view class="right" v-if="item.voteStatus">{{item.voteStatus}}</view>
			</view>
			<view class="line"></view>
			<view class="second">
				<view class="pending" v-if="item.statusDesc === 'PENDING'">未开始</view>
				<view class="progressing" v-if="item.statusDesc === 'PROGRESSING'">进行中</view>
				<view class="completed" v-if="item.statusDesc === 'COMPLETED'">已结束</view>
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
		<empty typeText="参与投票" v-else></empty>
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
				isLoading: true,
				visitorId: ''
			};
		},
		onShow() {
			this.getUserId()
		},
		methods: {
			async getUserVote(visitorId) {
				const res = await get('getUserVote', {
					visitorId: visitorId
				})
				this.voteList = res.rows;
				this.isLoading = false
			},
			getUserId() {
				let userId = uni.getStorageSync('userId');
				this.getUserVote(userId)
			},
			goDetail: function(e) {
				uni.navigateTo({
					url: `../vote-list/vote-list?id=${e.id}&endTime=${e.voteEnd}`
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f6f6f6;

		.vote-list {
			padding: 20rpx;
			margin: 20rpx 30rpx;
			background-color: #ffffff;
			border: 2rpx solid #f1f1f1;
			border-radius: 40rpx;

			image {
				width: 650rpx;
				height: 360rpx;
				border-radius: 12rpx;
			}

			.first {
				display: flex;
				justify-content: space-between;

				.left {
					margin: 10rpx 0;
					color: #333333;
					font-size: 34rpx;
				}

				.right {
					color: #ffffff;
					padding: 10rpx 20rpx;
					background-color: #4088FD;
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

				.center {
					font-size: 28rpx;
					height: 48rpx;
					line-height: 48rpx;
					color: #333333;
					border-radius: 30rpx;
					padding: 10rpx 20rpx;
				}

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
			}
		}

		.fill {
			padding: 30rpx 30rpx 20rpx 30rpx;
		}
	}
</style>