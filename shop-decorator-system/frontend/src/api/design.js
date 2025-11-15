import request from '@/utils/request'

// 获取我的装修方案列表
export const getMyDesigns = (params) => {
  return request({
    url: '/designs',
    method: 'get',
    params
  })
}

// 保存装修方案
export const saveDesign = (data) => {
  return request({
    url: '/designs',
    method: 'post',
    data
  })
}

// 更新装修方案
export const updateDesign = (id, data) => {
  return request({
    url: `/designs/${id}`,
    method: 'put',
    data
  })
}

// 获取装修方案详情
export const getDesignDetail = (id) => {
  return request({
    url: `/designs/${id}`,
    method: 'get'
  })
}

// 删除装修方案
export const deleteDesign = (id) => {
  return request({
    url: `/designs/${id}`,
    method: 'delete'
  })
}

// 导出装修方案
export const exportDesign = (id) => {
  return request({
    url: `/designs/${id}/export`,
    method: 'get',
    responseType: 'blob'
  })
}
