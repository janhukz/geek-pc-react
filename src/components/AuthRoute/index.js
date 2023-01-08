import React, { Component } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { hasToken } from 'utils/storage'

export default class AuthRoute extends Component {
  render() {
    // console.log(this.props)
    // 把接收到的component属性改成用render进行渲染
    const { component: Component, ...rest } = this.props
    // console.log(component)
    // console.log(rest)
    return (
      <Route
        {...rest}
        render={(props) => {
          // 使用render函数渲染组件可以添加自己的逻辑，这里用于鉴权
          if (hasToken()) {
            return <Component {...props}></Component>
          } else {
            return (
              <Redirect
                to={{
                  pathname: '/login',
                  // 通过search传递参数
                  // search: '?id=123',
                  state: {
                    from: props.location.pathname
                  }
                }}
              ></Redirect>
            )
          }
        }}
      ></Route>
    )
  }
}
