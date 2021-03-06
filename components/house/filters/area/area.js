// components/house/filters/area/area.js
let tag = 'components/house/filters/area/area.js'
let app = getApp()
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    cityCode: {
      type: String,
      value: app.globalData.cityCode
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    areas: [{
      code: '0',
      name: '不限'
    }],
    subs: {
      '0': [{
        code: 0,
        name: '不限'
      }]
    },
    streets: [],
    selectAreaIndex: 0,
    selectStreetIndex: 0,
  },

  attached() {
    console.log(tag + ' attached')

    let that = this

    wx.getStorage({
      key: 'areas',
      success(res) {

        let areas = res.data
        if (areas == null || areas.length == 0) {
          console.error(tag + ' areas == null || areas.length == 0')
          that.getAreas()
          return
        }

        that.data.areas = areas
        that.setData({
          areas: areas
        })

        wx.getStorage({
          key: 'streets',
          success(res) {
            let streets = res.data
            if (streets == null || streets.length == 0) {
              console.error(tag + ' streets == null || streets.length == 0')
              that.getAreas()
              return
            }

            that.data.streets = streets
            that.setData({
              streets: streets
            })

            wx.getStorage({
              key: 'selectArea',
              success(res) {
                let selectArea = res.data
                if (selectArea == null) {
                  console.error(tag + ' selectArea == null')                  
                  return
                }

                let areas = that.data.areas
                let streets = that.data.streets

                if (selectArea.area != null) {
                  for (var i = 0; i < areas.length; i++) {
                    if (areas[i].code == selectArea.area.code) {
                      that.setData({
                        selectAreaIndex: i
                      })
                      break
                    }
                  }
                }

                if (selectArea.street != null) {
                  for (var i = 0; i < streets.length; i++) {
                    if (streets[i].code == selectArea.street.code) {
                      that.setData({
                        selectStreetIndex: i
                      })
                      break
                    }
                  }
                }
              },
              fail(res) {
                console.error(tag + ' attached getStorage selectArea ' + res.errMsg)
                that.getAreas()
              }
            })
          },
          fail(res) {
            console.error(tag + ' attached getStorage streets ' + res.errMsg)
            that.getAreas()
          }
        })
      },
      fail(res) {
        console.error(tag + ' attached getStorage areas ' + res.errMsg)
        that.getAreas()
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAreas() {

      let that = this
      let cityCode = this.properties.cityCode
      var areas = this.data.areas

      wx.request({
        url: app.globalData.baseUrl + '/addr/getCityAreas',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/json'
        },
        data: {
          'cityCode': cityCode
        },
        success(res) {
          if (res.data.code != 0) {
            console.error(tag + ' getAreas ' + res.data.msg)
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
            return
          }

          if (res.data.data == null) {
            console.error(tag + ' getAreas res.data.data == null')
            wx.showToast({
              title: '数据错误',
              icon: 'none'
            })
            return
          }

          areas = areas.concat(res.data.data)
          wx.setStorage({
            data: areas,
            key: 'areas',
            success(res) {

            },
            fail(res) {
              console.error(tag + ' setStorage areas ' + res.errMsg)
            }
          })

          that.setData({
            areas: areas
          })

          that.data.areas = areas
          that.getStreets()
        },
        fail(res) {
          console.error(tag + ' getAreas ' + res.errMsg)
          wx.showToast({
            title: '数据错误 ' + res.errMsg,
            icon: 'none'
          })
        }
      })
    },

    getStreets() {

      let that = this
      let selectAreaIndex = this.data.selectAreaIndex
      let area = this.data.areas[selectAreaIndex]
      let subs = this.data.subs

      this.setData({
        selectStreetIndex: 0
      })

      var streets = subs[area.code]
      if (streets != null) {
        this.setData({
          streets: streets
        })
        return
      }

      wx.showLoading({
        title: '',
      })

      wx.request({
        url: app.globalData.baseUrl + '/addr/getAreaStreets',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/json'
        },
        data: {
          'areaCode': area.code
        },
        success(res) {
          if (res.data.code != 0) {
            console.error(tag + ' getStreets res.data.code != 0, msg: ' + res.data.msg)
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
            that.setData({
              streets: [{
                code: 0,
                name: '不限'
              }]
            })
            return
          }

          if (res.data.data == null || res.data.data.length == 0) {
            console.error(tag + ' getStreets res.data.data == null || res.data.data.length == 0')
            that.setData({
              streets: [{
                code: 0,
                name: '不限'
              }]
            })
            return
          }

          streets = [{
            code: '0',
            name: '不限'
          }]

          streets = streets.concat(res.data.data)
          subs[area.code] = streets

          wx.setStorage({
            data: streets,
            key: 'streets',
            success(res) {

            },
            fail(res) {
              console.error(tag + ' setStorage streets ' + res.errMsg)
            }
          })

          that.setData({
            streets: streets,
            subs: subs
          })
        },
        fail(res) {
          console.error(tag + ' getStreets ' + res.errMsg)
          wx.showToast({
            title: '数据错误 ' + res.errMsg,
            icon: 'none'
          })
          that.setData({
            streets: [{
              code: 0,
              name: '不限'
            }]
          })
        },
        complete(res) {
          wx.hideLoading({
            success: (res) => {},
          })
        }

      })
    },

    tapArea(event) {
      let index = event.currentTarget.dataset.index
      console.log('tapArea index: ' + index)

      this.data.selectAreaIndex = index
      this.setData({
        selectAreaIndex: index
      })
      this.getStreets()
    },

    tapStreet(event) {

      let index = event.currentTarget.dataset.index
      console.log('tapStreet index: ' + index)

      this.setData({
        selectStreetIndex: index
      })

    },

    tapConfirm(event) {
      console.log('tapConfirm')
      let areas = this.data.areas
      let streets = this.data.streets
      let area = areas[this.data.selectAreaIndex]
      let street = streets[this.data.selectStreetIndex]

      var data = {
        area: area,
        street: street
      }

      let that = this

      wx.setStorage({
        data: data,
        key: 'selectArea',
        success(res) {

          var eventDetail = {
            type: 0
          }
          var eventOption = {}
          that.triggerEvent('onConfirmed', eventDetail, eventOption)
        },
        fail(res) {
          console.error('数据错误 ' + res.errMsg)
          that.triggerEvent('onConfirmed')
        }
      }, )
    }
  },
})