import request from '@/utils/request'

// 上传单个文件
export const uploadSingle = (file, type = 'images') => {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: `/upload/single?type=${type}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传多个文件
export const uploadMultiple = (files, type = 'images') => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })

  return request({
    url: `/upload/multiple?type=${type}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除文件
export const deleteFile = (filename, type = 'images') => {
  return request({
    url: '/upload/file',
    method: 'delete',
    data: { filename, type }
  })
}

// 获取图片列表
export const getImages = (type = 'images') => {
  return request({
    url: '/upload/images',
    method: 'get',
    params: { type }
  })
}
