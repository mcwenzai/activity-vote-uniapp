<template>
	<view class="content">
		<view class="t-mask"
			:style="{opacity:show?'1':'0','z-index':zIndex,'left':show?'0rpx':'200%','transition-duration':duration?(duration+'s'):'0.3s'}"
			@click.stop="maskClick" @mousemove.stop>
			<view :class="['t-wrap',aniType,{'show':show}]">
				<view :style="[contentStyle]" @click.stop>
					<slot></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "kevy-mask",
		props: {
			/**
			 * 是否显示
			 */
			show: {
				type: Boolean,
				default: false
			},
			/**
			 * 是否开启点击遮罩关闭
			 */
			maskClose: {
				type: Boolean,
				default: true
			},
			/**
			 * 层级
			 */
			zIndex: {
				type: Number,
				default: 10
			},
			/**
			 * 动画时长，单位秒
			 */
			duration: {
				type: [String, Number],
				default: 0.3
			},
			/**
			 * 嵌入内容css类名
			 */
			contentStyle: {
				type: Object,
				default: () => {}
			},
			/**
			 * 动画类型（13种）：fadeInAndScaleUp、slideFromRight、slideFromBottom、newspaper、fall、sideAndFall、flipH3d、flipV3d、sign3d、superScale、slit3d、rotateFromBottom3d、rotateFromLeft3d
			 */
			aniType: {
				type: String,
				default: 'fadeInAndScaleUp'
			},
		},
		data() {
			return {
				isRm:false
			}
		},
		created() {

		},
		methods: {
			//遮罩点击
			maskClick() {
				if (this.maskClose) {
					this.$emit("click");
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		box-sizing: border-box;
		height: 0rpx;
		overflow: hidden;


		.t-mask {
			position: fixed;
			top: 0rpx;
			left: 0rpx;
			background: rgba(0, 0, 0, 0.6);
			margin: 0rpx;
			padding: 0rpx;
			transition-property: opacity;
			transition-timing-function: ease-in;
			-webkit-perspective: 1300rpx;
			perspective: 1300rpx;
			-webkit-backface-visibility: hidden;
			backface-visibility: hidden;


			.t-wrap {
				min-width: 100vw;
				min-height: 100vh;
				overflow: hidden;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;

				//fadeInAndScaleUp
				&.fadeInAndScaleUp {
					-webkit-transform: scale(0.7);
					transform: scale(0.7);
					opacity: 0;
					-webkit-transition: all 0.3s;
					transition: all 0.3s;

					&.show {
						-webkit-transform: scale(1);
						transform: scale(1);
						opacity: 1;
					}
				}

				//slideFromRight
				&.slideFromRight {
					-webkit-transform: translateX(20%);
					transform: translateX(20%);
					opacity: 0;
					-webkit-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
					transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);

					&.show {
						-webkit-transform: translateX(0);
						transform: translateX(0);
						opacity: 1;
					}
				}

				//slideFromBottom
				&.slideFromBottom {
					-webkit-transform: translateY(20%);
					transform: translateY(20%);
					opacity: 0;
					-webkit-transition: all 0.3s;
					transition: all 0.3s;

					&.show {
						-webkit-transform: translateY(0);
						transform: translateY(0);
						opacity: 1;
					}
				}

				//newspaper
				&.newspaper {
					-webkit-transform: scale(0) rotate(720deg);
					transform: scale(0) rotate(720deg);
					opacity: 0;
					-webkit-transition: all 0.5s;
					transition: all 0.5s;

					&.show {
						-webkit-transform: scale(1) rotate(0deg);
						transform: scale(1) rotate(0deg);
						opacity: 1;
					}
				}

				//fall
				&.fall {
					-webkit-transform-style: preserve-3d;
					transform-style: preserve-3d;
					-webkit-transform: translateZ(600px) rotateX(20deg);
					transform: translateZ(600px) rotateX(20deg);
					opacity: 0;

					&.show {
						-webkit-transition: all 0.3s ease-in;
						transition: all 0.3s ease-in;
						-webkit-transform: translateZ(0px) rotateX(0deg);
						transform: translateZ(0px) rotateX(0deg);
						opacity: 1;
					}
				}

				//sideAndFall
				&.sideAndFall {
					-webkit-transform-style: preserve-3d;
					transform-style: preserve-3d;
					-webkit-transform: translate(30%) translateZ(600px) rotate(10deg);
					transform: translate(30%) translateZ(600px) rotate(10deg);
					opacity: 0;

					&.show {
						-webkit-transition: all 0.3s ease-in;
						transition: all 0.3s ease-in;
						-webkit-transform: translate(0%) translateZ(0) rotate(0deg);
						transform: translate(0%) translateZ(0) rotate(0deg);
						opacity: 1;
					}
				}

				//flipH3d
				&.flipH3d {
					-webkit-transform-style: preserve-3d;
					transform-style: preserve-3d;
					-webkit-transform: rotateY(-70deg);
					transform: rotateY(-70deg);
					-webkit-transition: all 0.3s;
					transition: all 0.3s;
					opacity: 0;

					&.show {
						-webkit-transform: rotateY(0deg);
						transform: rotateY(0deg);
						opacity: 1;
					}
				}

				//flipV3d
				&.flipV3d {
					-webkit-transform-style: preserve-3d;
					transform-style: preserve-3d;
					-webkit-transform: rotateX(-70deg);
					transform: rotateX(-70deg);
					-webkit-transition: all 0.3s;
					transition: all 0.3s;
					opacity: 0;

					&.show {
						-webkit-transform: rotateX(0deg);
						transform: rotateX(0deg);
						opacity: 1;
					}
				}

				//sign3d
				&.sign3d {
					-webkit-transform-style: preserve-3d;
					transform-style: preserve-3d;
					-webkit-transform: rotateX(-60deg);
					transform: rotateX(-60deg);
					-webkit-transform-origin: 50% 0;
					transform-origin: 50% 0;
					opacity: 0;
					-webkit-transition: all 0.3s;
					transition: all 0.3s;

					&.show {
						-webkit-transform: rotateX(0deg);
						transform: rotateX(0deg);
						opacity: 1;
					}
				}

				//superScale
				&.superScale {
					-webkit-transform: scale(2);
					transform: scale(2);
					opacity: 0;
					-webkit-transition: all 0.3s;
					transition: all 0.3s;

					&.show {
						-webkit-transform: scale(1);
						transform: scale(1);
						opacity: 1;
					}
				}

				//slit3d
				&.slit3d {
					-webkit-transform-style: preserve-3d;
					transform-style: preserve-3d;
					-webkit-transform: translateZ(-3000px) rotateY(90deg);
					transform: translateZ(-3000px) rotateY(90deg);
					opacity: 0;

					&.show {
						-webkit-animation: slit .7s forwards ease-out;
						animation: slit .7s forwards ease-out;
					}
				}

				@-webkit-keyframes slit {
					50% {
						-webkit-transform: translateZ(-250px) rotateY(89deg);
						opacity: .5;
						-webkit-animation-timing-function: ease-out;
					}

					100% {
						-webkit-transform: translateZ(0) rotateY(0deg);
						opacity: 1;
					}
				}

				@keyframes slit {
					50% {
						transform: translateZ(-250px) rotateY(89deg);
						opacity: 1;
						animation-timing-function: ease-in;
					}

					100% {
						transform: translateZ(0) rotateY(0deg);
						opacity: 1;
					}
				}

				//rotateFromBottom3d
				&.rotateFromBottom3d {
					-webkit-transform-style: preserve-3d;
					transform-style: preserve-3d;
					-webkit-transform: translateY(100%) rotateX(90deg);
					transform: translateY(100%) rotateX(90deg);
					-webkit-transform-origin: 0 100%;
					transform-origin: 0 100%;
					opacity: 0;
					-webkit-transition: all 0.3s ease-out;
					transition: all 0.3s ease-out;

					&.show {
						-webkit-transform: translateY(0%) rotateX(0deg);
						transform: translateY(0%) rotateX(0deg);
						opacity: 1;
					}
				}

				//rotateFromLeft3d
				&.rotateFromLeft3d {
					-webkit-transform-style: preserve-3d;
					transform-style: preserve-3d;
					-webkit-transform: translateZ(100px) translateX(-30%) rotateY(90deg);
					transform: translateZ(100px) translateX(-30%) rotateY(90deg);
					-webkit-transform-origin: 0 100%;
					transform-origin: 0 100%;
					opacity: 0;
					-webkit-transition: all 0.3s;
					transition: all 0.3s;

					&.show {
						-webkit-transform: translateZ(0px) translateX(0%) rotateY(0deg);
						transform: translateZ(0px) translateX(0%) rotateY(0deg);
						opacity: 1;
					}
				}
			}
		}
	}
</style>