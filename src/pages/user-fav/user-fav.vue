<template>
	<view>
		<up-sticky>
			<up-alert customStyle="background-color: #ffffff" :title="favtitle" type="warning"></up-alert>
			<view style="padding: 0 40rpx 20rpx 40rpx; background: #ffffff">
				<up-search placeholder="搜索您收藏的活动" v-model="searchKeyword" :show-action="true" actionText="管理"
					@search="performSearch" @custom="adminFav()"></up-search>
			</view>
		</up-sticky>
		<view class="activity" v-if="favList.length">
			<block v-for="(item, index) in favList" :key="index">
				<view class="interval"></view>
				<view class="margins">
					<view class="list" hover-class="uni-list-cell-hover">
						<view @click="selectItem(index)" class="y-flex y-align-center" v-if="isEdit">
							<view class="sel-btn">
								<up-icon v-if="(item.isDelSelect && isEdit)" name="checkmark-circle-fill"
									color="#347DFF" size="40rpx"></up-icon>
								<view v-else class="no-select"></view>
							</view>
						</view>
						<image class="left" :src="item.imageUrl"></image>
						<view class="right" @click="goDetail(item)">
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
						<view class="right" v-if="item.signupStatus=== 'N'" @click="goSignUp(item)">我要报名</view>
						<view class="right" v-if="item.signupStatus=== 'Y'">已报名</view>
					</view>
				</view>
			</block>
			<view class="position-fixed" v-if="isEdit">
				<view class="position-flex">
					<view @click="allSelBtn()" class="left">
						<view class="sel-btn">
							<up-icon v-if="allSelState" name="checkmark-circle-fill" color="#347DFF"
								size="40rpx"></up-icon>
							<view v-else class="no-select"></view>
						</view>
						<span class="all">全选</span>
					</view>
					<view class="right">
						<view class="y-flex y-m-l-25">
							<up-button type="primary" shape="circle" @click="delState">删除({{totalSelCount}})</up-button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<empty typeText="收藏" v-else></empty>
	</view>
</template>

<script>
	import { timeToTimestamp } from '@/util/util.js';
	export default {
		data() {
			return {
				favtitle: "",
				isEdit: false,
				favList: [],
				submitBtnStyle: {
					background: '#FD7026',
					color: '#ffffff',
					border: 'none'
				},
				searchKeyword: "",
				filteredItems: "",

			}
		},
		computed: {
			allSelState() {
				let delAllSelect = true;
				let delCount = 0;
				this.favList.forEach(sitem => {
					if (!sitem.isDelSelect) delAllSelect = false;
					if (sitem.isDelSelect) delCount++;
				});
				return delAllSelect && delCount === this.favList.length;
			},
			totalSelCount() {
				let delCount = 0;
				this.favList.forEach(sitem => {
					if (sitem.isDelSelect) delCount++;
				});
				return delCount;
			}
		},
		onShow() {
			this.getFavList();
		},
		methods: {
			getFavList() {
				let that = this
				let token = uni.getStorageSync('token')
				if (token) {
					let favLists = uni.getStorageSync('favList');
					if (favLists) {
						favLists.map(item => ({
							...item,
							isDelSelect: false,
						}));
						that.favList = favLists
					}
				} else {
					this.favtitle = "您暂未登录，请登录后查看！"
				}
			},
			adminFav() {
				this.isEdit = !this.isEdit
			},
			selectItem(index) {
				this.favList[index].isDelSelect = !this.favList[index].isDelSelect
			},
			goDetail(item) {
				uni.navigateTo({
					url: `/pages/activity-detail/activity-detail?id=${item.id}`
				});
			},

			// 全选
			allSelBtn() {
				let toState = !this.allSelState
				this.favList.forEach(sitem => {
					sitem.isDelSelect = toState
				})
			},
			delState() {
				let fullList = uni.getStorageSync('favList');
				fullList.forEach((item, index) => {
					if (this.favList.some(favItem => favItem.id === item.id)) {
						fullList[index].isDelSelect = this.favList.find(favItem => favItem.id === item.id)
							.isDelSelect;
					}
				});
				this.favList = fullList.filter(item => !item.isDelSelect);
				uni.setStorageSync("favList", this.favList);
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
			},
			performSearch() {
				let favLists = uni.getStorageSync('favList');
				let filteredItems = favLists.filter(item =>
					item.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
				);
				this.favList = filteredItems
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f6f6f6;

		.u-alert {
			background: #ffffff;
		}

		.activity {
			display: block;

			.margins {
				padding: 20rpx 30rpx;
				background-color: #ffffff;
				border-radius: 20rpx;

				.list {
					display: flex;
					align-items: center;

					.y-flex {
						display: flex;

						.sel-btn {
							width: 45rpx;
							height: 45rpx;

							.no-select {
								width: 39rpx;
								height: 39rpx;
								border-radius: 50%;
								border: 1px solid #999999;
							}
						}
					}

					image {
						width: 200rpx;
						height: 180rpx;
						border-radius: 10rpx;
						margin-left: 20rpx;
					}

					.right {
						height: 180rpx;
						margin-left: 20rpx;
						display: flex;
						flex-flow: column;
						justify-content: space-between;

						.activity-top {
							font-size: 34rpx;
							color: #333333;
							line-height: 25px;
							font-weight: 600;
						}

						.sign {
							margin-top: 20rpx;
							line-height: 62rpx;
							height: 62rpx;
							color: #666666;
							font-size: 26rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;

							.left {
								font-size: 28rpx;
							}
						}

						.act {
							line-height: 62rpx;
							height: 62rpx;
							color: #666666;
							font-size: 26rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;

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
						height: 72rpx;
						line-height: 72rpx;
						display: flex;
						align-items: center;
						color: #A19B9A;

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

			.position-fixed {
				position: fixed;
				bottom: 0;
				left: 0;
				background: #ffffff;
				width: 100%;

				.position-flex {
					display: flex;
					align-items: center;
					padding: 30rpx 40rpx;

					.left {
						display: flex;
						width: 250rpx;

						.sel-btn {
							width: 45rpx;
							height: 45rpx;

							.no-select {
								width: 39rpx;
								height: 39rpx;
								border-radius: 50%;
								border: 1px solid #999999;
							}
						}

						.all {
							margin-left: 20rpx;
						}
					}

					.right {
						width: 500rpx;
					}
				}
			}
		}
	}
</style>