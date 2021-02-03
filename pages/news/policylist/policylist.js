// pages/news/policylist/policylist.js
let TAG = 'policylist.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityCode: '5101', // todo 暂定成都
    baseBarHeight: 0,
    tabBarHeight: 0,
    scrollHeight: 0,
    tabs: [{
        name: '购房政策',
        pageIndex: 0,
        refreshTrigger: false,
        showLoad: false,
        isLoad: true,
      },
      {
        name: '升学政策',
        pageIndex: 0,
        refreshTrigger: false,
        showLoad: false,
        isLoad: true,
      }
    ],
    currentIndex: 0,
    houseData: [],
    schoolData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this

    wx.createSelectorQuery()
      .in(that)
      .select('#basebar')
      .boundingClientRect()
      .exec(function (res) {
        var basebarHeight = res[0].height * app.globalData.pixelRatio
        let tabBarHeight = that.data.tabBarHeight
        that.setData({
          scrollHeight: app.globalData.screenHeight - basebarHeight - tabBarHeight,
          basebarHeight: basebarHeight
        })
      })

    wx.createSelectorQuery()
      .in(that)
      .select('#tabbar')
      .boundingClientRect()
      .exec(function (res) {
        var tabBarHeight = res[0].height * app.globalData.pixelRatio
        var basebarHeight = that.data.baseBarHeight
        that.setData({
          scrollHeight: app.globalData.screenHeight - basebarHeight - tabBarHeight,
          tabBarHeight: tabBarHeight
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

  tapOnTab(event) {
    let index = event.currentTarget.dataset.index
    console.log('tapOnTab index ' + index)
    this.setData({
      currentIndex: index
    })

    var pageData = index == 0 ? this.data.houseData : this.data.schoolData
    if (pageData.length == 0 && this.data.tabs[index].pageIndex == 0) {
      this.data.currentIndex = index
      this.refreshLoadPage()
    }
  },

  triggerRefresh(event) {

    console.log('triggerRefresh ' + this.data.refreshTrigger)

    if (this.data.refreshTrigger) {
      return
    }

    this.data.pageIndex = 0

    this.refreshLoadPage()
  },

  obtainCurrentTab() {
    return this.data.tabs[this.data.currentIndex]
  },

  onScrolllower(event) {

    console.log('onScrolllower')

    let tabs = this.data.tabs
    let tabData = tabs[this.data.currentIndex]
    let showLoad = tabData.showLoad
    let pageIndex = tabData.pageIndex

    if (showLoad) {
      return
    }

    this.data.tabs[this.data.currentIndex].pageIndex = pageIndex + 1
    tabData.showLoad = true

    this.setData({
      tabs: tabs
    })

    this.refreshLoadPage()
  },

  refreshLoadPage() {

    let that = this
    let tabs = this.data.tabs
    let index = this.data.currentIndex
    let tabData = tabs[index]
    var type = index
    var pageIndex = tabData.pageIndex
    var pageSize = 20
    var pageData = index == 0 ? this.data.houseData : this.data.schoolData
    var cityCode = this.data.cityCode

    if (pageIndex == 0) {
      pageData = []
      tabs[index].isLoad = true
      this.setData({
        tabs: tabs
      })
    }

    wx.request({
      url: app.globalData.baseUrl + '/news/getCityPolicies',
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
              tabs[that.data.currentIndex].isLoad = false
              that.setData({
                tabs: tabs
              })
            }

            return
          }

          for (var i = 0; i < res.data.data.length; i++) {
            var item = res.data.data[i]
            item.showTime = item.news.publish_time.split(' ')[0]
          }

          pageData = pageData.concat(res.data.data)
          if (index == 0) {
            that.setData({
              houseData: pageData
            })
          } else {
            that.setData({
              schoolData: pageData
            })
          }
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

        tabData.showLoad = false
        tabData.refreshTrigger = false

        that.setData({
          tabs: tabs
        })
      }
    })

  },

  tapItem(event) {
    let index = event.currentTarget.dataset.index
    console.log('tapItem index ' + index)
    var pageData = this.data.currentIndex == 0 ? this.data.houseData : this.data.schoolData
    var news = pageData[index].news
    var tabName = this.data.tabs[this.data.currentIndex].name

    wx.navigateTo({
      url: '/pages/news/detail/detail?newsId=' + news.id + '&title=' + tabName,
      success: function (res) {

      },
      fail(res) {
        console.error(TAG + ' tapItem navigateTo fail ' + res.errMsg)
      }
    })
  }
})