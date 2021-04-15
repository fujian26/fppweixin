// components/msg/listitem/listitem.js
Component({

  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    recentDialog: {
      type: Object
    }
  },

  observers: {
    'recentDialog': function (recentDialog) {
      this.refreshData(recentDialog)
    }
  },

  created() {

    setTimeout(() => {
      this.refreshData(this.properties.recentDialog)
    }, 32);
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: '',
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    optimizeShowTime(originalTime) {

      var strs = originalTime.split(' ')

      var targetDate = new Date(originalTime)
      var nowDate = new Date()

      if (targetDate.getFullYear() == nowDate.getFullYear() &&
        targetDate.getMonth() == nowDate.getMonth() &&
        targetDate.getDate() == nowDate.getDate()) { // 同一天

        var times = strs[1]
        var hour = times.split(':')[0]
        var min = times.split(':')[1]
        this.setData({
          showTime: hour + ':' + min
        })
      } else {
        this.setData({
          showTime: strs[0]
        })
      }
    },

    tapItem(event) {
      console.log('tapItem')
      var recentDialog = this.properties.recentDialog
      wx.setStorage({
        data: recentDialog,
        key: 'recentDialog',
        success(res) {
          wx.navigateTo({
            url: '/pages/msg/dialog/dialog?title=' + recentDialog.otherUser.nick + '&dialogId=' + recentDialog.dialogId + '&unReadCount=' + recentDialog.unread,
            fail(res) {
              console.error('tapItem fail', res)
            }
          })
        },
        fail(res) {
          console.error('tapItem fail ' + res.errMsg)
          wx.showToast({
            title: '数据错误',
            icon: 'none'
          })
        }
      })
    },

    refreshData(recentDialog) {
      var content = ''

      if (recentDialog.unread > 0) {
        content = '[' + recentDialog.unread + '条未读消息] '
      }

      if (recentDialog.lastMsg != null) {
        switch (recentDialog.lastMsg.type) {
          case 0:
            content += recentDialog.lastMsg.contentObj
            break;
          case 1:
            content += '[图片]'
            break
          case 2:
            content += '[视频]'
            break
          case 3:
            content += '[房源]'
            break
          case 4:
            content += '[房源]'
            break
          case 5:
            content += '[语音]'
            break
          default:
            break;
        }

        console.log('last msg', recentDialog.lastMsg)
        this.optimizeShowTime(recentDialog.lastMsg.create_time)
      }

      this.setData({
        content: content
      })
    },
  }
})