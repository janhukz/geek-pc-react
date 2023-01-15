import React, { Component } from 'react'
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Space,
  Input,
  Radio,
  Upload,
  Modal,
  message
} from 'antd'
import { baseURL } from 'utils/request'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'
import Channel from 'components/Channel'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { PlusOutlined } from '@ant-design/icons'
import { addArticle, editArticle, getArticleByID } from 'api/article'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG格式图片!')
    return Upload.LIST_IGNORE
  }
  const isLt1M = file.size / 1024 / 1024 <= 1
  if (!isLt1M) {
    message.error('封面图片必须小于1MB!')
    return Upload.LIST_IGNORE
  }
}
export default class ArticlePublish extends Component {
  state = {
    // 文章封面类型
    type: 1,
    fileList: [],
    previewVisible: false,
    previewImage: '',
    id: this.props.match.params.id
  }
  formRef = React.createRef()
  render() {
    const { fileList, type, previewVisible, previewImage, id } = this.state
    return (
      <div className={styles.root}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{id ? '编辑文章' : '发布文章'}</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form
            labelCol={{ span: 4 }}
            size="large"
            onFinish={this.onFinish}
            validateTrigger={['onBlur', 'onChange']}
            initialValues={{ type: this.state.type }}
            ref={this.formRef}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: '标题不能为空!'
                }
              ]}
            >
              <Input
                placeholder="请输入文章标题"
                style={{ width: 400 }}
              ></Input>
            </Form.Item>
            <Form.Item
              label="频道"
              name="channel_id"
              rules={[
                {
                  required: true,
                  message: '请选择频道!'
                }
              ]}
            >
              <Channel></Channel>
            </Form.Item>
            <Form.Item label="封面" name="type">
              <Radio.Group onChange={this.changeType}>
                <Radio value={1}>1张</Radio>
                <Radio value={3}>3张</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              {this.state.type !== 0 && (
                <Upload
                  listType="picture-card"
                  action={`${baseURL}upload`}
                  name="image"
                  onChange={this.uploadImage}
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  beforeUpload={beforeUpload}
                >
                  {/* {控制图片上传数量} */}
                  {fileList.length < type && <PlusOutlined />}
                </Upload>
              )}
              <Modal
                open={previewVisible}
                footer={null}
                onCancel={this.handleCancel}
              >
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>
            <Form.Item
              label="内容"
              name="content"
              rules={[
                {
                  required: true,
                  message: '文章内容不能为空!'
                }
              ]}
            >
              <ReactQuill theme="snow" placeholder="请输入文章内容!" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                {' '}
                <Button type="primary" size="large" htmlType="submit">
                  {id ? '编辑文章' : '发布文章'}
                </Button>
                <Button size="large" onClick={this.handelDraft}>
                  存为草稿
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
  // 获取表单数据
  async getFormData(values, isDraft) {
    const { type, fileList } = this.state
    if (fileList.length !== type) {
      return message.warn('请选择正确的图片个数！')
    }
    // console.log('values:', values)
    // console.log('fileList:', fileList)
    // console.log('解构values', { ...values })
    // 添加文章
    // 取fileList里的url
    const url = fileList.map((item) => {
      return item.url
    })
    // console.log('url:', url)
    // 判断是发布文章(无id) or 编辑文章(有id)
    if (this.state.id) {
      const res = await editArticle(
        {
          ...values,
          cover: {
            type,
            images: url
          }
        },
        isDraft,
        this.state.id
      )
      if (res.message === 'OK' && isDraft === false) {
        message.success('文章编辑成功!')
        this.props.history.push('/home/list')
      } else if (res.message === 'OK' && isDraft === true) {
        message.success('文章存草稿成功!')
        this.props.history.push('/home/list')
      } else {
        message.warn(res.message)
      }
    } else {
      const res = await addArticle(
        {
          // 这里需要处理一下post的请求参数
          ...values,
          cover: {
            type,
            images: url
          }
        },
        isDraft
      )
      if (res.message === 'OK' && isDraft === false) {
        message.success('文章发布成功!')
        this.props.history.push('/home/list')
      } else if (res.message === 'OK' && isDraft === true) {
        message.success('文章存草稿成功!')
        this.props.history.push('/home/list')
      } else {
        message.warn(res.message)
      }
    }
  }

  // 发布文章
  onFinish = async (values) => {
    this.getFormData(values, false)
  }
  // 存为草稿
  handelDraft = async () => {
    // 1. 使用refs访问antd的From组件 (集成第三方 DOM 库。)
    const { validateFields } = this.formRef.current
    const values = await validateFields()
    // 2. 发送存草稿请求 query draft = true
    this.getFormData(values, true)
  }
  changeType = (e) => {
    this.setState({
      type: e.target.value,
      // 切换上传封面个数时,清空数组
      fileList: []
    })
  }
  uploadImage = ({ fileList }) => {
    this.setState({
      fileList
    })
  }
  handlePreview = async (file) => {
    // console.log('file:', !file.url)
    // console.log('file.preview:', !file.preview)
    // console.log('返回：', !file.url && !file.preview)

    // 如果是服务器的图片则是 false&&ture 下面语句不执行
    // 用户上传的图片 则是 !undefined(就是true) && !undefined(true)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj) // 执行条件，!file.url && !file.preview  都是true
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    })
  }
  handleCancel = () => {
    this.setState({
      previewVisible: false
    })
  }
  async componentDidMount() {
    // 判断：有id才发请求
    if (this.state.id) {
      const res = await getArticleByID(this.state.id)
      console.log('获取文章详情:', res)
      const values = { ...res.data, type: res.data.cover.type }
      const fileList = res.data.cover.images.map((item) => {
        return {
          url: item
        }
      })
      const type = res.data.cover.type
      this.formRef.current.setFieldsValue(values)
      this.setState({
        fileList,
        type
      })
    }
  }
}
