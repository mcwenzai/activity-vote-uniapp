<template>
	<view class="privacy">
		<view class="theme">隐私保护指引</view>
		<view class="desc">本指引是艺术正青春共创大赛小程序开发方为处理你的个人信息而制定。</view>
		<view class="column">
			<view class="title"> 1. 开发者处理的信息 </view>
			<view class="text"> - 为活动报名需要，开发者将获取你的明示同意后，使用你的相册（仅读取）权限。 </view>
			<view class="text"> - 为了发起和参与投票，开发者将在获取你的明示同意后，收集你的微信昵称、头像。 </view>
			<view class="text"> - 开发者收集你选中的照片或视频信息，用于活动报名和个人头像。 </view>
			<view class="text"> - 为了活动报名需要，开发者需要获取你完整的个人信息（具体见活动报名表单），你在小程序中填写完完整个人信息后，点击提交按钮，视为你同意我方收集你的完整个人信息用于活动报名。 </view>
		</view>
		<view class="column">
			<view class="title"> 2. 你的权益 </view>
			<view class="text"> 关于使用你的相册（仅读取）权限，你可以通过以下路径：小程序主页右上角“…”—“设置”—点击特定信息—点击“不允许”，撤回对开发者的授权。 </view>
			<view class="text"> 关于你的个人信息，你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。 </view>
			<view class="text"> 若你在小程序中注册了账号，你可以通过以下方式与开发者联系，申请注销你在小程序中使用的账号。在受理你的申请后，开发者承诺在十五个工作日内完成核查和处理，并按照法律法规要求处理你的相关信息。 </view>
			<view class="text"> 若你在小程序中完成活动报名，即表示你同意用个人信息参与我们的活动，如若你想申请注销你的所有个人信息，请在整个活动举办完成后，通过以下方式与开发者联系，申请注销你在小程序中填写的个人信息。在受理你的申请后，开发者承诺在十五个工作日内完成核查和处理，并按照法律法规要求处理你的相关信息。 </view>
			<view class="text"> - 邮箱: art_service@163.com </view>
		</view>
		<view class="column">
			<view class="title"> 3. 开发者对信息的存储 </view>
			<view class="text"> 开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。 </view>
		</view>
		<view class="column">
			<view class="title"> 4. 信息的使用规则 </view>
			<view class="text"> 开发者将会在本指引所明示的用途内使用收集的信息 </view>
			<view class="text"> 如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以通知方式告知并征得你的明示同意。 </view>
		</view>
		<view class="column">
			<view class="title">
				5. 信息对外提供
			</view>
			<view class="text"> 开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。 </view>
			<view class="text"> 开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。 </view>
			<view class="text"> 若你认为开发者未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过以下方式与开发者联系；或者向微信进行投诉。 </view>
		</view>
		<view class="bottom">
			<view class="line1">
				邮箱: art_service@163.com
			</view>
			<view class="line1">
				更新日期：2024年6月19日
			</view>
			<view class="line2">
				生效日期：2024年6月19日
			</view>
		</view>
		<!-- 	<view class="confirm">
		<button type="primary">我已阅读</button>
	</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;

		.privacy {
			width: 92%;
			margin-left: 4%;

			.theme {
				margin: 40rpx 0;
				text-align: center;
				font-size: 42rpx;
			}
			.desc {
				color: #3d3d3d;
				font-size: 36rpx;
			}

			.column {
				line-height: 48rpx;
				.title {
					text-align: left;
					font-size: 36rpx;
					color: #3d3d3d;
					margin: 40rpx 0;
				}

				.text {
					font-size: 32rpx;
					color: #3f3f3f;
				}
			}

			.bottom {
				margin-top: 40rpx;
				text-align: left;
				color: #3f3f3f;
				.line1 {
					font-size: 32rpx;
				}
				.line2 {
					font-size: 32rpx;
					padding-bottom: 200rpx;
				}
			}
		}
	}
</style>