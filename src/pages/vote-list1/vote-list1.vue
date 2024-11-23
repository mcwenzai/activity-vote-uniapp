<template>
	<loading v-if="isLoading"></loading>
	<view class="vote-detail" v-else>
		<view class="top">
			<view class="one">
				<view class="left">
					<!-- <view class="title">距离本次投票结束还有</view> -->
					<image class="end" src="../../static/image/end.png"></image>
					<up-count-down :time="endSecond" format="DD:HH:mm:ss" autoStart millisecond @change="onChange">
						<view class="time">
							<view class="time__custom">
								<text class="time__custom__item">{{ timeData.days }}</text>
							</view>
							<text class="time__doc">天</text>
							<view class="time__custom">
								<text
									class="time__custom__item">{{timeData.hours > 10 ? timeData.hours : timeData.hours }}</text>
							</view>
							<text class="time__doc">时</text>
							<view class="time__custom">
								<text class="time__custom__item">{{ timeData.minutes }}</text>
							</view>
							<text class="time__doc">分</text>
							<view class="time__custom">
								<text class="time__custom__item">{{ timeData.seconds }}</text>
							</view>
							<text class="time__doc">秒</text>
						</view>
					</up-count-down>
				</view>
				<view class="r-right" @click="goRanking()">
					<image class="fix" src="../../static/image/ranking.png"></image>
					<text class="check">排行榜</text>
					<image class="fix-right" src="../../static/image/arr-right.png"></image>
				</view>
			</view>
			<view class="line"></view>
			<view class="two">
				<up-search v-model="voteInput" placeholder="请输入姓名/编号搜索" shape="square" bgColor="#f6f6f6" border="true"
					:showAction="false" :clearabled="true" @clear="resetSearch" actionText="搜索" @search="inputSeach"
					@custom="inputSeach" />
				<view class="borbao">
					<view class="select-title" @click="showSchool">
						<text class="title-color">学校</text>
						<image class="select-arrow" src="../../static/image/screen.png"></image>
					</view>
					<liu-select :list="schoolList" :open="openSchool" @close="openSchool = false"  @change="changeSelect"
						titleKey="school"></liu-select>
				</view>
			</view>
			<view class="nums">
				<view class="title">
					<image class="today-num" src="../../static/image/taday-num.png"></image>
					<view class="xuzhi" @click="clickNotice">
						<text>投票须知</text>
						<up-icon style="margin-left: 8rpx;" size="10" name="question-circle"></up-icon>
					</view>
				</view>
			</view>
			<view class="vote-num">
				<view class="common">
					<image class="v-img" src="../../static/image/common.png"></image>
					<text class="num">{{common}}</text>
					<text class="vote">票</text>
					<text class="note">(每人只能投1票)</text>
				</view>
				<view class="common" v-if="isShow">
					<image class="v-img" src="../../static/image/special.png"></image>
					<text class="num">{{special}}</text>
					<text class="vote">票</text>
					<text class="note">(每人可投多票)</text>
				</view>
			</view>
		</view>

		<view class="data-list">
			<view class="order-list">
				<view class="item" v-for="(item, index) in listData" :key="index">
					<view class="line1">
						<text class="left">{{item.registrationCode}}</text>
						<text class="right">{{item.voteCount}}</text>
					</view>
					<up-avatar :size="64" :src="item.imageUrl ? item.imageUrl : '/static/image/noimage.png'"
						@click="goVoteDetail(item.id)" mode="aspectFill"></up-avatar>
					<view class="line2">{{item.personName}}</view>
					<view class="line3">{{item.school}}</view>

					<button class="vote-but" :disabled="allIsVoted" size="mini" type="primary"
						@click="bindVoteTap(item, index)" v-if="item.num === 0">投票</button>
					<button class="vote-but" :disabled="allIsVoted" size="mini" type="primary"
						@click="bindVoteTap(item, index)" v-else>
						<text>投票+</text>
						<text>{{ item.num }}</text>
					</button>
				</view>
			</view>
		</view>
		<up-modal :show="showLottery" title="获得抽奖" confirmText="是" content='您已获得抽奖机会,是否去抽奖？' :showCancelButton="true"
			cancelText="否" @confirm="confirmLottery" @cancel="cancelLottery"></up-modal>
		<up-modal :show="showNotice" title="投票须知" confirmText="知道了" :content='notice'
			@confirm="confirmNotice"></up-modal>
		<up-loadmore :status="loadStatus" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" color="#c0c7e2" lineColor="#d8e0ff" :dashed="false" line />
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		get,
		post
	} from '@/common/request.js';
	import {
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app";
	import {
		getLabelByValue
	} from '@/util/util.js';
	const isLoading = ref(true);
	const listData = ref([]);
	const openSchool = ref(false);
	const schoolList = ref([]);
	const showNotice = ref(false);
	const notice = ref("");
	const voteInput = ref("");
	const voteCountTotal = ref(0);
	const common = ref(0);
	const special = ref(0);
	// 第几次投票
	const voteNumber = ref(true);
	const allIsVoted = ref(false);
	const voteId = ref('');
	const voteEnd = ref('');
	const endSecond = ref(0);
	const timeData = ref({});
	const pageSize = ref(20);
	const pageNo = ref(1);
	const totalPage = ref(0);
	const loadStatus = ref("loadmore");
	const loadingText = ref("努力加载中");
	const loadmoreText = ref("上拉加载");
	const nomoreText = ref("没有更多了");
	const searchText = ref("");
	const uDropdownRef = ref();
	const showLottery = ref(false);
	const isShow = ref(false);
	const isHasDraw = ref(false);
	onLoad((e) => {
		if (!e.endTime || !e.id) {
			console.error("参数缺失");
			return;
		}
		voteEnd.value = e.endTime;
		voteId.value = e.id;
		getVoteCount(e.id);
		countdown(e.endTime);
		getSchoolList();
		getActivityVote(e.id);
		getVoteDetail(e.id);
		getIsVoteDraw(e.id)
	});

	onReachBottom(() => {
		if (!isLoading.value && pageNo.value < totalPage.value) {
			loadStatus.value = "loading";
			pageNo.value++;
			getActivityVote(voteId.value, searchText.value, pageNo.value);
		} else {
			loadStatus.value = "nomore";
		}
	});
	const getIsVoteDraw = (id) => {
		const isHasDrawstatus = get('getVoteDrawstatus',{voteId: id})
		if (isHasDrawstatus == 'Y') {
			isHasDraw.value = true
		} else {
			isHasDraw.value = false
		}
	};
	const inputSeach = (input) => {
		listData.value = [];
		pageNo.value = 1;
		searchText.value = input;
		getActivityVote(voteId.value, searchText.value, pageNo.value);
	};
	const resetSearch = (input) => {
		listData.value = [];
		pageNo.value = 1;
		searchText.value = "";
		getActivityVote(voteId.value, searchText.value, pageNo.value);
	};
	const getSchoolList = async () => {
		const res = await get('getSchoolList');
		schoolList.value = res
	};
	const showSchool = () => {
		openSchool.value = !openSchool.value;
	};

	const changeSelect = (item, index) => {
		listData.value = [];
		pageNo.value = 1;
		searchText.value = item.school;
		getActivityVote(voteId.value, item.school, pageNo.value);
	};
	const getActivityVote = async (id, searchText, page) => {
		const res = await get('getActivityVote', {
			voteId: id,
			searchText: searchText,
			pageSize: pageSize.value,
			pageNo: page
		});
		const data = res.rows.map(item => ({
			...item,
			num: 0
		}));
		if (res.totalPage > pageNo.value) {
			loadStatus.value = "loadmore";
		} else {
			loadStatus.value = "nomore";
		}
		totalPage.value = res.totalPage;
		listData.value = [...listData.value, ...data];
		isLoading.value = false;
	};
	const getVoteCount = async (id) => {
		const res = await get('getVoteCount', {
			voteId: id
		});
		common.value = res.common;
		special.value = res.special;
		allIsVoted.value = res.common === 0 && res.special === 0;
		isShow.value = res.isShow;
		if( res.common == 0 && isHasDraw ) {
			showLottery.value = true
		}
		if (allIsVoted.value) {
			common.value = 0;
			special.value = 0;
		}
	};

	const bindVoteTap = async (e, index) => {
		if (allIsVoted.value) {
			showToast('今日票数已用完！');
			return;
		}
		try {
			const res = await post('postPersonVote', {
				id: e.id,
				voteId: voteId.value
			});
			listData.value[index].num += 1;
			listData.value[index].voteCount = res.voteCount;
			if (common.value <= 0 && special.value <= 0) {
				allIsVoted.value = true;
			}
			showToast('投票成功！');
		} finally {
			await getVoteCount(voteId.value);
		}
	};

	const showToast = (title, icon = 'none') => {
		uni.showToast({
			title,
			icon
		});
	};

	const getVoteDetail = async (voteId) => {
		const voteDetail = await get('getVoteDetail', {
			id: voteId
		});
		notice.value = voteDetail.remark
	};

	const goVoteDetail = (id) => {
		uni.navigateTo({
			url: `/pages/vote-detail/vote-detail?id=${id}`
		});
	};

	const goRanking = () => {
		uni.navigateTo({
			url: `/pages/ranking/ranking?voteId=${voteId.value}`
		});
	};

	const countdown = (endTime) => {
		const countDownDate = new Date(endTime).getTime();
		const now = new Date().getTime();
		const distance = countDownDate - now;
		if (distance < 0) {
			return "结束时间错误";
		}
		endSecond.value = Math.floor(distance);
	};
	const onChange = (e) => {
		timeData.value = e;
	};

	const godrawLottery = () => {
		uni.navigateTo({
			url: `/pages/draw-lottery/draw-lottery?voteId=${voteId.value}`
		});
	};
	const cancelLottery = () => {
		showLottery.value = false
	};
	const clickNotice = () => {
		showNotice.value = true
	};
	const confirmNotice = () => {
		showNotice.value = false
	};
	const confirmLottery = () => {
		uni.navigateTo({
			url: `/pages/draw-lottery/draw-lottery?voteId=${voteId.value}`
		});
		showLottery.value = false;
	};
</script>


<style lang="scss">
	page {
		background: #f6f6f6;

		.vote-detail {
			position: relative;
			width: 100%;

			.top {
				margin: 24rpx;
				background-color: #ffffff;
				border-radius: 20rpx;

				.one {
					display: flex;
					align-items: center;
					background-image: url("https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1813767909311799298.png");
					background-size: 702rpx 128rpx;

					.left {
						width: 520rpx;

						.end {
							width: 296rpx;
							height: 34rpx;
							margin: 28rpx 28rpx 0 28rpx;
						}

						.time {
							@include flex;
							align-items: flex-end;
							margin-left: 10rpx;
							line-height: 54rpx;

							&__custom {
								margin-top: 10rpx;
								width: 58rpx;
								height: 58rpx;
								display: flex;
								justify-content: center;
								align-items: center;

								&__item {
									color: #FF9743;
									font-size: 40rpx;
									text-align: center;
									font-weight: 600;
								}
							}

							&__doc {
								color: #999999;
								padding: 0px 4px;
							}

							&__item {
								color: #606266;
								font-size: 15px;
								margin-right: 4px;
							}
						}
					}

					.r-right {
						text-align: center;

						.fix {
							width: 32rpx;
							height: 30rpx;
						}

						.fix-right {
							width: 16rpx;
							height: 24rpx;
						}

						.check {
							font-size: 32rpx;
							color: #347DFF;
							line-height: 32rpx;
							text-align: left;
							margin: 0 8rpx;
						}
					}
				}

				.line {
					border-bottom: 1rpx solid #eeeeee;
				}

				.screen {
					display: flex;
					padding: 20rpx 28rpx 10rpx 28rpx;
					background-color: #ffffff;

					.check {
						background: linear-gradient(90deg, #F59A23, #FFDF25);
						padding: 16rpx 60rpx;
						border-radius: 40rpx;
						color: #ffffff;
					}

					.borbao {
						display: flex;
						align-items: center;

						.select-title {
							width: 152rpx;
							height: 64rpx;
							border: 1rpx solid #BEC5CE;
							border-radius: 200rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-left: 20rpx;

							.title-color {
								font-size: 30rpx;
								color: #666666;
							}

							.select-arrow {
								width: 27rpx;
								height: 27rpx;
							}
						}
					}
				}
			}

			.nums {
				padding: 0 28rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 20rpx 0;
				position: relative;

				.title {
					display: flex;
					align-items: center;

					.today-num {
						width: 178rpx;
						height: 32rpx;
					}

					.xuzhi {
						margin-left: 14rpx;
						display: flex;
						align-items: center;
						font-size: 22rpx;
						color: #8B94A1;
					}
				}

				.votes {
					color: #333333;
					font-size: 30rpx;
					position: relative;

					.color {
						color: #347DFF;
						margin: 0 4rpx;
						font-size: 32rpx;
						font-weight: 600;
					}
				}
			}

			.vote-num {
				display: flex;
				justify-content: space-between;
				padding: 0 28rpx 28rpx 28rpx;

				.common {
					display: flex;
					align-items: center;

					.v-img {
						width: 28rpx;
						height: 44rpx;
					}

					.num {
						margin-left: 10rpx;
						font-size: 32rpx;
						color: #347DFF;
					}

					.vote {
						font-size: 32rpx;
						color: #687186;
					}

					.note {
						font-size: 28rpx;
						color: #687186;
					}
				}
			}

			.data-list {
				display: flex;
				flex-wrap: wrap;
				padding: 0rpx 16rpx;

				.order-list {
					// display: flex;
					// flex-wrap: wrap;
					// padding: 0rpx 16rpx;

					.item {
						width: 342rpx;
						margin: 10rpx;
						background-color: #fff;
						border-radius: 20rpx;
						display: flex;
						flex-direction: column;
						align-items: center;

						.line1 {
							width: 300rpx;
							display: flex;
							justify-content: space-between;
							padding-top: 20rpx;

							.left {
								font-size: 26rpx;
								color: #BEC5CE;
								line-height: 26rpx;
								text-align: left;
								font-style: normal;
								text-transform: none;
							}

							.right {
								font-size: 28rpx;
								color: #FF4646;
								line-height: 28rpx;
								text-align: left;
								font-style: normal;
								text-transform: none;
							}
						}

						.line2 {
							font-size: 32rpx;
							font-weight: 600;
							color: #2A303A;
							line-height: 68rpx;
						}

						.line3 {
							width: 300rpx;
							font-size: 28rpx;
							color: #687186;
							line-height: 48rpx;
							text-align: center;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.vote-but {
							margin: 20rpx;
							width: 164rpx;
							height: 56rpx;
							line-height: 56rpx;
							background: #347DFF;
							border-radius: 20rpx 8rpx 20rpx 8rpx;
						}

						button[disabled] {
							color: #ffffff;
							background: #999999 !important;
						}

						.item-inner {
							width: 100%;
							background-color: #fff;
							border-radius: 10rpx;
							overflow: hidden;
							position: relative;

							.vote-but {
								margin: 20rpx;
								width: 164rpx;
								height: 56rpx;
								background: #347DFF;
								border-radius: 20rpx 8rpx 20rpx 8rpx;
								// margin-left: 89rpx;
							}

							button[disabled] {
								color: #ffffff;
								background: #999999 !important;
							}

							.shadow {
								top: 350rpx;
								position: relative;
								background-color: #fff;
								opacity: .8;
								text-align: center;
								height: 40rpx;
								white-space: nowrap;
								width: 100%;

								.left {
									font-size: 24rpx;
									color: #666666;
								}

								.right {
									font-size: 26rpx;
									margin-left: 20rpx;
									color: #333333;
								}
							}

							image {
								width: 100%;
								height: 350rpx;
								border-top-left-radius: 10rpx;
								border-top-right-radius: 10rpx;
							}

							.line {
								height: 70rpx;
								line-height: 70rpx;
								font-size: 28rpx;
								padding: 0 10rpx;
								display: flex;
								justify-content: space-between;

								.name {
									flex: 1;
									overflow: hidden;
								}

								.num {
									color: #FF4B40;
									max-width: 100rpx;
								}
							}

							.vote-btn {
								width: 100%;
								display: flex;
								justify-content: center;
							}

							.vote {
								width: 80%;
								padding: 10rpx 60rpx;
								opacity: .8;
								margin-bottom: 15rpx;
								text-align: center;
								border-radius: 30rpx;
								background-color: #347DFF;
								color: #fff;
							}
						}
					}
				}
			}

			.rank-list {
				width: 100%;
				display: flex;
				flex-direction: column;
				padding: 20rpx 20rpx;
				padding: 10rpx 20rpx;

				.item {
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					background-color: rgb(255, 255, 255, .8);
					border-radius: 10rpx;
					padding: 30rpx 30rpx;

					.item-inner {
						width: 100%;
						display: flex;
						align-items: center;
						margin-bottom: 50rpx;

						.no {
							width: 50rpx;
							text-align: center;
							margin-right: 10rpx;
							font-size: 32rpx;
						}

						.img {
							border-radius: 50%;
							padding: 5rpx;
							background-color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;

							image {
								width: 80rpx;
								height: 80rpx;
								border-radius: 50%;
							}
						}

						.line {
							flex: 1;
							padding: 0 20rpx;

							.name {
								font-size: 32rpx;
								font-weight: bold;
							}

							.num {
								font-size: 28rpx;
								margin-top: 10rpx;
							}
						}

						.end {
							width: 120rpx;
							font-size: 32rpx;
							text-align: right;
						}
					}
				}
			}

			.notice {
				position: fixed;
				bottom: 0;
				left: 0;
			}
		}
	}
</style>