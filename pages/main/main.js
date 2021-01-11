// pages/main/main.js
let app = getApp()

Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb.img.youboy.com%2F20107%2F29%2Fg3_4622251.jpg&refer=http%3A%2F%2Fb.img.youboy.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=b2a876a23f89b82fecbeb8415b1d1f14'
    }, {
      id: 1,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51sxue.com%2Fupload21%2F5560%2F201409091405596533.jpg&refer=http%3A%2F%2Fimg.51sxue.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=130f1249ccab380b3d9f56f6170cf2b1',
    }, {
      id: 2,
      url: 'https://ss3.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/baike/pic/item/d52a2834349b033b7d2ded8e1ece36d3d539bd38.jpg'
    }, {
      id: 3,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp2.qhimg.com%2Ft012f6e40ab82d08ccf.jpg&refer=http%3A%2F%2Fp2.qhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=93a94f4dfab895c6b44b2d27a8cbe0b2'
    }, {
      id: 4,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.lemeitu.com%2Fm00%2F28%2F0f%2F828f54a3a15598702288f3803ba4b86d__w.jpg&refer=http%3A%2F%2Fimg.lemeitu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=684a328363a937e57104fcec03c6d380'
    }, {
      id: 5,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.med66.com%2Fupload%2Fhtml%2F2015%2F02%2Fqm100393.jpg&refer=http%3A%2F%2Fwww.med66.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612792551&t=95a3efebda30c4b29e91762ac050b257'
    }],

    belowSearchItems: [{
        id: 1,
        str: '查学校',
        image: '/images/query_school.png'
      },

      {
        id: 2,
        str: '找房屋',
        image: '/images/query_house.png'
      },

      {
        id: 3,
        str: '看咨询',
        image: '/images/query_question.png'
      },

      {
        id: 4,
        str: '读政策',
        image: '/images/read_policy.png'
      }
    ],
    hotMsg: '成都发布最新楼市政策，全国楼市变化来袭？',
    cardsline1: [{
        id: 1,
        image: '/images/primary_school_divide.png',
        flex: 2.1,
        marginLeft: 0
      },
      {
        id: 2,
        image: '/images/proceed_junior_high.png',
        flex: 1,
        marginLeft: 16
      },
    ],
    cardsline2: [{
        id: 3,
        image: '/images/kindergarden_area.png',
        flex: 1,
        marginLeft: 0
      },
      {
        id: 4,
        image: '/images/settlement_demolition.png',
        flex: 1,
        marginLeft: 16
      },
      {
        id: 5,
        image: '/images/online_question.png',
        flex: 1,
        marginLeft: 16
      },
    ],
    hotSchools: []
  },

  created() {
    this.getHotSchools()
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onScrolled(event) {},

    tapSwiper(event) {
      console.log('tapSwiper event ' + event.currentTarget.dataset.id)
    },

    searchConfirm(event) {
      console.log('searchConfirm event ' + event.detail.value)
    },

    belowSearchItemTap(event) {
      let id = event.currentTarget.dataset.id
      console.log('belowSearchItemTap id ' + id)

      switch (id) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
      }
    },

    hotMsgTap(event) {
      console.log('hotMsgTap')
    },

    cardTap(event) {
      console.log('cardTap event ' + event.currentTarget.dataset.id)
    },

    hotSchoolMoreTap(event) {
      console.log('hotSchoolMoreTap')
    },

    hotSchoolItemTap(event) {
      console.log('hotSchoolItemTap school id ' + event.currentTarget.dataset.id)
    },

    getHotSchools() {
      let that = this;
      wx.request({
        url: app.globalData.baseUrl + '/school/getHotSchools',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/json'
        },
        data: {

        },
        success(res) {
          console.log('getHotSchools success')
          if (res.data.code != 0) {
            console.log('getHotSchools success code != 0, msg ' + res.data.msg)
            wx.showToast({
              title: '获取热门学校错误 ' + res.data.msg,
              icon: 'none'
            })
          } else {
            console.log('获取热门学校成功，数量: ' + res.data.data.length)
            for (var i = 0; i < res.data.data.length; i++) {
              var school = res.data.data[i]
              if (school.pics != null && school.pics.length > 0) {
                for (var j = 0; j < school.pics.length; j++) {
                  var schoolPic = school.pics[j]
                  if (schoolPic.type == 1) { // logo
                    school.school.logoPicUrl = app.globalData.baseUrl +
                      '/file/download/' +
                      schoolPic.url;
                  }
                }
              }
            }

            that.setData({
              hotSchools: res.data.data
            })
          }
        },
        fail(res) {
          console.log('getHotSchools fail res ' + res.errMsg)
          wx.showToast({
            title: '获取热门学校错误 ' + res.errMsg,
            icon: 'none'
          })
        }
      })
    }
  }
})