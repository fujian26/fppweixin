// pages/msg/msg.js
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
    refreshTrigger: false,
    pageIndex: 0,
    dialogs: []    
  },

  created() {
    this.getRecentDialogs()

    let that = this
    app.globalData.bus.on('newMsg', (msg) => {

      var dialogs = that.data.dialogs
      var foundDialog = false

      for (var i = 0; i < dialogs.length; i++) {

        if (dialogs[i].dialogId == msg.dialog_id) {
          foundDialog = true

          dialogs[i].lastMsg = msg
          if (msg.receiver_uid == app.globalData.uid) {          
            dialogs[i].unread++
          }
          that.setData({
            dialogs: dialogs
          })

          break
        }
      }

      if (!foundDialog) {
        console.error('newMsg not found dialog, dialog_id: ' + msg.dialog_id)
      }
    })

    /// 监听清除会话未读数事件
    app.globalData.bus.on('clearDialogUnread', (dialogId) => {
      
      var dialogs = that.data.dialogs
      var foundDialog = false

      for (var i = 0; i < dialogs.length; i++) {
        if (dialogs[i].dialogId == dialogId) {
          foundDialog = true
          dialogs[i].unread = 0
          break
        }
      }

      if (foundDialog) {
        that.setData({
          dialogs: dialogs
        })
      } else {
        console.error('clearDialogUnread not found dialog, dialogId: ' + dialogId)
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getRecentDialogs(showLoading) {

      let that = this
      let pageIndex = this.data.pageIndex
      var dialogs = this.data.dialogs

      if (showLoading) {
        wx.showLoading({
          title: '',
        })
      }

      wx.request({
        url: app.globalData.baseUrl + '/msg/getRecentDialogs',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/json'
        },
        data: {
          pageIndex: pageIndex,
          pageSize: 100
        },
        success(res) {
          if (res.data.code != 0) {
            console.error('getRecentDialogs fail', res)
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
            return
          }

          if (res.data.data == null || res.data.data.length == 0) {
            console.error('getRecentDialogs res.data.data == null || res.data.data.length == 0')
            if (pageIndex > 0) {
              wx.showToast({
                title: '没有数据了',
                icon: 'none'
              })
            }
            return
          }

          if (pageIndex == 0) {
            dialogs = res.data.data
          } else {
            dialogs = dialogs.concat(res.data.data)
          }

          var unReadCount = 0
          for (var i = 0; i < dialogs.length; i++) {
            unReadCount += dialogs[i].unread
          }
          app.globalData.unReadMsgNum = unReadCount
          app.globalData.bus.emit('msgNum')

          that.setData({
            pageIndex: pageIndex + 1,
            dialogs: dialogs
          })
        },
        fail(res) {
          console.error('getRecentDialogs fail', res)
          wx.showToast({
            title: '数据错误',
            icon: 'none'
          })          
        },
        complete(res) {
          if (showLoading) {
            wx.hideLoading({
              success: (res) => {},
            })
          } else {
            that.setData({
              refreshTrigger: false
            })
          }
        }
      })
    },

    onRefresh(event) {
      this.getRecentDialogs(false)
    },

    loadMore(event) {
      this.getRecentDialogs(true)
    }
  }
})
