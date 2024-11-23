<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="webUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				webUrl: ''
			}
		},
		onLoad(e) {
			this.webUrl = e.url
		},
		methods: {
			onWebViewReady() {
				console.log('webview加载完成')
			}
		}

	}
</script>

<style>
	uni-web-view {
		width: 100%;
		height: 100%;
	}
</style>