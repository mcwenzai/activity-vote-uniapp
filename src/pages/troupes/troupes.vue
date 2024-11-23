<template>
	<loading v-if="isLoading"></loading>
	<view class="wrap" v-else>
		<view class="swiper-container">
			<image class="header-icon" :src="bannerList" mode="widthFix"></image>
		</view>
		<view class="title">
			<view class="icon-left">
				<image class="icon-left" src="../../static/image/troupes-title.png"></image>
			</view>
			<view class="r-right" @click="goRanking()">
				<image class="fix" src="../../static/image/ranking.png"></image>
				<text class="check">排行榜</text>
				<image class="fix-right" src="../../static/image/arr-right.png"></image>
			</view>
		</view>

		<view class="search-bg">
			<up-search placeholder="搜索参赛单位名称" v-model="searchText" shape="round" :clearabled="true" inputAlign="center"
				bgColor="#ffffff" @search="searchCollegeList" @custom="searchCollegeList"
				@clear="clearCollegeList"></up-search>
		</view>
		<view class="column" v-if="collegeList.length">
			<view class="troupes-warter" v-for="(item, index) in collegeList" :key="index">
				<view @click="goDetail(item.id)">
					<up-lazy-load threshold="0" border-radius="10" :image="item.collegeImageUrl" img-mode="aspectFill"
						:height="160" :index="index"></up-lazy-load>
					<view class="troupes-title">
						{{item.unitName}}
					</view>
					<view class="troupes-num">
						<text class="num">{{item.likes}}</text>
						<text class="name">赞</text>
					</view>
					<view class="troupes-tag">
					</view>
				</view>
				<up-button icon="thumb-up" size="mini" type="primary" class="troupes-tag-text"
					@click="thumbsUp(item.id,index)">
					为TA点赞
				</up-button>
			</view>
		</view>
		<empty typeText="参赛单位" else></empty>
		<up-loadmore :status="loadStatus" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" color="#c0c7e2" lineColor="#d8e0ff" :dashed="false" line
			@loadmore="getCollegeList"></up-loadmore>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		get
	} from '@/common/request.js';
	import {
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app";
	const isLoading = ref(true);
	const collegeList = ref([]);
	const bannerList = ref(['https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1810973744303722498.png']);
	const searchText = ref('');
	const listData = ref([]);
	const pageSize = ref(20);
	const pageNo = ref(1);
	const totalPage = ref(0);
	const loadStatus = ref("loadmore");
	const loadingText = ref("努力加载中");
	const loadmoreText = ref("上拉加载");
	const nomoreText = ref("没有更多了");
	const waterfallRef = ref(null);
	onLoad(() => {
		getCollegeList();
	});
	onReachBottom(() => {
		if (!isLoading.value && pageNo.value < totalPage.value) {
			loadStatus.value = "loading"
			pageNo.value++
			getCollegeList();
		} else {
			loadStatus.value = "nomore"
		}
	});
	const getCollegeList = async () => {
		const res = await get('getCollegeList', {
			searchText: searchText.value,
			pageSize: pageSize.value,
			pageNo: pageNo.value
		});
		if (res.totalPage > pageNo.value) {
			loadStatus.value = "loadmore";
		} else {
			loadStatus.value = "nomore";
		}
		totalPage.value = res.totalPage;
		collegeList.value = [...collegeList.value, ...res.rows];
		isLoading.value = false
	};

	const thumbsUp = async (id, index) => {
		let list = collegeList.value;
		try {
			await get('getAddLikes', {
				id: id
			});
			list[index].likes++
		} catch {
			uni.showToast({
				title: '点赞失败',
				icon: 'error'
			})
		}
	};

	const searchCollegeList = (input) => {
		collegeList.value = []
		getCollegeList()
	};
	const clearCollegeList = () => {
		collegeList.value = []
		getCollegeList()
	};
	const goRanking = () => {
		uni.navigateTo({
			url: `/pages/troupes-ranking/troupes-ranking`
		});
	};
	const goDetail = (id) => {
		uni.navigateTo({
			url: `/pages/troupes-detail/troupes-detail?id=${id}`
		});
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: rgb(240, 240, 240);

		.swiper-container {
			position: relative;
			image{
				width: 100%;
				height: auto;
			}
		}
		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: -5rpx 24rpx 0rpx 24rpx;
			background-color: #ffffff;
			position: relative;
			height: 80rpx;
			.icon-left {
				width: 288rpx;
				height: 32rpx;
				line-height: 32rpx;

			}
			.r-right {
				display: flex;
				align-items: center;
				text-align: center;
				line-height: 32rpx;
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
					text-align: left;
					margin: 0 8rpx;
				}
			}
		}


		.search-bg {
			width: 670rpx;
			background: rgba(209, 210, 255, 0.5);
			border-radius: 20rpx;
			margin: 0 auto;
			padding: 40rpx 20rpx;
		}

		.column {
			display: flex;

			.troupes-warter {
				width: 342rpx;
				border-radius: 20rpx;
				margin: 20rpx;
				background-color: #ffffff;
				padding: 14rpx;
				position: relative;
			}

			.troupes-image {
				width: 100%;
				border-radius: 4px;
			}

			.troupes-title {
				font-size: 32rpx;
				margin: 10rpx 0 8rpx 0;
				color: $title-main-color;
				height: 82rpx;
			}

			.troupes-tag {
				display: flex;
				margin-top: 5px;
			}

			.troupes-tag-owner {
				color: #FFFFFF;
				display: flex;
				align-items: center;
				padding: 4rpx 14rpx;
				border-radius: 50rpx;
				font-size: 20rpx;
				line-height: 1;
			}

			.troupes-tag-text {
				width: 280rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50rpx;
				font-size: 20rpx;
				margin: 0 auto;
				background-color: #347DFF;
			}

			.troupes-num {
				font-size: 30rpx;

				.num {
					color: #ff2121;
				}

				.name {
					margin-left: 8rpx;
					color: $title-desc-color;
				}
			}
		}
	}
</style>