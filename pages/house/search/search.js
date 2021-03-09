// pages/house/search/search.js
let tag = 'pages/house/search/search.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basebarHeight: 0,
    cityCode: '5101', //todo 暂定成都
    cityName: '成都', //todo 暂定成都
    tabs: [{
        name: '房源',
        pageIndex: 0,
      },
      {
        name: "小区",
        pageIndex: 0,
      },
    ],
    currentIndex: 0,
    selectArea: null,
    selectRoomType: null,
    selectPrice: null,
    selectMore: null,
    showFilters: false,
    filterIndex: 0,
    houses: [],
    housePageIndex: 0,
    communities: [],
    communityPageIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    setTimeout(() => {

      let that = this

      let index = options.index
      console.log(tag + ' onLoad index: ' + index)
      if (index != undefined) {
        this.data.currentIndex = index
        this.refreshDataFromTab()
        this.setData({
          currentIndex: index
        })
      }

      wx.createSelectorQuery()
        .in(that)
        .select('#basebar')
        .boundingClientRect()
        .exec(function (res) {
          console.log(tag + ' createSelectorQuery res ' + res[0].height) // unit is px
          var basebarHeight = res[0].height * app.globalData.pixelRatio
          that.setData({
            basebarHeight: basebarHeight
          })
        })

    }, 100)

    this.refreshData()
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

    wx.removeStorage({
      key: 'areas',
    })

    wx.removeStorage({
      key: 'streets',
    })

    wx.removeStorage({
      key: 'selectArea',
    })

    wx.removeStorage({
      key: 'selectRoomType',
    })

    wx.removeStorage({
      key: 'selectPrice',
    })

    wx.removeStorage({
      key: 'selectMore',
    })
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

  tapTab(event) {
    let index = event.currentTarget.dataset.index
    console.log('tapTab index: ' + index)

    this.data.currentIndex = index
    this.refreshDataFromTab()
    this.setData({
      currentIndex: index
    })
  },

  tapFilterArea(event) {
    console.log('tapFilterArea')
    this.setData({
      showFilters: true,
      filterIndex: 0
    })
  },

  tapFilterRoomType(event) {
    console.log('tapFilterRoomType')
    this.setData({
      showFilters: true,
      filterIndex: 1
    })
  },

  tapFilterPrice(event) {
    console.log('tapFilterPrice')
    this.setData({
      showFilters: true,
      filterIndex: 2
    })
  },

  tapFilterMore(event) {
    console.log('tapFilterMore')
    this.setData({
      showFilters: true,
      filterIndex: 3
    })
  },

  onFilterConfirmed(event) {
    let type = event.detail.type
    let that = this
    console.log(tag + ' onFilterConfirmed type: ' + type)

    this.setData({
      showFilters: false
    })

    switch (type) {
      case 0: // 区域
        wx.getStorage({
          key: 'selectArea',
          success(res) {
            that.data.selectArea = res.data
            that.setData({
              selectArea: res.data
            })
            that.refreshDataFromFilter()
          },
          fail(res) {
            console.error('onFilterConfirmed fail: ' + res.errMsg)
          }
        })
        break
      case 1: // 户型
        wx.getStorage({
          key: 'selectRoomType',
          success(res) {
            that.data.selectRoomType = res.data
            that.setData({
              selectRoomType: res.data
            })
            that.refreshDataFromFilter()
          },
          fail(res) {
            console.error('onFilterConfirmed fail: ' + res.errMsg)
          }
        })
        break
      case 2: // 总价
        wx.getStorage({
          key: 'selectPrice',
          success(res) {
            that.data.selectPrice = res.data
            that.setData({
              selectPrice: res.data
            })
            that.refreshDataFromFilter()
          },
          fail(res) {
            console.error('onFilterConfirmed fail: ' + res.errMsg)
          }
        })
        break
      case 3: // 更多
        wx.getStorage({
          key: 'selectMore',
          success(res) {
            that.data.selectMore = res.data
            that.setData({
              selectMore: res.data
            })
            that.refreshDataFromFilter()
          },
          fail(res) {
            console.error('onFilterConfirmed fail: ' + res.errMsg)
          }
        })
        break
      default:
        console.error('onFilterConfirmed unsupport type: ' + type)
        break
    }
  },

  refreshDataFromFilter() {

    let currentIndex = this.data.currentIndex

    if (currentIndex == 0) {
      this.data.housePageIndex = 0
      this.getHouses()
    } else {
      this.data.communityPageIndex = 0
      this.getCommunities()
    }
  },

  refreshData() {
    let currentIndex = this.data.currentIndex

    if (currentIndex == 0) {
      this.getHouses()
    } else {
      this.getCommunities()
    }
  },

  refreshDataFromTab() {
    this.refreshDataFromFilter()
  },

  getHouses() {

    let cityCode = this.data.cityCode
    let selectArea = this.data.selectArea
    let selectRoomType = this.data.selectRoomType
    let selectPrice = this.data.selectPrice
    let selectMore = this.data.selectMore
    let housePageIndex = this.data.housePageIndex
    var houses = this.data.houses
    let that = this

    var areaCode = ''
    var streetCode = ''
    var streetCode = ''
    var roomNum = -1
    var startPrice = -1
    var endPrice = -1
    var startSquare = -1
    var endSquare = -1
    var toward = ''

    if (selectArea != null) {

      if (selectArea.area != null && selectArea.area.code != 0) {
        areaCode = selectArea.area.code
      }

      if (selectArea.street != null && selectArea.street.code != 0) {
        streetCode = selectArea.street.code
      }
    }

    if (selectRoomType != null) {
      roomNum = selectRoomType.num
    }

    if (selectPrice != null) {
      startPrice = selectPrice.startPrice
      endPrice = selectPrice.endPrice
    }

    if (selectMore != null) {
      if (selectMore.square != null) {
        startSquare = selectMore.square.start
        endSquare = selectMore.square.end
      }

      if (selectMore.toward != null) {
        toward = selectMore.toward
      }
    }

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/getHouseList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        'cityCode': cityCode,
        'areaCode': areaCode,
        'streetCode': streetCode,
        'roomNum': roomNum,
        'startPrice': startPrice,
        'endPrice': endPrice,
        'startSquare': startSquare,
        'endSquare': endSquare,
        'toward': toward,
        'pageIndex': housePageIndex,
        'pageSize': 20
      },
      success(res) {
        if (res.data.code != 0) {
          console.error(tag + ' getHouses ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        if (res.data.data == null) {
          console.error(tag + ' getHouses res.data.data == null')
          wx.showToast({
            title: '数据错误',
            icon: 'none'
          })
          return
        }

        if (housePageIndex == 0) {
          houses = res.data.data
        } else {
          houses = houses.concat(res.data.data)
        }
        that.setData({
          houses: houses,
          housePageIndex: housePageIndex + 1
        })
      },
      fail(res) {
        console.error(tag + ' getHouses ' + res.errMsg)
        wx.showToast({
          title: '数据错误: ' + res.errMsg,
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

  getCommunities() {

    let cityCode = this.data.cityCode
    let selectArea = this.data.selectArea
    let communityPageIndex = this.data.communityPageIndex
    var communities = this.data.communities
    let that = this

    var areaCode = ''
    var streetCode = ''
    var streetCode = ''

    if (selectArea != null) {

      if (selectArea.area != null && selectArea.area.code != 0) {
        areaCode = selectArea.area.code
      }

      if (selectArea.street != null && selectArea.street.code != 0) {
        streetCode = selectArea.street.code
      }
    }

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/getCommunityList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        'cityCode': cityCode,
        'areaCode': areaCode,
        'streetCode': streetCode,
        'pageIndex': communityPageIndex,
        'pageSize': 20
      },
      success(res) {
        if (res.data.code != 0) {
          console.error(tag + ' getCommunities ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        if (res.data.data == null) {
          console.error(tag + ' getCommunities res.data.data == null')
          wx.showToast({
            title: '数据错误',
            icon: 'none'
          })
          return
        }

        if (communityPageIndex == 0) {
          communities = res.data.data
        } else {
          communities = communities.concat(res.data.data)
        }
        that.setData({
          communities: communities,
          communityPageIndex: communityPageIndex + 1
        })
      },
      fail(res) {
        console.error(tag + ' getCommunities ' + res.errMsg)
        wx.showToast({
          title: '数据错误: ' + res.errMsg,
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
    let currentIndex = this.data.currentIndex
    var hint = '请输入要查询的房源'
    if (currentIndex == 1) {
      hint = '请输入要查询的小区'
    }
    wx.navigateTo({
      url: '/pages/house/search/inner/inner?hint=' + hint + '&currentIndex=' + currentIndex,
      success(res) {

      },
      fail(res) {
        console.error('tapSearch ' + res.errMsg)
      }
    })
  }
})