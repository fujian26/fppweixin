// pages/house/search/inner/inner.js
let tag = 'pages/house/search/inner/inner.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityCode: '5101', //todo 暂定成都
    cityName: '成都', //todo 暂定成都
    hint: '请输入要查询的房源',
    currentIndex: 0,
    houses: [],
    communities: [],
    pageIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let hint = options.hint
    let currentIndex = options.currentIndex
    console.log(tag + ' onLoad, hint: ' + hint + ', currentIndex: ' + currentIndex)
    this.setData({
      hint: hint,
      currentIndex: currentIndex
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

  doSearch(event) {
    let value = event.detail.value
    let currentIndex = this.data.currentIndex
    console.log(tag + ' doSearch value: ' + value)

    if (currentIndex == 0) {
      this.searchHouses(value)
    } else {
      this.searchCommunities(value)
    }
  },

  searchHouses(content) {

    let pageIndex = this.data.pageIndex
    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/searchHouse',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "content": content,
        "pageIndex": pageIndex,
        "pageSize": 100
      },
      success(res) {
        if (res.data.code != 0) {
          console.error(tag + ' searchHouses ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        if (res.data.data == null) {
          console.error(tag + ' searchHouses res.data.data == null')
          wx.showToast({
            title: '数据错误',
          })
          return
        }

        that.setData({
          houses: res.data.data
        })
      },
      fail(res) {
        console.error(tag + ' searchHouses ' + res.errMsg)
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

  searchCommunities(content) {

    let pageIndex = this.data.pageIndex
    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/searchCommunity',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "content": content,
        "pageIndex": pageIndex,
        "pageSize": 100
      },
      success(res) {
        if (res.data.code != 0) {
          console.error(tag + ' searchCommunities ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        if (res.data.data == null) {
          console.error(tag + ' searchCommunities res.data.data == null')
          wx.showToast({
            title: '数据错误',
          })
          return
        }

        that.setData({
          communities: res.data.data
        })
      },
      fail(res) {
        console.error(tag + ' searchCommunities ' + res.errMsg)
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
  }
})