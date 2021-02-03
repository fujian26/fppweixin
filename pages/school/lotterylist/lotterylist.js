// pages/school/lotterylist/lotterylist.js
let app = getApp()
let TAG = 'lotterylist.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityCode: '5101', // todo 暂定成都
    title: '',
    tabbarHeight: 0,
    scrollHeight: 0,
    type: 0,
    refreshTrigger: false,
    pageIndex: 0,
    pageSize: 20,
    showLoad: false,
    isLoad: true,
    pageData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let type = options.type
    console.log(TAG + ' onLoad type ' + type)
    this.setData({
      title: options.title,
      type: type
    })

    let that = this

    wx.createSelectorQuery()
      .in(that)
      .select('#basebar')
      .boundingClientRect()
      .exec(function (res) {
        console.log(TAG + ' createSelectorQuery res ' + res[0].height) // unit is px
        var basebarHeight = res[0].height * app.globalData.pixelRatio
        that.setData({
          scrollHeight: app.globalData.screenHeight - basebarHeight
        })
      })

    this.refreshLoadPage()
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

  triggerRefresh(event) {

    if (this.data.refreshTrigger) {
      return
    }

    this.data.pageIndex = 0

    this.refreshLoadPage()
  },

  onScrolllower(event) {

    console.log('onScrolllower')

    let showLoad = this.data.showLoad
    let pageIndex = this.data.pageIndex

    if (showLoad) {
      return
    }

    this.data.pageIndex = pageIndex + 1

    this.setData({
      showLoad: true
    })


    this.refreshLoadPage()
  },

  refreshLoadPage() {

    let that = this
    var type = this.data.type
    var pageIndex = this.data.pageIndex
    var pageSize = this.data.pageSize
    var pageData = this.data.pageData
    var cityCode = this.data.cityCode

    if (pageIndex == 0) {
      pageData = []
    }

    wx.request({
      url: app.globalData.baseUrl + '/school/getCityLotterys',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        cityCode: cityCode,
        type: type,
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      success(res) {
        if (res.data.code != 0) {
          console.error(TAG + ' refreshLoadPage success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '获取数据失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          if (res.data.data == null || res.data.data.length == 0) {

            console.error(TAG + ' refreshLoadPage res.data.data == null || lenth == 0')

            if (pageIndex == 0) {
              wx.showModal({
                title: '提示',
                content: '没有数据',
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack()
                  } else if (res.cancel) {
                    wx.navigateBack()
                  }
                }
              })
            }

            if (pageIndex > 0) {
              that.setData({
                isLoad: false
              })
            }

            return
          }

          for (var i = 0; i < res.data.data.length; i++) {
            var item = res.data.data[i]
            item.showTime = item.publish_time.split(' ')[0]
          }

          pageData = pageData.concat(res.data.data)
          that.setData({
            pageData: pageData
          })
        }
      },
      fail(res) {
        console.error('refreshLoadPage fail res ' + res.errMsg)
        wx.showToast({
          title: '获取数据失败 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {
        that.setData({
          showLoad: false,
          refreshTrigger: false
        })
      }
    })

  },

  tapItem(event) {
    let index = event.currentTarget.dataset.index
    console.log('tapItem index ' + index)
  },
})