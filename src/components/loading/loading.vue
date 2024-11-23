<template>
	<view class="container">
		<view class="loader">
			<view class="loader__ball"></view>
			<view class="loader__ball"></view>
			<view class="loader__ball"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "loading",
		data() {
			return {};
		}
	};
</script>

<style lang="scss" scoped>
	$dotColor: linear-gradient(135deg, #347DFF, #34b9ff, #34f5ff);
	$dotSize: 30rpx;
	$duration: 2s;

	.container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.loader {
		animation: rotate $duration linear infinite normal;
		position: relative;
		transform-origin: 50% 50%;

		&__ball {
			height: $dotSize;
			width: $dotSize;
			left: -$dotSize * 0.5;
			position: absolute;
			top: -$dotSize * 0.5;
			transform-origin: 50% 50%;

			&:nth-of-type(2) {
				transform: rotate(120deg);
			}

			&:nth-of-type(3) {
				transform: rotate(240deg);
			}

			&::after {
				animation: move $duration * 0.5 ease-in-out infinite alternate;
				background: $dotColor;
				border-radius: 50%;
				content: "";
				display: inline-block;
				height: 100%;
				width: 100%;
				transform-origin: 50% 50%;
			}
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0);
		}

		to {
			transform: rotate(360deg);
		}
	}

	@keyframes move {

		0%,
		15% {
			transform: translateY(0);
		}

		100% {
			transform: translateY(-150%);
		}
	}
</style>