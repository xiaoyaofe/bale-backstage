import Mock from 'mockjs'

export default {
  list: () => {
    const items = Mock.mock({
      'items|10': [{
        id: '@integer(1, 20)',
        appId: '@integer(1000, 2000)',
        'status|1': ['published', 'draft', 'deleted'],
        version_name: '1.12.10',
        version_number: "@integer(10, 50)",
        version_note:"@sentence(1,3)",
        mother_name: "api1.12.10",
        mother_type:"@boolean()",
        display_time: '@datetime',
      }]
    })
    return {
      code: 20000,
      data: items
    }
  }
}
