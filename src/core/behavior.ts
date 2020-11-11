import { BehaviorData } from './data'
import { upload } from "./requests";

export default function behavior() {
    // 点击事件
    (function hackClick() {
        window.addEventListener('click', (event) => {
            let xPath:string = getXPath(event.target)
            if (!xPath) return;
            let data: BehaviorData = {
                target: xPath,
                type: "CLICK"
            }

            upload(data, "/behavior")
        }, false)

        function getXPath(element: any):string {
            let xPath = ""
            if (!(element instanceof Element)) {
                return ""
            }

            if (element.nodeType !== 1) {
                return ""
            }
            // 忽略body点击事件
            if (element === document.body || element === document.documentElement) {
                return ""
            }

            function childIndex(element: any) {
                let parent = element.parentNode
                return [].slice.call(parent.childNodes).findIndex(el => el === element)
            }

            while(element !== null && element !== document.body) {
                let tag = element.tagName.toLocaleLowerCase()
                let index = childIndex(element)
                let id = element.id
                let className = [].slice.call(element.classList).map((cl) => "." + cl).join("")
                xPath = tag + (id && "#" + id) + className + (index === 0 ? '' : `[${index + 1}]`) + "/" + xPath
                element = element.parentNode
            }
            return "html/document/" + xPath.substr(0, xPath.length - 1)
        }
    })();

    // log、warn、error等控制台行为
    (function hackConsole(){
        if (window.console) {
            ['log', 'warn', 'error'].forEach((level: string) => {
                let _console: {[index: string]: any} = window.console
                let action = _console[level]
                _console[level] = function() {
                    let args = [].slice.call(arguments)
                    let params = {
                        content: args,
                        type: "CONSOLE",
                        level: level
                    }
                    action(params)
                    action.apply(null, args)
                    upload(params, "/console")
                }
            })
        }
    })();

    // 监听用户的页面跳转行为有什么意义?
    (function hackHashChange() {
        window.addEventListener('hashchange', (event) => {
            let oldUrl = event.oldURL
            let newUrl = event.newURL
            let params:any = {
                oldUrl,
                newUrl
            }
            upload(params, "linkjump")
        })
    })();
    
    (function hackPushStateAndReplaceState() {
        let oldUrl = ""
        function hack(type: any) {
            let _history:any = history
            let oriFn :any = _history[type]
            let newFn = function() {
                let args = [].slice.call(arguments)
                oriFn.apply(null, args)
                oldUrl = document.location.href
            }
            _history[type] = newFn
        }
        window.addEventListener('popstate', (event) => {
            let newUrl = document.location.href
            let params: any = {
                oldUrl,
                newUrl
            }

            // console.log(params)
        });

        ["pushState", "replaceState"].forEach(type => hack(type)) 
    })()
}