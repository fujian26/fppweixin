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
    searchMode: false,
    searchContent: '', // 搜索的输入内容
    tabs: [{
        id: 1,
        name: '推荐',
        pageIndex: 0,
        type: 100,
        refreshTrigger: false,
        isLoad: true,
        showLoad: false,
      },
      {
        id: 2,
        name: '热门',
        pageIndex: 0,
        type: 101,
        refreshTrigger: false,
        isLoad: true,
        showLoad: false,
      },
      {
        id: 3,
        name: '幼儿园',
        pageIndex: 0,
        type: 0,
        refreshTrigger: false,
        isLoad: true,
        showLoad: false,
      },
      {
        id: 4,
        name: '小学',
        pageIndex: 0,
        type: 1,
        refreshTrigger: false,
        isLoad: true,
        showLoad: false,
      },
      {
        id: 5,
        name: '中学',
        pageIndex: 0,
        type: 2,
        refreshTrigger: false,
        isLoad: true,
        showLoad: false,
      },
      {
        id: 6,
        name: '培训机构',
        pageIndex: 0,
        type: 3,
        refreshTrigger: false,
        isLoad: true,
        showLoad: false,
      }
    ],
    recommonds: [], // 推荐
    hots: [], // 热门
    kindergartens: [], // 幼儿园
    primarys: [], // 小学
    middles: [], // 中学
    trainings: [], // 培训机构
    searchDatas: []
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
    let index = event.currentTarget.dataset.index
    console.log('tapOnTab event ' + index)
    this.setData({
      currentIndex: index
    })
    this.switchPageData(index)
  },

  switchPageData(index) {

    this.setData({
      searchMode: false
    })

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

    if (pageData.length == 0) {
      this.refreshLoadPage(tabs, tabData, pageData)
    }
  },

  reassempleSchoolExt(item) {
    item.nature = item.school.nature == 0 ? '公办' : '私办'
    item.area = item.school.city_name + item.school.area_name
    item.addr = item.school.province_name != null ? item.school.province_name : '' +
      item.school.city_name != null ? item.school.city_name : '' +
      item.school.area_name != null ? item.school.area_name : '' +
      item.street_name != null ? item.street_name : '' +
      item.detail_addr != null ? item.detail_addr : ''

    if (item.distance > 0) {
      var km = item.distance / 1000
      if (km < 1) {
        item.distanceStr = '<1km'
      } else {
        km = Math.round(km * 100) / 100
        item.distanceStr = km + 'km'
      }
    } else {
      item.distanceStr = ''
    }

    switch (item.school.type) {
      case 0:
        item.tagSrc = '/images/kindergarten-tag.png'
        break
      case 1:
        item.tagSrc = '/images/primary-school-tag.png'
        break
      case 2:
        item.tagSrc = '/images/middle-school-tag.png'
        break
      case 3:
        item.tagSrc = '/images/training-school-tag.png'
        break
    }
  },

  refreshLoadPage(tabs, tabData, pageData) {

    let that = this

    if (tabData.pageIndex == 0) {
      pageData = []
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
        lng: 103.92377,
        lat: 30.57447
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
          if (schoolExts == null) {
            return
          }

          for (var i = 0; i < schoolExts.length; i++) {
            that.reassempleSchoolExt(schoolExts[i])
          }

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
        tabData.showLoad = false
        tabData.triggerRefresh = false
        that.setData({
          tabs: tabs
        })
      }
    })

  },

  triggerRefresh(event) {

    let that = this
    let tabs = this.data.tabs
    let currentIndex = this.data.currentIndex
    let tabData = this.data.tabs[currentIndex]

    if (tabData.triggerRefresh) {
      return
    }

    this.refreshLoadPage(tabs, tabData, this.obtainPageData())

    // setTimeout(() => {
    //   tabData.triggerRefresh = false
    //   that.setData({
    //     tabs: tabs
    //   })
    // }, 1000);
  },

  triggerRestore(event) {
    console.log('triggerRestore refreshTrigger ')
  },

  triggerAbort(event) {

    let that = this
    let tabs = this.data.tabs
    let currentIndex = this.data.currentIndex
    let tabData = this.data.tabs[currentIndex]

    console.log('triggerAbort refreshTrigger ' + tabData.refreshTrigger)
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

  onScrolllower(event) {

    console.log('onScrolllower')

    let tabs = this.data.tabs
    let currentIndex = this.data.currentIndex
    let tabData = tabs[currentIndex]
    let pageData = this.obtainPageData()

    if (tabData.showLoad) {
      return
    }

    tabData.showLoad = true
    // if (pageData == null || pageData.length < pageSize) {
    //   tabData.isLoad = false
    // } else {
    //   tabData.isLoad = true
    // }

    this.setData({
      tabs: tabs
    })

    tabData.pageIndex++
    this.refreshLoadPage(tabs, tabData, pageData)
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

  // 执行搜索
  doSearch(event) {

    let content = this.data.searchContent

    if (typeof content === 'undefined' || content == null || content == '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none'
      })
      return
    }

    let that = this
    wx.showLoading()

    wx.request({
      url: app.globalData.baseUrl + '/school/blurSearch',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        keyWord: content,
        lng: app.globalData.lng,
        lat: app.globalData.lat
      },
      success(res) {
        console.log('doSearch success')
        if (res.data.code != 0) {
          console.error('doSearch success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {
          var schoolExts = res.data.data
          if (schoolExts == null || schoolExts.length == 0) {
            wx.showToast({
              title: '没有数据',
              icon: 'none'
            })
            return
          }

          for (var i = 0; i < schoolExts.length; i++) {
            that.reassempleSchoolExt(schoolExts[i])
          }

          that.setData({
            searchDatas: schoolExts
          })
        }
      },
      fail(res) {
        console.log('doSearch fail res ' + res.errMsg)
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

  // 搜索框获得焦点
  searchFocus(event) {
    this.setData({
      searchMode: true,
      searchDatas: []
    })
  },

  // 监听搜索的输入
  onSearchInput(event) {
    this.data.searchContent = event.detail.value
  },

  // 左上角返回键
  tapBack(event) {    
    if (this.data.searchMode) {
      this.setData({
        searchMode: false
      })
    } else {
      wx.navigateBack()
    }
  }
})