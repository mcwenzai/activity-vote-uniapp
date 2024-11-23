export const API_CONFIG = {
	getActivityDetail: {
		url: '/applet/appActivity/detail',
		needToken: true,
	},
	getStatus: {
		url: '/applet/appActivity/status',
		needToken: false,
	},
	postSms: {
		url: '/applet/aliYunSms/sendCode',
		needToken: false,
	},
	sendCode: {
		url: '/applet/aliYunSms/sendCode',
		needToken: false,
	},
	getActivity: {
		url: '/applet/appActivity/page',
		needToken: true,
	},
	getRanking: {
		url: '/applet/appActivityVote/top',
		needToken: false,
	},
	// 提交报名
	postActivity: {
		url: '/applet/appActivityPerson/register',
		needToken: true,
	},
	uploadFile: {
		url: '/applet/file/upload',
		needToken: false,
	},
	// 我的活动
	getUserActivity: {
		url: '/applet/myAppActivity/page',
		needToken: true,
	},
	getUserDetail: {
		url: '/applet/appActivityVisitor/detail',
		needToken: true,
	},
	postEdit: {
		url: '/applet/appActivityVisitor/edit',
		needToken: true,
	},
	getVoteList: {
		url: '/index/case',
		needToken: false,
	},
	getActivityVote: {
		url: '/applet/appActivityVoteItem/page',
		needToken: false
	},
	getPersonDetail: {
		url: '/applet/appActivityVoteItem/detail',
		needToken: true,
	},
	postPersonVote: {
		url: '/applet/personVote',
		needToken: true,
	},
	// 验证码登录
	phoneLogin: {
		url: '/applet/phone/Login',
		needToken: false,
	},
	// 手机号直接登录
	phoneLoginDirect: {
		url: '/applet/uncode/phone/Login',
		needToken: false,
	},
	// 抖音授权登录
	toutiaoLogin: {
		url: '/applet/dy/login',
		needToken: false,
	},
	// 微信授权登录
	weixinLogin: {
		url: '/applet/wx/login',
		needToken: false,
	},
	// 我的消息列表
	getUserMessage: {
		url: '/applet/sysMessage/page',
		needToken: true
	},
	// 我的投票
	getUserVote: {
		url: '/applet/myAppActivityVote/page',
		needToken: true
	},
	// 消息阅读
	postSetRead: {
		url: '/applet/sysMessage/setRead',
		needToken: true
	},
	// 通知公告列表
	getNoticeList: {
		url: '/applet/appActivityNotice/page',
		needToken: false
	},
	// 通知公告详情
	getNoticeDetail: {
		url: '/applet/appActivityNotice/detail',
		needToken: false
	},
	// 国家
	getCountry: {
		url: '/applet/getCountry',
		needToken: false
	},
	getVoteCount: {
		url: '/applet/getVoteCount',
		needToken: true
	},
	// 身份证识别
	getIdCard: {
		url: '/applet/appActivity/recognizeIdentityCard',
		needToken: true
	},
	getSts: {
		url: '/applet/get_sts_token_for_oss_upload',
		needToken: true
	},
	// 获取学校
	getSchoolList: {
		url: 'applet/getSchoolList',
		needToken: true
	},
	// 投票详情
	getVoteDetail: {
		url: 'applet/appActivityVote/detail',
		needToken: false
	},
	// 奖品列表
	getPrizeList: {
		url: 'applet/appActivityVoteDraw/getPrizeList',
		needToken: true
	},
	// 中奖记录
	getVoteDraw: {
		url: '/applet/appActivityVoteDraw/add',
		needToken: true
	},
	addVoteDraw: {
		url: '/applet/appActivityVoteDraw/add',
		needToken: true
	},
	// 抽奖次数
	getVoteDrawCount: {
		url: '/applet/appActivityVoteDrawDetail/getCount',
		needToken: true
	},
	// 院团点赞
	getAddLikes: {
		url: '/applet/appActivityCollege/likes',
		needToken: true
	},
	// 院团列表
	getCollegeList: {
		url: '/applet/appActivityCollege/page',
		needToken: false
	},
	// 院团排名
	getCollegeRanking: {
		url: '/applet/appActivityCollege/top',
		needToken: true
	},
	// 院团详情
	getCollegeDetail: {
		url: '/applet/appActivityCollege/detail',
		needToken: false
	},
	// 报名详情
	getSignUpDetail: {
		url: '/applet/appActivityPerson/detail',
		needToken: true
	},
	// 报名修改
	postSignUpUpdate: {
		url: '/applet/appActivityPerson/update',
		needToken: true
	},
	getFileName: {
		url: '/applet/getFileObjectName',
		needToken: true
	},
	getVoteDrawstatus: {
		url: '/applet/appActivityVoteDraw/status',
		needToken: true
	},
		// 抽中奖品
	getLuckyDraw: {
		url: '/applet/appActivityVoteDraw/luckyDraw',
		needToken: true
	}
};