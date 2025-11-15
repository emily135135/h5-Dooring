import request from '@/utils/request'

// 获取模板列表（包含公共和私有）
export const getTemplates = (params) => {
  return request({
    url: '/templates',
    method: 'get',
    params
  })
}

// 获取单个模板详情
export const getTemplateDetail = (id) => {
  return request({
    url: `/templates/${id}`,
    method: 'get'
  })
}

// 创建模板（管理员）
export const createTemplate = (data) => {
  return request({
    url: '/templates',
    method: 'post',
    data
  })
}

// 更新模板（管理员）
export const updateTemplate = (id, data) => {
  return request({
    url: `/templates/${id}`,
    method: 'put',
    data
  })
}

// 删除模板（管理员）
export const deleteTemplate = (id) => {
  return request({
    url: `/templates/${id}`,
    method: 'delete'
  })
}

// 切换模板公开状态（管理员）
export const toggleTemplateVisibility = (id, isPublic) => {
  return request({
    url: `/templates/${id}/visibility`,
    method: 'patch',
    data: { isPublic }
  })
}
