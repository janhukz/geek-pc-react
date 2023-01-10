// 封装频道相关接口
import request from 'utils/request'

export const getAllChannels = () =>
  request({
    method: 'GET',
    url: 'channels'
  })
