function getLabelByValue(options, value) {
	return options.find(option => option.value === value)?.label
}

function getTextByValue(options, value) {
	return options.find(option => option.value === value)?.text
}

function getNameByValue(options, value) {
	return options.find(option => option.value === value)?.name
}

function getValueByText(options, text) {
	return options.find(option => option.text === text)?.value
}

function getValueByName(options, name) {
	return options.find(option => option.name === name)?.value
}



// 日期格式化
const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 年月日转时间戳
const timeToTimestamp = timeString => {
	const date = new Date(timeString);
	if (isNaN(date.getTime())) {
		throw new Error('Invalid date string');
	}
	return Math.floor(date.getTime() / 1000);
};
const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

function timestampToDate(timestamp) {
	let date = new Date(timestamp);
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let day = ("0" + date.getDate()).slice(-2);
	return `${year}-${month}-${day}`;
}

const $h = {
	//除法函数，用来得到精确的除法结果
	//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
	//调用：$h.Div(arg1,arg2)
	//返回值：arg1除以arg2的精确结果
	Div: function(arg1, arg2) {
		arg1 = parseFloat(arg1);
		arg2 = parseFloat(arg2);
		var t1 = 0,
			t2 = 0,
			r1, r2;
		try {
			t1 = arg1.toString().split(".")[1].length;
		} catch (e) {}
		try {
			t2 = arg2.toString().split(".")[1].length;
		} catch (e) {}
		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		return this.Mul(r1 / r2, Math.pow(10, t2 - t1));
	},
	//加法函数，用来得到精确的加法结果
	//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
	//调用：$h.Add(arg1,arg2)
	//返回值：arg1加上arg2的精确结果
	Add: function(arg1, arg2) {
		arg2 = parseFloat(arg2);
		var r1, r2, m;
		try {
			r1 = arg1.toString().split(".")[1].length
		} catch (e) {
			r1 = 0
		}
		try {
			r2 = arg2.toString().split(".")[1].length
		} catch (e) {
			r2 = 0
		}
		m = Math.pow(100, Math.max(r1, r2));
		return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
	},
	//减法函数，用来得到精确的减法结果
	//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
	//调用：$h.Sub(arg1,arg2)
	//返回值：arg1减去arg2的精确结果
	Sub: function(arg1, arg2) {
		arg1 = parseFloat(arg1);
		arg2 = parseFloat(arg2);
		var r1, r2, m, n;
		try {
			r1 = arg1.toString().split(".")[1].length
		} catch (e) {
			r1 = 0
		}
		try {
			r2 = arg2.toString().split(".")[1].length
		} catch (e) {
			r2 = 0
		}
		m = Math.pow(10, Math.max(r1, r2));
		//动态控制精度长度
		n = (r1 >= r2) ? r1 : r2;
		return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
	},
	//乘法函数，用来得到精确的乘法结果
	//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
	//调用：$h.Mul(arg1,arg2)
	//返回值：arg1乘以arg2的精确结果
	Mul: function(arg1, arg2) {
		arg1 = parseFloat(arg1);
		arg2 = parseFloat(arg2);
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	},
}

/**
 * 处理服务器扫码带进来的参数
 * @param string param 扫码携带参数
 * @param string k 整体分割符 默认为：&
 * @param string p 单个分隔符 默认为：=
 * @return object
 * 
 */
const getUrlParams = (param, k, p) => {
	if (typeof param != 'string') return {};
	k = k ? k : '&'; //整体参数分隔符
	p = p ? p : '='; //单个参数分隔符
	var value = {};
	if (param.indexOf(k) !== -1) {
		param = param.split(k);
		for (var val in param) {
			if (param[val].indexOf(p) !== -1) {
				var item = param[val].split(p);
				value[item[0]] = item[1];
			}
		}
	} else if (param.indexOf(p) !== -1) {
		var item = param.split(p);
		value[item[0]] = item[1];
	} else {
		return param;
	}
	return value;
}


function isWechatOrQQ() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/WeiBo/i) == "weibo") {
		return true;
	} else if (ua.indexOf('mobile mqqbrowser') > -1) {
		return true;
	} else if (ua.indexOf('iphone') > -1 || ua.indexOf('mac') > -1) {
		if (ua.indexOf('qq') > -1) {
			return true;
		}

	}
	return false;
}

/*
 * 合并数组
 */
const SplitArray = function(list, sp) {
	if (typeof list != 'object') return [];
	if (sp === undefined) sp = [];
	for (var i = 0; i < list.length; i++) {
		sp.push(list[i]);
	}
	return sp;
}

const Tips = function(opt, to_url) {
	if (typeof opt == 'string') {
		to_url = opt;
		opt = {};
	}
	var title = opt.title || '',
		icon = opt.icon || 'none',
		endtime = opt.endtime || 2000;
	if (title) uni.showToast({
		title: title,
		icon: icon,
		duration: endtime
	})
	if (to_url != undefined) {
		if (typeof to_url == 'object') {
			var tab = to_url.tab || 1,
				url = to_url.url || '';
			switch (tab) {
				case 1:
					//一定时间后跳转至 table
					setTimeout(function() {
						uni.switchTab({
							url: url
						})
					}, endtime);
					break;
				case 2:
					//跳转至非table页面
					setTimeout(function() {
						uni.navigateTo({
							url: url,
						})
					}, endtime);
					break;
				case 3:
					//返回上页面
					setTimeout(function() {
						uni.navigateBack({
							delta: parseInt(url),
						})
					}, endtime);
					break;
				case 4:
					//关闭当前所有页面跳转至非table页面
					setTimeout(function() {
						uni.reLaunch({
							url: url,
						})
					}, endtime);
					break;
				case 5:
					//关闭当前页面跳转至非table页面
					setTimeout(function() {
						uni.redirectTo({
							url: url,
						})
					}, endtime);
					break;
			}

		} else if (typeof to_url == 'function') {
			setTimeout(function() {
				to_url && to_url();
			}, endtime);
		} else {
			//没有提示时跳转不延迟
			setTimeout(function() {
				uni.navigateTo({
					url: to_url,
				})
			}, title ? endtime : 0);
		}
	}
}


