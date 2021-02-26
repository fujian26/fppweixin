// pages/school/basic/basic.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenW: app.globalData.screenWidth,
    schoolExt: null,
    logoUrl: '',
    importantStr: null,
    typeStr: '',
    nature: '', // 学校性质
    entranceMode: '', // 入学方式
    teachingQuality: '', // 教学质量
    eatablishTime: '', // 创办时间
    addr: '', // 学校地址
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

  rightTapFromBar(event) {
    console.log('basic.js rightTapFromBar')
  },

  initSchoolData() {
    let that = this
    wx.getStorage({
      key: 'schoolExt',
      success(res) {

        var logoUrl = ''
        var schoolExt = res.data
        var school = res.data.school  

        logoUrl = res.data.logoUrl
        console.log('logoUrl ' + logoUrl)

        var typeStr = ''
        switch (res.data.school.type) {
          case 0:
            typeStr = '幼儿园'
            break
          case 1:
            typeStr = '小学'
            break
          case 2:
            typeStr = '中学'
            break
          case 3:
            typeStr = '培训机构'
            break
          default:
            typeStr = '学校'
        }

        var importantStr = null
        if (res.data.school.is_key == 1) {
          importantStr = '重点' + typeStr
        }

        var nature = '公办'
        if (school.nature == 1) {
          nature = '私办'
        }

        var entranceMode = '户籍划片摇号'
        if (school.entrance_mode == 1) {
          entranceMode = '直读'
        }

        var teachingQuality = '良'
        if (school.teaching_quality == 1) {
          teachingQuality = '优'
        }

        var date = new Date(school.eatablish_time)
        var eatablishTime = date.getFullYear() + '年'

        var addr = school.province_name + school.city_name +
          school.area_name + school.street_name +
          school.detail_addr

        that.setData({
          schoolExt: res.data,
          logoUrl: logoUrl,
          importantStr: importantStr,
          typeStr: typeStr,
          nature: nature,
          entranceMode: entranceMode,
          teachingQuality: teachingQuality,
          eatablishTime: eatablishTime,
          addr: addr
        })
      },
      fail(res) {
        console.log('basic created fail res: ' + res.errMsg)
      }
    })
  }
})