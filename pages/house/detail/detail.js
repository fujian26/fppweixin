// pages/house/detail/detail.js
let tag = 'pages/house/detail/detail.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '二手房源详情',
    house: null,
    community: null,
    showAddTime: '',
    recommendTags: [
      '同小区房源',
      '周边房源',
      '划片小区'
    ],
    commentNum: 0,
    attentioned: false,
    houseLegalSalingBg: '',
    countDownDay: 0, // 倒计时天数
    countDownHour: 0,
    countDownMin: 0,
    countDownSec: 0,
    countDownViewHeight: 0,
    nameMarginTop: 28,
    legalSalingExpired: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    setTimeout(() => {
      let that = this
      wx.createSelectorQuery()
        .in(that)
        .select('#countDown')
        .boundingClientRect()
        .exec(function (res) {
          console.log(tag + ' createSelectorQuery res ' + res[0].height) // unit is px
          var countDownViewHeight = res[0].height * app.globalData.pixelRatio
          that.setData({
            countDownViewHeight: countDownViewHeight
          })
        })
    }, 200);

    this.initHouse()
  },

  startCountDown() {

    let house = this.data.house
    let nowTimeStamp = Date.parse(new Date())
    let timeStamp = Date.parse(new Date(house.houseLegal.end_time))

    if (nowTimeStamp >= timeStamp) {
      this.setData({
        legalSalingExpired: true,
        houseLegalSalingBg: app.globalData.baseUrl + '/file/download/house_legal_expired_bg.png'
      })
      return
    }

    setTimeout(() => {

      let house = this.data.house
      let nowTimeStamp = Date.parse(new Date())
      let timeStamp = Date.parse(new Date(house.houseLegal.end_time))

      var diffTime = timeStamp - nowTimeStamp
      if (diffTime <= 0) {
        this.setData({
          legalSalingExpired: true,
          houseLegalSalingBg: app.globalData.baseUrl + '/file/download/house_legal_expired_bg.png'
        })
      } else {

        this.startCountDown()

        var day = 0,
          hour = 0,
          min = 0,
          sec = 0

        day = Math.floor(diffTime / (24 * 60 * 60 * 1000))
        diffTime = diffTime % (24 * 60 * 60 * 1000)

        if (diffTime > 0) {
          hour = Math.floor(diffTime / (60 * 60 * 1000))
          diffTime = diffTime % (60 * 60 * 1000)

          if (diffTime > 0) {
            min = Math.floor(diffTime / (60 * 1000))
            diffTime = diffTime % (60 * 1000)

            if (diffTime > 0) {
              sec = Math.floor(diffTime / 1000)
            }
          }
        }

        this.setData({
          countDownDay: day,
          countDownHour: hour,
          countDownMin: min,
          countDownSec: sec
        })
      }

    }, 1000);
  },

  initHouse() {

    let that = this
    var title = this.data.title

    this.setData({
      houseLegalSalingBg: app.globalData.baseUrl + '/file/download/house_legal_saling_bg.png'
    })    

    wx.getStorage({
      key: 'house',
      success(res) {

        var house = res.data
        var community = house.community

        if (house.source_type == 1) {
          title = '法拍房房源详情'
          var nameMarginTop = that.data.nameMarginTop
          nameMarginTop -= 104
          that.setData({
            nameMarginTop: nameMarginTop
          })
          that.data.house = house
          that.startCountDown()
        }

        var streetName = community.street_name != null && community.street_name.length > 0 ? ('-' + community.street_name) : ''
        var locationStr = community.city_name + '-' + community.area_name + streetName

        console.log('house name ' + house.name)

        var showAddTime = house.add_time.split(' ')[0]

        that.queryAttention(house.id)
        that.queryComment(house.id)

        that.setData({
          house: house,
          community: community,
          locationStr: locationStr,
          showAddTime: showAddTime
        })
      },
      fail(res) {
        console.error(tag + ' initHouse fail res: ' + res.errMsg)
      }
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

  tapSwiper(event) {
    console.log(tag + ' tapSwiper')
  },

  tapAddr(event) {

    let community = this.data.community
    console.log('tapAddr, lng: ' + community.lng + ', lat: ' + community.lat)

    wx.navigateTo({
      url: '/pages/map/show/show?lng=' + community.lng + '&lat=' + community.lat,
      success: function (res) {

      },
      fail(res) {
        console.error(tag + ' tapAddr fail ' + res.errMsg)
      }
    })
  },

  tapHomeMortgage(event) {
    console.log('tapHomeMortgage')
    let house = this.data.house
    wx.navigateTo({
      url: '/pages/house/specialArticles/specialArticles?type=' +
        house.source_type + '&index=0',
      fail(res) {
        console.error(tag + ' tapHomeMortgage navigateTo article detail fail ' + res.errMsg)
      }
    })
  },

  tapHomeProcess(event) {
    console.log('tapHomeProcess')
    let house = this.data.house
    wx.navigateTo({
      url: '/pages/house/specialArticles/specialArticles?type=' +
        house.source_type + '&index=1',
      fail(res) {
        console.error(tag + ' tapHomeProcess navigateTo article detail fail ' + res.errMsg)
      }
    })
  },

  tapHomeTax(event) {
    console.log('tapHomeTax')
    let house = this.data.house
    wx.navigateTo({
      url: '/pages/house/specialArticles/specialArticles?type=' +
        house.source_type + '&index=2',
      fail(res) {
        console.error(tag + ' tapHomeTax navigateTo article detail fail ' + res.errMsg)
      }
    })
  },

  tapLegalPolicy(event) {
    console.log('tapLegalPolicy')
    let house = this.data.house
    wx.navigateTo({
      url: '/pages/house/specialArticles/specialArticles?type=' +
        house.source_type + '&index=0',
      fail(res) {
        console.error(tag + ' tapLegalPolicy navigateTo article detail fail ' + res.errMsg)
      }
    })
  },

  tapLegalProcess(event) {
    console.log('tapLegalProcess')
    let house = this.data.house
    wx.navigateTo({
      url: '/pages/house/specialArticles/specialArticles?type=' +
        house.source_type + '&index=1',
      fail(res) {
        console.error(tag + ' tapLegalProcess navigateTo article detail fail ' + res.errMsg)
      }
    })
  },

  tapLegalCost(event) {
    console.log('tapLegalCost')
    let house = this.data.house
    wx.navigateTo({
      url: '/pages/house/specialArticles/specialArticles?type=' +
        house.source_type + '&index=2',
      fail(res) {
        console.error(tag + ' tapLegalCost navigateTo article detail fail ' + res.errMsg)
      }
    })
  },

  tapCommunity(event) {

    console.log('tapCommunity')

    let community = this.data.community

    wx.setStorage({
      data: community,
      key: 'community',
      success(res) {
        wx.navigateTo({
          url: '/pages/house/community/detail/detail',
          fail(res) {
            console.error(tag + ' navigateTo community detail fail ' + res.errMsg)
          }
        })
      },
      fail(res) {
        console.error(tag + ' setStorage community fail ' + res.errMsg)
      }
    })
  },

  tapComment(event) {

    console.log('tapComment')

    let house = this.data.house

    wx.navigateTo({
      url: '/pages/comments/comments?id=' + house.id + '&type=1',
      success: function (res) {

      },
      fail(res) {
        console.error(tag + ' tapComment fail ' + res.errMsg)
      }
    })
  },

  tapAttention(event) {

    console.log('tapAttention')

    let that = this
    var attentioned = this.data.attentioned
    var house = this.data.house

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/attentionHouse',
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "houseId": house.id,
        "attention": !attentioned
      },
      success(res) {
        console.log(tag + ' tapAttention success')
        if (res.data.code != 0) {
          console.error(tag + ' tapAttention success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '操作失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          that.setData({
            attentioned: res.data.data.attentioned
          })
        }
      },
      fail(res) {
        console.error(tag + ' tapAttention fail res ' + res.errMsg)
        wx.showToast({
          title: '操作失败 ' + res.errMsg,
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

  tapConsulte(event) {
    console.log('tapConsulte')
  },

  tapCall(event) {
    console.log('tapCall')
    let house = this.data.house
    if (house.phone_num != null && house.phone_num.length > 0) {
      wx.makePhoneCall({
        phoneNumber: house.phone_num,
      })
    } else {
      console.error(tag + ' tapCall house.phone_num == null || house.phone_num.length == 0')
    }
  },

  queryAttention(houseId) {

    let that = this

    wx.request({
      url: app.globalData.baseUrl + '/house/queryHouseAttention',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "houseId": houseId
      },
      success(res) {
        console.log(tag + ' queryAttention success')
        if (res.data.code != 0) {
          console.error(tag + ' queryAttention success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          that.setData({
            attentioned: res.data.data.attentioned
          })
        }
      },
      fail(res) {
        console.error(tag + ' queryAttention fail res ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {}
    })

  },

  queryComment(houseId) {

    let that = this

    wx.request({
      url: app.globalData.baseUrl + '/comments/getList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "id": houseId,
        "type": 1,
        "pageIndex": 0,
        "pageSize": 20
      },
      success(res) {
        console.log(tag + ' queryComment success')
        if (res.data.code != 0) {
          console.error(tag + ' queryComment success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          that.setData({
            commentNum: res.header.total
          })
        }
      },
      fail(res) {
        console.error(tag + ' queryComment fail res ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {}
    })

  },

  tapLegalBuy(event) {
    console.log('tapLegalBuy')
    let legalSalingExpired = this.data.legalSalingExpired
    if (legalSalingExpired) {
      return
    }
  },

  tapLegalRisk(event) {
    console.log('tapLegalRisk')
    let legalSalingExpired = this.data.legalSalingExpired
    if (legalSalingExpired) {
      return
    }
  }
})