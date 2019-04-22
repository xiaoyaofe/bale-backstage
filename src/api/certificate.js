import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/certificate/list',
    method: 'get',
    params
  })
}
