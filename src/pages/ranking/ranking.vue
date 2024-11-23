<template>
	<loading v-if="isLoading"></loading>
	<view class="container" v-else>
		<view class="header">
			<image class="header-icon" src="https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/1810973744303722498.png"
				mode="aspectFit"></image>
		</view>
		<view class="way">
			<image src="../../static/image/vocal-mini.png" @click="selectWay('vocal')" v-if="wayValue!=='vocal'">
			</image>
			<image src="../../static/image/dance-mini.png" @click="selectWay('dance')" v-if="wayValue!=='dance'">
			</image>
			<image src="../../static/image/musical.png" @click="selectWay('musical')" v-if="wayValue!=='musical'">
			</image>
		</view>
		<view class="ranking">
			<view class="rangking-title">
				<view class="center">
					<image class="full" src="../../static/image/dance.png" v-if="wayValue==='dance'"></image>
					<image class="full" src="../../static/image/vocal.png" v-if="wayValue==='vocal'"></image>
					<image class="full" src="../../static/image/musical.png" v-if="wayValue==='musical'"></image>
				</view>
				<view class="screen" @click="showPoup">
					<text>筛选</text>
					<image class="sc" src="../../static/image/screen.png"></image>
				</view>
			</view>
			<view class="selected" v-if="school || name || registrationCode">
				<view class="name-icon" v-if="name">
					<text class="name">{{name}}</text>
					<up-icon name="close" size="12" :bold="true" @click="deleteName"></up-icon>
				</view>
				<view class="name-icon" v-if="registrationCode">
					<text class="name">{{registrationCode}}</text>
					<up-icon name="close" size="12" :bold="true" @click="deleteCode"></up-icon>
				</view>
				<view class="name-ic" v-if="school">
					<text class="name">{{school}}</text>
					<up-icon name="close" size="12" :bold="true" @click="deleteSchool"></up-icon>
				</view>
			</view>
			<view class="ranking-list">
				<view class="ranking-list-item" v-for="(item, index) in rankingList" :key="index">
					<view v-if="item.top == 1" class="ranking-list-number">
						<image src="/static/image/ranking0.png"></image>
					</view>
					<view v-if="item.top == 2" class="ranking-list-number">
						<image src="/static/image/ranking1.png"></image>
					</view>
					<view v-if="item.top == 3" class="ranking-list-number">
						<image src="/static/image/ranking2.png"></image>
					</view>
					<view v-else class="ranking-list-number">
						<text>{{item.top}}</text>
					</view>
					<view class="ranking-list-nickname">
						<up-avatar :src="item.imageUrl" size="56" mode="aspectFill"></up-avatar>
						<view class="info">
							<view class="name">
								<text>{{item.name}}</text>
								<text class="code">{{item.registrationCode}}</text>
							</view>
							<view class="school">
								{{item.school}}
							</view>
						</view>
					</view>
					<view class="ranking-list-score">
						<text class="score">{{item.count}}</text>
						<text class="text">票</text>
					</view>
				</view>
			</view>
			<!-- < -->
			<!-- <up-loading-icon :show="showLoading" color="#347DFF" text="正在查找" inactiveColor="#a8a8a8"></up-loading-icon> -->
		</view>
		<up-popup :show="showScreen" :round="10" mode="center" :closeable="true" :customStyle="popupStyle"
			@close="closeScreen">
			<view class="title">
				<text class="center">榜单搜索</text>
			</view>
			<view class="line1">
				<up-input placeholder="参赛用户姓名搜索" border="surround" v-model="name"></up-input>
			</view>
			<view class="line">
				<up-input type="number" placeholder="参赛用户编号搜索" border="surround" v-model="registrationCode"></up-input>
			</view>
			<view class="line">
				<w-select width="100%" height="38px" v-model="school" :list="schoolList" valueName="content"
					keyName="id" @change="selectSchool">
				</w-select>
			</view>
			<view class="line2">
				<up-button type="primary" text="确定" @click="confirm"></up-button>
			</view>
		</up-popup>
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
				way: "声乐",
				name: "",
				school: "",
				registrationCode: "",
				schoolSelected: "",
				nameSelected: "",
				codeSelected: "",
				schoolList: [],
				wayArray: [{
						value: 'dance',
						label: '舞蹈',
					},
					{
						value: 'vocal',
						label: '声乐',
					},
					{
						value: 'musical',
						label: '器乐',
					}
				],
				wayValue: "vocal",
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
			let isOnload = true
			this.voteId = e.voteId;
			this.getRankingList(e.voteId, this.way, isOnload);
			this.getSchoolList();
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
			async getRankingList(voteId, way, isOnload) {
				if (!isOnload) {
					uni.showLoading({
						title: '正在切换'
					})
				}
				let argu = {
					voteId: this.voteId,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
					way: this.way,
					name: this.name,
					school: this.school,
					registrationCode: this.registrationCode
				}
				const res = await get('getRanking', argu);
				if (res.rows.length) {
					this.totalPage = res.totalPage;
					this.loadStatus = "loadmore";
					this.rankingList = this.rankingList.concat(res.rows);
				} else {
					this.loadStatus = "nomore"
				}
				this.isLoading = false
				if (!isOnload) {
					uni.hideLoading();
				}
			},
			selectWay(way) {
				this.rankingList = [];
				this.wayValue = way;
				let wayLable = getLabelByValue(this.wayArray, way);
				this.way = wayLable;
				this.getRankingList(this.voteId, wayLable);
			},
			selectSchool(e) {
				this.school = e.content;
			},
			showPoup() {
				this.showScreen = true;
			},
			closeScreen() {
				this.showScreen = false;
			},
			async getSchoolList() {
				const res = await get('getSchoolList');
				this.schoolList = res.map(item => ({
					id: parseInt(item.school_CODE),
					content: item.school
				}));
			},
			confirm() {
				this.rankingList = [];
				this.showScreen = false;
				this.getRankingList();
			},
			deleteSchool() {
				this.rankingList = [];
				this.school = "";
				this.getRankingList();
			},
			deleteName() {
				this.rankingList = [];
				this.name = "";
				this.getRankingList();
			},
			deleteCode() {
				this.rankingList = [];
				this.registrationCode = "";
				this.getRankingList();
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
					height: 300rpx;
				}

				.header-date {
					position: absolute;
					left: 40rpx;
					top: 260rpx;
					font-size: 24rpx;
					color: #ffffff;
				}
			}

			.way {
				position: absolute;
				top: 250rpx;
				right: 20rpx;
				z-index: 99;

				image {
					width: 120rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}
			}

			.ranking {
				border-radius: 30rpx;
				background: #fff;
				position: absolute;
				top: 300rpx;
				left: 0;
				width: 750rpx;

				.rangking-title {
					display: flex;
					justify-content: space-between;
					align-items: center;


					.center {
						margin-left: 260rpx;

						.full {
							width: 206rpx;
							height: 94rpx;
						}
					}

					.screen {
						display: flex;
						height: 28rpx;
						line-height: 28rpx;
						margin-right: 30rpx;
						font-size: 28rpx;
						color: #555;

						text {
							margin-right: 8rpx;
						}

						.sc {
							padding-top: 4rpx;
							width: 28rpx;
							height: 22rpx;
						}
					}
				}

				.selected {
					width: auto;
					height: 48rpx;
					display: flex;
					padding-bottom: 20rpx;

					.name-icon {
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 26rpx;
						color: #3D3D3D;
						background: #EEF5FF;
						border-radius: 8rpx;
						border: 1rpx solid #CBD1DE;
						text-align: center;
						line-height: 48rpx;
						margin: 0 0 0 46rpx;
						max-width: 152rpx;
						padding: 0 8rpx;

						.name {
							margin-right: 10rpx;
							margin-left: 10rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}

					.name-ic {
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 26rpx;
						color: #3D3D3D;
						background: #EEF5FF;
						border-radius: 8rpx;
						border: 1rpx solid #CBD1DE;
						text-align: center;
						line-height: 48rpx;
						margin: 0 0 0 46rpx;
						max-width: 220rpx;
						padding: 0 8rpx;

						.name {
							margin-right: 10rpx;
							margin-left: 10rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
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
							width: 60rpx;

							image {
								width: 40rpx;
								height: 48rpx;
							}
						}

						.ranking-list-nickname {
							display: flex;
							align-items: center;
							width: 600rpx;

							.info {
								margin-left: 10rpx;
								position: relative;
								line-height: 52rpx;

								.name {
									display: flex;
									align-items: center;
									font-size: 32rpx;
									color: $title-main-color;

									.code {
										margin-left: 20rpx;
										font-size: 22rpx;
										color: #687186;
									}
								}

								.school {
									font-size: 26rpx;
									color: #8B94A1;
									font-weight: 300;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
								}
							}
						}

						.ranking-list-score {
							display: block;
							font-size: 32rpx;
							text-align: right;
							width: 120rpx;

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

			.title {
				display: flex;
				justify-content: center;
				line-height: 88rpx;

				.center {
					font-size: 36rpx;
					color: #333;
					font-weight: 600;
				}
			}

			.line {
				margin: 40rpx;
			}

			.line1 {
				margin: 20rpx 40rpx 40rpx 40rpx;
			}

			.line2 {
				margin: 40rpx 40rpx 0rpx 40rpx;
				padding-bottom: 40rpx;
			}
		}
	}
</style>