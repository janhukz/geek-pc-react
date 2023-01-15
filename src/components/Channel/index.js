import React, { Component } from 'react'
import { Select } from 'antd'
import { getAllChannels } from 'api/channel'
const { Option } = Select

export default class Channel extends Component {
  state = {
    channels: []
  }
  render() {
    // console.log('父组件提供的属性:', this.props)
    return (
      <Select
        placeholder="请选择文章频道!"
        style={{
          width: 220
        }}
        // 自定义表单控件处理
        value={this.props.value}
        onChange={this.props.onChange}
      >
        {this.state.channels.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    )
  }
  componentDidMount() {
    this.getChannelList()
  }

  async getChannelList() {
    const res = await getAllChannels()
    this.setState({
      channels: res.data.channels
    })
  }
}
