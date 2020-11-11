'use strict';

var config = {
    host: "http://127.0.0.1:3000"
};

/**
 * 使用image上传的依据
 * 1. 只需要发送一个请求就行了，不需要返回
 * 2. 没有跨域问题
 * 3. 不会阻塞页面加载，影响用户的体验，只需new Image对象
 * 4. 不会携带cookie信息
 */
function imageRequest(url) {
    var image = new Image(1, 1);
    image.src = url;
}
function getRequestUrl(data, url) {
    var dataStr = config.host + url + "/error.gif" + "?";
    function getDataStr(curData) {
        Object.keys(curData).forEach(function (key) {
            if (Object.prototype.toString.call(curData[key]) === "[object Object]") {
                getDataStr(curData[key]);
            }
            else {
                dataStr += key + "=" + curData[key] + "&";
            }
        });
    }
    getDataStr(data);
    dataStr = dataStr.substr(0, dataStr.length - 1);
    return dataStr;
}
function upload(data, url) {
    var src = getRequestUrl(data, url);
    imageRequest(src);
}

function getPageInfo() {
    return {
        pageWidth: document.body.clientWidth,
        pageHeight: document.body.clientHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
    };
}
function getBrowserInfo() {
    var inBrowser = typeof window !== "undefined";
    var ua = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = ua && /msie|trident/.test(ua);
    var isEdge = ua && ua.indexOf("edge/") > 0;
    var isChrome = ua && /chrome\/\d+/.test(ua) && !isEdge;
    var isOpera = ua && (ua.indexOf("opera") > -1 || ua.indexOf("opr") > -1);
    var isSafari = ua && ua.indexOf("safari") > -1 && ua.indexOf("chrome") === -1;
    var isQQ = ua && ua.indexOf("mqqbrowser") > 0;
    var isFF = ua && ua.indexOf("firefox") > -1;
    var isUC = ua && ua.indexOf("ucbrowser/") > 0;
    var isBaidu = ua && ua.indexOf("baiduboxapp") > 0;
    var isAndroid = ua && ua.indexOf("android") > 0;
    var isIOS = ua && /iphone|ipad|ipod|ios/.test(ua);
    // 组装数据 省掉 更多的if else的判断
    var BrowserTypeArr = [
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
    var BrowserRetArr = [
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
    ].map(function (val) {
        return {
            browserName: val,
            ua: ua,
        };
    });
    var index = BrowserTypeArr.map(function (val, index) {
        if (val) {
            return index;
        }
    }).filter(Boolean)[0];
    return BrowserRetArr[index] ? BrowserRetArr[index] : { browserName: "unknow", ua: ua };
}
function getOSInfo() {
    var sUserAgent = navigator.userAgent;
    var isWin = navigator.platform == "Win32" || navigator.platform == "Windows";
    var isMac = navigator.platform == "Mac68K" ||
        navigator.platform == "MacPPC" ||
        navigator.platform == "Macintosh" ||
        navigator.platform == "MacIntel";
    if (isMac)
        return "Mac";
    var isUnix = navigator.platform == "X11" && !isWin && !isMac;
    if (isUnix)
        return "Unix";
    var isLinux = String(navigator.platform).indexOf("Linux") > -1;
    if (isLinux)
        return "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 ||
            sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K)
            return "Win2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 ||
            sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP)
            return "WinXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 ||
            sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003)
            return "Win2003";
        var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 ||
            sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista)
            return "WinVista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 ||
            sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7)
            return "Win7";
        var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 ||
            sUserAgent.indexOf("Windows 10") > -1;
        if (isWin10)
            return "Win10";
    }
    return "other";
}
function getDeviceInfo() {
    return {
        browser: getBrowserInfo(),
        os: getOSInfo(),
    };
}

// 处理运行时异常和资源加载异常
function error() {
    window.addEventListener("error", function (event) {
        var params;
        console.log(event);
        if (event instanceof ErrorEvent) { // 运行时错误
            var message = event.message, lineno = event.lineno, colno = event.colno, filename = event.filename, stack = event.error.stack;
            params = {
                message: message,
                lineno: lineno,
                colno: colno,
                filename: filename,
                stack: stack
            };
        }
        else { // 资源加载错误
            // localName是产生错误的标签元素，如image
            var _a = event.target, localName = _a.localName, src = _a.src, href = _a.href;
            var sourceUrl = "";
            // link标签产生的错误是没有src属性的，只有href属性
            sourceUrl = localName === "link" ? href : src;
            params = {
                resourceType: localName,
                sourceUrl: sourceUrl
            };
        }
        // 整合数据
        var data = {
            uid: "AAAA",
            trackId: "",
            timestamp: +new Date(),
            deviceInfo: getDeviceInfo(),
            type: params.resourceType ? "RESOURCE" : "ERROR",
            pageInfo: getPageInfo(),
            currentUrl: window.location.href,
            refererUrl: document.referrer,
            data: params
        };
        console.log(data);
        // 上传错误
        upload(data, "/monitor/error");
    }, true);
}

function initMonitor() {
    error();
    // promise()
    // hackRequest()
    // behavior()
    // 有时关于dom的一些指标和load在加载页面时是拿不到的，所以做一个特殊处理
    setTimeout(function () {
        // recordPerformance()
    }, 2000);
}
initMonitor();
//# sourceMappingURL=bundle.cjs.js.map
