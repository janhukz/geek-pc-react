import React, { Component } from 'react'
import {
  Card,
  Breadcrumb,
  Radio,
  Form,
  Button,
  DatePicker,
  Space,
  Table,
  Tag,
  Modal,
  message
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import styles from './index.module.scss'
import { Link } from 'react-router-dom'
import { ArticleStatus } from 'api/constants'
import { delArticle, getArticles } from 'api/article'
import Channel from 'components/Channel'
import defaultImg from 'assets/error.png'
const { RangePicker } = DatePicker

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
              alt=""
              style={{ width: 200, height: 120, objectFit: 'cover' }}
            />
          )
        }
        return (
          <img
            src={data.cover.images[0]}
            alt=""
            style={{ width: 200, height: 120, objectFit: 'cover' }}
          />
        )
      }
    },
    { title: '标题', dataIndex: 'title' },
    {
      title: '状态',
      dataIndex: 'status',
      render(status) {
        const obj = ArticleStatus.find((item) => item.id === status)
        return <Tag color={obj.color}>{obj.name}</Tag>
      }
    },
    { title: '发布时间', dataIndex: 'pubdate' },
    { title: '阅读数', dataIndex: 'read_count' },
    { title: '评论数', dataIndex: 'comment_count' },
    { title: '点赞数', dataIndex: 'like_count' },
    {
      title: '操作',
      render: (data) => {
        return (
          // 这里需要两个按钮，可以使用幽灵节点 <></> 来充当jsx根元素
          <Space>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => this.handleEdit(data.id)}
            />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => this.handleDelete(data.id)}
            />
          </Space>
        )
      }
    }
  ]

  reqParams = {
    page: 1,
    per_page: 10
  }

  state = {
    articles: {}
  }
  render() {
    const { total_count, results, per_page, page } = this.state.articles
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
            <Form.Item label="频道" name="channel_id">
              <Channel></Channel>
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
          {/* 文章列表 */}
          <Table
            dataSource={results}
            columns={this.columns}
            rowKey="id"
            pagination={{
              total: total_count,
              position: ['bottomCenter'],
              pageSize: per_page,
              current: page,
              onChange: this.onChange
            }}
          ></Table>
        </Card>
      </div>
    )
  }
  onFinish = ({ status, channel_id, date }) => {
    if (status !== -1) {
      this.reqParams.status = status
    } else {
      // 点全部时，删除status，因为全部不需要传status
      delete this.reqParams.status
    }
    if (channel_id !== undefined) {
      this.reqParams.channel_id = channel_id
    } else {
      delete this.reqParams.channel_id
    }
    if (date) {
      this.reqParams.begin_pubdate = date[0]
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      this.reqParams.end_pubdate = date[1]
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
    } else {
      delete this.reqParams.begin_pubdate
      delete this.reqParams.end_pubdates
    }
    console.log(this.reqParams)
    // 如果是查询操作，要让页码重新为1
    this.reqParams.page = 1
    // 重新发起请求
    this.getArticleList()
  }
  componentDidMount() {
    this.getArticleList()
  }
  async getArticleList() {
    const res = await getArticles(this.reqParams)
    // console.log('文章:', res)
    this.setState({
      articles: res.data
    })
  }
  onChange = (record, selected) => {
    this.reqParams.page = record
    this.reqParams.per_page = selected
    this.getArticleList()
  }
  handleDelete = (id) => {
    // console.log(id)
    return Modal.confirm({
      title: '温馨提示',
      content: '您确定要删除这篇文章吗?',
      onOk: async () => {
        // 发送请求，删除文章
        const res = await delArticle(id)
        if (res.message === 'OK') {
          this.getArticleList()
          message.success('删除文章成功!')
        } else {
          message.error('删除文章失败!')
        }
      }
    })
  }
  handleEdit = (id) => {
    this.props.history.push(`/home/publish/${id}`)
  }
}
