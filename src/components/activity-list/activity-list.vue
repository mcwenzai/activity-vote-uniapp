<template>
	<view class="activity">
		<block v-for="(item, index) in listData" :key="index">
			<view class="margins">
				<view class="list" hover-class="uni-list-cell-hover" @click="$emit('detail', item)" v-if="item.status=='CLOSED'">
					<image class="left" :src="item.imageUrl"></image>
					<view class="right">
						<view class="activity-top">{{ item.name }}</view>
<!-- 						<view class="sign">
							<text class="left">活动时间: </text>
							<text>{{ item.enterStartTime.slice(0, 10) }}</text>
							<text>~</text>
							<text>{{ item.enterEndTime.slice(0, 10) }}</text>
						</view> -->
						<view class="act">
							<text class="left">报名时间: </text>
							<text>{{ item.enterStartTime.slice(0, 10) }}</text>
							<text>~</text>
							<text>{{ item.enterEndTime.slice(0, 10) }}</text>
						</view>
					</view>
				</view>
				<view class="list" hover-class="uni-list-cell-hover" @click="$emit('detail', item)" v-else>
					<image class="left" :src="item.imageUrl"></image>
					<view class="right">
						<view class="activity-top">{{ item.name }}</view>
<!-- 						<view class="sign">
							<text class="left">活动时间: </text>
							<text>{{ item.enterStartTime.slice(0, 10) }}</text>
							<text>~</text>
							<text>{{ item.enterEndTime.slice(0, 10) }}</text>
						</view> -->
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
						<uni-icons type="staff-filled" color="#A19B9A" size="26"></uni-icons>
						<text>已报名</text>
						<text>{{item.enterCount ? item.enterCount: '0'}}</text>
						<text>人</text>
					</view>
					<view class="right-c" v-if="item.signupStatus=== 'N'">我要报名</view>
					<view class="right-c" v-if="item.signupStatus=== 'Y'">已报名</view>
				</view>
				<view class="bottom" v-else>
					<view class="left">
						<uni-icons type="staff-filled" color="#FF9743" size="26"></uni-icons>
						<text>已报名</text>
						<text>{{item.enterCount ? item.enterCount: '0'}}</text>
						<text>人</text>
					</view>
					<view class="right" v-if="item.signupStatus=== 'N'" @click="$emit('signUp', item)">我要报名</view>
					<view class="right" v-if="item.signupStatus=== 'Y'">已报名</view>
				</view>
			</view>
			<view class="interval" v-if="isInterval"></view>
	</block>
	</view>
</template>
<script>
	export default {
		name: 'activity-list',
		props: {
			listData: {
				type: Array,
				required: true
			},
			isInterval: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss">
	.activity {
		display: block;

		.margins {
			padding: 20rpx 30rpx;
			background-color: #ffffff;
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

				.left {
					height: 72rpx;
					line-height: 72rpx;
					display: flex;
					align-items: center;
					color: #FF9743;

					text {
						font-size: 32rpx;
					}
				}

				.left-c {
					height: 72rpx;
					line-height: 72rpx;
					display: flex;
					align-items: center;
					color: #A19B9A;

					text {
						font-size: 32rpx;
					}
				}

				.right {
					background: #347DFF;
					border-radius: 20rpx 8rpx 20rpx 8rpx;
					font-size: 28rpx;
					color: #ffffff;
					text-align: center;
					padding: 12rpx 18rpx;
				}

				.right-c {
					background: #A19B9A;
					border-radius: 20rpx 8rpx 20rpx 8rpx;
					font-size: 28rpx;
					color: #ffffff;
					text-align: center;
					padding: 12rpx 18rpx;
				}
			}
		}
		.interval {
			width: 750rpx;
			height: 20rpx;
			background-color: #f6f6f6;
		}
	}
</style>