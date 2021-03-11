// pages/me/attentions/attentions.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        name: '关注小区',
        pageIndex: 0
      },
      {
        name: '关注房源',
        pageIndex: 0
      },
      {
        name: '关注学校',
        pageIndex: 0
      },
    ],
    currentIndex: 0,
    communities: [],
    houses: [],
    schools: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    console.log('onReachBottom')
    this.loadDatas()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tapTab(event) {
    var index = event.currentTarget.dataset.index
    console.log('tapTab index: ' + index)
    var currentIndex = this.data.currentIndex

    if (currentIndex == index) {
      return
    }

    this.data.currentTarget = index
    this.setData({
      currentIndex: index
    })
    
    var tabs = this.data.tabs
    tabs[index].pageIndex = 0
    this.data.tabs = tabs    
    this.loadDatas()
  },

  loadDatas() {

    let index = this.data.currentIndex

    switch (index) {
      case 0: // 关注小区
        this.loadCommunities()
        break
      case 1: // 关注房源
        this.loadHouses()
        break
      case 2: //关注学校
        this.loadSchools()
        break
      default:
        console.error('loadDatas unknown index: ' + index)
        break
    }
  },

  loadCommunities() {

    let that = this
    let tabs = this.data.tabs
    var communities = this.data.communities

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/getAttentionedCommunities',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        'pageIndex': tabs[0].pageIndex,
        'pageSize': 50
      },
      success(res) {
        if (res.data.code != 0) {
          console.error('loadCommunities res.data.code != 0, ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        if (res.data.data.length == 0) {
          console.error('loadCommunities res.data.data.length == 0')
          wx.showToast({
            title: '没有数据',
            icon: 'none'
          })
          return
        }

        if (tabs[0].pageIndex == 0) {
          communities = res.data.data
        } else {
          communities = communities.concat(res.data.data)
        }

        tabs[0].pageIndex = tabs[0].pageIndex + 1
        that.setData({
          tabs: tabs,
          communities: communities
        })
      },
      fail(res) {
        console.error('loadCommunities fail: ' + res.errMsg)
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

  loadHouses() {

    let that = this
    let tabs = this.data.tabs
    var houses = this.data.houses

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/getAttentionedHouses',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        'pageIndex': tabs[1].pageIndex,
        'pageSize': 50
      },
      success(res) {
        if (res.data.code != 0) {
          console.error('loadHouses res.data.code != 0, ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        if (res.data.data.length == 0) {
          console.error('loadHouses res.data.data.length == 0')
          wx.showToast({
            title: '没有数据',
            icon: 'none'
          })
          return
        }

        if (tabs[1].pageIndex == 0) {
          houses = res.data.data
        } else {
          houses = houses.concat(res.data.data)
        }

        tabs[1].pageIndex = tabs[1].pageIndex + 1
        that.setData({
          tabs: tabs,
          houses: houses
        })
      },
      fail(res) {
        console.error('loadHouses fail: ' + res.errMsg)
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

  loadSchools() {

    let that = this
    let tabs = this.data.tabs
    var schools = this.data.schools

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/school/getAttentionedSchools',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        'pageIndex': tabs[2].pageIndex,
        'pageSize': 50
      },
      success(res) {
        if (res.data.code != 0) {
          console.error('loadSchools res.data.code != 0, ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        if (res.data.data.length == 0) {
          console.error('loadSchools res.data.data.length == 0')
          wx.showToast({
            title: '没有数据',
            icon: 'none'
          })
          return
        }

        if (tabs[2].pageIndex == 0) {
          schools = res.data.data
        } else {
          schools = schools.concat(res.data.data)
        }

        tabs[2].pageIndex = tabs[2].pageIndex + 1
        that.setData({
          tabs: tabs,
          schools: schools
        })
      },
      fail(res) {
        console.error('loadSchools fail: ' + res.errMsg)
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
})