// pages/map/map.js

// 华阳实验小学 lng: 104.054664,lat: 30.508009
// 双流区实验小学 103.925500,30.578376
// 天府六小 103.811592,30.695326
let app = getApp()
const TAG = 'map.js'
Component({

  attached() {

    let that = this
    this.primayMapCtx = wx.createMapContext('primaryMap', this)

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
        console.log('createSelectorQuery res ' + res[0].height)
        that.setData({
          mapHeight: app.globalData.screenHeight - res[0].height - 120
        })
      })


    // 测试
    setTimeout(() => {
      that.setData({
        markers: [{
            id: 1,
            longitude: 104.054664,
            latitude: 30.508009,
            selected: false,
            width: 0,
            height: 0,
            iconPath: '',
            content: '华阳实验小学',
            customCallout: {
              display: 'ALWAYS'
            },
            polygons: [{
              points: [{
                  longitude: 104.053497,
                  latitude: 30.509389
                },
                {
                  longitude: 104.052985,
                  latitude: 30.506632
                },
                {
                  longitude: 104.055488,
                  latitude: 30.505531
                },
                {
                  longitude: 104.057919,
                  latitude: 30.508824
                },
              ],
              strokeWidth: 1,
              strokeColor: '#3E66D5',
              fillColor: '#99CCFF',
              level: 'aboveroads'
            }]
          },
          {
            id: 2,
            longitude: 103.925500,
            latitude: 30.578376,
            selected: false,
            width: 0,
            height: 0,
            iconPath: '',
            content: '双流区实验小学',
            customCallout: {
              display: 'ALWAYS'
            },
            polygons: [{
              points: [{
                  longitude: 103.924001,
                  latitude: 30.579026
                },
                {
                  longitude: 103.927124,
                  latitude: 30.578879
                },
                {
                  longitude: 103.925031,
                  latitude: 30.577121
                },
              ],
              strokeWidth: 1,
              strokeColor: '#3E66D5',
              fillColor: '#99CCFF',
              level: 'aboveroads'
            }]
          },
          {
            id: 3,
            longitude: 104.095519,
            latitude: 30.493166,
            selected: false,
            width: 0,
            height: 0,
            iconPath: '',
            content: '天府六小',
            customCallout: {
              display: 'ALWAYS'
            },
            polygons: [{
              points: [{
                  longitude: 104.081646,
                  latitude: 30.496225
                },
                {
                  longitude: 104.098063,
                  latitude: 30.502685
                },
                {
                  longitude: 104.099876,
                  latitude: 30.483192
                },
              ],
              strokeWidth: 1,
              strokeColor: '#3E66D5',
              fillColor: '#99CCFF',
              level: 'aboveroads'
            }]
          }
        ]
      })
    }, 1000);
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
    mapHeight: 0,
    lng: 113.3345211,
    lat: 23.10229,
    markers: [], // 标记的学校
    desc: null, // 选择标记学校的简介
    polygons: [] // 多边形，表示覆盖的区域
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapHouse(event) {

    },

    tapList(event) {

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

      var intro = '箐蓉小学入学登记范围为A+B部分，其中：A部分：天府大道以东，世纪城以南，科华路与下新街以西、老城区沙发上防守打法发发发'
      if (intro.length > 50) {
        intro = intro.substr(0, 50) + '...'
      }

      this.hasSelectedMarker = true

      this.setData({
        markers: markers,
        desc: {
          name: markerData.content,
          typeStr: '小学',
          areaStr: '天府新区',
          natureStr: '公办',
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
    }
  }
})