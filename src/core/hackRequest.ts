import { XHRData } from "./data"
import { upload } from "./requests"
import { getDeviceInfo } from "./utils"

export default function hackRequest() {
    (function hackXHR() {
        let method = "", url = "", startTime = 0, data = null, status = 0, result = false, duration = 0
        let xhr = window.XMLHttpRequest
        // hack open AOP
        let originOpen = xhr.prototype.open
        xhr.prototype.open = function(this: XMLHttpRequest, meth: string, u: string, async: boolean, user: string, password: string) {
        method = meth
        url = u
        return originOpen.apply(this, arguments as any)
        } as any
        // hack send
        let originSend = xhr.prototype.send
        xhr.prototype.send = function(value) {
            startTime = Date.now()
            let ajaxEnd = (event: any) => () => {
                data = value
                status = this.status
                result = (this.status >= 200 && this.status <= 206) || this.status === 304
                duration = Date.now() - startTime
                const xhrData: XHRData = new XHRData({
                    uid: "12222",
                    trackId: "",
                    timestamp: Date.now(),
                    type: "XHR",
                    deviceInfo: getDeviceInfo(),
                    url, 
                    method, 
                    event, 
                    startTime,
                    data,
                    status,
                    result,
                    duration
                })
                
                console.log(xhrData)
                upload(xhrData, '/xhr')
            }

            // 监听xhr的事件
            this.addEventListener('load', ajaxEnd('load'))
            this.addEventListener('error', ajaxEnd('error'))
            this.addEventListener('abort', ajaxEnd('abort'))
            return originSend.apply(this, arguments as any)
        }
    })();

    (function hackFetch() {
        if (window.fetch && typeof window.fetch === "function") {
            let oriFetch = window.fetch
            let newFetch:any = function(this: any) {
                let startTime = Date.now()
                let args:Array<any> = [].slice.call(arguments)
                let url = "", method = "GET"
                let fetchInput:any = args[0]

                // fetch的第一个参数可以使string的地址，也可以是一个Request对象的实例
                if (typeof fetchInput === "string") {
                    url = fetchInput
                } else if (fetchInput instanceof window.Request){
                    url = fetchInput.url
                    if (fetchInput.method) {
                        method = fetchInput.method
                    }
                } else {
                    url = "" + fetchInput
                }

                if (args[1] && args[1].method) {
                    method = args[1].method
                }

                let fetchData: any = {
                    method,
                    url,
                }
                return oriFetch.apply(this, args as any).then((response: Response) => {
                    fetchData.status = response.status
                    fetchData.startTime = startTime
                    fetchData.data = fetchInput instanceof Request ? fetchInput : args[1]
                    fetchData.result = response.ok
                    fetchData.duration = Date.now() - startTime
                    fetchData.uid = "12222",
                    fetchData.trackId = "",
                    fetchData.timestamp = Date.now(),
                    fetchData.type = "FETCH"
                    fetchData.deviceInfo = getDeviceInfo(),

                    upload(fetchData, "/xhr")
                    return response
                })
            }

            window.fetch = newFetch
        }
    })();
}