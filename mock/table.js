import Mock from 'mockjs'

export default {
  list: () => {
    const items = Mock.mock({
      'items|10': [{
        id: '@integer(1, 20)',
        appId: '@integer(1, 20)',
        mother_name:'@sentence(1,3)',
        channel_name:'@sentence(1,3)',
        channel_sdk_name:'@sentence(1,3)',
        channel_param_name:'@sentence(1,3)',
        certificate_name:'@sentence(1,3)',
        icon_name:'@sentence(1,3)',
        baleId:'@integer(60, 90)',
        bale_time:'@datetime',
        system_type:'@boolean()',

        title: '@sentence(1,3)',
        'status|1': ['success', 'fail', 'processing'],
        author: 'name',
        appKey: "a134abcb-2b72-4662-8d79-f4ab92e95b0e",
        appSecret: "a134abcb-2b72-4662-8d79-f4ab92e95b0e",
        screen:"@boolean()",
        display_time: '@datetime',
        total: '@integer(300, 5000)',
        pageviews: '@integer(100, 500)',
        txt: '@sentence(1,6)',
        // 



      }]
    })
    return {
      code: 20000,
      data: items
    }
  }
}
