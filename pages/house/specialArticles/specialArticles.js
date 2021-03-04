// pages/house/specialArticles/specialArticles.js
let tag = 'pages/house/specialArticles/specialArticles.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    type: 0, // 0-普通房 1-法拍房
    tabs: [],
    currentIndex: 0,
    htmlUrls: [],
    htmlContents: ['', '', ''],
    htmlContent: '',
    cityCode: '5101', //todo 暂时定为成都
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let type = options.type
    let currentIndex = options.index
    var title = ''
    var tabs = []

    console.log(tag + ' onLoad type: ' + type + ', currentIndex: ' + currentIndex)

    if (type == 0) {
      tabs = [
        '购房按揭', '办理流程', '购房税费'
      ]
      title = '房产解读'
    } else {
      tabs = [
        '政策解读', '法拍流程', '法拍费用'
      ]
      title = '法拍解读'
    }

    this.data.currentIndex = currentIndex
    this.setData({
      title: title,
      tabs: tabs,
      type: type,
      currentIndex: currentIndex
    })

    this.loadDatas()
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

  loadDatas() {

    let that = this
    let cityCode = this.data.cityCode
    let type = this.data.type
    let currentIndex = this.data.currentIndex
    let htmlContents = this.data.htmlContents

    if (htmlContents[currentIndex] != null && htmlContents[currentIndex].length > 0) {
      this.setData({
        htmlContent: htmlContents[currentIndex]
      })
      return
    }

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/getCitySpecialArticle',
      method: 'GET',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "cityCode": cityCode,
        "type": -1
      },
      success(res) {
        console.log(tag + ' loadDatas success')
        if (res.data.code != 0) {
          console.error(tag + ' loadDatas success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          var articles = res.data.data
          var htmlUrls = []
          for (var i = 0; i < articles.length; i++) {
            var item = articles[i]
            if (type == 0) {
              if (item.type >= 0 && item.type <= 2) {
                htmlUrls.push(item.news.file_path)
              }
            } else {
              if (item.type > 2) {
                htmlUrls.push(item.news.file_path)
              }
            }
          }

          that.data.htmlUrls = htmlUrls
          that.getHtmlContent(currentIndex, htmlUrls[currentIndex])
        }
      },
      fail(res) {
        console.error(tag + ' loadDatas fail res ' + res.errMsg)
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

  getHtmlContent(index, url) {

    let that = this
    var htmlContents = this.data.htmlContents

    wx.request({
      url: url,
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      success(res) {
        htmlContents[index] = res.data
        that.setData({
          htmlContents: htmlContents,
          htmlContent: htmlContents[index]
        })
      },
      fail(res) {
        wx.showToast({
          title: '数据错误',
          icon: ''
        })
        console.error(tag + ' getHtmlContent fail ' + res.errMsg)
      }
    })
  },

  tapTab(event) {
    let index = event.currentTarget.dataset.index    
    console.log('tapTab index: ' + index)

    this.data.currentIndex = index
    this.loadDatas()

    this.setData({
      currentIndex: index
    })
  }
})