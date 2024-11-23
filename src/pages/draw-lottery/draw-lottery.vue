<template>
	<loading v-if="isLoading"></loading>
	<view class="almost-lottery" v-else>
		<view class="almost-lottery__wheel">
			<almost-lottery :lottery-size="lotteryConfig.lotterySize" :action-size="lotteryConfig.actionSize"
				:ring-count="2" :duration="1" :self-rotaty="false" :img-circled="true" :canvasCached="true"
				:prize-list="prizeList" :prize-index="prizeIndex" @reset-index="prizeIndex = -1"
				@draw-before="handleDrawBefore" @draw-start="handleDrawStart" @draw-end="handleDrawEnd"
				v-if="prizeList.length" />
			<view class="almost-lottery__count">
				<text class="text">剩余抽奖 {{ drawNum }} 次</text>
			</view>
		</view>
		<view class="almost-lottery__rule">
			<view class="rule-head">
				<view class="line"></view>
				<text class="title">活动规则</text>
				<view class="line"></view>
			</view>
			<view class="rule-body">
				<view class="item">
					<view class="number">1</view>
					<view class="text">
						<text>抽奖细则：</text>
						<text>投完普通票可进行抽奖</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		get
	} from '@/common/request.js';
	import {
		clearCacheFile,
		clearStore
	} from '@/util/lottery/lottery.js';
	export default {
		data() {
			return {
				lotteryConfig: {
					// 抽奖转盘的整体尺寸，单位rpx
					lotterySize: 600,
					// 抽奖按钮的尺寸，单位rpx
					actionSize: 200
				},
				// 转盘外环
				// lotteryBg: require('@/static/lottery-bg.png'),
				// 抽奖按钮
				// actionBg: require('@/static/action-bg.png'),
				// 奖品数据
				prizeList: [],
				// 奖品是否设有库存
				onStock: false,
				// 中奖下标
				prizeIndex: -1,
				// 是否正在抽奖中，避免重复触发
				prizeing: false,
				// 前端控制中奖概率
				onFrontend: false,
				// 权重随机数的最大值
				prizeWeightMax: 100,
				// 权重数组
				prizeWeightArr: [],
				// 抽奖次数
				drawNum: 0,
				voteId: "",
				isLoading: true,
				prizeUrl: ""
			}
		},

		onLoad(e) {
			uni.showLoading({
				title: '加载中'
			})
			this.voteId = e.voteId
			this.prizeList = []
			this.getPrizeList(e.voteId);
			this.getVoteDrawCount(e.voteId);
		},

		onReady() {
			uni.hideLoading();
			this.isLoading = false
		},

		methods: {
			// 重新生成
			handleInitCanvas() {
				clearCacheFile()
				clearStore()
				this.prizeList = []
				this.getPrizeList();
			},
			// 获取奖品列表
			async getPrizeList(vote) {
				const res = await get('getPrizeList', {
					voteId: vote
				});
				let list = res.map(item => ({
					id: item.id,
					prizeImage: item.imageUrl,
					prizeName: item.name,
					prizeId: item.prizeId,
					drawId: item.drawId,
					url: item.url,
					prizeWeight: Number(item.rate)
				}));
				this.prizeList = list
				this.prizeWeightArr = list
				if (this.onFrontend) {
					// 生成权重数组并排序取得最大值
					this.prizeWeightArr = this.prizeList.map(item => item.prizeWeight)
					let prizeWeightArrSort = [...this.prizeWeightArr]
					prizeWeightArrSort.sort((a, b) => b - a)
					// 开放自定义权重最大值，没有自定义则取权重数组中的最大值
					this.prizeWeightMax = this.prizeWeightMax > 0 ? this.prizeWeightMax : prizeWeightArrSort[0]
				}
			},

			async getVoteDrawCount(vote) {
				const result = await get('getVoteDrawCount', {
					voteId: vote
				});
				this.drawNum = result
			},

			// 抽奖开始之前
			handleDrawBefore(callback) {
				let flag = false
				// 还有抽奖次数
				if (this.drawNum > 0) {
					flag = true
					this.drawNum--
				} else {
					flag = false
					uni.showToast({
						title: '无抽奖权限',
						icon: 'error'
					})
				}
				callback(flag)
			},
			// 本次抽奖开始
			handleDrawStart() {
				if (this.prizeing) return
				this.prizeing = true
				this.tryLotteryDraw()
			},
			// 尝试发起抽奖
			tryLotteryDraw() {
				if (this.onFrontend) {
				  this.localGetPrizeIndex()
				} else {
				  this.remoteGetPrizeIndex()
				}
			},
			// 本地获取中奖下标
			localGetPrizeIndex() {
				let randomWeight = Math.ceil(Math.random()*this.prizeWeightMax);
				console.log('本次权重随机数 =>', randomWeight);
				// 寻找第一个权重值大于或等于randomWeight的奖品
				for (let i = 0; i < this.prizeList.length; i++) {
					if (this.prizeList[i].prizeWeight >= randomWeight) {
						this.prizeIndex = i;
						return;
					}
				}
				// prizeIndex为-1表示没有找到合适的奖品
				this.prizeIndex = -1;
			},
			// 远程获取中奖
			async remoteGetPrizeIndex () {
			  console.warn('###当前处于模拟的请求接口，并返回了中奖信息###')
			  // 模拟请求接口获取中奖信息
			  let list = this.prizeList;
			  const prize = await get('getLuckyDraw',{drawId:list[0].drawId});
			    for (let i = 0; i < list.length; i++) {
			      let item = list[i]
			      if (item.prizeId === prize.id) {
			        // 中奖下标
			        this.prizeIndex = i
			        break
			      }
			    }
			    this.prizeUrl = prize.url
			    console.log('本次抽中奖品 =>', this.prizeList[this.prizeIndex].prizeName)
			    
			  //   // 如果奖品设有库存
			  //   if (this.onStock) {
			  //   	console.log('本次奖品库存 =>', this.prizeList[this.prizeIndex].prizeStock)
			  //   }
			  // }, 200)
			},

			async handleDrawEnd() {
				let prizeName = this.prizeList[this.prizeIndex].prizeName;
				let prizeUrl = this.prizeUrl;
				let tipContent = ''

				if (prizeName === '谢谢参与') {
					tipContent = '很遗憾，没有中奖，请再接再厉！'
				} else {
					// 如果奖品设有库存
					if (this.onStock) {
						let prizeStock = this.prizeList[this.prizeIndex].prizeStock
						tipContent = prizeStock ? `恭喜您，获得 ${prizeName}` : `很抱歉，您来晚了，当前奖品 ${prizeName} 已无库存`
					} else {
						tipContent = `恭喜您，获得 ${prizeName} ！`
					}
				}
				uni.showModal({
					content: tipContent,
					showCancel: false,
					confirmText: '领取',
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: `/pages/webview/webview?url=${prizeUrl}`
							})
						}
					},
					complete: () => {
						this.prizeing = false
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.almost-lottery {
		width: 100%;
		height: 100%;
		background-image: url('https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1815218124434788354.jpg');
		z-index: -9999;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-size: cover;
		/* 或使用 contain, 100% 100% 等根据需求 */
		background-repeat: no-repeat;
		background-position: center center;
	}

	.almost-lottery__head {
		position: relative;

		.action {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			line-height: 88rpx;
			margin: 0 auto;
			color: #FFFFFF;
			font-size: 32rpx;
			background-color: rgba(255, 136, 61, 1);
			border-radius: 44rpx;
		}

		.action-shadow {
			box-shadow: 0px 14rpx 0px 0px rgba(235, 112, 36, 1);
		}

		.gold {
			width: 44rpx;
			height: 44rpx;
			margin-right: 10rpx;
			background-repeat: no-repeat;
			background-position: center center;
			background-size: contain;
		}

		.num {
			color: #F9FC31;
		}

		.tip {
			position: relative;
			color: #FFFFFF;
			font-size: 24rpx;
			text-align: center;
		}
	}

	.almost-lottery__wheel {
		margin-top: 340rpx;
		text-align: center;

		.almost-lottery__count {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			padding: 40rpx 0;
		}

		.text {
			color: #FFFFFF;
			font-size: 24rpx;
		}
	}

	.almost-lottery__rule {
		padding: 0 28rpx;
		color: #FFF8CB;

		.rule-head {
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin: 40rpx 0;

			.line {
				flex: 1;
				height: 1px;
				background-color: #FFF3A5;
			}

			.title {
				width: 280rpx;
				color: #F63857;
				line-height: 70rpx;
				text-align: center;
				margin: 0 20rpx;
				border-radius: 8rpx;
				background-image: linear-gradient(0deg, rgba(255, 242, 158, 1), rgba(255, 244, 168, 1));
			}
		}

		.rule-body {
			color: #FFF8CB;
			font-size: 24rpx;
			padding: 10rpx 0 40rpx;

			.item {
				display: flex;
				margin-bottom: 10rpx;
			}

			.number {
				position: relative;
				top: 4rpx;
				width: 28rpx;
				height: 28rpx;
				line-height: 28rpx;
				text-align: center;
				color: #F63857;
				background: #FFF8CB;
				border-radius: 50%;
				margin-right: 10rpx;
			}

			.text {
				flex: 1;
			}

			.item-rule .text {
				display: flex;
				flex-direction: column;
			}
		}
	}

	.almost-lottery__action-dev {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 400rpx;
		height: 80rpx;
		border-radius: 10rpx;
		text-align: center;
		background-color: red;
		margin: 0 auto 40rpx;

		.text {
			color: #FFFFFF;
			font-size: 28rpx;
		}
	}

	.almost-lottery__popup-wrap {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;

		.almost-lottery {
			background: transparent;
		}
	}
</style>