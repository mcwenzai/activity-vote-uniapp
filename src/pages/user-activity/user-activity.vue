<template>
	<loading v-if="isLoading"></loading>
	<block v-else>
		<view class="activity" v-if="myActivityList.length">
			<block v-for="(item, index) in myActivityList" :key="index">
				<view class="margins">
					<view class="list" hover-class="uni-list-cell-hover">
						<image class="left" :src="item.imageUrl"></image>
						<view class="right">
							<view class="activity-top">{{ item.name }}</view>
							<view class="status">
								<up-tag text="审核中" size="mini" type="success" plain plainFill
									v-if="item.approveStatus === 'NEW'" @click="editInformation(item)"></up-tag>
								<up-tag text="已通过" size="mini" type="primary" plain plainFill
									v-if="item.approveStatus === 'SUCCESS'"></up-tag>
								<up-tag text="未通过" size="mini" type="error" plain plainFill
									v-if="item.approveStatus === 'FAIL'"></up-tag>
							</view>
							<view class="act">
								<text class="left">报名时间: </text>
								<text>{{ item.enterStartTime.slice(0, 10) }}</text>
								<text>~</text>
								<text>{{ item.enterEndTime.slice(0, 10) }}</text>
							</view>
						</view>
					</view>
					<view class="bottom" v-if="item.approveStatus == 'FAIL'">
						<up-button type="primary" text="查看原因" shape="circle" @click="seeReason(item.rejectReason)"></up-button>
					</view>

					<view class="bottom" v-if="item.approveStatus == 'SUCCESS'">
						<up-button type="primary" size="mini" text="完善信息" shape="circle" @click="editInformation(item)"></up-button>
					</view>
					
					
				</view>
				<view class="interval"></view>
			</block>
			<up-popup :show="showReason" :customStyle="customStyle"  mode="center" :closeable="true" @close="showReason = false">
				<up-cell title="查看原因"></up-cell>
				<view class="content">
					<text>{{rejectReason}}</text>
				</view>
			</up-popup>
		</view>
		<empty typeText="报名" v-else></empty>
	</block>
</template>

<script>
	import {
		get
	} from '@/common/request.js';
	import { timeToTimestamp } from '@/util/util.js';
	export default {
		data() {
			return {
				myActivityList: [],
				isLoading: true,
				token: "",
				showReason: false,
				rejectReason: "",
				customStyle: {
					width: "600rpx",
					height: "auto"
				}
			}
		},
		onLoad() {
			this.getToken();
		},
		methods: {
			async getMyActivityList(visitorId) {
				const res = await get('getUserActivity', {
					visitorId: visitorId
				})
				this.myActivityList = res.rows;
				this.isLoading = false
			},
			goDetail(item) {
				uni.navigateTo({
					url: `/pages/activity-detail/activity-detail?id=${item.id}`
				});
			},
			getToken() {
				let userId = uni.getStorageSync('userId');
				this.getMyActivityList(userId)
			},
			seeReason(e) {
				this.showReason = true
				this.rejectReason = e
			},
			editInformation(data) {
				let objStr = JSON.stringify(data);
				let time = data.enterEndTime;
				const timeNow =  Math.floor(Date.now() / 1000);
				if ( timeToTimestamp(time) > timeNow ) {
					uni.navigateTo({
						url: '/pages/edit-signup/edit-signup?data=' + encodeURIComponent(objStr)
					});
				} else {
					uni.navigateTo({
						url: `/pages/activity-detail/activity-detail?id=${data.id}`
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f6f6f6;

		.activity {
			display: block;

			.margins {
				padding: 20rpx 30rpx;
				background-color: #ffffff;
				border-radius: 20rpx;

				.list {
					display: flex;

					image {
						width: 280rpx;
						height: 180rpx;
						border-radius: 10rpx;
					}

					.right {
						width: 100%;
						height: auto;
						margin-left: 20rpx;
						display: flex;
						flex-flow: column;
						justify-content: space-between;

						.activity-top {
							font-size: 34rpx;
							color: #333333;
							line-height: 25px;
						}

						.status {
							text-align: right;
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
					justify-content: flex-end;
					align-items: center;

					.u-button {
						text-align: right;
						width: 140rpx;
						height: 52rpx;
						margin-right: 0rpx;
					}

					button {
						text-align: right;
					}

				}
			}

			.interval {
				width: 750rpx;
				height: 20rpx;
				background-color: #f6f6f6;
			}
			.content {
				padding: 26rpx 30rpx;
			}
		}
	}
</style>