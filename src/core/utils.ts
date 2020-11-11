import { DeviceInfo } from './data'
export function getPageInfo() {
	return {
		pageWidth: document.body.clientWidth,
		pageHeight: document.body.clientHeight,
		screenWidth: window.screen.width,
		screenHeight: window.screen.height,
	};
}

export function getBrowserInfo(): any {
	const inBrowser = typeof window !== "undefined";
	const ua = inBrowser && window.navigator.userAgent.toLowerCase();
	const isIE = ua && /msie|trident/.test(ua);
	const isEdge = ua && ua.indexOf("edge/") > 0;
	const isChrome = ua && /chrome\/\d+/.test(ua) && !isEdge;
	const isOpera = ua && (ua.indexOf("opera") > -1 || ua.indexOf("opr") > -1);
	const isSafari =
		ua && ua.indexOf("safari") > -1 && ua.indexOf("chrome") === -1;
	const isQQ = ua && ua.indexOf("mqqbrowser") > 0;
	const isFF = ua && ua.indexOf("firefox") > -1;
	const isUC = ua && ua.indexOf("ucbrowser/") > 0;
	const isBaidu = ua && ua.indexOf("baiduboxapp") > 0;
	const isAndroid = ua && ua.indexOf("android") > 0;
	const isIOS = ua && /iphone|ipad|ipod|ios/.test(ua);
	// 组装数据 省掉 更多的if else的判断
	const BrowserTypeArr = [
		isIE,
		isEdge,
		isChrome,
		isOpera,
		isSafari,
		isQQ,
		isFF,
		isUC,
		isBaidu,
		isAndroid,
		isIOS,
	];
	const BrowserRetArr = [
		"IE",
		"Edge",
		"Chrome",
		"Opera",
		"Safari",
		"QQ",
		"FF",
		"UC",
		"Baidu",
		"Android",
		"IOS",
	].map((val) => {
		return {
			browserName: val,
			ua,
		};
	});

	const index: any = BrowserTypeArr.map((val, index) => {
		if (val) {
			return index;
		}
	}).filter(Boolean)[0];

	return BrowserRetArr[index] ? BrowserRetArr[index] : { browserName: "unknow", ua };
}

export function getOSInfo() {
	let sUserAgent = navigator.userAgent;
	let isWin =
		navigator.platform == "Win32" || navigator.platform == "Windows";
	let isMac =
		navigator.platform == "Mac68K" ||
		navigator.platform == "MacPPC" ||
		navigator.platform == "Macintosh" ||
		navigator.platform == "MacIntel";
	if (isMac) return "Mac";
	let isUnix = navigator.platform == "X11" && !isWin && !isMac;
	if (isUnix) return "Unix";
	let isLinux = String(navigator.platform).indexOf("Linux") > -1;
	if (isLinux) return "Linux";
	if (isWin) {
		let isWin2K =
			sUserAgent.indexOf("Windows NT 5.0") > -1 ||
			sUserAgent.indexOf("Windows 2000") > -1;
		if (isWin2K) return "Win2000";
		let isWinXP =
			sUserAgent.indexOf("Windows NT 5.1") > -1 ||
			sUserAgent.indexOf("Windows XP") > -1;
		if (isWinXP) return "WinXP";
		let isWin2003 =
			sUserAgent.indexOf("Windows NT 5.2") > -1 ||
			sUserAgent.indexOf("Windows 2003") > -1;
		if (isWin2003) return "Win2003";
		let isWinVista =
			sUserAgent.indexOf("Windows NT 6.0") > -1 ||
			sUserAgent.indexOf("Windows Vista") > -1;
		if (isWinVista) return "WinVista";
		let isWin7 =
			sUserAgent.indexOf("Windows NT 6.1") > -1 ||
			sUserAgent.indexOf("Windows 7") > -1;
		if (isWin7) return "Win7";
		let isWin10 =
			sUserAgent.indexOf("Windows NT 10") > -1 ||
			sUserAgent.indexOf("Windows 10") > -1;
		if (isWin10) return "Win10";
	}
	return "other";
}

export function getDeviceInfo() {
	return  {
		browser: getBrowserInfo(),
		os: getOSInfo(),
	};
}
