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
    recommonds: [], // 推荐
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