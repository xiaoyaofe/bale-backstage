import Mock from 'mockjs'

export default {
  list: () => {
    const items = Mock.mock({
      'items|5': [{
        id: '@integer(1, 20)',
        appId: '@integer(1000, 2000)',
        certificate_name: '@sentence(1,3)',
        alias: "@sentence(2,3)",
        alias_password: "a134abcb",
        certificate_password: 'published',
      }]
    })
    return {
      code: 20000,
      data: items
    }
  }
}
