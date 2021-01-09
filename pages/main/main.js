// pages/main/main.js
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb.img.youboy.com%2F20107%2F29%2Fg3_4622251.jpg&refer=http%3A%2F%2Fb.img.youboy.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=b2a876a23f89b82fecbeb8415b1d1f14'
    }, {
      id: 1,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51sxue.com%2Fupload21%2F5560%2F201409091405596533.jpg&refer=http%3A%2F%2Fimg.51sxue.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=130f1249ccab380b3d9f56f6170cf2b1',
    }, {
      id: 2,
      url: 'https://ss3.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/baike/pic/item/d52a2834349b033b7d2ded8e1ece36d3d539bd38.jpg'
    }, {
      id: 3,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp2.qhimg.com%2Ft012f6e40ab82d08ccf.jpg&refer=http%3A%2F%2Fp2.qhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=93a94f4dfab895c6b44b2d27a8cbe0b2'
    }, {
      id: 4,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.lemeitu.com%2Fm00%2F28%2F0f%2F828f54a3a15598702288f3803ba4b86d__w.jpg&refer=http%3A%2F%2Fimg.lemeitu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=684a328363a937e57104fcec03c6d380'
    }, {
      id: 5,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.med66.com%2Fupload%2Fhtml%2F2015%2F02%2Fqm100393.jpg&refer=http%3A%2F%2Fwww.med66.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=95a3efebda30c4b29e91762ac050b257'
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapSwiper(event) {
      console.log('tapSwiper event ' + event.currentTarget.dataset.id)
    }
  }
})