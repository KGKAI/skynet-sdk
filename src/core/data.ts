export class Data {
    uid?: string;    // 用户id
    trackId?: string;    // 标识此错误的唯一id
    timestamp?: string | number;  // 错误发生时的时间戳
    type?: string;   // 错误的类型
    deviceInfo?: DeviceInfo;     // 设备信息
    currentUrl?: string;    // 当前出错页面的地址
    refererUrl?: string;    // 当前页面是从哪个页面跳转过来的
    pageInfo?: PageInfo;    // 页面的信息
    appVersion?: number;     
    apiVersion?: number;
    appId?: number;
    
    constructor(options: Data) {
        this.uid = options.uid;
        this.trackId = options.trackId;
        this.timestamp = options.timestamp;
        this.type = options.type;
        this.deviceInfo = options.deviceInfo;
        this.currentUrl = options.currentUrl;
        this.refererUrl = options.refererUrl;
        this.pageInfo = options.pageInfo;
        this.appVersion = options.appVersion;
        this.apiVersion = options.apiVersion;
        this.appId = options.appId;
    }
}

interface Error {
    message: string;
    lineno: string;
    colno: string;
    stack: string;
}

interface ResourceError {
    resourceType: string;
    sourceUrl: string;
}

interface PromiseError {
    reason: string
}

export class ErrorData extends Data {
    data: Partial<Error> & Partial<ResourceError> & Partial<PromiseError>
    constructor(options: ErrorData) {
        super(options)
        this.data = options.data
    }
}

export interface PageInfo {
    pageWidth: number;
    pageHeight: number;
    screenWidth: number;
    screenHeight: number;
}

export interface DeviceInfo {
    browser: {
        browserName: string;
        ua: string;
    };
    os: string;
}

export class PerformanceData extends Data {
    dns: number;   // dns解析耗时
    tcp: number;    // tcp连接耗时
    ssl: number;    // ssl安全连接耗时，仅https可用
    ttfb: number;   // time to first byte 白屏时间
    trans: number;  // 数据传输耗时
    dom: number;    // DOM解析耗时
    res: number;  // 资源加载耗时
    firstbyte: number;  // 首包时间
    fpt: number;    // first paint time 首次渲染时间；从请求开始到浏览器开始解析第一批html文档字节的时间差
    tti: number;    //time to interactive 首次可交互时间；浏览器完成所有HTML解析并且完成dom构建，此时浏览器开始加载资源
    domready: number;  // HTML加载完成时间 如果页面有同步执行的js，则同步js执行时间=domReady-tti
    load: number;   // 页面完全加载时间

    constructor(options: PerformanceData) {
        super(options)
        this.dns = options.dns
        this.tcp = options.tcp
        this.ssl = options.ssl
        this.ttfb = options.ttfb
        this.trans = options.trans
        this.dom = options.dom
        this.res = options.res
        this.firstbyte = options.firstbyte
        this.fpt = options.fpt
        this.tti = options.tti
        this.domready = options.domready
        this.load = options.load
    }
}

export class XHRData extends Data {
    url: string;
    method: string;
    event: string;
    startTime: number;
    data: any;
    status: number;
    result: boolean;
    duration: number;
    constructor(options: XHRData) {
        super(options)
        this.url = options.url
        this.method = options.method
        this.event = options.event
        this.startTime = options.startTime
        this.data = options.data
        this.status = options.status
        this.result = options.result
        this.duration = options.duration
    }   
}

export class BehaviorData extends Data {
    target: string;
    type: string;
    constructor(options: BehaviorData) {
        super(options)
        this.target = options.target
        this.type = options.type
    }
}