// pages/school/lottery/lottery.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lottery: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initSchoolData()
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

  initSchoolData() {
    let that = this
    wx.getStorage({
      key: 'schoolExt',
      success(res) {        
        
        var school = res.data.school

        that.getLotteryData(school, school.city_code)
      },
      fail(res) {
        console.log('basic created fail res: ' + res.errMsg)
      }
    })
  },  

  getLotteryData(school, cityCode) {

    let that = this

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: app.globalData.baseUrl + '/school/getCityRecentLottery',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        cityCode: cityCode,
        type: school.type
      },
      success(res) {        
        if (res.data.code != 0) {
          console.error('getLotteryData success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '获取数据失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {        

          var lottery = res.data.data
          if (lottery == null) {
            lottery = {
              title: '没有数据'
            }
            wx.showToast({
              title: '没有数据',
            })
          }

          that.setData({
            lottery: lottery         
          })
        }
      },
      fail(res) {
        console.error('getRecruitData fail res ' + res.errMsg)
        wx.showToast({
          title: '获取数据失败 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading()
      }
    })

  }
})