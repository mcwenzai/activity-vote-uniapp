<template>
	<loading v-if="isLoading"></loading>
	<view class="container" v-else>
		<view class="header">
			<image class="header-icon" src="https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1810973744303722498.png"
				mode="widthFix"></image>
		</view>
		<view class="ranking">
			<view class="rangking-title">
				<view class="center">
					<image class="full" src="../../static/image/troupes.png" v-if="wayValue==='troupes'"></image>
				</view>
			</view>
			<view class="ranking-list" v-if="rankingList.length">
				<view class="ranking-list-item" v-for="(item, index) in rankingList" :key="index">
					<view v-if="index < 3" class="ranking-list-number">
						<image :src="'/static/image/' + 'ranking' + index + '.png'"></image>
					</view>
					<view v-else class="ranking-list-number">
						<text>{{item.top}}</text>
					</view>
					<view class="ranking-list-nickname">
						<up-avatar :src="item.collegeImageUrl" size="56" mode="aspectFill"></up-avatar>
						<view class="info">
							<view class="name">
								<text>{{item.unitName}}</text>
								<text class="code">{{item.registrationCode}}</text>
							</view>
						</view>
					</view>
					<view class="ranking-list-score">
						<text class="score">{{item.likes}}</text>
						<text class="text">赞</text>
					</view>
				</view>
			</view>
			<empty typeText="院团排行" else></empty>
		</view>
		<up-loadmore :status="loadStatus" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" color="#c0c7e2" lineColor="#d8e0ff" :dashed="false" line />
		<up-gap height="10" bgColor="#f6f6f6"></up-gap>
	</view>
</template>

<script>
	import {
		get
	} from '@/common/request.js';
	import {
		getLabelByValue
	} from '@/util/util.js';
	export default {
		data() {
			return {
				rankingList: [],
				nowDate: "",
				isLoading: true,
				voteId: "",
				name: "",
				school: "",
				registrationCode: "",
				schoolSelected: "",
				nameSelected: "",
				codeSelected: "",
				schoolList: [],
				wayValue: "troupes",
				popupStyle: {
					width: '80%'
				},
				showScreen: false,
				searchText: "",
				pageSize: 20,
				pageNo: 1,
				totalPage: 0,
				loadStatus: "loadmore",
				loadingText: "努力加载中",
				loadmoreText: "加载完",
				nomoreText: "没有更多了"
			}
		},
		onLoad(e) {
			this.voteId = e.voteId;
			this.getRankingList();
			this.getDate();
		},
		onReachBottom() {
			if (!this.isLoading) {
				if (this.pageNo < this.totalPage) {
					this.loadStatus = "loading"
					this.pageNo++;
					this.getRankingList(this.voteId);
				} else {
					this.loadStatus = "nomore"
				}
			}
		},
		methods: {
			getDate() {
				let date = new Date();
				const year = date.getFullYear();
				const month = date.getMonth() + 1
				const day = date.getDate();
				date = `${year}-${this.addZero(month)}-${this.addZero(day)}`
				this.nowDate = date
			},
			addZero(num) {
				if (num < 10) {
					num = `0${num}`
				}
				return num
			},
			async getRankingList() {
				const res = await get('getCollegeRanking');
				if (res.rows.length) {
					this.totalPage = res.totalPage;
					this.loadStatus = "loadmore";
					this.rankingList = this.rankingList.concat(res.rows);
				} else {
					this.loadStatus = "nomore"
				}
				this.isLoading = false
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f6f6f6;

		.container {
			position: relative;
			padding-bottom: 20rpx;

			.header {
				position: relative;

				.header-icon {
					width: 100%;
					height: auto;
				}

				.header-date {
					position: absolute;
					left: 40rpx;
					top: 260rpx;
					font-size: 24rpx;
					color: #ffffff;
				}
			}

			.ranking {
				position: relative;
				background: #fff;
				width: 750rpx;
				margin-top: -10rpx;

				.rangking-title {
					display: flex;
					justify-content: center;

					.full {
						width: 206rpx;
						height: 94rpx;
					}
				}

				.ranking-list {
					margin: 0 40rpx;

					.ranking-list-item {
						display: flex;
						align-items: center;
						font-size: 28rpx;
						margin: 34rpx 0;
						border-radius: 20rpx;

						.ranking-list-number {
							color: #777;
							display: flex;
							flex: 1;

							image {
								width: 40rpx;
								height: 48rpx;
							}
						}

						.ranking-list-nickname {
							display: flex;
							align-items: center;
							flex: 8;

							.info {
								margin-left: 10rpx;
								position: relative;

								.name {
									display: flex;
									align-items: center;
									font-size: 32rpx;
									color: $title-main-color;
								}
							}
						}

						.ranking-list-score {
							display: block;
							font-size: 32rpx;
							text-align: right;
							flex: 2;

							.score {
								color: #ff5757;
							}

							.text {
								color: #454C5A;
								font-size: 30rpx;
							}
						}
					}
				}
			}
		}
	}
</style>