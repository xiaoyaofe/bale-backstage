import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/mother/list',
    method: 'get',
    params
  })
}
