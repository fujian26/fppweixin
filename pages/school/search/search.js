// pages/school/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: '',
    currentIndex: 0,
    tabs: [{
        id: 1,
        name: '推荐'
      },
      {
        id: 2,
        name: '热门'
      },
      {
        id: 3,
        name: '幼儿园'
      },
      {
        id: 4,
        name: '小学'
      },
      {
        id: 5,
        name: '中学'
      },
      {
        id: 6,
        name: '培训机构'
      }
    ],
    recommonds: [
      {
        school: {
          id: 11,
          name: '金苹果中海国际社区幼儿园',
          phone: '028-87589813'
        },
        pics: [
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51sxue.com%2Fupload21%2F5560%2F201409091405596533.jpg&refer=http%3A%2F%2Fimg.51sxue.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=130f1249ccab380b3d9f56f6170cf2b1'
        ],
        nature: '私立',
        area: '成都高新区',
        addr: '成都高新区蓝岸17号',
        distanceStr: '10km',
        tagSrc: '/images/kindergarten-tag.png'      
      },
      {
        school: {
          id: 22,
          name: '金苹果中海国际社区幼儿园',
          phone: '028-87589813'
        },
        pics: [
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51sxue.com%2Fupload21%2F5560%2F201409091405596533.jpg&refer=http%3A%2F%2Fimg.51sxue.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=130f1249ccab380b3d9f56f6170cf2b1'
        ],
        nature: '私立',
        area: '成都高新区',
        addr: '成都高新区蓝岸17号',
        distanceStr: '',
        tagSrc: '/images/primary-school-tag.png'
      },
      {
        school: {
          id: 33,
          name: '金苹果中海国际社区幼儿园',
          phone: '028-87589813'
        },
        pics: [
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51sxue.com%2Fupload21%2F5560%2F201409091405596533.jpg&refer=http%3A%2F%2Fimg.51sxue.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=130f1249ccab380b3d9f56f6170cf2b1'
        ],
        nature: '私立',
        area: '成都高新区',
        addr: '成都高新区蓝岸17号',
        distanceStr: '',
        tagSrc: '/images/middle-school-tag.png'
      }      
    ], // 推荐
    hots: [], // 热门
    kindergartens: [], // 幼儿园
    primarys: [], // 小学
    middles: [], // 中学
    trainings: [] // 培训机构
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      location: '成都'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tapOnTab(event) {
    console.log('tapOnTab event ' + event.currentTarget.dataset.index)
    this.setData({
      currentIndex: event.currentTarget.dataset.index
    })
  }
})