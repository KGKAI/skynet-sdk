import { ErrorData } from "./data";
import { upload } from "./requests";
import { getDeviceInfo, getPageInfo } from "./utils";

// 处理运行时异常和资源加载异常
export default function error() {
    window.addEventListener("error", (event: any) => {
        let params: any
        if (event instanceof ErrorEvent) {  // 运行时错误
            const {message, lineno, colno, filename, error: {stack}} = event
            params = {
                message,
                lineno,
                colno,
                filename,
                stack
            }
        } else {    // 资源加载错误
            // localName是产生错误的标签元素，如image
            const {localName, src, href} = event.target
            let sourceUrl = ""
            // link标签产生的错误是没有src属性的，只有href属性
            sourceUrl = localName === "link" ? href : src
            params = {
                resourceType: localName,
                sourceUrl
            }            
        }
        // 整合数据
        const data: ErrorData = {
            uid: "AAAA",
            trackId: "",
            timestamp: +new Date(),
            deviceInfo: getDeviceInfo(),
            type: params.resourceType ? "RESOURCE" : "ERROR",
            pageInfo: getPageInfo(),
            currentUrl: window.location.href,
            refererUrl: document.referrer,
            data: params
        }
        console.log(data)
        // 上传错误
        upload(data, "/monitor/error")
    }, true)
}