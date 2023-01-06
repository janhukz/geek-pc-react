import React, { Component } from 'react'
import { Card, Form, Checkbox, Input, Button } from 'antd'
import './index.scss'
import logo from 'assets/logo.png'

export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <Card className="login-container">
          <img src={logo} className="login-logo" alt="logo" />
          {/* 表单 */}
          <Form
            size="large"
            validateTrigger={['onBlur']}
            onFinish={this.onFinish}
            initialValues={{
                mobile:'13911111111',
                code:'246810',
                agree:true
            }}
          >
            <Form.Item
              name="mobile"
              rules={[
                {
                  required: true,
                  message: '手机号不能为空'
                },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '手机号格式错误'
                }
              ]}
            >
              <Input placeholder="请输入手机号" autoComplete="off" />
            </Form.Item>

            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: '验证码不能为空'
                },
                {
                  pattern: /^\d{6}$/,
                  message: '验证码格式错误'
                }
              ]}
            >
              <Input.Password placeholder="请输入验证码" />
            </Form.Item>

            <Form.Item
              valuePropName="checked"
              name="agree"
              rules={[
                {
                  validator(rule, value) {
                    if (value) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject(new Error('请阅读并同意用户协议'))
                    }
                  }
                }
              ]}
            >
              <Checkbox>我已经阅读并同意[隐私条款]和[用户协议]</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
  onFinish = (values) => {
    console.log(values)
  }
}
