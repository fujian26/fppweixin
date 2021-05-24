// pages/msg/dialog/dialog.js

import config from '../../../config.js'
import util from '../../../utils/util.js'

let app = getApp()
let tag = 'dialog.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    dialogId: 0,
    pageIndex: 0,
    refreshTrigger: false,
    recordMode: false,
    recording: false,
    msgs: [],
    otherUser: null,
    inputValue: '',
    svToView: '',
    svHeight: 0,
    unReadCount: 0,
    showMorePanel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this

    wx.getStorage({
      key: 'recentDialog',
      success(res) {
        that.setData({
          dialogId: res.data.dialogId,
          otherUser: res.data.otherUser
        })
        that.data.dialogId = res.data.dialogId
        that.getMsgs(true)
        that.clearUnread()
      }
    })

    wx.createSelectorQuery()
      .in(that)
      .select('#basebar')
      .boundingClientRect()
      .exec(function (res) {
        console.log('createSelectorQuery res ' + res[0].height) // unit is px
        var basebarHeight = res[0].height * app.globalData.pixelRatio
        that.setData({
          svHeight: app.globalData.screenHeight - basebarHeight - 130
        })
      })

    this.data.dialogId = options.dialogId
    this.data.unReadCount = Number(options.unReadCount)

    setTimeout(() => {
      this.setData({
        title: options.title
      })
    }, 64);

    this.initRecord()

    app.globalData.bus.on('dialogNewMsg', (msg) => {
      var dialogId = that.data.dialogId
      if (msg.dialog_id != dialogId) {
        console.error('dialog.js not match, dialogId: ' + dialogId)
        return
      }
      that.addNewMsgToUI(msg)

      app.globalData.bus.emit('clearDialogUnread', dialogId)

      app.globalData.unReadMsgNum--
      app.globalData.bus.emit('msgNum')
      
      this.sendReadMsgToServer([msg.id], [msg], msg.sender_uid)

      // that.updateMsgRead(msg.id)
    })

    // 已读通知
    app.globalData.bus.on('msgRead', (msgReadData) => {
      var dialogId = that.data.dialogId
      if (msgReadData.dialogId != dialogId) {
        console.warn('msgRead dialogId not match, dialogId: ' + dialogId)
        return
      }

      let msgs = that.data.msgs
      var readIdList = msgReadData.msgIdList
      var hasChanged = false

      for (var i = 0; i < msgs.length; i++) {

        if (readIdList != null && readIdList != 'undefined') {
          if (readIdList.length == 0) {
            break
          }

          var index = readIdList.indexOf(msgs[i].id)
          if (index >= 0) {
            msgs[i].receiver_read = true
            readIdList.splice(index, 1)
            hasChanged = true
          }
        } else {
          msgs[i].receiver_read = true
          hasChanged = true
        }
      }

      if (hasChanged) {
        that.setData({
          msgs: msgs
        })
      }
    })
  },

  updateMsgRead(msgId) {
    wx.request({
      url: app.globalData.baseUrl + '/msg/readMsg',
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        id: msgId
      },
      success(res) {
        if (res.data.code != 0) {

          console.error('updateMsgRead fail ' + res.data.msg)

          if (res.data.code == config.server.tokenCode) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: config.server.tokenExpiredTip,
              success(res) {}
            })
          }

          return
        }
      },
      fail(res) {
        console.error('updateMsgRead fail ' + res.errMsg)
      }
    })
  },

  initRecord() {

    var rm = wx.getRecorderManager()
    let that = this

    rm.onError(function (error) {
      console.error('record onError', error)
    })

    rm.onStop(function (res) {
      console.log('record onStop', res)
      if (res.duration < 2000) { // 小于2秒
        wx.showToast({
          title: '录制太短了',
          icon: 'none'
        })
        return
      }

      that.uploadFile(5, res.tempFilePath, res.duration / 1000)
    })
  },

  unInitRecord() {
    var rm = wx.getRecorderManager()
    rm.onError(null)
    rm.onStop(null)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.unInitRecord()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /// 增加时间标签
  addShowTimeInMsgs(msgs) {

    if (msgs == null || msgs == undefined || msgs.length == 0) {
      return
    }

    var datas = []

    for (var i = 0; i < msgs.length; i++) {
      if (typeof (msgs[i]) != 'string') {
        datas.push(msgs[i])
      }
    }

    if (datas.length == 0) {
      console.error('addShowTimeInMsgs datas.length == 0')
      return
    }

    msgs = []
    var date = '',
      lastTime = ''
    for (var i = 0; i < datas.length; i++) {

      var data = datas[i]
      var strs = data.create_time.split(' ')

      if (date.length == 0) {
        if (util.isToday(data.create_time)) {
          var times = strs[1].split(':')
          var hour = times[0]
          var min = times[1]
          date = hour + ":" + min
        } else {
          date = strs[0]
        }
      }

      if (lastTime.length > 0 && !util.isSameDay(lastTime, data.create_time)) {

        msgs.push({
          date: date
        })

        if (util.isToday(data.create_time)) {
          var times = strs[1].split(':')
          var hour = times[0]
          var min = times[1]
          date = hour + ":" + min
        } else {
          date = strs[0]
        }
      }

      lastTime = data.create_time
      msgs.push(data)
    }

    if (util.isToday(datas[datas.length - 1].create_time)) {
      var times = strs[1].split(':')
      var hour = times[0]
      var min = times[1]
      date = hour + ":" + min
    } else {
      date = strs[0]
    }

    msgs.push({
      date: date
    })

    return msgs
  },

  getMsgs(showLoading) {
    let dialogId = this.data.dialogId
    let pageIndex = this.data.pageIndex
    var msgs = this.data.msgs

    let that = this

    if (showLoading) {
      wx.showLoading({
        title: '',
      })
    }

    wx.request({
      url: app.globalData.baseUrl + '/msg/getMsgFromDialog',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        dialogId: dialogId,
        pageIndex: pageIndex,
        pageSize: 40
      },
      success(res) {
        if (res.data.code != 0) {
          console.error('getMsgs fail: ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
          return
        }

        if (res.data.data == null || res.data.data.length == 0) {
          console.error('getMsgs res.data.data == null || res.data.data.length == 0')
          if (pageIndex > 0) {
            wx.showToast({
              title: '没有数据了',
              icon: 'none'
            })
          }
          return
        }

        res.data.data.reverse()

        if (pageIndex == 0) {
          msgs = res.data.data
        } else {
          msgs = msgs.concat(res.data.data)
        }

        for (var i = 0; i < msgs.length; i++) {
          console.log('msg.contentObj', msgs[i].contentObj)
        }

        msgs = that.addShowTimeInMsgs(msgs)

        that.setData({
          pageIndex: pageIndex + 1,
          msgs: msgs,
          svToView: 'msg-' + (msgs.length - 1)
        })
      },
      fail(res) {
        console.error('getMsgs fail: ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
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

  loadMore(event) {
    this.getMsgs(false)
  },

  tapRecord(event) {
    let recordMode = this.data.recordMode
    this.setData({
      recordMode: !recordMode
    })
  },

  tapAdd(event) {
    this.switchMorePanel()
  },

  onInput(event) {
    this.data.inputValue = event.detail.value
  },

  tapSend(event) {

    let inputValue = this.data.inputValue

    console.log('tapSend, value: ' + inputValue)
    if (inputValue == null || inputValue == undefined || inputValue.length == 0) {
      wx.showToast({
        title: '必须输入内容',
        icon: 'none'
      })
      return
    }

    let dialogId = this.data.dialogId
    let otherUser = this.data.otherUser

    this.sendMsg({
      sender_uid: app.globalData.uid,
      dialog_id: dialogId,
      type: 0,
      create_time: util.formatTime(new Date()),
      receiver_uid: otherUser.uid,
      content: inputValue,
      contentObj: inputValue
    })
  },

  addNewMsgToUI(msg) {

    let that = this
    var msgs = this.data.msgs
    msgs.pop()
    msgs.push(msg)

    var times = msg.create_time.split(' ')[1]
    var hour = times.split(':')[0]
    var min = times.split(':')[1]
    msgs.push({
      date: hour + ":" + min
    })

    that.setData({
      msgs: msgs,
      inputValue: '',
      svToView: 'msg-' + (msgs.length - 1)
    })
  },

  sendMsg(msg) {

    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/msg/add',
      method: "POST",
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: msg,
      success(res) {
        if (res.data.code != 0) {

          console.error('sendMsg fail ' + res.data.msg)

          if (res.data.code == config.server.tokenCode) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: config.server.tokenExpiredTip,
              success(res) {}
            })
          } else {
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
          }

          return
        }

        that.addNewMsgToUI(res.data.data)
        app.globalData.bus.emit('newMsg', res.data.data)
      },
      fail(res) {
        console.error('sendMsg fail ' + res.errMsg)
        wx.showToast({
          title: '数据错误',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  startRecord(event) { // 开始录制
    console.log('startRecord')
    wx.getRecorderManager().start({
      duration: 60000
    })
    this.setData({
      recording: true
    })

    if (this.data.recordTimeout != null && this.data.recordTimeout != undefined) {
      clearTimeout(this.data.recordTimeout)
    }

    this.data.recordTimeout = setTimeout(() => {
      wx.showToast({
        title: '超过最长时长',
        icon: 'none'
      })
      this.endRecordInner()
    }, 60 * 1000);
  },

  endRecordInner() {
    wx.getRecorderManager().stop()
    this.setData({
      recording: false
    })
  },

  endRecord(event) { // 结束录制
    console.log('endRecord')
    this.endRecordInner()
  },

  clearUnread() {

    let dialogId = this.data.dialogId
    let that = this

    wx.request({
      url: app.globalData.baseUrl + '/msg/clearUnread',
      method: "POST",
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        id: dialogId
      },
      success(res) {

        if (res.data.code != 0) {
          console.error('clearUnread fail', res.data)

          if (res.data.code == config.server.tokenCode) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: config.server.tokenExpiredTip,
              success(res) {}
            })
          } else {
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
          }

          return
        }

        app.globalData.unReadMsgNum = app.globalData.unReadMsgNum - that.data.unReadCount
        app.globalData.bus.emit('msgNum')
        app.globalData.bus.emit('clearDialogUnread', dialogId)
      },
      fail(res) {
        console.error('clearUnread fail', res)
        wx.showToast({
          title: '数据错误',
          icon: 'none'
        })
      }
    })
  },

  sendReadMsgToServer(msgIdList, unReadMsgs, receiverUid) {

    var msgReadData = {
      dialogId: this.data.dialogId,
      receiverUid: receiverUid,
      msgIdList: msgIdList
    }

    var data = {
      uid: app.globalData.uid,
      type: 0,
      contentJson: JSON.stringify(msgReadData)
    }

    wx.sendSocketMessage({
      data: JSON.stringify(data),
      success(res) {
        console.log('send read operation success', res)
        for (var i = 0; i < unReadMsgs.length; i++) {
          unReadMsgs[i].receiver_read = true
        }
      },
      fail(res) {
        console.error('send read operation fail', res)
      }
    }, )

  },

  onSvScroll(event) {

    console.log('onSvScroll', event)
    clearTimeout(this.data.readCheckTimeOut)

    let msgs = this.data.msgs
    var unReadMsgs = []
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].receiver_uid == app.globalData.uid && !msgs[i].receiver_read) {
        unReadMsgs.push(msgs[i])
      }
    }

    console.log('unReadMsgs.length', unReadMsgs.length)

    if (unReadMsgs.length == 0) {
      return
    }

    this.data.readCheckTimeOut = setTimeout(() => {


      var receiverUid = -1
      var msgIdList = []

      for (var i = 0; i < unReadMsgs.length; i++) {
        msgIdList.push(unReadMsgs[i].id)
        receiverUid = unReadMsgs[i].sender_uid
      }

      this.sendReadMsgToServer(msgIdList, unReadMsgs, receiverUid)

    }, 1000);
  },

  switchMorePanel() {
    let showMorePanel = !this.data.showMorePanel
    let svHeight = showMorePanel ? (this.data.svHeight - 160) : (this.data.svHeight + 160)
    let msgs = this.data.msgs
    this.setData({
      showMorePanel: showMorePanel,
      svHeight: svHeight
    }, () => {
      this.setData({
        svToView: 'msg-' + (msgs.length - 1)
      })
    })
  },

  tapImage(event) {
    let that = this
    wx.chooseImage({
      count: 1,
      success(res) {
        that.uploadFile(1, res.tempFilePaths[0])
      },
      fail(res) {
        console.error('tapImage fail: ' + res.errMsg)
        wx.showToast({
          title: '操作失败 ' + res.errMsg,
        })
      }
    })
  },

  tapVideo(event) {
    console.log('tapVideo')
    let that = this
    wx.chooseVideo({
      camera: 'back',
      success(res) {
        that.uploadFile(2, res.tempFilePath)
      },
      fail(res) {
        console.error('tapVideo fail: ' + res.errMsg)
        wx.showToast({
          title: '操作失败 ' + res.errMsg,
        })
      }
    })
  },

  uploadFile(type, filePath, duration) {

    let that = this
    let dialogId = this.data.dialogId
    let otherUser = this.data.otherUser

    wx.showLoading({
      title: '',
    })

    wx.uploadFile({
      filePath: filePath,
      name: 'file',
      url: app.globalData.baseUrl + '/file/upload',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      success(res) {

        var data = JSON.parse(res.data)

        if (data.code != 0) {

          console.error('uploadFile fail 1 ' + data.msg)

          if (data.code == config.server.tokenCode) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: config.server.tokenExpiredTip,
              success(res) {}
            })
          } else {
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            })
          }

          return
        }

        wx.hideLoading({
          success: (res) => {},
        })

        var content = null

        console.log('--heihei, res: ', res)

        switch (type) {
          case 1: // 图片
            content = {
              url: data.data,
              width: 0,
              height: 0
            }
            break
          case 2: // 视频
            content = {
              url: data.data,
              width: 0,
              height: 0
            }
            break
          case 5: // 声音
            content = {
              url: data.data,
              duration: duration
            }
            break
          default:
            console.error('不支持的类型')
            wx.showToast({
              title: '数据错误',
              icon: ''
            })
            return
        }

        var contentStr = wx.arrayBufferToBase64(util.stringToByte(JSON.stringify(content)))

        that.sendMsg({
          sender_uid: app.globalData.uid,
          dialog_id: dialogId,
          type: type,
          create_time: util.formatTime(new Date()),
          receiver_uid: otherUser.uid,
          content: contentStr,
          contentObj: JSON.stringify(content)
        })
      },
      fail(res) {
        console.error('uploadFile fail 2 ' + res.errMsg)
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '操作失败 ' + res.errMsg,
          icon: 'none'
        })
      }
    })
  }
})