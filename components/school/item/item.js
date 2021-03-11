// components/school/item/item.js
let tag = 'components/school/item/item.js'
let app = getApp()
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    ext: {
      type: Object
    },
    showAddr: {
      type: Boolean,
      value: true
    }
  },

  attached() {
    setTimeout(() => {

      let ext = this.properties.ext
      let showAddr = this.properties.showAddr
      console.log(tag + ' attatched school name: ' + ext.school.name + ', showAddr: ' + showAddr)

      var tagUrl = ''

      switch (ext.school.type) {
        case 0:
          tagUrl = '/images/kindergarten-tag.png'
          break
        case 1:
          tagUrl = '/images/primary-school-tag.png'
          break
        case 2:
          tagUrl = '/images/middle-school-tag.png'
          break
        case 3:
          tagUrl = '/images/training-school-tag.png'
        default:
          console.error('unknown school type: ' + ext.school.type)
          break
      }

      this.setData({
        tagUrl: tagUrl
      })

    }, 100);
  },

  /**
   * 组件的初始数据
   */
  data: {
    tagUrl: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapItem() {

      console.log('tapItem')
      let ext = this.properties.ext

      wx.setStorage({
        data: ext,
        key: 'schoolExt',
        success(res) {
          wx.navigateTo({
            url: '/pages/school/detail/detail',
            fail(res) {
              console.log(tag + ' navigateTo school detail fail ' + res.errMsg)
            }
          })
        },
        fail(res) {
          console.log(tag + ' setStorage school fail ' + res.errMsg)
        }
      })
    }
  }
})