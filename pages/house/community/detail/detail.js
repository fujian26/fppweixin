// pages/house/community/detail/detail.js
let TAG = 'community-detail.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    community: null,
    tagListLocal: [],
    attentioned: false,
    attentionNum: 0,
    locationStr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this

    wx.getStorage({
      key: 'community',
      success(res) {

        var community = res.data

        var buildTypeStr = ''
        switch (community.building_type) {
          case 1:
            buildTypeStr = '小高层'
            break
          case 2:
            buildTypeStr = '花园洋房'
            break
          default:
            buildTypeStr = '高层'
            break
        }

        community.buildTypeStr = buildTypeStr

        var tags = []
        tags.push({
          str: buildTypeStr,
          color: '#3E66D5',
          textColor: '#FFFFFF'
        })

        if (community.tags != null) {
          for (var i = 0; i < community.tagList.length; i++) {
            tags.push({
              str: community.tagList[i],
              color: '#99CCFF',
              textColor: '#3E66D5'
            })
          }
        }

        var streetName = community.street_name != null && community.street_name.length > 0 ? ('-' + community.street_name) : ''
        var locationStr = community.city_name + '-' + community.area_name + streetName

        that.setData({
          community: community,
          tagListLocal: tags,
          locationStr: locationStr
        })
      },
      fail(res) {
        console.error(TAG + ' community get fail res: ' + res.errMsg)
        wx.showToast({
          title: '数据错误',
          icon: ''
        })
      }
    })

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

  tapAddr(event) {
    console.log('tapAddr')
  }
})