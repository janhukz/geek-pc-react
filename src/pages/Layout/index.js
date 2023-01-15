import React, { Component } from 'react'
import styles from './index.module.scss'
import {
  LogoutOutlined,
  HomeOutlined,
  DiffOutlined,
  EditOutlined
} from '@ant-design/icons'
import { Layout, Menu, message, Popconfirm } from 'antd'
import { Switch, Route, Link } from 'react-router-dom'
import { removeToken } from 'utils/storage'
import { getUserProfile } from 'api/user'
// import Home from 'pages/Home'
// import ArticleList from 'pages/ArticleList'
// import ArticlePublish from 'pages/ArticlePublish'

const Home = React.lazy(() => import('pages/Home'))
const ArticleList = React.lazy(() => import('pages/ArticleList'))
const ArticlePublish = React.lazy(() => import('pages/ArticlePublish'))

const { Header, Content, Sider } = Layout

export default class HomeComponent extends Component {
  state = {
    profile: {}
  }
  render() {
    return (
      <div className={styles.layout}>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <div className="profile">
              <span>{this.state.profile.name}</span>
              <span>
                <Popconfirm
                  title="你确定要退出本系统吗?"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={this.onConfirm}
                >
                  <LogoutOutlined /> 退出
                </Popconfirm>
              </span>
            </div>
          </Header>
          <Layout>
            <Sider width={200}>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[this.props.location.pathname]}
                style={{
                  height: '100%',
                  borderRight: 0
                }}
              >
                <Menu.Item key="/home" icon={<HomeOutlined />}>
                  <Link to="/home">数据概览</Link>
                </Menu.Item>

                <Menu.Item key="/home/list" icon={<DiffOutlined />}>
                  <Link to="/home/list">内容管理</Link>
                </Menu.Item>

                <Menu.Item key="/home/publish" icon={<EditOutlined />}>
                  <Link to="/home/publish">发布文章</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout
              style={{
                padding: '24px',
                overflow: 'auto'
              }}
            >
              <Content className="site-layout-background">
                <Switch>
                  <Route exact path="/home" component={Home}></Route>
                  <Route path="/home/list" component={ArticleList}></Route>
                  {/* 新增文章的路由 */}
                  <Route
                    exact
                    path="/home/publish"
                    component={ArticlePublish}
                    key="add"
                  ></Route>
                  {/* 编辑文章的路由 */}
                  {/* key值发生变化,组件就不会复用了 */}
                  <Route
                    path="/home/publish/:id"
                    component={ArticlePublish}
                    key="edit"
                  ></Route>
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }
  onConfirm = () => {
    // 移除token
    // localStorage.removeItem('token')
    removeToken()
    // 跳转到登录页
    this.props.history.push('/login')
    // 提示消息
    message.success('退出成功!')
  }
  async componentDidMount() {
    const res = await getUserProfile()
    // console.log(res)
    this.setState({
      profile: res.data
    })
  }
}
