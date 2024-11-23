<template>
	<view>
		<up-notify :message="message" :show="showNotify"></up-notify>
		<up-cell-group>
			<up-cell title="头像" :isLink="true" arrow-direction="right">
				<template #value>
					<up-avatar :src="user.imageUrl" shape="circle" @click="selectImage"></up-avatar>
				</template>
			</up-cell>
			<up-cell title="姓名" :isLink="true" arrow-direction="right" :value="user.name"
				@click="showName = true"></up-cell>
			<up-popup :show="showName" :round="10" mode="center" safeAreaInsetBottom="true" @close="showName = false">
				<view class="paddings">
					<view class="title">
						<text class="center">姓名编辑</text>
					</view>
					<view class="inputs">
						<up-input placeholder="请输入姓名" border="surround" v-model="user.name"
							@change="inversion"></up-input>
					</view>
					<up-button type="primary" :disabled="disabled" loadingText="提交中" text="确定"
						@click="submitName">确定</up-button>
				</view>
			</up-popup>
			<up-cell title="昵称" :isLink="true" arrow-direction="right" :value="user.nickName"
				@click="showNickname = true"></up-cell>
			<up-popup :show="showNickname" :round="10" mode="center" safeAreaInsetBottom="true"
				@close="showNickname = false">
				<view class="paddings">
					<view class="title">
						<text class="center">昵称编辑</text>
					</view>
					<view class="inputs">
						<up-input placeholder="请输入昵称" border="surround" v-model="user.nickName"
							@change="inversion"></up-input>
					</view>
					<up-button type="primary" :disabled="disabled" loadingText="提交中" text="确定"
						@click="submitNikename">确定</up-button>
				</view>
			</up-popup>
			<up-cell title="性别" :isLink="true" arrow-direction="right" :value="user.gender"
				@click="showGender = true"></up-cell>
			<up-picker :show="showGender" :columns="genderRange" keyName="text" @confirm="genderConfirm"></up-picker>
			<up-cell title="出生年月" :isLink="true" arrow-direction="right" :value="user.birthday"
				@click="showBirthday = true"></up-cell>
			<up-datetime-picker :show="showBirthday" :formatter="formatter" v-model="user.birthday"
				:minDate="-631180800" mode="date" :closeOnClickOverlay="true" @close="showBirthday = false"
				@confirm="birthdayConfirm"></up-datetime-picker>
			<up-cell title="联系电话" :isLink="true" arrow-direction="right" :value="user.phone"
				@click="showPhone = true"></up-cell>
			<up-popup :show="showPhone" :round="10" mode="center" safeAreaInsetBottom="true" @close="showPhone = false">
				<view class="paddings">
					<view class="title">
						<text class="center">联系电话编辑</text>
					</view>
					<view class="inputs">
						<up-input type="number" placeholder="请输入联系电话" border="surround" v-model="user.phone"
							@change="inversion"></up-input>
					</view>
					<up-button type="primary" :disabled="disabled" loadingText="提交中" text="确定"
						@click="submitPhone">确定</up-button>
				</view>
			</up-popup>
		</up-cell-group>
	</view>
</template>


<script>
	import { get,post } from '@/common/request.js';
	import { getValueByText,getTextByValue } from '@/util/util.js';
	import config from '@/common/config';
	const uploadFileUrl = config.baseUrl + '/applet/file/upload'
	export default {
		data() {
			const d = new Date()
			const year = d.getFullYear()
			let month = uni.$u.padZero(d.getMonth() + 1)
			const date = d.getDate()
			return {
				showName: false,
				showNickname: false,
				showGender: false,
				showPhone: false,
				showBirthday: false,
				user: {
					id: "",
					imageUrl: "",
					name: "",
					nickName: "",
					gender: "",
					birthday: "",
					phone: ""
				},
				genderRange: [
					[{
						value: "M",
						text: "男"
					}, {
						value: "F",
						text: "女"
					}]
				],
				disabled: true,
				showNotify: false,
				message: "",
				isLoading: true,
				token: ""
			}
		},
		onShow() {
			let token = uni.getStorageSync('token');
			let userId = uni.getStorageSync('userId');
			this.token = token
			this.user.id = userId
			this.getUserDetail(userId);
		},

		methods: {
			async getUserDetail(userId) {
				try {
					const res = await get('getUserDetail', {
						id: userId
					});
					let user = res
					user.gender = getTextByValue(this.genderRange[0],user.gender)
					this.user = user;
					this.isLoading = false
				} catch (error) {
					uni.showToast({
						title: error.message,
						icon: 'none'
					})
				}
			},

			selectImage() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: uploadFileUrl,
							filePath: tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								let fileData = JSON.parse(uploadFileRes.data)
								if (fileData.success) {
									this.user.imageUrl = fileData.data.fileUrl;
									this.submit();
								} else {
									uni.showToast({
										title: fileData.message,
										icon: 'error'
									})
								}
							}
						});
					}
				});
			},
			submitName() {
				this.showName = false
				this.submit()
			},
			submitNikename() {
				this.showNickname = false
				this.submit()
			},
			submitPhone() {
				this.showPhone = false
				this.submit()
			},
			async submitData(user) {
				const postUser = {
					id: user.id,
					imageUrl: user.imageUrl,
					name: user.name,
					nickName: user.nickName,
					gender: user.gender,
					birthday: user.birthday ? user.birthday : '',
					phone: user.phone
				}
				await post('postEdit', postUser);
				this.isLoading = false
			},
			submit(e) {
				let user = JSON.parse(JSON.stringify(this.user));
				user.gender = getValueByText(this.genderRange[0],user.gender)
				this.submitData(user)
			},
			genderConfirm(e) {
				this.user.gender = e.value[0].text
				this.showGender = false
				this.submit()
			},
			birthdayConfirm(e) {
				this.result(e.value, e.mode);
				this.submit()
			},
			result(time, mode) {
				const timeFormat = uni.$u.timeFormat
				this.user.birthday = timeFormat(time, 'yyyy-mm-dd')
				this.showBirthday = false
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
					return `${value}日`
				}
				return value
			},
			inversion() {
				this.disabled = false
			}
		}
	}
</script>

<style lang="scss">
	.acatar {
		width: 68rpx;
		height: 68rpx;
		border-radius: 68rpx;
	}

	.paddings {
		padding: 30rpx 80rpx;

		.title {
			display: flex;

			.center {
				text-align: center;
				font-size: 36rpx;
				color: #333;
				font-weight: 600;
			}

		}

		.inputs {
			margin: 36rpx 0;
		}

		.buttons {}
	}
</style>