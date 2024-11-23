<template>
	<loading v-if="isLoading"></loading>
	<view class="container" v-else>
		<view class="activity">
			<view class="list" hover-class="uni-list-cell-hover">
				<image class="left" :src="activityData.imageUrl"></image>
				<view class="right">
					<view class="activity-top">{{ activityData.name }}</view>
					<view class="activity-center">
						<text>报名时间：</text>
						<text>{{ activityData.enterStartTime.slice(5,16) }}</text>
						<text>~</text>
						<text>{{ activityData.enterEndTime.slice(5,16) }}</text>
					</view>
					<view class="activity-bottom">
						<up-tag text="审核中" size="mini" type="success" plain plainFill
							v-if="activityData.approveStatus === 'NEW'"></up-tag>
						<up-tag text="已通过" size="mini" type="primary" plain plainFill
							v-if="activityData.approveStatus === 'SUCCESS'"></up-tag>
						<up-tag text="未通过" size="mini" type="error" plain plainFill
							v-if="activityData.approveStatus === 'FAIL'"></up-tag>
					</view>
				</view>
			</view>
		</view>
		<up-form :model="formData" :rules="rules" ref="formRef">
			<view class="column">
				<view class="title">基本信息</view>
				<up-form-item label="个人形象照" labelWidth="80" prop="imageUrl" ref="imageUrl"
					:required="true"></up-form-item>
				<view class="avatar">
					<up-upload :fileList="imageUrl" @afterRead="imageUrlAfter" @delete="deletePic" name="imageUrl"
						:maxCount="1" width="140" height="100" :customStyle="customStyle">
						<image src="/static/image/avatar1.png" mode="widthFix" style="width: 180rpx;" />
					</up-upload>
				</view>
				<up-form-item label="姓名" labelWidth="80" prop="name" :border-bottom="true" :required="true">
					<up-input type="string" v-model="formData.name" disabledColor="#fff" maxlength="5"
						inputAlign="right" border="none" placeholder="请填写" :clearable="false" />
				</up-form-item>
				<up-form-item label="联系电话" labelWidth="80" prop="phone" :border-bottom="true" :required="true">
					<up-input type="number" v-model="formData.phone" disabledColor="#fff" maxlength="11"
						inputAlign="right" border="none" placeholder="请填写" :clearable="false" />
				</up-form-item>
				<up-form-item label="学校" labelWidth="80" prop="school" :border-bottom="true" :required="true"
					@click="showPicker('school')">
					<up-input v-model="formData.school" disabled disabledColor="#ffffff" inputAlign="right"
						border="none" placeholder="请选择"></up-input>
					<template #right>
						<up-icon size="16" name="arrow-right"></up-icon>
					</template>
					<up-picker title="选择学校" :show="showSchool" :columns="formData.schoolRange" keyName="school"
						@cancel="showSchool=false" @confirm="schoolChange"></up-picker>
				</up-form-item>
				<up-popup :show="showOtherSchool" :round="10" mode="bottom" @close="showName = false">
					<view class="paddings">
						<view class="title">其他学校</view>
						<view class="inputs">
							<up-input placeholder="请输入学校" type="string" v-model="formData.school"
								maxlength="22"></up-input>
						</view>
						<up-button type="primary" shape="circle" :disabled="!Boolean(formData.school)" loadingText="提交中"
							text="确定" @click="confirmSchool">确定</up-button>
					</view>
				</up-popup>
				<up-form-item label="赛道" labelWidth="80" prop="way" :border-bottom="true" :required="true"
					@click="showPicker('way')">
					<up-input v-model="formData.way" disabled disabledColor="#ffffff" inputAlign="right" border="none"
						placeholder="请选择"></up-input>
					<template #right>
						<up-icon size="16" name="arrow-right"></up-icon>
					</template>
					<up-action-sheet :actions="formData.wayRange" keyName="label" title="选择赛道" :show="showWay"
						@close="showWay = false" @select="wayChange"></up-action-sheet>
				</up-form-item>

				<up-form-item label="展示视频" labelWidth="80" prop="videoUrl" :border-bottom="false"
					:required="true"></up-form-item>

				<view class="box">
					<view v-if="formData.videoUrl">
						<video class="video" show-fullscreen-btn="true" :src="formData.videoUrl" controls="controls"
							v-if="formData.videoUrl"></video>
						<u-icon class="u-icon" name="close" color="#ffffff" size="16" @click="deletaVideo"></u-icon>
					</view>
					<circle-progress canvasId="progressCanvas4" :progress="videoProgress" backgroundColor="#EFEFF4"
						progressBackgroundColor="#347DFF" :showText="true" textColor="#333333" :textSize="24"
						:height="20" :isCircular="true" :diameter="200" v-else-if="videoProgress"></circle-progress>
					<image class="video-img" src="/static/image/up-video.png" mode="widthFix" @click="videoSelect"
						v-else></image>
				</view>


				<up-form-item label="是否原创" labelWidth="80" prop="isOriginal" :border-bottom="true" :required="true"
					@click="showPicker('isOriginal')">
					<up-input v-model="formData.isOriginal" disabled disabledColor="#ffffff" inputAlign="right"
						border="none" placeholder="请选择"></up-input>
					<template #right>
						<up-icon size="16" name="arrow-right"></up-icon>
					</template>
					<up-action-sheet :actions="formData.isOriginalRange" keyName="label" title="是否原创"
						:show="showIsOriginal" @close="showIsOriginal = false"
						@select="isOriginalSelect"></up-action-sheet>
				</up-form-item>
			</view>
			<view class="column">
				<up-collapse :border="false">
					<up-collapse-item title="完善详细报名信息" name="guide">
						<up-form-item label="身份证" labelWidth="80" prop="idCardImage" ref="idCardImage"></up-form-item>
						<view class="photo">
							<up-upload :fileList="idCardFrontUrl" @afterRead="imageUrlAfter" @delete="deletePic"
								name="idCardFrontUrl" :maxCount="1" width="136" height="94" :customStyle="customStyle">
								<image src="/static/image/id-card1.png" mode="widthFix" style="width: 180rpx;">
								</image>
								<view class="photo-text">身份证正面</view>
							</up-upload>
							<up-upload :fileList="idCardBackUrl" @afterRead="imageUrlAfter" @delete="deletePic"
								name="idCardBackUrl" :maxCount="1" width="136" height="94" :customStyle="customStyle">
								<image src="/static/image/id-card2.png" mode="widthFix" style="width: 180rpx;">
								</image>
								<view class="photo-text">身份证反面</view>
							</up-upload>
						</view>
						<up-form-item label="身份证号" labelWidth="80" prop="idCard" :border-bottom="true">
							<up-input type="number" v-model="formData.idCard" inputAlign="right" border="none"
								maxlength="18" placeholder="请填写" :clearable="false" />
						</up-form-item>

						<up-form-item label="性别" labelWidth="80" prop="gender" :border-bottom="true"
							@click="showPicker('gender')">
							<up-input v-model="formData.gender" disabled disabledColor="#ffffff" inputAlign="right"
								border="none" placeholder="请选择"></up-input>
							<template #right>
								<up-icon size="16" name="arrow-right"></up-icon>
							</template>
							<up-action-sheet :actions="formData.genderRange" keyName="label" title="选择性别"
								:show="showGender" @close="showGender = false" @select="genderSelect"></up-action-sheet>
						</up-form-item>
						<up-form-item label="民族" labelWidth="80" prop="nation" :border-bottom="true"
							@click="showPicker('nation')">
							<up-input v-model="formData.nation" disabled disabledColor="#ffffff" inputAlign="right"
								border="none" placeholder="请选择"></up-input>
							<template #right>
								<up-icon size="16" name="arrow-right"></up-icon>
							</template>
							<up-picker title="选择民族" :show="showNation" :columns="formData.nationRange" keyName="label"
								@cancel="showNation=false" @confirm="nationChange"></up-picker>
						</up-form-item>
						<up-form-item label="年龄" labelWidth="80" prop="age" :border-bottom="true">
							<up-input type="number" v-model="formData.age" maxlength="3" inputAlign="right"
								border="none" placeholder="请填写" :clearable="false" />
						</up-form-item>

						<up-form-item label="星座" labelWidth="80" prop="constellation" :border-bottom="true"
							@click="showPicker('constellation')">
							<up-input v-model="formData.constellation" disabled disabledColor="#ffffff"
								inputAlign="right" border="none" placeholder="请选择"></up-input>
							<template #right>
								<up-icon size="16" name="arrow-right"></up-icon>
							</template>
							<up-picker title="选择星座" :show="showConstellation" :columns="formData.constellationRange"
								keyName="label" @cancel="showConstellation=false"
								@confirm="constellationChange"></up-picker>
						</up-form-item>

						<up-form-item label="身高(cm)" labelWidth="80" prop="stature" :border-bottom="true">
							<up-input type="number" v-model="formData.stature" maxlength="3" inputAlign="right"
								border="none" placeholder="请填写" :clearable="false" />
						</up-form-item>

						<up-form-item label="体重(kg)" labelWidth="80" prop="weight" :border-bottom="true">
							<up-input type="number" v-model="formData.weight" maxlength="3" inputAlign="right"
								border="none" placeholder="请填写" :clearable="false" />
						</up-form-item>
						<!-- <view class="title">籍贯信息</view> -->
						<up-form-item label="国籍" labelWidth="80" prop="country" :border-bottom="true"
							@click="showPicker('country')">
							<up-input v-model="formData.country" disabled disabledColor="#ffffff" inputAlign="right"
								border="none" placeholder="请选择"></up-input>
							<template #right>
								<up-icon size="16" name="arrow-right"></up-icon>
							</template>
							<up-picker title="选择国籍" :show="showCountry" :columns="formData.countryRange" keyName="label"
								@cancel="showCountry=false" @confirm="countryChange"></up-picker>
						</up-form-item>

						<up-form-item label="城市" labelWidth="80" prop="city" :border-bottom="true"
							@click="showPicker('city')">
							<up-input type="string" v-model="formData.city" maxlength="22" inputAlign="right"
								border="none" placeholder="请填写" />
						</up-form-item>
						<up-popup :show="showOtherSchool" :round="10" mode="bottom" @close="showName = false">
							<view class="paddings">
								<view class="title">其他学校</view>
								<view class="inputs">
									<up-input placeholder="请输入学校" type="string" v-model="formData.school"
										maxlength="22"></up-input>
								</view>
								<up-button type="primary" shape="circle" :disabled="!Boolean(formData.school)"
									loadingText="提交中" text="确定" @click="confirmSchool">确定</up-button>
							</view>
						</up-popup>
						<up-form-item label="专业" labelWidth="80" prop="profession" :border-bottom="true">
							<up-input type="string" v-model="formData.profession" maxlength="12" inputAlign="right"
								border="none" placeholder="请填写" :clearable="false" />
						</up-form-item>
						<up-form-item label="最高学历" labelWidth="80" prop="education" :border-bottom="true"
							@click="showPicker('education')">
							<up-input v-model="formData.education" disabled disabledColor="#ffffff" inputAlign="right"
								placeholder="请选择" border="none"></up-input>
							<template #right>
								<up-icon size="16" name="arrow-right"></up-icon>
							</template>
							<up-picker title="选择学历" :show="showEducation" :columns="formData.educationRange"
								keyName="label" @cancel="showEducation=false" @confirm="educationChange"></up-picker>
						</up-form-item>
						<up-form-item label="毕业时间" labelWidth="80" prop="graduationDate" :border-bottom="true"
							:customStyle="formItemStyle" @click="showPicker('graduationDate')">
							<up-input v-model="formData.graduationDate" disabled disabledColor="#ffffff"
								inputAlign="right" border="none" placeholder="请选择"></up-input>
							<template #right>
								<up-icon size="16" color="" name="arrow-right"></up-icon>
							</template>
							<up-datetime-picker :show="showGraduationDate" :minDate="820425600000"
								v-model="formData.graduationDate" mode="date" @cancel="graduationDateCancel"
								@confirm="graduationDateConfirm"></up-datetime-picker>
							<!-- :maxDate="1720407323150" -->
						</up-form-item>
						<up-form-item label="学生证" labelWidth="80" prop="studentImage"></up-form-item>
						<view class="photo">
							<up-upload :fileList="studentFrontUrl" @afterRead="imageUrlAfter" @delete="deletePic"
								name="studentFrontUrl" :maxCount="1" width="136" height="92" :customStyle="customStyle">
								<image src="/static/image/id-card1.png" mode="widthFix" style="width: 180rpx;">
								</image>
								<view class="photo-text">学生证封面</view>
							</up-upload>
							<up-upload :fileList="studentBackUrl" @afterRead="imageUrlAfter" @delete="deletePic"
								name="studentBackUrl" :maxCount="1" width="136" height="94" :customStyle="customStyle">
								<image src="/static/image/id-card2.png" mode="widthFix" style="width: 180rpx;">
								</image>
								<view class="photo-text">学生证内页</view>
							</up-upload>
						</view>
						<up-form-item label="直播平台" labelWidth="80" prop="platform" :border-bottom="true">
							<up-input type="string" v-model="formData.platform" maxlength="5" inputAlign="right"
								border="none" placeholder="请填写" :clearable="false" />
						</up-form-item>
						<up-form-item label="粉丝数" labelWidth="80" prop="fansCount">
							<up-input type="number" v-model="formData.fansCount" maxlength="9" inputAlign="right"
								border="none" placeholder="请填写" :clearable="false" />
						</up-form-item>
						<up-form-item label="直播经历" labelWidth="80" prop="liveExperience"></up-form-item>
						<up-textarea placeholder="请输入您的直播经历(200字以内)" :count="true" :autoHeight="true" border="surround"
							maxlength="200" v-model="formData.liveExperience"></up-textarea>

						<up-form-item label="个人简介" labelWidth="80" prop="introduce"
							:border-bottom="false"></up-form-item>
						<up-textarea placeholder="请输入您的个人简介(400字以内)" :count="true" :autoHeight="true" border="surround"
							maxlength="400" v-model="formData.introduce"></up-textarea>
					</up-collapse-item>
				</up-collapse>
			</view>
		</up-form>

		<view class="fixed">
			<up-button @click="submit" type="primary"
				style="color:#ffffff;background-color:#347DFF;border-color:#347DFF;">立即报名</up-button>
		</view>
	</view>
