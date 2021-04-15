// pages/news/settle/settle.js
let app = getApp()
let TAG = 'news-settle.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBottom: false,
    html: '',
    scrollHeight: 0,
    cityCode: '',
    policies: null,
    currentPolicy: null,
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.cityCode = options.cityCode

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

    this.getPolicies(options.cityCode)
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

  tapShowBottom(event) {
    this.setData({
      showBottom: true
    })
  },

  tapHideBottom(event) {
    this.setData({
      showBottom: false
    })
  },

  getPolicies(cityCode) {

    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/news/getSettlePolicyCity',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        cityCode: cityCode
      },
      success(res) {
        console.log(TAG + ' getPolicies success')
        if (res.data.code != 0) {
          console.error(TAG + ' getPolicies success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {
          var policies = res.data.data
          if (policies == null || policies.length == 0) {
            console.error(TAG + ' getPolicies policies == null || policies.length == 0')
            wx.showToast({
              title: '暂无数据',
              icon: 'none'
            })
            return
          }

          console.log('policies.length ' + policies.length)

          if (policies.length > 1) {
            setTimeout(() => {
              that.setData({
                showBottom: true
              })
            }, 500);
          }

          that.switchPolicy(0, policies[0])
          that.setData({
            policies: policies
          })
        }
      },
      fail(res) {
        console.error(TAG + ' getPolicies fail res ' + res.errMsg)
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

  switchPolicy(index, policy) {

    this.setData({
      currentPolicy: policy,
      currentIndex: index
    })

    let that = this

    wx.request({
      url: policy.news.file_path,
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          html: res.data
        })
        that.addWatchNum(policy.news_id)
      },
      fail(res) {
        wx.showToast({
          title: '数据错误',
          icon: ''
        })
        console.error(TAG + ' switchPolicy fail ' + res.errMsg)
      }
    })

  },

  tapPolicyItem(event) {
    let index = event.currentTarget.dataset.index
    console.log('tapPolicyItem index: ' + index)
    this.setData({
      showBottom: false
    })
    this.switchPolicy(index, this.data.policies[index])
  },

  addWatchNum(newsId) {

    let that = this

    console.log('addWatchNum ' + newsId)

    wx.request({
      url: app.globalData.baseUrl + '/news/addWatchNum',
      data: {
        newsId: newsId
      },
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('addWatchNum code ' + res.data.code)
      },
      fail(res) {
        console.error(TAG + ' addWatchNum fail ' + res.errMsg)
      }
    })

  },

  tapSwitch(event) {
    console.log('tapSwitch')
    this.setData({
      showBottom: true
    })
  }
})