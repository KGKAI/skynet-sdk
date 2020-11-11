import { ErrorData } from "./data"
import { upload } from "./requests"
import { getDeviceInfo, getPageInfo } from "./utils"

// 处理promise异常
export default function promiseError() {
    window.addEventListener("unhandledrejection", (event) => {
        const {reason, timeStamp} = event
        const params = {
            reason
        }
        const data: ErrorData = {
            uid: "AAAA",
            trackId: "",
            timestamp: timeStamp,
            deviceInfo: getDeviceInfo(),
            type: "PROMISE",
            pageInfo: getPageInfo(),
            currentUrl: window.location.href,
            refererUrl: document.referrer,
            data: params
        }

        console.log(data)
        upload(data, "/error")
    }, true)
}