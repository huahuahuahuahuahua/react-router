// 创建和管理listeners的方法
function createEvents() {
    let handlers =[]
    return {
        push(fn){
            handlers.push(fn);
            return function () {
                handlers = handlers.filter(handler=>handler!==fn)
            }
        },
        call(arg){
            handlers.forEach(fn=>fn&&fn(arg))
        }
    }
}

function createBrowserHistory() {
    const listeners = createEvents();
    let location={
        pathname:'/',
    }
    const handlePop=function () {
        const currentLocation={
            pathname:window.location.pathname
        }
        listeners.call(currentLocation)// 路由变化时执行回调
    }

  // 监听popstate事件
  // 注意pushState和replaceState并不会触发popstate
  // 但是浏览器的前进后退会触发popstate
  // 我们这里监听这个事件是为了处理浏览器的前进后退
    window.addEventListener('popstate', handlePop);
    const history={
        listen(listeners){
            return listeners.push(listeners)
        },
        push(url){
            const history = window.history
            history.pushState(null,'',url);
            location={pathname:url};
            listeners.call(location)
        },
        location
    }
    return history
}

export default createBrowserHistory