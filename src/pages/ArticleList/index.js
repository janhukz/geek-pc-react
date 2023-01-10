import React, { Component } from 'react'
import {
  Card,
  Breadcrumb,
  Radio,
  Form,
  Button,
  Select,
  DatePicker,
  Space,
  Table,
  Tag
} from 'antd'
import styles from './index.module.scss'
import { Link } from 'react-router-dom'
import { ArticleStatus } from 'api/constants'
import { getAllChannels } from 'api/channel'
import { getArticles } from 'api/article'
import defaultImg from 'assets/error.png'
const { Option } = Select
const { RangePicker } = DatePicker
const { Column, ColumnGroup } = Table

export default class ArticleList extends Component {
  columns = [
    {
      title: '封面',
      dataIndex: '',
      render(data) {
        if (data.cover.type === 0) {
          return (
            <img
              src={defaultImg}
              style={{ width: 200, height: 120, objectFit: 'cover' }}
            />
          )
        }
        return (
          <img
            src={data.cover.images[0]}
            style={{ width: 200, height: 120, objectFit: 'cover' }}
          />
        )
      }
    },
    { title: '标题', dataIndex: 'title' },
    { title: '状态', dataIndex: 'status' },
    { title: '发布时间', dataIndex: 'pubdate' },
    { title: '阅读数', dataIndex: 'read_count' },
    { title: '评论数', dataIndex: 'comment_count' },
    { title: '点赞数', dataIndex: 'like_count' },
    { title: '操作' }
  ]

  state = {
    channels: [],
    articles: {}
  }
  render() {
    const { total_count, results } = this.state.articles
    return (
      <div className={styles.root}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>文章列表</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form onFinish={this.onFinish}>
            <Form.Item label="状态" name="status" initialValue={-1}>
              <Radio.Group>
                {ArticleStatus.map((item) => (
                  <Radio key={item.id} value={item.id}>
                    {item.name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item label="频道">
              <Select
                placeholder="请选择文章频道"
                style={{
                  width: 220
                }}
              >
                {this.state.channels.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="日期" name="date">
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                筛选
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title={`根据筛选条件共查询到${total_count}条数据`}>
          <Table
            dataSource={results}
            columns={this.columns}
            rowKey="id"
          ></Table>
        </Card>
      </div>
    )
  }
  onFinish = (values) => {
    console.log(values)
  }
  componentDidMount() {
    this.getChannelList()
    this.getArticleList()
  }

  async getChannelList() {
    const res = await getAllChannels()
    this.setState({
      channels: res.data.channels
    })
  }
  async getArticleList() {
    const res = await getArticles()
    this.setState({
      articles: res.data
    })
  }
}