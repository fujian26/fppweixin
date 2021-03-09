// components/house/item/item.js
let tag = 'components/house/item/item.js'
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    house: {
      type: Object
    },
    community: {
      type: Object
    }
  },

  attached() {

    setTimeout(() => {
      
      let house = this.properties.house
      let community = this.properties.community

      var areaStr = community.area_name + '-' + community.name
      
      var line2Str = house.roomShowStr
      line2Str += ' | ' + house.square + '㎡'
      line2Str += ' | ' + house.towards
      line2Str += ' | ' + house.floor_num + '/' + house.floor_total + '层'

      var line3Str = '市场价: ' + house.totalPriceStr + '万'

      this.setData({
        areaStr: areaStr,
        line2Str: line2Str,
        line3Str: line3Str
      })

    }, 100);
  },

  /**
   * 组件的初始数据
   */
  data: {
    areaStr: '',
    line2Str: '',
    line3Str: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

    tapItem(event) {

      console.log('tapItem')
      let house = this.data.house
  
      wx.setStorage({
        data: house,
        key: 'house',
        success(res) {
          wx.navigateTo({
            url: '/pages/house/detail/detail',
            fail(res) {
              console.error(tag + ' navigateTo house detail fail ' + res.errMsg)
            }
          })
        },
        fail(res) {
          console.log(tag + ' setStorage house fail ' + res.errMsg)
        }
      })
    },
  }
})
