// pages/comments/comments.js
let app = getApp()
let tag = '/pages/comments/comments.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    type: '0', // 0-community 1-house 2-news
    commentsNum: 0,
    comments: [],
    pageIndex: 0,
    showEdit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.id = Number(options.id)
    this.data.type = Number(options.type)

    this.loadDatas(true)
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
    console.log('onReachBottom')
    this.loadDatas(true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadDatas(showLoading) {

    let pageIndex = this.data.pageIndex
    let type = this.data.type
    let id = this.data.id
    var comments = this.data.comments

    let that = this

    if (showLoading) {
      wx.showLoading({
        title: '',
      })
    }

    wx.request({
      url: app.globalData.baseUrl + '/comments/getList',
      method: 'GET',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "id": id,
        "type": type,
        "pageIndex": pageIndex,
        "pageSize": 20
      },
      success(res) {
        console.log('loadDatas success')
        if (res.data.code != 0) {
          console.error(tag + ' loadDatas success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '加载失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          if (res.data.data == null || res.data.data.length == 0) {
            wx.showToast({
              title: pageIndex > 0 ? '没有数据了' : '没有数据',
              icon: 'none'
            })
            return
          }

          comments = comments.concat(res.data.data)

          var commentsNum = Number(res.header.total)

          that.setData({
            comments: comments,
            commentsNum: commentsNum,
            pageIndex: pageIndex + 1
          })
        }
      },
      fail(res) {
        console.error('loadDatas fail res ' + res.errMsg)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      },
      complete(res) {
        if (showLoading) {
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    })
  },

  tapSendComment(event) {
    console.log('tapSendComment')
    this.setData({
      showEdit: true
    })
  },

  tapSendComment(event) {
    console.log('tapSendComment')
    this.setData({
      showEdit: true
    })
  },

  tapHideEdit(event) {

    console.log('tapHideEdit')
    let nowEdit = this.data.commentContent

    this.setData({
      showEdit: false,
      lastCommentValue: nowEdit
    })
  },

  tapCommentFinalSend(event) {

    console.log('tapCommentFinalSend')

    let type = this.data.type
    let content = this.data.commentContent

    if (content == null || content.length == 0) {
      console.error('content == null || content.length == 0')
      wx.showToast({
        title: '内容不能为空',
        icon: ''
      })
      return
    }

    this.setData({
      showEdit: false,
      lastCommentValue: content
    })

    this.sendComment(content)
  },

  // 监听评论输入
  onCommentInput(event) {
    this.data.commentContent = event.detail.value
  },

  sendComment(content) {

    let type = this.data.type
    switch (type) {
      case 0: // commnity
        this.sendCommunityComment(content)
        break
      case 1: //hosue
        this.sendHouseComment(content)
        break
      default:
        console.error('sendComment non support type: ' + type)
        break
    }
  },

  sendCommunityComment(content) {

    let id = this.data.id
    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/comments/addCommunity',
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "communityId": id,
        "comment": {
          "content": content
        }
      },
      success(res) {
        console.log('sendCommunityComment success')
        if (res.data.code != 0) {
          console.error('sendCommunityComment success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '评论失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          wx.showToast({
            title: '评论成功',
            icon: 'none'
          })

          var comments = that.data.comments
          var commentsNum = that.data.commentsNum

          comments.unshift(res.data.data)

          that.setData({
            comments: comments,
            commentsNum: commentsNum + 1,
            lastCommentValue: ''
          })
        }
      },
      fail(res) {
        console.error('sendCommunityComment fail res ' + res.errMsg)
        wx.showToast({
          title: '评论失败',
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

  sendHouseComment(content) {

    let id = this.data.id
    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/comments/addHouseComment',
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "houseId": id,
        "comment": {
          "content": content
        }
      },
      success(res) {
        console.log('sendHouseComment success')
        if (res.data.code != 0) {
          console.error('sendHouseComment success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '评论失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          wx.showToast({
            title: '评论成功',
            icon: 'none'
          })

          var comments = that.data.comments
          var commentsNum = that.data.commentsNum

          comments.unshift(res.data.data)

          that.setData({
            comments: comments,
            commentsNum: commentsNum + 1,
            lastCommentValue: ''
          })
        }
      },
      fail(res) {
        console.error('sendHouseComment fail res ' + res.errMsg)
        wx.showToast({
          title: '评论失败',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })

  }
})