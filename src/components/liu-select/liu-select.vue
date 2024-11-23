<template>
	<view class="content">
		<view class="liu-select-fixed" :class="openClass">
			<view class="liu-search-warp">
				<view class="liu-search-input">
					<view class="lsi-warp">
						<up-icon class="lsi-icon" size="20" name="search"></up-icon>
						<input class="lsi-input" v-model="keyword" placeholder="请输入要搜索学校名称" @input="getParamsList" />
					</view>
				</view>
				<scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="lower">
					<view class="liu-search-list" v-if="outPutList.length > 0">
						<view class="liu-search-li" v-for="(item,index) in outPutList" :key="index"
							@click="mapSelectMenu(item,index)">
							<view class="liu-search-left">
								<view class="liu-search-title" v-if="titleKey">{{item[titleKey]}}
								</view>
								<view class="liu-search-title" v-else>未选择标题
								</view>
								<view class="liu-search-desc" v-if="subtitleKey">{{item[subtitleKey]}}</view>
							</view>
							<view class="liu-search-icon" v-if="mapSelectIndex == index">
								<up-icon name="checkmark"></up-icon>
							</view>
						</view>
						<view class="liu-loading">
							<view class="liu-loading-text">已加载全部</view>
						</view>
					</view>
					<view v-else class="liu-void">
						<up-empty mode="search" icon="https://cdn.uviewui.com/uview/empty/search.png" text="未查询到内容">
						</up-empty>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="liu-overlay" @click="closeOverlay" v-if="open == true"></view>
	</view>
</template>

<script>
	export default {
		name: 'liu-select',
		props: {
			list: {
				type: Array,
				default: []
			},
			titleKey: {
				type: [String, null],
				default: null
			},
			subtitleKey: {
				type: [String, null],
				default: null
			},
			open: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				mapSelectIndex: null,
				keyword: "",
				outPutList: [],
				openClass: ""
			}
		},
		watch: {
			list(newList, oldList) {
				this.getParamsList();
			},
			open(newOpen, oldOpen) {
				if (newOpen == true) {
					this.openClass = "show";
				} else {
					this.openClass = "hide";
				}
			}
		},
		created() {
			this.getParamsList();
		},
		methods: {
			mapSelectMenu(item, index) {
				this.mapSelectIndex = index;
				this.$emit("change", item, index)
				this.$emit("close");
			},
			getParamsList() {
				var selectList = this.list;
				this.mapSelectIndex = null;
				if (!this.keyword) {
					this.outPutList = selectList;

					return false;
				}
				var arr = [];
				for (var i = 0; i < selectList.length; i++) {
					let item = selectList[i];
					if (item[this.titleKey].indexOf(this.keyword) > -1) {
						arr.push(item);
					} else {

					}
				}
				this.outPutList = arr;
			},
			lower() {

			},
			closeOverlay() {
				this.$emit("close");
			}
		}
	}
</script>

<style scoped lang="scss">
	.liu-overlay {
		transition-duration: 300ms;
		transition-timing-function: ease-out;
		position: fixed;
		inset: 0px;
		z-index: 100;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.liu-select-fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 150;
		transition: transform .5s ease-in-out;
		transform: translateY(calc(100% + 40rpx));

		&.show {
			animation: showHandler 0.3s forwards;
		}

		&.hide {
			animation: hideHandler 0.3s forwards;
		}

		.liu-search-warp {
			background: #fff;
			border-radius: 10rpx 10rpx 0 0;

			.liu-search-input {
				padding: 30rpx 40rpx;
				font-size: 28rpx;

				.lsi-warp {
					display: flex;
					align-items: center;
					border: 2rpx solid #e3e3e3;
					padding: 16rpx 20rpx;
					border-radius: 50rpx;

					.lsi-icon {
						width: 30rpx;
						height: 30rpx;
					}

					.lsi-input {
						width: 90%;
						padding-left: 16rpx;
						font-size: 28rpx;
					}
				}
			}

			.liu-search-list {
				.liu-search-li {
					padding: 20rpx 30rpx;
					display: flex;
					align-items: center;
					border-bottom: 1rpx solid #f7f7f7;
					min-height: 50rpx;

					.liu-search-left {
						width: 90%;

						.liu-search-title {
							font-size: 28rpx;
							line-height: 36rpx;
							color: #333;
						}

						.liu-search-desc {
							padding-top: 10rpx;
							font-size: 24rpx;
							line-height: 36rpx;
							color: #999;
						}
					}

					.liu-search-icon {
						.lsi-icon {
							width: 40rpx;
							height: 40rpx;
						}
					}

				}
			}

		}

	}

	.scroll-Y {
		height: 500rpx;
	}

	.liu-loading {
		color: #333;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;


		.liu-loading-text {
			padding-left: 12rpx;
			padding-right: 32rpx;
		}
	}

	@keyframes turn {
		0% {
			transform: rotate(0deg);
		}

		25% {
			transform: rotate(90deg);
		}

		50% {
			transform: rotate(180deg);
		}

		75% {
			transform: rotate(270deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes showHandler {
		0% {
			transform: translateY(calc(100% + 40rpx));
		}

		100% {
			transform: translateY(0);
		}
	}

	@keyframes hideHandler {
		0% {
			transform: translateY(0);
		}


		100% {
			transform: translateY(calc(100% + 40rpx));
		}
	}

	.liu-void {
		text-align: center;
		padding-top: 60rpx;

		.liu-void-img {
			width: 40%;
		}

		.liu-void-text {
			padding-top: 30rpx;
			font-size: 26rpx;
			color: #909090;
		}
	}
</style>