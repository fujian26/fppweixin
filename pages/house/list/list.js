// pages/house/list/list.js
let tag = 'pages/house/list/list.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, // 0-school
    id: 0,
    pageIndex: 0,
    houses: [],
    normalHouses: [],
    searchHouses: [],
    searchStr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    let id = options.id

    console.log(tag + ' onLoad, type: ' + type + ', id: ' + id)

    this.data.type = type
    this.data.id = id

    this.loadDatas();
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
    if (searchStr != null && searchStr.length > 0) {
      return
    }
    this.loadDatas();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadDatas() {
    let type = this.data.type
    let id = this.data.id

    switch (type) {
      case '0':
        this.getSchoolHouses(id)
        break
      default:
        console.error(tag + ' not support type: ' + type)
    }
  },

  searchDatas() {
    let type = this.data.type
    let id = this.data.id

    switch (type) {
      case '0':
        this.searchSchoolHouses(id)
        break
      default:
        console.error(tag + ' not support type: ' + type)
    }
  },

  searchSchoolHouses(schoolId) {

    let searchContent = this.data.searchStr
    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/searchHouseBySchool',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "schoolId": schoolId,
        "content": searchContent
      },
      success(res) {
        console.log(tag + ' searchSchoolHouses success')
        if (res.data.code != 0) {
          console.error(tag + ' searchSchoolHouses success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          var houses = res.data.data

          if (houses == null) {
            console.error(tag + ' searchSchoolHouses error houses == null')
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
            return
          }          

          that.setData({
            houses: houses,
            searchHouses: houses    
          })
        }
      },
      fail(res) {
        console.error(tag + ' searchSchoolHouses fail res ' + res.errMsg)
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

  getSchoolHouses(schoolId) {

    let that = this
    let pageIndex = this.data.pageIndex
    var nowHouses = this.data.houses    

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/getHouseBySchool',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "schoolId": schoolId,
        "pageIndex": pageIndex,
        "pageSize": 20
      },
      success(res) {
        console.log(tag + ' getSchoolHouses success')
        if (res.data.code != 0) {
          console.error(tag + ' getSchoolHouses success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          var houses = res.data.data

          if (houses == null) {
            console.error(tag + ' getSchoolHouses error houses == null')
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
            return
          }

          nowHouses = nowHouses.concat(houses)

          that.setData({
            houses: nowHouses,
            normalHouses: nowHouses,
            pageIndex: pageIndex + 1
          })
        }
      },
      fail(res) {
        console.error(tag + ' getSchoolHouses fail res ' + res.errMsg)
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

  onSearchFocused(event) {
    console.log(tag + ' onSearchFocused')
  },

  onSearchInput(event) {
    
    let value = event.detail.value
    this.data.searchStr = value

    console.log(tag + ' onSearchInput ' + value)
    if (value == null || value.length == 0) {
      let houses = this.data.normalHouses
      this.setData({
        houses: houses,
        searchHouses: []
      })
    }
  },

  doSearch(event) {
    let value = event.detail.value
    console.log(tag + ' doSearch ' + value)

    if (value == null || value.length == 0) {
      return
    }

    this.searchDatas()
  }
})