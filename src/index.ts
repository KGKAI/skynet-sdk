import error from "./core/error"
import promise from "./core/promise";
import hackRequest from "./core/hackRequest"
import recordPerformance from "./core/performance"
import behavior from "./core/behavior"

function initMonitor() {
    error()
    // promise()
    // hackRequest()
    // behavior()
    // 有时关于dom的一些指标和load在加载页面时是拿不到的，所以做一个特殊处理
    setTimeout(() => {
        // recordPerformance()
    }, 2000);
}

initMonitor()
