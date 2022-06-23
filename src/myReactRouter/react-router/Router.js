import React from "react";

import HistoryContext from "./HistoryContext.js";
import RouterContext from "./RouterContext.js";


class Router extends React.Component {
    static computeRootMatch(pathname) {
        return { path: "/", url: "/", params: {}, isExact: pathname === "/" }
    }

    constructor(props) {
        super(props);
        this.state = {
            localtion: props.history.location // 将history的location挂载到state上
        }
       // 下面两个变量是防御性代码，防止根组件还没渲染location就变了
        // 如果location变化时，当前根组件还没渲染出来，就先记下他，等当前组件mount了再设置到state上
        this._isMounted = false;
        this._pendingLocation = null;
        // 在页面挂载完监听
        this.unlisten=props.history.listen(location=>{
            if(this._isMounted){
                this.setState({location});
            }else{
                this._pendingLocation=location;
            }
        })
    };
    componentDidMount(){
        this._isMounted=true;
        if (this._pendingLocation) {
            this.setState({location:this._pendingLocation})
        }
    }
    componentWillUnmount(){
        if(this.unlisten){
            this.UNLISTEN && this.unlisten()
            this._isMounted=false;
            this._pendingLocation=null;
        }
    }
    render(){
       return(
        <RouterContext.Provider
        value={{
            history:this.props.history,
            location:this.state.localtion,
            match:Router.computeRootMatch(this.state.localtion.pathname)
        }}
        >
            <HistoryContext.Provider
            children={this.props.children||null}
            value={this.props.history}
            />
        </RouterContext.Provider>
       ) 
    }
}

export default Router
