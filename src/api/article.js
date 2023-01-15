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
    params
  })
}
/**
 * 删除文章接口
 * @param {*} id
 * @returns
 */
export const delArticle = (id) => {
  return request.delete(`/mp/articles/${id}`)
}
/**
 * 添加文章接口
 * @param {*} data
 * @param {*} isDraft
 * @returns
 */
export const addArticle = (data, isDraft = false) => {
  return request({
    url: 'mp/articles',
    method: 'POST',
    data,
    params: { draft: isDraft }
  })
}

/**
 * 通过ID获取文章详情
 * @param {*} id
 * @returns
 */
export const getArticleByID = (id) => {
  return request({
    url: `mp/articles/${id}`,
    method: 'GET'
  })
}

/**
 * 添加文章接口
 * @param {*} data
 * @param {*} isDraft
 * @param {*} id
 * @returns
 */
export const editArticle = (data, isDraft = false, id) => {
  return request({
    url: `mp/articles/${id}`,
    method: 'PUT',
    data,
    params: { draft: isDraft }
  })
}
