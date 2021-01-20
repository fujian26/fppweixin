// pages/school/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: '',
    currentIndex: 0,
    tabs: [{
        id: 1,
        name: '推荐',
        pageIndex: 0,
        type: 100
      },
      {
        id: 2,
        name: '热门',
        pageIndex: 0,
        type: 101
      },
      {
        id: 3,
        name: '幼儿园',
        pageIndex: 0,
        type: 0
      },
      {
        id: 4,
        name: '小学',
        pageIndex: 0,
        type: 1
      },
      {
        id: 5,
        name: '中学',
        pageIndex: 0,
        type: 2
      },
      {
        id: 6,
        name: '培训机构',
        pageIndex: 0,
        type: 3
      }
    ],
    recommonds: [{
        school: {
          id: 11,
          name: '金苹果中海国际社区幼儿园',
          phone: '028-87589813'
        },
        pics: [
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51sxue.com%2Fupload21%2F5560%2F201409091405596533.jpg&refer=http%3A%2F%2Fimg.51sxue.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=130f1249ccab380b3d9f56f6170cf2b1'
        ],
        nature: '私立',
        area: '成都高新区',
        addr: '成都高新区蓝岸17号',
        distanceStr: '10km',
        tagSrc: '/images/kindergarten-tag.png'
      },
      {
        school: {
          id: 22,
          name: '金苹果中海国际社区幼儿园',
          phone: '028-87589813'
        },
        pics: [
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51sxue.com%2Fupload21%2F5560%2F201409091405596533.jpg&refer=http%3A%2F%2Fimg.51sxue.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=130f1249ccab380b3d9f56f6170cf2b1'
        ],
        nature: '私立',
        area: '成都高新区',
        addr: '成都高新区蓝岸17号',
        distanceStr: '',
        tagSrc: '/images/primary-school-tag.png'
      },
      {
        school: {
          id: 33,
          name: '金苹果中海国际社区幼儿园',
          phone: '028-87589813'
        },
        pics: [
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51sxue.com%2Fupload21%2F5560%2F201409091405596533.jpg&refer=http%3A%2F%2Fimg.51sxue.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=130f1249ccab380b3d9f56f6170cf2b1'
        ],
        nature: '私立',
        area: '成都高新区',
        addr: '成都高新区蓝岸17号',
        distanceStr: '',
        tagSrc: '/images/middle-school-tag.png'
      }
    ], // 推荐
    hots: [], // 热门
    kindergartens: [], // 幼儿园
    primarys: [], // 小学
    middles: [], // 中学
    trainings: [] // 培训机构
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
    console.log('tapOnTab event ' + event.currentTarget.dataset.index)
    this.setData({
      currentIndex: event.currentTarget.dataset.index
    })
  },

  switchPageData(index) {
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

    if (pageData.length == 0) {

    }
  },

  refreshLoadPage(tabData, pageData) {

    if (tabData.pageIndex == 0) {
      pageData = []
    }

    wx.request({
      url: app.globalData.baseUrl + '/school/getSchoolList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        type: tabData.type,
        pageIndex: tabData.pageIndex,
        pageSize: 20,
        lng: 0,
        lat: 0
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
            var item = schoolExts[i]
            item.nature = item.school.nature == 0 ? '公办' : '私办'
            item.area = item.school.city_name + item.school.area_name
            item.addr = item.school.province_name +
              item.school.city_name +
              item.school.area_name +
              item.street_name +
              item.detail_addr
            
            if (item.distance > 0) {
              var km = item.distance / 1000
              if (km < 1) {
                
              }
            }  

          }

          that.setData({

          })
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
        wx.hideLoading()
      }
    })

  }

},
})