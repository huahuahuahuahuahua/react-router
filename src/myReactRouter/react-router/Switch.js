import React from "react";

import RouterContext from "./RouterContext.js";
import matchPath from "./matchPath.js";

class Switch extends React.Component{
    render(){
        return (
            <RouterContext.Consumer>
                {
                    context=>{
                        const location = context.location
                        let element,match;
                        React.Children.forEach(this.props.children,child=>{
                            if(!match && React.isValidElement(child)){
                                element = child;
                                const path = child.props.path;
                                match = matchPath(location.pathname,{...child.props,path})
                            }
                        });
                        // 最终<Switch>组件的返回值只是匹配上子元素的一个拷贝，其他子元素被忽略了
                        // match属性会被塞给拷贝元素的computedMatch
                        // 如果一个都没匹配上，返回null
                        return match
                            ? React.cloneElement(element, { location, computedMatch: match })
                            : null;
                    }
                }
            </RouterContext.Consumer>
        )
    }
}


export default Switch;