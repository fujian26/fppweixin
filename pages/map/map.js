// pages/map/map.js

// 华阳实验小学 lng: 104.054664,lat: 30.508009
// 双流区实验小学 103.925500,30.578376
// 天府六小 103.811592,30.695326
let app = getApp()
const TAG = 'map.js'
Component({

  attached() {

    let that = this
    this.primayMapCtx = wx.createMapContext('schoolMap', this)

    if (app.globalData.lng == null) {
      console.log(TAG + ' app.globalData.lng == null need getLocation')
      wx.getLocation({
        altitude: false,
        isHighAccuracy: true,
        type: 'gcj02',
        success(res) {
          console.log(TAG + ' getLocation lng: ' + res.longitude + ' lat: ' + res.latitude)
          app.globalData.lng = res.longitude
          app.globalData.lat = res.latitude

          that.getCitySchools()

          that.setData({
            lng: app.globalData.lng,
            lat: app.globalData.lat
          })
        },
        fail(res) {
          console.error(TAG + ' getLocation error ' + res.errMsg)
        }
      })
    } else {
      this.getCitySchools()
      this.setData({
        lng: app.globalData.lng,
        lat: app.globalData.lat
      })
    }

    wx.createSelectorQuery()
      .in(that)
      .select('#basebar')
      .boundingClientRect()
      .exec(function (res) {
        console.log('createSelectorQuery res ' + res[0].height) // unit is px
        var realHeight = res[0].height * app.globalData.pixelRatio
        that.setData({
          typeTabTop: realHeight,
          mapHeight: app.globalData.screenHeight - realHeight - 120
        })
      })
  },

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
  // 成都 lng 103.92377 lat 30.57447
  data: {
    typeTabTop: 0,
    mapHeight: 0,
    currentIndex: -1,
    lng: 113.3345211,
    lat: 23.10229,
    markers: [], // 标记的学校
    desc: null, // 选择标记学校的简介
    polygons: [], // 多边形，表示覆盖的区域
    kindergartens: [], // 幼儿园数据
    primarys: [], // 小学数据
    middles: [], // 中学数据
  },

  /**
   * 组件的方法列表
   */
  methods: {

    getCitySchools() {

      let that = this

      wx.showLoading()

      wx.request({
        url: app.globalData.baseUrl + '/school/getCitySchools',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/json'
        },
        data: {
          cityCode: app.globalData.cityCode,
          pageIndex: -1,
          pageSize: 0
        },
        success(res) {
          if (res.data.code != 0) {
            console.error('getCitySchools success code != 0, msg ' + res.data.msg)
            wx.showToast({
              title: '获取数据失败 ' + res.data.msg,
              icon: 'none'
            })
          } else {

            var schoolExts = res.data.data
            if (schoolExts == null) {
              return
            }

            var kindergartens = []
            var primarys = []
            var middles = []

            for (var i = 0; i < schoolExts.length; i++) {
              var ext = schoolExts[i]

              // only kindergarten..primary school..middle school..needed
              if (ext.school.type != 0 &&
                ext.school.type != 1 &&
                ext.school.type != 2) {
                continue
              }

              var data = {
                ext: ext,
                longitude: ext.school.lng,
                latitude: ext.school.lat,
                selected: false,
                width: 0,
                height: 0,
                iconPath: '',
                content: ext.school.name,
                intro: ext.school.brief,
                areaStr: ext.school.area_name != null ? ext.school.area_name : '',
                natureStr: ext.school.nature == 0 ? '公办' : '私办',
                customCallout: {
                  display: 'ALWAYS'
                }
              }

              var polygons = []
              if (ext.school.rangeDatas != null) {
                var points = []
                for (var i = 0; i < ext.school.rangeDatas.length; i++) {
                  let rangeData = ext.school.rangeDatas[i]
                  points.push({
                    longitude: rangeData.lng,
                    latitude: rangeData.lat,
                  })
                }
                polygons = [{
                  points: points,
                  strokeWidth: 1,
                  strokeColor: '#3E66D5',
                  fillColor: '#99CCFF',
                  level: 'aboveroads'
                }]
              }
              data.polygons = polygons

              if (ext.school.type == 0) {
                data.id = kindergartens.length + 1
                data.typeStr = '幼儿园'
                kindergartens.push(data)
              } else if (ext.school.type == 1) {
                data.id = primarys.length + 1
                data.typeStr = '小学'
                primarys.push(data)
              } else {
                data.id = middles.length + 1
                data.typeStr = '中学'
                middles.push(data)
              }
            }

            that.data.kindergartens = kindergartens
            that.data.primarys = primarys
            that.data.middles = middles

            that.switchTab(0)
          }
        },
        fail(res) {
          console.error('getCitySchools fail res ' + res.errMsg)
          wx.showToast({
            title: '获取数据失败 ' + res.errMsg,
            icon: 'none'
          })
        },
        complete(res) {
          wx.hideLoading()
        }
      })
    },

    switchTab(index) {

      if (this.data.currentIndex == index) {
        return
      }

      var markers = []
      if (index == 0) {
        markers = this.data.kindergartens
      } else if (index == 1) {
        markers = this.data.primarys
      } else {
        markers = this.data.middles
      }

      for (var i = 0; i < markers.length; i++) {
        markers[i].selected = false
      }
      this.hasSelectedMarker = false

      this.setData({
        currentIndex: index,
        markers: markers,
        polygons: [],
        desc: null
      })
    },

    // 点击 房源
    tapHouse(event) {
      wx.navigateTo({
        url: '/pages/house/search/search',
        fail(res) {
          console.error('main.js navigateTo house search fail ' + res.errMsg)
        }
      })
    },

    // 点击 列表
    tapList(event) {
      wx.navigateTo({
        url: '/pages/school/search/search',
        fail(res) {
          console.error(TAG + ' navigateTo school search fail ' + res.errMsg)
        }
      })
    },

    tapLocation(event) {

      this.primayMapCtx.moveToLocation({
        success: function (res) {
          console.log('movetolocation success')
        },
        fail: function (res) {
          console.log('movetoloction fail ' + res.errMsg)
        }
      })
    },

    // 点击地图上的标记点
    tapMarker(event) {
      let markerId = event.detail.markerId
      console.log('tapMarker markid ' + markerId)

      let markers = this.data.markers
      var markerData = null

      for (var i = 0; i < markers.length; i++) {
        if (markers[i].id == markerId) {
          markers[i].selected = true
          markerData = markers[i]
        } else {
          markers[i].selected = false
        }
      }

      var intro = markerData.intro
      if (intro.length > 50) {
        intro = intro.substr(0, 50) + '...'
      }

      this.hasSelectedMarker = true

      this.setData({
        markers: markers,
        desc: {
          name: markerData.content,
          typeStr: markerData.typeStr,
          areaStr: markerData.areaStr,
          natureStr: markerData.natureStr,
          intro: intro
        },
        polygons: markerData.polygons
      })
    },

    // 随便点击地图上的点
    tapMap(event) {
      console.log('tapMap longitude ' + event.detail.longitude + " lat " + event.detail.latitude)

      let markers = this.data.markers

      if (this.hasSelectedMarker) {

        for (var i = 0; i < markers.length; i++) {
          markers[i].selected = false
        }

        this.hasSelectedMarker = false

        this.setData({
          markers: markers,
          desc: null,
          polygons: []
        })
      }
    },

    // 点击详情按钮
    tapDesc(event) {

      console.log('tapDesc here')

      var markers = []
      var index = this.data.currentIndex
      if (index == 0) {
        markers = this.data.kindergartens
      } else if (index == 1) {
        markers = this.data.primarys
      } else {
        markers = this.data.middles
      }

      var markerData = null
      for (var i = 0; i < markers.length; i++) {
        if (markers[i].selected) {
          markerData = markers[i]
          break
        }
      }

      if (markerData == null) {
        wx.showToast({
          title: '数据错误',
          icon: ''
        })
        return
      }

      wx.setStorage({
        data: markerData.ext,
        key: 'schoolExt',
        success(res) {
          wx.navigateTo({
            url: '/pages/school/detail/detail',
            fail(res) {
              console.log(TAG + ' navigateTo school detail fail ' + res.errMsg)
            }
          })
        },
        fail(res) {
          console.log(TAG + ' setStorage school fail ' + res.errMsg)
        }
      })

    },

    // click type tab
    tapTabItem(event) {
      console.log('tapTabItem')
      this.switchTab(event.currentTarget.dataset.index)
    }
  },
})