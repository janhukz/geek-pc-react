import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.min.css'
import './index.css'
import App from './App'
import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/zh_CN'
import 'moment/locale/zh-cn'

const root = ReactDOM.createRoot(document.getElementById('root'))

const element = (
  <ConfigProvider locale={locale}>
    <App />
  </ConfigProvider>
)

root.render(element)
