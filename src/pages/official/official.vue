<template>
	<view>
		<official-account v-if="isFollow" :bindload="changetab"></official-account>
		<view class="guide-mask" :class="[showGuide?'guide-mask-show':'']">
			<view style="width:100%;position: absolute;top: 0;right: 0;">
				<view>
					<image src="../../static/image/point_bg.png" style="width: 100%;" mode="widthFix" />
				</view>
				<view @click="close" style="text-align: center;">
					<image src="../../static/image/point_btn.png" style="width: 60%;" mode="widthFix" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { get } from '@/common/request.js';
	export default {
		data() {
			return {
				isFollow: true,
				showGuide: true,
				activityData: {}
			}
		},
		onLoad(options) {
			let objStr = decodeURIComponent(options.data);
			let obj = JSON.parse(objStr);
			this.activityData = obj
		},
		onReady() {
			setInterval(() => {
				this.goSignUp();
			}, 60 * 1000);
		},
		onUnload() {
			clearInterval(this.signUpTimer);
		},
		methods: {
			closeGuide() {
				this.showGuide = false
			},
			async goSignUp() {
				let res = await get('getActivity');
				let objStr = JSON.stringify(this.activityData);
				if (res) {
					uni.navigateTo({
						url: '/pages/sign-up/sign-up?data=' + encodeURIComponent(objStr)
					})
				} else {
					this.showGuide = true
				}
			}
		}
	}
</script>

<style scoped>
	.guide-mask {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1110;
		opacity: 0;
		outline: 0;
		text-align: center;
		-ms-transform: scale(1.185);
		transform: scale(1.185);
		backface-visibility: hidden;
		perspective: 2000upx;
		background: rgba(0, 0, 0, 0.6);
		transition: all 0.3s ease-in-out 0s;
		pointer-events: none;
	}

	.guide-mask-show {
		opacity: 1;
		transition-duration: 0.3s;
		-ms-transform: scale(1);
		transform: scale(1);
		overflow-x: hidden;
		overflow-y: auto;
		pointer-events: auto;
	}
</style>