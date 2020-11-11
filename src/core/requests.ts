import { Data, ErrorData } from "./data";
import {config} from "../config/index"
/**
 * 使用image上传的依据
 * 1. 只需要发送一个请求就行了，不需要返回
 * 2. 没有跨域问题
 * 3. 不会阻塞页面加载，影响用户的体验，只需new Image对象
 * 4. 不会携带cookie信息
 */

export function imageRequest(url: string) {
    const image = new Image(1, 1)
    image.src = url
}

export function getRequestUrl(data: Data, url: string): string {
    let dataStr = config.host + url + "/error.gif" + "?"
    function getDataStr(curData: any) {
        Object.keys(curData).forEach((key: any) => {
            if (Object.prototype.toString.call(curData[key]) === "[object Object]") {
                getDataStr(curData[key] as any)
            } else {
                dataStr += `${key}=${curData[key]}&`
            }
        })
    }

    getDataStr(data)
    dataStr = dataStr.substr(0, dataStr.length - 1)
    return dataStr
}

export function upload(data: Data, url: string) {
    let src = getRequestUrl(data, url)
    imageRequest(src)
}