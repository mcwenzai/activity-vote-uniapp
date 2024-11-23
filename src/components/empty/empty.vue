<template>
	<view class="empty">
		<image src="/static/image/nocomment.png" mode="widthFix"></image>
		<text>暂无</text>
		<text>{{typeText}}</text>
		<!-- <text>数据~</text> -->
	</view>
</template>

<script>
	export default {
		name: "empty",
		props: {
			typeText: {
				type: String,
				default: ""
			}
		}
	}
</script>

<style lang="scss">
	.empty {
		width: 100%;
		height: 300rpx;
		padding: 60rpx 0;
		text-align: center;

		image {
			display: block;
			width: 240rpx;
			height: 240rpx;
			margin: 0 auto;
		}

		text {
			display: inline;
			width: 100%;
			text-align: center;
			font-size: 30rpx;
			color: #777777;
		}
	}
</style>