// pages/house/detail/detail.js
let tag = 'pages/house/detail/detail.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '二手房源详情',
    house: null,
    community: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initHouse()
  },

  initHouse() {

    let that = this
    var title = this.data.title

    wx.getStorage({
      key: 'house',
      success(res) {

        var house = res.data
        var community = house.community

        if (house.source_type == 1) {
          title = '法拍房房源详情'
        }

        var streetName = community.street_name != null && community.street_name.length > 0 ? ('-' + community.street_name) : ''
        var locationStr = community.city_name + '-' + community.area_name + streetName

        console.log('house name ' + house.name)

        that.setData({
          house: house,
          community: community,
          locationStr: locationStr
        })
      },
      fail(res) {
        console.error(tag + ' initHouse fail res: ' + res.errMsg)
      }
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

  tapSwiper(event) {
    console.log(tag + ' tapSwiper')
  },

  tapAddr(event) {

    let community = this.data.community
    console.log('tapAddr, lng: ' + community.lng + ', lat: ' + community.lat)

    wx.navigateTo({
      url: '/pages/map/show/show?lng=' + community.lng + '&lat=' + community.lat,
      success: function (res) {

      },
      fail(res) {
        console.error(tag + ' tapAddr fail ' + res.errMsg)
      }
    })
  },
})