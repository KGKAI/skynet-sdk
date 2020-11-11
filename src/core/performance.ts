import { PerformanceData } from "./data"
import { upload } from "./requests"

// 记录性能参数
export default function recordPerformance() { 
    const timing = window.performance.timing
    // 阶段耗时
    let dns = timing.domainLookupEnd - timing.domainLookupStart
    let tcp = timing.connectEnd - timing.connectStart
    let ssl = timing.connectEnd - timing.secureConnectionStart
    let ttfb = timing.responseStart - timing.navigationStart
    let trans = timing.responseEnd - timing.responseStart
    let dom = timing.domInteractive - timing.domLoading
    let res = timing.loadEventStart - timing.domContentLoadedEventEnd
    // 关键性能指标
    let firstbyte = timing.responseStart - timing.domainLookupStart
    let fpt = timing.domComplete - timing.navigationStart
    let tti = timing.domInteractive - timing.fetchStart
    let domready = timing.domContentLoadedEventEnd - timing.fetchStart
    let load = timing.loadEventEnd - timing.navigationStart

    const data: PerformanceData = new PerformanceData({
        dns,
        tcp,
        ssl,
        ttfb,
        trans,
        dom,
        res,
        firstbyte,
        fpt,
        tti,
        domready,
        load
    } as PerformanceData)

    upload(data, "/performance")
}