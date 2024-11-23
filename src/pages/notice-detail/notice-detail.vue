<template>
	<loading v-if="isLoading"></loading>
	<view v-else>
		<view class="notice-detail" v-if="noticeDetail">
			<view class="title">{{noticeDetail.noticeTitle}}</view>
			<view class="notice-flex">
				<view class="tag">
					<up-icon name="clock" size="16"></up-icon>
					<text class="tagtext1">{{noticeDetail.publishTime.substring(0,10)}}</text>
				</view>
				<view class="tag">
					<up-icon name="eye" size="18"></up-icon>
					<text class="tagtext2">{{noticeDetail.views}}</text>
				</view>
				<view class="tag">
					<up-icon name="account" size="18"></up-icon>
					<text class="tagtext3">{{noticeDetail.publishUserName}}</text>
				</view>
			</view>
			<view class="content">
				<view class="text">
					<text>{{noticeDetail.noticeContent}}</text>
				</view>
			</view>
			<view class="enclosure" v-if="fileList.length">
				<view class="tit">附件：</view>
				<view class="file">
					<view class="line" v-for="(item,index) in fileList" :key="index" @click="downloadEnclosure(item.url)">{{item.name}}</view>
				</view>
			</view>
		</view>
		<empty typeText="公告" v-else></empty>
	</view>
</template>
<script>
	import {
		get
	} from '@/common/request.js';
	export default {
		data() {
			return {
				noticeDetail: null,
				isLoading: true,
				fileList: []
			}
		},
		onLoad(id) {
			this.getNoticeDetail(id)
		},
		methods: {
			async getNoticeDetail(id) {
				const res = await get('getNoticeDetail', id)
				this.noticeDetail = res;
				let fileArray = Object.entries(res.fileMap).map(([name, url]) => ({
					name,
					url
				}));
				this.fileList = fileArray
				this.isLoading = false
			},
			downloadEnclosure(url) {
				uni.downloadFile({
					url: url,
					success: (res) => {
						if (res.statusCode === 200) {
							let filePath = res.tempFilePath
							uni.openDocument({
								filePath: filePath,
								success: function(res) {
								},
								fail: function(res) {
									uni.showToast({
										title: '暂不支持该附件预览'
									})
								},
								complete: function(res) {
									console.log(res)
								}
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '下载失败',
							icon: 'none'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;

		.notice-detail {
			padding: 30rpx;

			.title {
				font-size: 36rpx;
				color: #222222;
				margin: 10rpx 0;
			}

			.notice-flex {
				display: flex;
				justify-content: space-between;
				margin: 30rpx 0;

				.tag {
					display: flex;
					align-items: center;
					font-size: 28rpx;

					.tagtext1 {
						margin-left: 6rpx;
						color: #666;
						overflow: hidden;
						white-space: nowrap;
					}

					.tagtext2 {
						margin-left: 6rpx;
						color: #666;
						overflow: hidden;
						white-space: nowrap;
					}

					.tagtext3 {
						margin-left: 6rpx;
						color: #666;
						overflow: hidden;
						white-space: nowrap;
					}
				}
			}

			.content {
				background-color: #f2f2f2;
				padding: 20rpx;

				.text {
					font-size: 30rpx;
					color: #444444;
				}
			}

			.enclosure {
				display: flex;
				align-items: center;
				margin-top: 20rpx;

				.tit {
					font-size: 30rpx;
					color: #333;
				}

				.file {
					width: 580rpx;
					font-size: 30rpx;
					color: #347DFF;
					word-wrap: break-word;

					.line {
						line-height: 60rpx;
						height: 60rpx;
					}
				}
			}
		}
	}
</style>