</template>

<script>
	import {
		get,
		post
	} from '@/common/request.js';
	// import AliOSS from '@/util/oss/oss.js';
	import {
		getValueByText,
		getValueByName,
		getNameByValue
	} from '@/util/util.js';
	import config from '@/common/config';
	const uploadFileUrl = config.baseUrl + '/applet/file/upload';
	import {
		timeFormat
	} from '@/uni_modules/uview-plus';
	import nationData from '@/common/nationData.js';
	import constellationData from '@/common/constellationData.js';
	// import OBSupload from '@/util/oss/obs.js'
	export default {
		data() {
			return {
				// formRef: null,
				isLoading: true,
				imageUrl: [],
				studentFrontUrl: [],
				studentBackUrl: [],
				idCardFrontUrl: [],
				idCardBackUrl: [],
				videoProgress: 0,
				formData: {
					name: "",
					gender: "",
					genderRange: [{
						value: "M",
						name: "男"
					}, {
						value: "F",
						name: "女"
					}],
					nation: '',
					nationRange: nationData,
					way: "",
					wayRange: [{
						value: 0,
						name: '声乐'
					}, {
						value: 1,
						name: '器乐'
					}, {
						value: 2,
						name: '舞蹈'
					}],
					constellationRange: constellationData,
					stature: '',
					weight: '',
					age: "",
					isOriginal: "",
					isOriginalRange: [{
							value: "Y",
							name: "是"
						},
						{
							value: "N",
							name: "否"
						},
						{
							value: "P",
							name: "部分"
						}
					],
					phone: '',
					idCard: '',
					country: "",
					countryRange: [],
					city: "",
					education: "", // 最高学历
					educationRange: [
						[{
							value: 0,
							label: '博士'
						}, {
							value: 1,
							label: '硕士'
						}, {
							value: 2,
							label: '本科'
						}, {
							value: 3,
							label: '大专'
						}, {
							value: 4,
							label: '高中'
						}, {
							value: 5,
							label: '初中'
						}]
					],
					platform: "", //平台
					introduce: "", // 个人简介
					fansCount: null,
					address: "",
					graduationDate: "",
					school: "",
					schoolRange: [],
					profession: "",
					liveExperience: "",
					imageUrl: "",
					studentFrontUrl: "",
					studentBackUrl: "",
					idCardFrontUrl: "",
					idCardBackUrl: "",
					videoUrl: ""
				},
				showGender: false,
				showWay: false,
				showNation: false,
				showIsOriginal: false,
				showConstellation: false,
				showCountry: false,
				showCity: false,
				showSchool: false,
				showGraduationDate: false,
				showOtherSchool: false,
				showEducation: false,
				activityData: {},
				upImageStyles: {
					width: 128,
					height: 100,
					border: {
						color: '#F9FBFF',
						width: '1px',
						style: 'solid',
						radius: '0'
					}
				},
				customStyle: {
					flex: "none"
				},
				formItemStyle: {
					'border-color': "#ff5555"
				},
				rules: {
					'imageUrl': {
						required: true,
						message: '请上传形象照'
					},
					'name': {
						required: true,
						message: '请输入姓名'
					},
					'phone': [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}
					],
					'way': {
						required: true,
						message: '请选择赛道'
					},
					'isOriginal': {
						required: true,
						message: '请选择是否原创'
					},
					'school': {
						required: true,
						message: '请填写学校'
					},
					'videoUrl': {
						required: true,
						message: '请上传展示视频'
					}
				}
			};
		},
		onLoad(options) {
			let objStr = decodeURIComponent(options.data);
			let obj = JSON.parse(objStr);
			this.activityData = obj
			this.getCountry();
			// this.getOssSts("665656.mp4");
			this.getSchoolList();
			// this.getSignUpDetail();
		},
		// onReady() {
		// 	this.$refs.formRef.setRules(this.rules)
		// },
		methods: {
			// async getOssSts(name) {
			// 	let argu = {
			// 		fileName: name
			// 	}
			// 	const res = await get('getSts', argu);
			// 	this.client = new AliOSS({
			// 		accessKeyId: res.accessKeyId,
			// 		accessKeySecret: res.accessKeySecret,
			// 		securityToken: res.securityToken,
			// 		expiration: res.expiration
			// 	});
			// },
			async getCountry() {
				const res = await get('getCountry')
				let countryArray = res.map((country, index) => ({
					value: index,
					label: country
				}));
				this.formData.countryRange[0] = countryArray
			},
			async getSchoolList() {
				const res = await get('getSchoolList')
				this.formData.schoolRange[0] = res
				this.isLoading = false
			},
			// async getSignUpDetail() {
			// 	let result = await get('getSignUpDetail', {
			// 		activityId: this.activityData.id
			// 	});
			// 	result.gender = getNameByValue(this.formData.genderRange, result.gender)
			// 	result.isOriginal = getNameByValue(this.formData.isOriginalRange, result.isOriginal)
			// 	this.formData = {
			// 		...this.formData,
			// 		...result
			// 	}
			// 	const urlProp = ['imageUrl', 'studentFrontUrl', 'studentBackUrl', 'idCardFrontUrl',
			// 		'idCardBackUrl'
			// 	]
			// 	urlProp.forEach(propName => {
			// 		if (result[propName]) {
			// 			this.updateUrl(propName, result[propName]);
			// 		}
			// 	});
			// },
			// updateUrl(propName, url) {
			// 	this[propName] = [{
			// 		url: url
			// 	}];
			// },

			showPicker(e) {
				switch (e) {
					case "gender":
						this.showGender = true
						break;
					case "nation":
						this.showNation = true
						break;
					case "way":
						this.showWay = true
						break;
					case "isOriginal":
						this.showIsOriginal = true
						break;
					case "constellation":
						this.showConstellation = true
						break;
					case "country":
						this.showCountry = true
						break;
					case "city":
						this.showCity = true
						break;
					case "school":
						this.showSchool = true
						break;
					case "education":
						this.showEducation = true
						break;
					case 'graduationDate':
						this.showGraduationDate = true
						break;
				}
			},
			genderSelect(e) {
				this.formData.gender = e.name;
			},
			nationChange(e) {
				this.formData.nation = e.value[0].label;
				this.showNation = false;
			},
			wayChange(e) {
				this.formData.way = e.name;
			},
			isOriginalSelect(e) {
				this.formData.isOriginal = e.name;
			},
			constellationChange(e) {
				this.formData.constellation = e.value[0].label;
				this.showConstellation = false;
			},
			countryChange(e) {
				this.formData.country = e.value[0].label;
				this.showCountry = false;
			},
			cityChange(e) {
				this.formData.city = e.value[0].label;
				this.showCity = false;
			},
			schoolChange(e) {
				let selectedIndex = e.indexs[0];
				// const isLastTwo = selectedIndex >= this.formData.schoolRange.length - 2; // 判断是否为最后两项
				if (this.formData.schoolRange[0][selectedIndex].school_CODE === "OTHER" || this.formData.schoolRange[0][
						selectedIndex
					].school_CODE === "INTERNATIONAL") {
					this.showSchool = false
					this.showOtherSchool = true
					this.formData.school = ""
				} else {
					this.formData.school = this.formData.schoolRange[0][selectedIndex].school
					this.showSchool = false
				}
			},
			educationChange(e) {
				this.formData.education = e.value[0].label;
				this.showEducation = false;
			},
			async imageUrlAfter(event) {
				this[event.name].push({
					status: 'uploading',
					message: '上传中',
				});
				const result = await this.uploadFilePromise(event.file.url, event.name);
				if (result === "idCardError") {
					this[event.name] = []
				} else {
					this[event.name][0] = {
						status: 'success',
						message: '',
						url: result
					}
					this.formData[event.name] = result
				}
			},
			deletePic(event) {
				this[event.name].splice(event.index, 1);
				this.formData[event.name] = ""
			},
			videoSelect(e) {
				uni.chooseMedia({
					count: 1,
					mediaType: ['video'],
					sourceType: ['album', 'camera'],
					maxDuration: 30,
					camera: 'back',
					success: async (file) => {
						if (file.tempFiles[0].size > 209715200) {
							uni.showToast({
								title: '上传视频不能超过200M',
								icon: 'none'
							})
						} else {
							const fileName = await get('getFileName', {
								fileName: file.tempFiles[0].tempFilePath
							});
			
							const videoUrl = await this.uploadFilePromise(file.tempFiles[0].tempFilePath,'videoUrl');
							this.formData.videoUrl = videoUrl
						}
					}
				})
			},
			uploadFilePromise(filePath, type) {
				return new Promise((resolve, reject) => {
					const uploadTask = uni.uploadFile({
						url: uploadFileUrl,
						filePath: filePath,
						name: 'file',
						success: (uploadFileRes) => {
							let fileData = JSON.parse(uploadFileRes.data)
							if (fileData.success) {
								if (type === 'idCardFrontUrl') {
									let argu = {
										cardPath: fileData.data.fileUrl
									}
									const result = get('getIdCard', argu)
									result.then((res) => {
										if (res.idnumber === null) {
											uni.showToast({
												title: '身份证识别失败,请重新上传！',
												icon: 'none'
											})
											setTimeout(() => {
												resolve("idCardError")
											}, 200)
										} else {
											let uploadForm = {
												gender: res.gender,
												nation: res.nationality,
												idCard: res.idnumber,
												name: res.name,
												age: res.age
											}
											this.formData = Object.assign({}, this.formData,
												uploadForm);
											setTimeout(() => {
												resolve(fileData.data.fileUrl)
											}, 200)
										}

									}).catch((error) => {
										uni.showToast({
											title: '身份证识别失败,请重新上传！',
											icon: 'none'
										})
									});
								} else {
									setTimeout(() => {
										resolve(fileData.data.fileUrl)
									}, 200)
								}
							} else {
								uni.showToast({
									icon: 'error',
									title: fileData.message
								})
							}
						},
						fail: (uploadFileErr) => {
							if (type === 'videoUrl') {
								uni.showToast({
									icon: 'error',
									title: '视频上传失败'
								})
							} else {
								uni.showToast({
									icon: 'error',
									title: '图片上传失败'
								})
							}
						}
					});
					if (type === 'videoUrl') {
						uploadTask.onProgressUpdate((res) => {
							this.showProgress = true;
							this.videoProgress = res.progress
						});
					}
				})
			},
			// 个人展示视频
			// videoSelect(e) {

			// 	uni.chooseMedia({
			// 		count: 1,
			// 		mediaType: ['video'],
			// 		sourceType: ['album', 'camera'],
			// 		maxDuration: 30,
			// 		camera: 'back',
			// 		success: async (file) => {
			// 			if (file.tempFiles[0].size > 209715200) {
			// 				uni.showToast({
			// 					title: '上传视频不能超过200M',
			// 					icon: 'none'
			// 				})
			// 			} else {
			// 				const fileName = await get('getFileName', {
			// 					fileName: file.tempFiles[0].tempFilePath
			// 				});
			// 				console.log(fileName)
			// 				const progressHandler = (progress) => {
			// 					this.videoProgress = progress
			// 					this.showProgress = true;
			// 				};
							// 华为云上传
			// 				const {
			// 					success,
			// 					data
			// 				} = await OBSupload(file.tempFiles[0].tempFilePath, fileName,
			// 					progressHandler);
			// 				console.log(data)
			// 				if (success) {
			// 					this.formData.videoUrl = data
			// 				} else {
			// 					uni.showToast({
			// 						icon: 'none',
			// 						title: data
			// 					})
			// 				}
			// 				// 阿里云OSS上传
			// 				// const fileName = await get('getFileName', {
			// 				// 	fileName: file.tempFiles[0].tempFilePath
			// 				// });
			// 				// const progressHandler = (progress) => {
			// 				// 	this.videoProgress = progress
			// 				// 	this.showProgress = true;
			// 				// };
			// 				// const {
			// 				// 	success,
			// 				// 	data
			// 				// } = await this.client.ossUpload(file.tempFiles[0].tempFilePath, fileName, 'video/',
			// 				// 	progressHandler);
			// 				// if (success) {
			// 				// 	this.formData.videoUrl = data
			// 				// } else {
			// 				// 	uni.showToast({
			// 				// 		icon: 'none',
			// 				// 		title: data
			// 				// 	})
			// 				// }
			// 			}
			// 		}
			// 	})
			// },
			deletaVideo() {
				this.formData.videoUrl = "";
				this.videoProgress = 0
			},
			confirmSchool() {
				this.showOtherSchool = false
			},
			submit() {
				this.$refs.formRef.validate().then(res => {
					if (res) {
						const formData = this.formData
						let activityiId = this.activityData.id
						let data = {
							id: formData.id,
							activityId: activityiId,
							imageUrl: formData.imageUrl,
							idCardFrontUrl: this.idCardFrontUrl.length ? this.idCardFrontUrl[0].url : "",
							idCardBackUrl: this.idCardBackUrl.length ? this.idCardBackUrl[0].url : "",
							age: formData.age,
							city: formData.city,
							constellation: formData.constellation,
							country: formData.country,
							education: formData.education,
							fansCount: formData.fansCount,
							gender: getValueByName(formData.genderRange, formData.gender),
							graduationDate: formData.graduationDate,
							idCard: formData.idCard,
							introduce: formData.introduce,
							isOriginal: getValueByName(formData.isOriginalRange, formData.isOriginal),
							liveExperience: formData.liveExperience,
							name: formData.name,
							nation: formData.nation,
							phone: formData.phone,
							platform: formData.platform,
							profession: formData.profession,
							school: formData.school,
							stature: formData.stature,
							studentFrontUrl: this.studentFrontUrl.length ? this.studentFrontUrl[0].url : "",
							studentBackUrl: this.studentBackUrl.length ? this.studentBackUrl[0].url : "",
							way: formData.way,
							weight: formData.weight,
							videoUrl: formData.videoUrl.length ? formData.videoUrl : ""
						}
						this.formUrl(data)
					} else {
						uni.showToast({
							title: '请录入完整信息',
							icon: 'none',
						})
					}
				})
			},
			async formUrl(form) {
				await post('postActivity', form)
				uni.showToast({
					title: "报名成功",
					icon: 'success'
				})
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/user/user'
					})
				}, 2000)
			},
			// back() {
			// 	uni.navigateBack({
			// 		delta: 1
			// 	})
			// },

			showDate() {
				this.showLiveExperienceDate = false
			},
			graduationDateConfirm(e) {
				let formattedDate = timeFormat(e.value);
				this.formData.graduationDate = formattedDate;
				this.showGraduationDate = false
			},
			graduationDateCancel(e) {
				this.showGraduationDate = false
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #f6f6f6;

		.container {
			// margin: 20rpx;

			.activity {
				margin: 20rpx;
				background: #ffffff;
				padding: 20rpx;
				display: block;
				border-radius: 24rpx;

				.list {
					display: flex;

					image {
						width: 188rpx;
						height: 160rpx;
						border-radius: 20rpx;
					}

					.right {
						margin-left: 20rpx;
						display: flex;
						flex-flow: column;
						justify-content: space-between;

						.activity-top {
							font-weight: 700;
							font-style: normal;
							font-size: 16px;
							color: #333333;
							line-height: 25px;
						}

						.activity-center {
							font-size: 28rpx;
							color: #FF9743;
						}

						.activity-bottom {
							display: flex;
							align-self: flex-end;
						}

						.activity-recom {
							text-align: center;
							width: 80rpx;
							height: 40rpx;
							color: #ff704d;
							border: 1rpx solid #ff704d;
							border-radius: 10rpx;
						}
					}
				}
			}

			.u-form {
				margin: 20rpx;

				.column {
					background-color: #ffffff;
					margin: 30rpx 0;
					padding: 20rpx;
					border-radius: 20rpx;

					.title {
						border-bottom: none;
						margin-bottom: 20rpx;
						font-size: 36rpx;
						color: #333333;
					}

					.u-form-item__body {
						align-items: center;
					}

					.select-right {
						display: flex;
						align-items: center;
					}


					.avatar {
						background-color: #F9FBFF;
						border-radius: 12rpx;
						display: flex;
						height: auto;
						justify-content: center;
						align-items: center;
					}

					.photo {
						background-color: #F9FBFF;
						border-radius: 12rpx;
						display: flex;
						height: auto;
						justify-content: space-between;
						align-items: center;
						padding: 10rpx 40rpx 10rpx 40rpx;
						text-align: center;

						.photo-text {
							color: #4A84F4;
							font-size: 26rpx;
						}
					}

					.box {
						display: grid;
						align-items: center;
						justify-content: center;
						position: relative;
						overflow: hidden;
						border-radius: 8rpx;
						background-color: #F9FBFF;


						.suit {
							width: 180rpx;
							height: 180rpx;
						}

						.echo {
							width: 670rpx;
							height: 360rpx;
						}

						.video-img {
							margin: 20rpx 0rpx 20rpx 0rpx;
							width: 140rpx;
							height: 140rpx;
						}

						.video {
							width: 670rpx;
						}

						.u-icon {
							position: absolute;
							top: 2rpx;
							right: 4rpx;
							z-index: 1;
						}
					}

					.paddings {
						padding: 30rpx 80rpx;

						.title {
							text-align: center;
							font-size: 36rpx;
							color: #333;
							font-weight: 600;
						}

						.inputs {
							margin: 36rpx 0;
						}
					}
				}
			}

			.fixed {
				background-color: #ffffff;
				border-top: 1rpx solid #e5e5e5;
				padding-bottom: 40rpx;
				padding-top: 20rpx;

				button {
					width: 600rpx;
					height: 80rpx;
					line-height: 80rpx;
				}
			}
		}
	}
</style>