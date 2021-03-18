// pages/school/detail/detail.js
const utils = require('../../../utils/util');
let app = getApp()
let TAG = 'detail.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: app.globalData.StatusBar,
    schoolExt: null,
    addr: '',
    nature: '',
    entranceMode: '',
    typeStr: '',
    dynamics: [],
    communities: [],
    communityTotalNum: 0,
    houses: [],
    houseTotalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#00000000',
      fail(res) {
        console.error('setNavigationBarColor ' + res.errMsg)
      }
    })
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

        var typeStr = ''
        switch (school.type) {
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

        switch (school.school_level) {
          case 1:
            typeStr = '二级' + typeStr
            break
          case 2:
            typeStr = '三级' + typeStr
            break
          default:
            typeStr = '一级' + typeStr
            break
        }

        var nature = '公办'
        if (school.nature == 1) {
          nature = '私办'
        }

        var entranceMode = '户籍划片摇号'
        if (school.entrance_mode == 1) {
          entranceMode = '直读'
        }

        var addr = school.province_name + school.city_name +
          school.area_name + school.street_name +
          school.detail_addr

        that.setData({
          schoolExt: res.data,
          addr: addr,
          nature: nature,
          entranceMode: entranceMode,
          typeStr: typeStr
        })

        that.getDynamics(schoolExt.school)
        that.getDetail(schoolExt.school)
        that.getCommunityList(schoolExt.school.id)
        that.getHouses(schoolExt.school.id)
      },
      fail(res) {
        console.log('basic created fail res: ' + res.errMsg)
      }
    })
  },

  tapLeft(event) {
    wx.navigateBack()
  },

  tapRight(event) {

  },

  tapDetail(event) {
    wx.navigateTo({
      url: '/pages/school/basic/basic',
      fail(res) {
        console.error('detail.js navigateTo school basic fail ' + res.errMsg)
      }
    })
  },

  tapSignUp(event) {

  },

  tapPhone(event) {
    let school = this.data.schoolExt.school

    if (school.phone == null && school.phone.length == 0) {
      return
    }

    wx.makePhoneCall({
      phoneNumber: school.phone,
    })
  },

  // 划片范围及小区 -- 更多
  tapDivideRangeMore(event) {

    console.log('tapDivideRangeMore')
    if (this.data.schoolExt == null || this.data.schoolExt.school == null) {
      console.error('tapDivideRangeMore this.data.schoolExt == null || this.data.schoolExt.school == null')
      return
    }

    let school = this.data.schoolExt.school

    wx.navigateTo({
      url: '/pages/school/communities/communities?title=' + school.name + '&schoolId=' + school.id,
      success: function (res) {

      },
      fail(res) {
        console.error(TAG + ' tapDivideRangeMore navigateTo fail ' + res.errMsg)
      }
    })
  },

  tapAttenRecruit(event) {

    let schoolExt = this.data.schoolExt

    if (schoolExt == null ||
      schoolExt.recruitStudentList == null ||
      schoolExt.recruitStudentList.length <= 0) {
      console.error('tapAttenRecruit data error schoolExt.recruitStudentList ' + schoolExt.recruitStudentList)
      return
    }

    let news = schoolExt.recruitStudentList[0]

    wx.navigateTo({
      url: '/pages/news/detail/detail?newsId=' + news.id + '&title=招生简章',
      success: function (res) {

      },
      fail(res) {
        console.error(TAG + ' tapAttenRecruit navigateTo fail ' + res.errMsg)
      }
    })
  },

  // 落户迁户条件
  tapAttenSettle(event) {

    let schoolExt = this.data.schoolExt
    if (schoolExt == null) {
      console.error('tapAttenSettle schoolExt == null)')
      return
    }

    wx.navigateTo({
      url: '/pages/news/settle/settle?cityCode=' + schoolExt.school.city_code,
      success: function (res) {

      },
      fail(res) {
        console.error(TAG + ' tapAttenSettle navigateTo fail ' + res.errMsg)
      }
    })
  },

  // 摇号流程手续
  tapAttenLottery(event) {

    let schoolExt = this.data.schoolExt
    if (schoolExt == null) {
      return
    }

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/news/getVariatyNewsList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        id: schoolExt.school.type,
        type: 2,
        pageIndex: 0,
        pageSize: 1
      },
      success(res) {
        console.log(TAG + ' getCityRecentLottery success')
        if (res.data.code != 0) {
          console.error(TAG + ' getCityRecentLottery success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {          
          if (res.data.data == null || res.data.data.length == 0) {
            console.error(TAG + ' getCityRecentLottery error news == null')
            wx.showToast({
              title: '没有数据',
              icon: 'none'
            })
            return
          }
          
          var news = res.data.data[0]

          wx.navigateTo({
            url: '/pages/news/detail/detail?newsId=' + news.id + '&title=学校动态',
            success: function (res) {

            },
            fail(res) {
              console.error(TAG + ' tapAttenLottery navigateTo fail ' + res.errMsg)
            }
          })
        }
      },
      fail(res) {
        console.error(TAG + ' getDynamics fail res ' + res.errMsg)
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

  // 周边房源 - 更多
  tapHouseMore(event) {

    console.log('tapHouseMore')

    if (this.data.schoolExt == null) {
      console.error('tapHouseMore this.data.schoolExt == null')
      return
    }

    let school = this.data.schoolExt.school
    wx.navigateTo({
      url: '/pages/house/list/list?type=0&id=' + school.id,
      success: function (res) {

      },
      fail(res) {
        console.error(TAG + ' tapHouseMore navigateTo fail ' + res.errMsg)
      }
    })
  },

  // 学校动态 - 更多
  tapSchoolDynamicMore(event) {

  },

  // 获取学校动态
  getDynamics(school) {

    let that = this

    wx.request({
      url: app.globalData.baseUrl + '/news/getVariatyNewsList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        id: school.id,
        type: 0,
        pageIndex: 0,
        pageSize: 10
      },
      success(res) {
        console.log(TAG + ' getDynamics success')
        if (res.data.code != 0) {
          console.error(TAG + ' getDynamics success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '动态获取错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {
          var dynamics = res.data.data
          if (dynamics != null) {
            for (var i = 0; i < dynamics.length; i++) {
              dynamics[i].distanceTime = utils.getDistanceTime(dynamics[i].publish_time)
            }
            that.setData({
              dynamics: dynamics
            })
          } else {
            console.error('getDynamics res.data.data == null')
          }
        }
      },
      fail(res) {
        console.log(TAG + ' getDynamics fail res ' + res.errMsg)
        wx.showToast({
          title: '动态获取错误 ' + res.errMsg,
          icon: 'none'
        })
      }
    })
  },

  // 获取学校详情
  getDetail(school) {

    let that = this

    wx.request({
      url: app.globalData.baseUrl + '/school/getDetail',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        id: school.id
      },
      success(res) {
        console.log(TAG + ' getDetail success')
        if (res.data.code != 0) {
          console.error(TAG + ' getDetail success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {
          if (res.data.data == null) {
            console.error(TAG + ' getDetail res.data.data == null')
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
            return
          }

          that.setData({
            schoolExt: res.data.data
          })

          wx.setStorage({
            data: res.data.data,
            key: 'schoolExt',
            success(res) {

            },
            fail(res) {
              console.log(TAG + ' getDetail setStorage school fail ' + res.errMsg)
            }
          })
        }
      },
      fail(res) {
        console.log(TAG + ' getDetail fail res ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
          icon: 'none'
        })
      }
    })
  },

  tapCommunity(event) {
    let index = event.currentTarget.dataset.index
    let community = this.data.communities[index]
    console.log('tapCommunity index: ' + index)

    wx.setStorage({
      data: community,
      key: 'community',
      success(res) {
        wx.navigateTo({
          url: '/pages/house/community/detail/detail',
          fail(res) {
            console.error(TAG + ' navigateTo community detail fail ' + res.errMsg)
          }
        })
      },
      fail(res) {
        console.error(TAG + ' setStorage community fail ' + res.errMsg)
      }
    })
  },

  getCommunityList(schoolId) {

    let that = this

    wx.request({
      url: app.globalData.baseUrl + '/school/getCommunityList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "schoolId": schoolId
      },
      success(res) {
        console.log(TAG + ' getCommunityList success')
        if (res.data.code != 0) {
          console.error(TAG + ' getCommunityList success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          var communities = res.data.data

          if (communities == null) {
            console.error(TAG + ' getCommunityList error communities == null')
            return
          }

          var showCommunities = []
          for (var i = 0; i < 5 && i < communities.length; i++) {
            showCommunities.push(communities[i])
          }

          that.setData({
            communities: showCommunities,
            communityTotalNum: communities.length
          })
        }
      },
      fail(res) {
        console.error(TAG + ' getCommunityList fail res ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {}
    })
  },

  getHouses(schoolId) {

    let that = this

    wx.request({
      url: app.globalData.baseUrl + '/house/getHouseBySchool',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "schoolId": schoolId,
        "pageIndex": 0,
        "pageSize": 20
      },
      success(res) {
        console.log(TAG + ' getHouses success')
        if (res.data.code != 0) {
          console.error(TAG + ' getHouses success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          var houses = res.data.data

          if (houses == null) {
            console.error(TAG + ' getHouses error houses == null')
            return
          }

          var showHouses = []
          for (var i = 0; i < 5 && i < houses.length; i++) {
            showHouses.push(houses[i])
          }

          that.setData({
            houses: showHouses,
            houseTotalNum: houses.length
          })
        }
      },
      fail(res) {
        console.error(TAG + ' getHouses fail res ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {}
    })
  }
})