/**
 * 移除数组中的某个数组并组成新的数组返回
 * @param array array 需要移除的数组
 * @param int index 需要移除的数组的键值
 * @param string | int 值
 * @return array
 * 
 */
const ArrayRemove = (array, index, value) => {
	const valueArray = [];
	if (array instanceof Array) {
		for (let i = 0; i < array.length; i++) {
			if (typeof index == 'number' && array[index] != i) {
				valueArray.push(array[i]);
			} else if (typeof index == 'string' && array[i][index] != value) {
				valueArray.push(array[i]);
			}
		}
	}
	return valueArray;
}
/**
 * 生成海报获取文字
 * @param string text 为传入的文本
 * @param int num 为单行显示的字节长度
 * @return array 
 */
const textByteLength = (text, num) => {
	let strLength = 0;
	let rows = 1;
	let str = 0;
	let arr = [];
	for (let j = 0; j < text.length; j++) {
		if (text.charCodeAt(j) > 255) {
			strLength += 2;
			if (strLength > rows * num) {
				strLength++;
				arr.push(text.slice(str, j));
				str = j;
				rows++;
			}
		} else {
			strLength++;
			if (strLength > rows * num) {
				arr.push(text.slice(str, j));
				str = j;
				rows++;
			}
		}
	}
	arr.push(text.slice(str, text.length));
	return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
}

/**
 * 获取分享海报
 * @param array arr2 海报素材
 * @param string store_name 素材文字
 * @param string price 价格
 * @param function successFn 回调函数
 * 
 * 
 */
const PosterCanvas = (arr2, store_name, price, successFn) => {
	uni.showLoading({
		title: '海报生成中',
		mask: true
	});
	const ctx = uni.createCanvasContext('myCanvas');
	ctx.clearRect(0, 0, 0, 0);
	/**
	 * 只能获取合法域名下的图片信息,本地调试无法获取
	 * 
	 */
	uni.getImageInfo({
		src: arr2[0],
		success: function(res) {
			const WIDTH = res.width;
			const HEIGHT = res.height;
			ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);
			ctx.drawImage(arr2[1], 0, 0, WIDTH, WIDTH);
			ctx.save();
			let r = 90;
			let d = r * 2;
			let cx = 40;
			let cy = 990;
			ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
			ctx.clip();
			ctx.drawImage(arr2[2], cx, cy, d, d);
			ctx.restore();
			const CONTENT_ROW_LENGTH = 40;
			let [contentLeng, contentArray, contentRows] = textByteLength(store_name,
				CONTENT_ROW_LENGTH);
			if (contentRows > 2) {
				contentRows = 2;
				let textArray = contentArray.slice(0, 2);
				textArray[textArray.length - 1] += '……';
				contentArray = textArray;
			}
			ctx.setTextAlign('center');
			ctx.setFontSize(32);
			let contentHh = 32 * 1.3;
			for (let m = 0; m < contentArray.length; m++) {
				ctx.fillText(contentArray[m], WIDTH / 2, 820 + contentHh * m);
			}
			ctx.setTextAlign('center')
			ctx.setFontSize(48);
			ctx.setFillStyle('red');
			ctx.fillText('￥' + price, WIDTH / 2, 860 + contentHh);
			ctx.draw(true, function() {
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					fileType: 'png',
					destWidth: WIDTH,
					destHeight: HEIGHT,
					success: function(res) {
						uni.hideLoading();
						successFn && successFn(res.tempFilePath);
					}
				})
			});
		},
		fail: function() {
			uni.hideLoading();
			Tips({
				title: '无法获取图片信息'
			});
		}
	})
}

/**
 * 数字变动动画效果
 * @param float BaseNumber 原数字
 * @param float ChangeNumber 变动后的数字
 * @param object that 当前this
 * @param string name 变动字段名称
 * */
const AnimationNumber = (BaseNumber, ChangeNumber, that, name) => {
	var difference = $h.Sub(ChangeNumber, BaseNumber) //与原数字的差
	var absDifferent = Math.abs(difference) //差取绝对值
	var changeTimes = absDifferent < 6 ? absDifferent : 6 //最多变化6次
	var changeUnit = absDifferent < 6 ? 1 : Math.floor(difference / 6);
	// 依次变化
	for (var i = 0; i < changeTimes; i += 1) {
		// 使用闭包传入i值，用来判断是不是最后一次变化
		(function(i) {
			setTimeout(() => {
				that.setData({
					[name]: $h.Add(BaseNumber, changeUnit)
				})
				// 差值除以变化次数时，并不都是整除的，所以最后一步要精确设置新数字
				if (i == changeTimes - 1) {
					that.setData({
						[name]: $h.Add(BaseNumber, difference)
					})
				}
			}, 100 * (i + 1))
		})(i)
	}
}

function friendlyDate(timestamp) {
	var formats = {
		'year': '%n% 年前',
		'month': '%n%月前',
		'day': '%n% 天前',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前',
	};

	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}


export {
	formatTime,
	timestampToDate,
	timeToTimestamp,
	$h,
	Tips,
	SplitArray,
	ArrayRemove,
	PosterCanvas,
	AnimationNumber,
	getUrlParams,
	getValueByText,
	getTextByValue,
	getNameByValue,
	getLabelByValue,
	getValueByName,
	friendlyDate
};