// components/house/filters/roomtype/roomtype.js
let tag = 'components/house/filters/roomtype/roomtype.js'
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
    types: [{
        name: '一室',
        num: 1
      },
      {
        name: '二室',
        num: 2
      },
      {
        name: '三室',
        num: 3
      },
      {
        name: '四室',
        num: 4
      },
      {
        name: '四室以上',
        num: 5
      }
    ],
    selectIndex: -1
  },

  attached() {

    console.log(tag + ' attached')

    let that = this
    let types = this.data.types

    wx.getStorage({
      key: 'selectRoomType',
      success(res) {
        
        let type = res.data
        if (type == null) {
          return
        }

        for (var i = 0; i < types.length; i++) {
          if (types[i].num == type.num) {
            that.setData({
              selectIndex: i
            })
            break
          }
        }
      },
      fail(res) {
        console.error(tag + ' attached getStorage ' + res.errMsg)
      }
    })    
  },

  /**
   * 组件的方法列表
   */
  methods: {

    tapItem(event) {
      let index = event.currentTarget.dataset.index
      let selectIndex = this.data.selectIndex
      console.log('tapItem index: ' + index)
      this.setData({
        selectIndex: selectIndex != index ? index : -1
      })
    },

    tapConfirm(event) {

      console.log('tapConfirm')
      let types = this.data.types
      let selectIndex = this.data.selectIndex
      var type = null

      if (selectIndex >= 0) {
        type = types[selectIndex]
      }

      let that = this

      wx.setStorage({
        data: type,
        key: 'selectRoomType',
        success(res) {

          var eventDetail = {
            type: 1
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
  }
})