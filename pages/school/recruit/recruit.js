// pages/school/recruit/recruit.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolExt: null,
    logoUrl: '',
    time: '',
    recruit: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initSchoolData()    
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

  initSchoolData() {
    let that = this
    wx.getStorage({
      key: 'schoolExt',
      success(res) {        

        var schoolExt = res.data
        var school = res.data.school

        that.getRecruitData(school.id)

        var logoUrl = ''
        for (var i = 0; i < schoolExt.pics.length; i++) {
          if (schoolExt.pics[i].type == 2) {
            var url = schoolExt.pics[i].url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              url = app.globalData.baseUrl + "/file/download/" + url
            }
            logoUrl = url
            break
          }
        }

        that.setData({
          schoolExt: res.data,
          logoUrl: logoUrl          
        })
      },
      fail(res) {
        console.log('basic created fail res: ' + res.errMsg)
      }
    })
  },

  getRecruitData(schoolId) {

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: app.globalData.baseUrl + '/school/getRecentRecruit',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        schoolId: schoolId
      },
      success(res) {        
        if (res.data.code != 0) {
          console.error('getRecruitData success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '获取数据失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {        

          var recruit = res.data.data
          var date = new Date(recruit.recruit_time)
          var time = (date.getMonth() + 1) + '月' + date.getDate() + '日'

          that.setData({
            recruit: recruit,
            time: time
          })
        }
      },
      fail(res) {
        console.error('getRecruitData fail res ' + res.errMsg)
        wx.showToast({
          title: '获取数据失败 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading()
      }
    })

  }
})