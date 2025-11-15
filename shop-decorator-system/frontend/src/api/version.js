import request from '../utils/request'

// 获取设计的版本历史列表
export const getVersions = (designId) => {
  return request({
    url: `/designs/${designId}/versions`,
    method: 'get'
  })
}

// 获取指定版本的详细内容
export const getVersionDetail = (versionId) => {
  return request({
    url: `/versions/${versionId}`,
    method: 'get'
  })
}

// 手动创建版本
export const createVersion = (designId, data) => {
  return request({
    url: `/designs/${designId}/versions`,
    method: 'post',
    data
  })
}

// 恢复到指定版本
export const restoreVersion = (versionId) => {
  return request({
    url: `/versions/${versionId}/restore`,
    method: 'post'
  })
}

// 删除版本
export const deleteVersion = (versionId) => {
  return request({
    url: `/versions/${versionId}`,
    method: 'delete'
  })
}
