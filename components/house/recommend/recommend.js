// components/house/recommend/recommend.js
let tag = 'components/house/recommend/recommend.js'
let app = getApp()
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    communityId: {
      type: Number
    },
    community: {
      type: Object
    },
    houseId: {
      type: Number,
      value: -1
    },
    pageSize: {
      type: Number,
      value: 5
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tags: [{
        name: '同小区房源',
        pageIndex: 0,
        houses: []
      },
      {
        name: '周边房源',
        pageIndex: 0,
        houses: []
      },
      // '划片小区'
    ],
    currentTagIndex: 0,
    houses: []
  },

  attached() {
    setTimeout(() => {

      let communityId = this.properties.communityId
      let houseId = this.properties.houseId
      let pageSize = this.properties.pageSize

      console.log(tag + ' attached communityId: ' + communityId +
        ', houseId: ' + houseId +
        ', pageSize: ' + pageSize)

      this.loadDatas(false)

    }, 100);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapTagItem(event) {
      let index = event.currentTarget.dataset.index
      console.log(tag + ' tapTagItem index: ' + index)

      var houses = this.data.tags[index].houses
      var pageIndex = this.data.tags[index].pageIndex

      this.setData({
        currentTagIndex: index,
        houses: houses
      })

      if (pageIndex == 0) {
        this.loadDatas(true)
      }
    },

    loadDatas(showLoading) {

      let currentTagIndex = this.data.currentTagIndex

      switch (currentTagIndex) {
        case 0: // same community
          this.loadSameCommunityDatas(showLoading)
          break
        case 1: // nearby
          this.loadNearbyDatas(showLoading)
          break
      }
    },

    loadSameCommunityDatas(showLoading) {

      let that = this
      var tags = this.data.tags
      var pageIndex = tags[0].pageIndex
      let houseId = this.properties.houseId
      let communityId = this.properties.communityId
      let pageSize = this.properties.pageSize

      if (showLoading) {
        wx.showLoading({
          title: '',
        })
      }

      wx.request({
        url: app.globalData.baseUrl + '/house/getHouseByCommunity',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/json'
        },
        data: {
          "communityId": communityId,
          "sourceType": -1,
          "excludeHouseId": houseId,
          "pageIndex": pageIndex,
          "pageSize": pageSize,
          "allowLoop": true
        },
        success(res) {
          console.log(tag + ' loadSameCommunityDatas success')
          if (res.data.code != 0) {
            console.error(tag + ' loadSameCommunityDatas success code != 0, msg ' + res.data.msg)
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
          } else {

            var houses = res.data.data

            if (houses == null) {
              console.error(tag + ' loadSameCommunityDatas error houses == null')
              return
            }

            if (houses.length == 0) {
              console.log(tag + ' loadSameCommunityDatas error houses.length == 0')
              return
            }

            console.log(tag + ' loadSameCommunityDatas houses.length: ' + houses.length)

            tags[0].pageIndex = res.header.pageIndex
            tags[0].houses = houses

            that.setData({
              tags: tags,
              houses: tags[0].houses = houses
            })
          }
        },
        fail(res) {
          console.error(tag + ' loadSameCommunityDatas fail res ' + res.errMsg)
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

    loadNearbyDatas(showLoading) {
      let that = this
      var tags = this.data.tags
      var pageIndex = tags[1].pageIndex
      let communityId = this.properties.communityId
      let community = this.properties.community
      let pageSize = this.properties.pageSize

      var lng = 0
      var lat = 0

      if (community != null) {
        lng = community.lng
        lat = community.lat
      }

      if (showLoading) {
        wx.showLoading({
          title: '',
        })
      }

      wx.request({
        url: app.globalData.baseUrl + '/house/getHouseNearby',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/json'
        },
        data: {
          "excludeCommunityId": communityId,
          "lng": lng,
          "lat": lat,
          'pageIndex': pageIndex,
          "pageSize": pageSize
        },
        success(res) {
          console.log(tag + ' loadNearbyDatas success')
          if (res.data.code != 0) {
            console.error(tag + ' loadNearbyDatas success code != 0, msg ' + res.data.msg)
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
          } else {

            var houses = res.data.data

            if (houses == null) {
              console.error(tag + ' loadNearbyDatas error houses == null')
              return
            }

            if (houses.length == 0) {
              console.log(tag + ' loadNearbyDatas error houses.length == 0')
              return
            }

            console.log(tag + ' loadNearbyDatas houses.length: ' + houses.length)

            tags[1].pageIndex++
            tags[1].houses = houses

            that.setData({
              tags: tags,
              houses: tags[1].houses = houses
            })
          }
        },
        fail(res) {
          console.error(tag + ' loadNearbyDatas fail res ' + res.errMsg)
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

    tapRefresh(event) {
      console.log('tapRefresh')
      this.loadDatas(true)
    }
  }
})