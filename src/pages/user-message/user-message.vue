<template>
	<view class="user-message" v-if="messageList.length">
		<up-list>
			<up-list-item v-for="(item, index) in messageList" :key="index">
				<up-cell :label="item.messageContent" @click="openMessage(item)">
					<template #icon>
						<up-icon size="40" name="../../../../static/icons/message.svg"></up-icon>
					</template>
					<template #title>
						<view class="u-slot-title">
							<text class="u-cell-text">{{item.messageTitle}}</text>
						</view>
					</template>
					<template #value>
						<view class="">
							<view class="cell-text">{{item.time}}</view>
							<view style="text-align: right;">
								<up-tag text="未读" plain size="mini" type="info" v-if="item.readFlag===0"></up-tag>
								<up-tag text="已读" plain size="mini" type="info" v-if="item.readFlag===1"></up-tag>
							</view>
						</view>
					</template>
				</up-cell>
			</up-list-item>
		</up-list>
		<view>
			<up-modal :show="showMessage" :title="messageDetail.messageTitle" :content="messageDetail.messageContent"
				@confirm="isReadClick"></up-modal>
		</view>
	</view>
	<empty typeText="消息" v-else></empty>
</template>

<script>
	import {
		get,
		post
	} from '@/common/request.js'
	export default {
		data() {
			return {
				messageList: [],
				messageDetail: {},
				showMessage: false
			};
		},
		onLoad() {
			this.getMyMessage()
		},
		methods: {
			async getMyMessage() {
				const res = await get('getUserMessage');
				let data = res.rows
				this.messageList = data;
				this.isLoading = false
			},
			openMessage(item) {
				this.messageDetail = item
				this.showMessage = true
			},

			async isReadClick() {
				const data = {
					messageId: this.messageDetail.messageId
				}
				await post('postSetRead', data)
				this.getMyMessage();
				this.showMessage = false;
			}
		}
	}
</script>

<style lang="scss">
	.user-message {
		background-color: #ffffff;
		padding: 10rpx 20rpx;
	}

	.cell-text {
		font-size: 22rpx;
		color: #999999;
	}
</style>