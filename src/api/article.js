import request from 'utils/request'

/**
 * 获取文章列表
 * @param {*} params
 * @returns
 */
export const getArticles = (params) => {
  return request({
    url: '/mp/articles',
    method: 'get',
    params,
  })
}