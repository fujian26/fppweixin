// components/house/filters/more/more.js
let tag = 'components/house/filters/more/more.js'
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
    squares: [{
        name: '50㎡以下',
        start: 0,
        end: 50
      },
      {
        name: '50-90㎡',
        start: 50,
        end: 90
      },
      {
        name: '90-150㎡',
        start: 90,
        end: 150
      },
      {
        name: '150-200㎡',
        start: 150,
        end: 200
      },
      {
        name: '200㎡以上',
        start: 200,
        end: -1
      }
    ],
    squareIndex: -1,
    towards: [
      '南北', '朝南', '朝东', '朝北', '朝西'
    ],
    towardIndex: -1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapSquare(event) {
      let index = event.currentTarget.dataset.index
      let squareIndex = this.data.squareIndex
      console.log('tapSquare index: ' + index)
      this.setData({
        squareIndex: squareIndex == index ? -1 : index
      })
    },

    tapToward(event) {
      let index = event.currentTarget.dataset.index
      let towardIndex = this.data.towardIndex
      console.log('tapToward index: ' + index)
      this.setData({
        towardIndex: towardIndex == index ? -1 : index
      })
    },

    tapConfirm(event) {

      console.log('tapConfirm')
      let squares = this.data.squares
      let squareIndex = this.data.squareIndex
      let towards = this.data.towards
      let towardIndex = this.data.towardIndex

      var square = null
      var toward = null

      if (squareIndex >= 0) {
        square = squares[squareIndex]
      }

      if (towardIndex >= 0) {
        toward = towards[towardIndex]
      }

      let that = this
      var data = {
        square: square,
        toward: toward
      }

      wx.setStorage({
        data: data,
        key: 'selectMore',
        success(res) {

          var eventDetail = {
            type: 3
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