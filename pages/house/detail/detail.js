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
    attentioned: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initHouse()
  },

  initHouse() {

    let that = this
    var title = this.data.title

    wx.getStorage({
      key: 'house',
      success(res) {

        var house = res.data
        var community = house.community

        if (house.source_type == 1) {
          title = '法拍房房源详情'
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
  },

  tapHomeProcess(event) {
    console.log('tapHomeProcess')
  },

  tapHomeTax(event) {
    console.log('tapHomeTax')
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

  }
})