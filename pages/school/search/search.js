// pages/school/search/search.js
let app = getApp()
let pageSize = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: '',
    currentIndex: 0,
    adData: null,
    pageHeight: app.globalData.screenHeight * 0.6,
    tabs: [{
        id: 1,
        name: '推荐',
        pageIndex: 0,
        type: 100
      },
      {
        id: 2,
        name: '热门',
        pageIndex: 0,
        type: 101
      },
      {
        id: 3,
        name: '幼儿园',
        pageIndex: 0,
        type: 0
      },
      {
        id: 4,
        name: '小学',
        pageIndex: 0,
        type: 1
      },
      {
        id: 5,
        name: '中学',
        pageIndex: 0,
        type: 2
      },
      {
        id: 6,
        name: '培训机构',
        pageIndex: 0,
        type: 3
      }
    ],
    recommonds: [], // 推荐
    hots: [], // 热门
    kindergartens: [], // 幼儿园
    primarys: [], // 小学
    middles: [], // 中学
    trainings: [], // 培训机构    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      location: '成都'
    })
    this.switchPageData(false)
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
    this.switchPageData(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tapOnTab(event) {
    let index = event.currentTarget.dataset.index
    console.log('tapOnTab index: ' + index)
    this.data.currentTarget = index
    this.setData({
      currentIndex: index
    })

    this.switchPageData(true)
  },

  switchPageData(fromTab) {

    let index = this.data.currentIndex
    let tabs = this.data.tabs
    let tabData = this.data.tabs[index]
    var pageData = null
    switch (index) {
      case 0:
        pageData = this.data.recommonds
        break
      case 1:
        pageData = this.data.hots
        break
      case 2:
        pageData = this.data.kindergartens
        break
      case 3:
        pageData = this.data.primarys
        break
      case 4:
        pageData = this.data.middles
        break
      case 5:
        pageData = this.data.trainings
        break
    }

    console.log('pageData.length ' + pageData.length)

    if (fromTab && pageData.length == 0) {
      this.refreshLoadPage(tabs, tabData, pageData)
    } else if (!fromTab) {
      this.refreshLoadPage(tabs, tabData, pageData)
    }
  },

  refreshLoadPage(tabs, tabData, pageData) {

    let that = this
    var showLoading = tabData.pageIndex

    if (tabData.pageIndex == 0) {
      pageData = []
    }

    if (showLoading) {
      wx.showLoading({
        title: '',
      })
    }

    wx.request({
      url: app.globalData.baseUrl + '/school/getSchoolList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      // 成都 lng 103.92377 lat 30.57447
      data: {
        type: tabData.type,
        pageIndex: tabData.pageIndex,
        pageSize: 20,
        lng: app.globalData.lng,
        lat: app.globalData.lat
      },
      success(res) {
        if (res.data.code != 0) {
          console.error('refreshLoadPage success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '获取数据失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          var schoolExts = res.data.data
          if (schoolExts == null || schoolExts.length == 0) {
            return
          }

          tabData.pageIndex++
          that.data.tabs = tabs

          pageData = pageData.concat(schoolExts)          

          switch (tabData.id) {
            case 1:
              that.setData({
                recommonds: pageData
              })
              break
            case 2:
              that.setData({
                hots: pageData
              })
              break
            case 3:
              that.setData({
                kindergartens: pageData
              })
              break
            case 4:
              that.setData({
                primarys: pageData
              })
              break
            case 5:
              that.setData({
                middles: pageData
              })
              break
            case 6:
              that.setData({
                trainings: pageData
              })
              break
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
        if (showLoading) {
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    })

  },

  obtainPageData() {
    var pageData = null
    let index = this.data.currentIndex
    switch (index) {
      case 0:
        pageData = this.data.recommonds
        break
      case 1:
        pageData = this.data.hots
        break
      case 2:
        pageData = this.data.kindergartens
        break
      case 3:
        pageData = this.data.primarys
        break
      case 4:
        pageData = this.data.middles
        break
      case 5:
        pageData = this.data.trainings
        break
    }

    return pageData
  },

  tapSchoolItem(event) {
    var index = event.currentTarget.dataset.index
    console.log('tapSchoolItem index ' + index)

    let pageData = this.obtainPageData()
    if (pageData == null || pageData.length <= index) {
      console.error('tapSchoolItem error pageData == null || pageData.length <= index')
      return
    }

    wx.setStorage({
      data: pageData[index],
      key: 'schoolExt',
      success(res) {
        wx.navigateTo({
          url: '/pages/school/detail/detail',
          fail(res) {
            console.log('search.js navigateTo school detail fail ' + res.errMsg)
          }
        })
      },
      fail(res) {
        console.log('search.js setStorage school fail ' + res.errMsg)
      }
    })
  },

  tapAd(event) {
    let adData = this.data.adData
    if (adData == null || adData.school_id == null) {
      return
    }

    wx.showLoading({
      title: '正在加载...',
    })

    wx.request({
      url: app.globalData.baseUrl + '/school/getDetail',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        id: adData.school_id
      },
      success(res) {
        console.log('tapAd success')
        if (res.data.code != 0) {
          console.error('tapAd success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          var schoolExt = res.data.data
          if (schoolExt == null) {
            console.error('tapAd schoolExt == null')
            wx.showToast({
              title: '数据错误',
              icon: 'none'
            })
            return
          }

          wx.setStorage({
            data: schoolExt,
            key: 'schoolExt',
            success(res) {
              wx.navigateTo({
                url: '/pages/school/detail/detail',
                fail(res) {
                  wx.showToast({
                    title: '操作失败',
                    icon: 'none'
                  })
                  console.error('search.js tapAd navigateTo school detail fail ' + res.errMsg)
                }
              })
            },
            fail(res) {
              wx.showToast({
                title: '操作失败',
                icon: 'none'
              })
              console.error('search.js tapAd setStorage school fail ' + res.errMsg)
            }
          })
        }
      },
      fail(res) {
        console.log('tapAd fail res ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading()
      }
    })
  },

  tapSearch(event) {
    console.log('tapSearch')
    wx.navigateTo({
      url: '/pages/school/search/inner/inner',
      fail(res) {
        console.error('navigate to inner error ' + res.errMsg)
      }
    })
  }
})