<template>
	<loading v-if="isLoading"></loading>
	<view class="vote-list" v-else>
		<view class="vote-first">
			<up-gap height="16"></up-gap>
			<view class="vote-top">
				<view class="r-right" @click="goRanking()">
					<image class="fix" src="../../static/image/ranking.png"></image>
					<text class="check">查看排行榜</text>
					<image class="fix-right" src="../../static/image/arr-right.png"></image>
				</view>
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
				<view class="screen">
					<up-search v-model="voteInput" placeholder="参赛用户姓名搜索" shape="round" bgColor="#E3E7FC" border="true"
						:showAction="false" :clearabled="true" @clear="resetSearch" actionText="搜索" @search="inputSeach"
						@custom="inputSeach" />
					<view class="borbao">
						<view class="select-title" @click="showSchool">
							<text class="title-color">学校</text>
							<image class="select-arrow" src="../../static/image/screen.png"></image>
						</view>
						<liu-select :list="schoolList" :open="openSchool" @close="openSchool = false"
							@change="changeSelect" titleKey="school"></liu-select>
					</view>
				</view>
			</view>
			<up-gap height="6"></up-gap>
			<view class="vote-bg">
				<view class="xuzhi" @click="clickNotice">
					<text>投票须知</text>
					<up-icon color="#827FC1" size="13" name="question-circle"></up-icon>
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
		</view>
		<!-- <up-gap height="12"></up-gap> -->
		<view class="vote-middle">
			<up-gap height="16" color="#040b3e"></up-gap>
			<view class="data-list">
				<view class="left-list">
					<view class="list" v-for="(item, index) in leftList" :key="index">
						<view class="pic-des">
							<image class="avatar" :src="item.imageUrl ? item.imageUrl : '/static/image/noimage.png'"
								@click="goVoteDetail(item.id)" mode="aspectFill"></image>
							<view class="side">
								<view class="line1">{{item.personName}}</view>
								<view class="line2">{{item.voteCount}}票</view>
								<view class="line3">{{item.registrationCode}}</view>
							</view>
						</view>
						<view class="name">{{item.school}}</view>
						<up-button class="left-b" @click="bindVoteTap(item,index)">投票</up-button>
					</view>
				</view>
				<view class="right-list">
					<view class="list" v-for="(item, index) in rightList" :key="index">
						<view class="pic-des">
							<image class="avatar" :src="item.imageUrl ? item.imageUrl : '/static/image/noimage.png'"
								@click="goVoteDetail(item.id)" mode="aspectFill"></image>
							<view class="side">
								<view class="line1">{{item.personName}}</view>
								<view class="line2">{{item.voteCount}}票</view>
								<view class="line3">{{item.registrationCode}}</view>
							</view>
						</view>
						<view class="name">{{item.school}}</view>
						<up-button class="right-b" @click="bindVoteTap(item,index)">投票</up-button>
					</view>
				</view>
			</view>
		</view>
		<view class="vote-third"></view>
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
	const leftList = ref([]);
	const rightList = ref([]);
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
	
	onPullDownRefresh(() => {
		listData.value = [];
		pageNo.value = 1;
		this.loadStatus = "loadmore";
		getVoteCount(voteId.value);
		countdown(voteEnd.value);
		getSchoolList();
		getActivityVote(voteId.value);
		getVoteDetail(voteId.value);
		getIsVoteDraw(voteId.value)
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 200);
	});
	
	const getIsVoteDraw = (id) => {
		const isHasDrawstatus = get('getVoteDrawstatus', {
			voteId: id
		})
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

		splitList(listData.value);
		isLoading.value = false;
	};
	
	const splitList = (list) => {
		leftList.value = [];
		rightList.value = [];

		list.forEach(item => {
			if (leftList.value.length <= rightList.value.length) {
				leftList.value.push(item);
			} else {
				rightList.value.push(item);
			}
		});
	};

	const getVoteCount = async (id) => {
		const res = await get('getVoteCount', {
			voteId: id
		});
		common.value = res.common;
		special.value = res.special;
		allIsVoted.value = res.common === 0 && res.special === 0;
		isShow.value = res.isShow;
		if (res.common.value == 0 && isHasDraw.value) {
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
	.vote-list {
		position: relative;
		height: 100vh;
	}

	.vote-first,
	.vote-middle,
	.vote-third {
		width: 100%;
	}

	.vote-first {
		height: 532rpx;
		background-image: url('https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1817807838702596097.png');
		background-size: cover;
		background-position: center;

		.vote-top {
			margin: 0 24rpx;
			width: 702rpx;
			height: 284rpx;
			background-image: url('https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1817799432918921218.png');
			background-size: 100%;

			.r-right {
				padding: 20rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;

				.fix {
					width: 32rpx;
					height: 30rpx;
				}

				.fix-right {
					width: 16rpx;
					height: 24rpx;
				}

				.check {
					font-size: 30rpx;
					color: #616893;
					line-height: 30rpx;
					text-align: left;
					margin: 0 8rpx;
				}
			}

			.time {
				@include flex;
				align-items: flex-end;
				margin: 20rpx 10rpx;
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

			.screen {
				display: flex;
				padding: 10rpx 28rpx 10rpx 28rpx;

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
						background: #E3E7FC;
						// border: 1rpx solid #BEC5CE;
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
		.vote-bg {
			width: 750rpx;
			height: 212rpx;
			background-image: url('https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1817809851326787585.png');
			background-size: 100%;

			.xuzhi {
				display: flex;
				justify-content: flex-end;
				font-size: 24rpx;
				color: #827FC1;
				padding: 22rpx 60rpx;
			}

			.vote-num {
				width: 654rpx;
				height: 60rpx;
				background: #FAEBFF;
				border-radius: 16rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 10rpx 48rpx 0rpx 48rpx;

				.common {
					display: flex;
					align-items: center;

					.v-img {
						width: 40rpx;
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
						font-size: 22rpx;
						color: #687186;
					}
				}
			}
		}
	}

	.vote-middle {
		background-color: #040b3e;
		min-height: 66.7%;
		.data-list {
			display: flex;
			flex-direction: row;
			flex-direction: row;
			align-items: flex-start;

			.left-list {
				display: flex;
				flex-direction: row;
				flex: 1;
				flex-direction: column;
				height: auto;

				.list {
					width: 332rpx;
					height: 308rpx;
					background: #323A70;
					border-radius: 20rpx 20rpx 40rpx 20rpx;
					margin: 40rpx 10rpx 40rpx 30rpx;

					.pic-des {
						display: flex;
						width: 332rpx;
						height: 162rpx;

						.avatar {
							position: relative;
							top: -36rpx;
							left: -18rpx;
							width: 164rpx;
							height: 188rpx;
							border-radius: 20rpx 20rpx 20rpx 20rpx;
							border: 2rpx solid #8B51F3;
							z-index: 99;
						}

						.side {
							position: relative;
							top: -12rpx;
							left: -18rpx;
							z-index: 9;

							.line1 {
								width: 144rpx;
								height: 48rpx;
								padding-left: 10rpx;
								line-height: 48rpx;
								background: #8B51F3;
								border-radius: 0rpx 8rpx 20rpx 0rpx;
								color: #fff;
								font-size: 32rpx;
							}

							.line2 {
								width: 162rpx;
								height: 48rpx;
								padding-left: 10rpx;
								line-height: 48rpx;
								background: #F4F5FF;
								border-radius: 8rpx 0rpx 20rpx 0rpx;
								margin: 14rpx 0;
								font-size: 26rpx;
								color: #8B51F3;
							}

							.line3 {
								width: 92rpx;
								height: 24rpx;
								padding-left: 10rpx;
								font-weight: 400;
								font-size: 24rpx;
								color: #E1D1FF;
								line-height: 24rpx;
							}
						}
					}

					.name {
						font-weight: 400;
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 56rpx;
						padding: 0 18rpx;
						text-align: left;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.left-b {
						width: 300rpx;
						height: 72rpx;
						background: linear-gradient(90deg, #504DF2 0%, #9251F3 100%);
						border-radius: 20rpx 8rpx 40rpx 8rpx;
						color: #ffffff;
						font-size: 28rpx;
					}
				}
			}


			.right-list {
				display: flex;
				flex-direction: row;
				flex: 1;
				flex-direction: column;
				height: auto;

				.list {
					text-align: right;
					width: 332rpx;
					height: 308rpx;
					background: #323A70;
					border-radius: 20rpx 20rpx 40rpx 20rpx;
					margin: 40rpx 30rpx 40rpx 10rpx;

					.pic-des {
						width: 332rpx;
						height: 162rpx;

						.avatar {
							position: relative;
							top: -36rpx;
							right: -18rpx;
							width: 164rpx;
							height: 188rpx;
							border-radius: 20rpx 20rpx 20rpx 20rpx;
							border: 2rpx solid #8B51F3;
							z-index: 99;
						}

						.side {
							position: relative;
							top: -212rpx;
							right: 150rpx;
							z-index: 9;
							text-align: right;
							display: grid;

							.line1 {
								width: 144rpx;
								height: 48rpx;
								padding-right: 10rpx;
								line-height: 48rpx;
								background: #8B51F3;
								border-radius: 8rpx 0rpx 0rpx 20rpx;
								justify-self: end;
								color: #fff;
								font-size: 32rpx;
							}

							.line2 {
								width: 162rpx;
								height: 48rpx;
								padding-right: 10rpx;
								line-height: 48rpx;
								background: #F4F5FF;
								border-radius: 8rpx 0rpx 0rpx 20rpx;
								margin: 14rpx 0;
								justify-self: end;
								font-size: 26rpx;
								color: #8B51F3;
							}

							.line3 {
								width: 92rpx;
								height: 24rpx;
								padding-right: 10rpx;
								font-weight: 400;
								font-size: 24rpx;
								color: #E1D1FF;
								line-height: 24rpx;
								justify-self: end;
								text-align: center;
							}
						}
					}

					.name {
						font-weight: 400;
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 56rpx;
						padding: 0 18rpx;
						text-align: right;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.right-b {
						width: 300rpx;
						height: 72rpx;
						background: linear-gradient(90deg, #9251F3 0%, #504DF2 100%);
						border-radius: 8rpx 20rpx 8rpx 40rpx;
						color: #ffffff;
						font-size: 28rpx;
					}
				}

			}
		}
	}

	.vote-third {
		height: 33.333%;
		background-image: url('https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1817850768507138049.png');
		background-size: cover;
		background-position: center;
		margin-top: -460rpx;
	}
</style>