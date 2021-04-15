// components/msg/dialogitem/dialogitem.js
let app = getApp()
Component({

  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    msg: {
      type: Object
    },
    otherUser: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    user: null,
    senderIsMe: false
  },

  created() {
    setTimeout(() => {

      let msg = this.properties.msg

      this.setData({
        user: app.globalData.user,
        senderIsMe: msg.date == undefined && msg.sender_uid == app.globalData.uid
      })
    }, 64);
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
