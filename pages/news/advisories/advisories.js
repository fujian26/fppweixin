// pages/news/advisories/advisories.js
let tag = 'pages/news/advisories/advisories.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityCode: '5101', //todo 暂定成都
    cityName: '成都', //todo 暂定成都
    tabs: [{
        name: '推荐',
        type: 100,
        pageIndex: 0,
        items: []
      },
      {
        name: "新闻",
        type: -1,
        pageIndex: 0,
        items: []
      },
      {
        name: "教学",
        type: 0,
        pageIndex: 0,
        items: []
      },
      {
        name: "楼市",
        type: 1,
        pageIndex: 0,
        items: []
      },
    ],
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDatas(this.data.currentIndex)
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
    console.log('onReachBottom')
    this.loadDatas(this.data.currentIndex)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tapTab(event) {
    let index = event.currentTarget.dataset.index
    console.log('tapTab index: ' + index)
    this.data.currentIndex = index
    this.setData({
      currentIndex: index
    })
    this.loadDatas(index)
  },

  loadDatas(index) {

    let that = this
    let cityCode = this.data.cityCode
    let tabs = this.data.tabs

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/news/getAdvisoryList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        'cityCode': cityCode,
        'type': tabs[index].type,
        'pageIndex': tabs[index].pageIndex,
        'pageSize': 50
      },
      success(res) {

        if (res.data.code != 0) {
          console.error(tag + ' loadDatas res.data.code != 0, error: ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        console.log(tag + ' loadDatas res.data.data.length: ' + res.data.data.length +
          ', pageIndex: ' + tabs[index].pageIndex)

        if (res.data.data.length == 0) {
          if (tabs[index].pageIndex == 0) {
            wx.showToast({
              title: '没有数据',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '没有数据了',
              icon: 'none'
            })
          }
          return
        }

        var items = tabs[index].items
        if (tabs[index].pageIndex == 0) {
          items = res.data.data
        } else {
          items = items.concat(res.data.data)
        }

        tabs[index].items = items
        tabs[index].pageIndex = tabs[index].pageIndex + 1

        that.setData({
          tabs: tabs
        })
      },
      fail(res) {
        console.error(tag + ' loadDatas fail ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  tapSearch(event) {
    console.log('tapSearch')
    wx.navigateTo({
      url: '/pages/news/advisories/inner/inner',
      fail(res) {
        console.error(tag + ' navigate inner fail: ' + res.errMsg)
      }
    })
  }
})