// pages/main/main.js
let app = getApp()
let TAG = 'main.js'
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
    hotSchools: [],
    hotCommunities: [],
    hotCommunityPageIndex: 0,
    houses: [], // 热门房源
    houseIndex: 0,
  },

  created() {
    this.getHotSchools()
    this.getHotCommunities(false)
    this.getHotHouses(false)
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
        case 1: // 查学校
          wx.navigateTo({
            url: '/pages/school/search/search',
            fail(res) {
              console.error('main.js navigateTo school search fail ' + res.errMsg)
            }
          })
          break;
        case 2: // 找房屋
          wx.navigateTo({
            url: '/pages/house/search/search',
            fail(res) {
              console.error('main.js navigateTo house search fail ' + res.errMsg)
            }
          })
          break;
        case 3: // 看资讯
          wx.navigateTo({
            url: '/pages/news/advisories/advisories',
            fail(res) {
              console.error('navigate to advisories fail: ' + res.errMsg)
            }
          })
          break;
        case 4: // 读政策
          wx.navigateTo({
            url: '/pages/news/policylist/policylist',
            fail(res) {
              console.error('main.js navigateTo policylist fail ' + res.errMsg)
            }
          })
          break;
      }
    },

    hotMsgTap(event) {
      console.log('hotMsgTap')
    },

    naviToLotteryList(title, type) {
      wx.navigateTo({
        url: '/pages/school/lotterylist/lotterylist?title=' + title + '&type=' + type,
        success: function (res) {

        },
        fail(res) {
          console.error(TAG + ' naviToLotteryList fail ' + res.errMsg)
        }
      })
    },

    cardTap(event) {
      let id = event.currentTarget.dataset.id
      console.log('cardTap event ' + id)
      switch (id) {
        case 1: // 小学划片
          this.naviToLotteryList('小学划片', 1)
          break
        case 2: // 小升初
          this.naviToLotteryList('小升初', 2)
          break
        case 3: // 幼儿园专区
          this.naviToLotteryList('幼儿园专区', 0)
          break
        case 4: // 落户拆迁
          wx.navigateTo({
            url: '/pages/news/settle/settle?cityCode=5101', // todo 暂定成都
            success: function (res) {

            },
            fail(res) {
              console.error(TAG + ' cardTap 4 navigateTo settle fail ' + res.errMsg)
            }
          })
          break

      }
    },

    hotSchoolMoreTap(event) {
      console.log('hotSchoolMoreTap')
    },

    hotSchoolItemTap(event) {
      var index = event.currentTarget.dataset.index
      console.log('hotSchoolItemTap school index ' + index)
      var shcoolExt = this.data.hotSchools[index]
      wx.setStorage({
        data: shcoolExt,
        key: 'schoolExt',
        success(res) {
          wx.navigateTo({
            url: '/pages/school/detail/detail',
            fail(res) {
              console.log('main.js navigateTo school detail fail ' + res.errMsg)
            }
          })
        },
        fail(res) {
          console.log('main.js setStorage school fail ' + res.errMsg)
        }
      })
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
    },

    getHotCommunities(showLoading) {

      if (showLoading) {
        wx.showLoading({
          title: '',
        })
      }

      var pageIndex = this.data.hotCommunityPageIndex
      var hotCommunities = this.data.hotCommunities
      let that = this

      if (this.data.hotCommunityPageIndex == 0) {
        hotCommunities = []
      }

      wx.request({
        url: app.globalData.baseUrl + '/house/getCityHotCommunity',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/json'
        },
        data: {
          cityCode: 5101, //todo 暂定成都
          pageIndex: pageIndex,
          pageSize: 3
        },
        success(res) {
          if (res.data.code != 0) {
            console.error('getHotCommunities success code != 0, msg ' + res.data.msg)
            if (showLoading) {
              wx.showToast({
                title: '数据错误 ' + res.data.msg,
                icon: 'none'
              })
            }
          } else {

            if (res.data.data == null) {
              console.error('getHotCommunities res.data.data == null')
              if (showLoading) {
                wx.showToast({
                  title: '数据错误',
                  icon: 'none'
                })
              }
              return
            }

            if (res.data.data.length == 0) {
              if (showLoading) {
                wx.showToast({
                  title: '没有更多数据',
                  icon: 'none'
                })
              }
              that.data.hotCommunityPageIndex = 0
              return
            }

            that.setData({
              hotCommunityPageIndex: pageIndex + 1,
              hotCommunities: res.data.data
            })
          }
        },
        fail(res) {
          console.error('getHotCommunities fail res ' + res.errMsg)
          if (showLoading) {
            wx.showToast({
              title: '数据错误 ' + res.errMsg,
              icon: 'none'
            })
          }
        },
        complete(res) {
          if (showLoading) {
            wx.hideLoading({
              success: (res) => {},
            })
          }
        }
      })
    },

    // 热门小区-item
    tapHotCommunityItem(event) {
      let index = event.currentTarget.dataset.index
      let that = this
      console.log('tapHotCommunityItem index ' + index)

      wx.setStorage({
        data: that.data.hotCommunities[index],
        key: 'community',
        success(res) {
          wx.navigateTo({
            url: '/pages/house/community/detail/detail',
            fail(res) {
              console.error('main.js navigateTo community detail fail ' + res.errMsg)
            }
          })
        },
        fail(res) {
          console.error('main.js setStorage community fail ' + res.errMsg)
        }
      })
    },

    // 热门小区-换一批
    tapHotCommunityRefresh(event) {

      console.log('tapHotCommunityRefresh')

      if (this.data.hotCommunities.length == 0) {
        this.data.hotCommunityPageIndex = 0
      }

      this.getHotCommunities(true)
    },

    tapMoreHouse(event) {
      console.log('tapMoreHouse')

      wx.navigateTo({
        url: '/pages/house/search/search?index=0',
        fail(res) {
          console.error('main.js navigateTo house search fail ' + res.errMsg)
        }
      })
    },

    tapMoreCommunity(event) {

      console.log('tapMoreCommunity')

      wx.navigateTo({
        url: '/pages/house/search/search?index=1',
        fail(res) {
          console.error('main.js navigateTo house search fail ' + res.errMsg)
        }
      })
    },

    getHotHouses(showLoading) {

      let that = this
      let houseIndex = this.data.houseIndex

      if (showLoading) {
        wx.showLoading({
          title: '',
        })
      }

      wx.request({
        url: app.globalData.baseUrl + '/house/getCityHot',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/json'
        },
        data: {
          "cityCode": "5101", //todo 暂定成都
          "pageIndex": houseIndex,
          "pageSize": 3
        },
        success(res) {
          console.log('getHotHouses success')
          if (res.data.code != 0) {
            console.error('getHotHouses success code != 0, msg ' + res.data.msg)
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
          } else {

            if (res.data.data == null || res.data.data.length == 0) {
              if (showLoading) {
                wx.showToast({
                  title: '没有更多数据',
                  icon: 'none'
                })
                that.data.houseIndex = 0
              }
              return
            }

            that.setData({
              houses: res.data.data,
              houseIndex: houseIndex + 1
            })
          }
        },
        fail(res) {
          console.error('getHotHouses fail res ' + res.errMsg)
          wx.showToast({
            title: '数据错误 ' + res.errMsg,
            icon: 'none'
          })
        },
        complete(res) {
          if (showLoading) {
            wx.hideLoading({
              success: (res) => {},
            })
          }
        }
      })
    },

    tapHouseRefresh(event) {

      console.log('tapHouseRefresh')

      if (this.data.houses.length == 0) {
        this.data.houseIndex = 0
      }

      this.getHotHouses(true)
    }
  },
})