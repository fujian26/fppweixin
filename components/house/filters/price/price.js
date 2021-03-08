// components/house/filters/price/price.js
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
    prices: [{
        name: '50万以下',
        startPrice: 500000,
        endPrice: 0,
      },
      {
        name: '50-90万',
        startPrice: 500000,
        endPrice: 900000,
      },
      {
        name: '90-150万',
        startPrice: 900000,
        endPrice: 1500000,
      },
      {
        name: '150-200万',
        startPrice: 1500000,
        endPrice: 2000000,
      },
      {
        name: '200-300万',
        startPrice: 2000000,
        endPrice: 3000000,
      },
      {
        name: '300万以上',
        startPrice: 3000000,
        endPrice: -1,
      }
    ],
    selectIndex: -1,
    lowPrice: 0,
    highPrice: 0
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

    onLowInput(event) {
      let value = event.detail.value
      console.log('onLowInput value: ' + value)
      this.data.lowPrice = value
    },

    onHighInput(event) {
      let value = event.detail.value
      console.log('onHighInput value: ' + value)
      this.data.highPrice = value
    },

    onEditFocus(event) {
      console.log('onEditFocus')
      this.setData({
        selectIndex: -1
      })
    },

    tapConfirm(event) {

      console.log('tapConfirm')
      let prices = this.data.prices
      let selectIndex = this.data.selectIndex
      let lowPrice = this.data.lowPrice
      let highPrice = this.data.highPrice

      var price = null

      if (selectIndex >= 0) {
        price = prices[selectIndex]
      } else {
        if (lowPrice >= 0 && highPrice > lowPrice) {
          price = {
            name: lowPrice + '-' + highPrice + '万',
            startPrice: lowPrice * 10000,
            endPrice: highPrice * 10000,
          }
        }
      }

      let that = this

      wx.setStorage({
        data: price,
        key: 'selectPrice',
        success(res) {

          var eventDetail = {
            type: 2
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