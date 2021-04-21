// pages/news/detail/detail.js
import config from '../../../config.js'
let app = getApp()
let TAG = 'news-detail.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    title: '新闻咨询',
    newsDetail: null,
    html: '',
    scrollHeight: 0,
    comments: [],
    commentsTotal: 0,
    showEdit: false,
    pageShowed: false,
    fromWhere: '',
    author: '',
    publishTimeStr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this

    wx.createSelectorQuery()
      .in(that)
      .select('#basebar')
      .boundingClientRect()
      .exec(function (res) {
        console.log(TAG + ' createSelectorQuery res ' + res[0].height) // unit is px
        var basebarHeight = res[0].height * app.globalData.pixelRatio
        that.setData({
          scrollHeight: app.globalData.screenHeight - basebarHeight
        })
      })

    console.log(TAG + ' onLoad id ' + options.newsId + ' title ' + options.title)
    if (options.title != null) {
      this.setData({
        title: options.title
      })
    }

    console.log('options.newsId: ' + options.newsId)
    this.data.id = options.newsId
    this.getNewsDetail(options.newsId)
    this.addVisitCount(options.newsId)
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
    if (this.data.pageShowed) {
      this.getComments()
    }
    this.data.pageShowed = true
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getNewsDetail(newsId) {

    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/news/getDetail',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        newsId: newsId
      },
      success(res) {
        console.log(TAG + ' getNewsDetail success')
        if (res.data.code != 0) {
          console.error(TAG + ' getNewsDetail success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {
          var newsDetail = res.data.data
          if (newsDetail == null) {
            console.error(TAG + ' getNewsDetail newsDetail == null')
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
            return
          }

          var author = ''
          if (newsDetail.news_author != null && newsDetail.news_author.length > 0) {
            author = newsDetail.news_author + ' '
          }

          var fromWhere = ''
          if (newsDetail.from_where != null && newsDetail.from_where.length > 0) {
            fromWhere = '转: ' + newsDetail.from_where
          }

          var publishTimeStr = ''
          if (fromWhere.length > 0 || author.length > 0) {
            publishTimeStr = ' | '
          }
          publishTimeStr += newsDetail.publish_time

          console.log('newsDetail.file_path ' + newsDetail.file_path)

          that.getHtmlContent(newsDetail.id, newsDetail.file_path)
          that.getComments()

          that.setData({
            newsDetail: newsDetail,
            fromWhere: fromWhere,
            author: author,
            publishTimeStr: publishTimeStr
          })
        }
      },
      fail(res) {
        console.log(TAG + ' getNewsDetail fail res ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
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

  getHtmlContent(id, url) {

    let that = this

    wx.request({
      url: url,
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          html: res.data
        })
        that.addWatchNum(id)
      },
      fail(res) {
        wx.showToast({
          title: '数据错误',
          icon: ''
        })
        console.error(TAG + ' getHtmlContent fail ' + res.errMsg)
      }
    })
  },

  tapComment(event) {
    var index = event.currentTarget.dataset.index
    console.log(TAG + ' tapComment index ' + index)
  },

  addWatchNum(newsId) {

    let that = this

    console.log('addWatchNum ' + newsId)

    if (app.globalData.token == null || app.globalData.token.length == 0) {
      return
    }

    wx.request({
      url: app.globalData.baseUrl + '/news/addWatchNum',
      data: {
        newsId: newsId
      },
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('addWatchNum code ' + res.data.code)
      },
      fail(res) {
        console.error(TAG + ' addWatchNum fail ' + res.errMsg)
      }
    })

  },

  getComments() {

    let that = this
    let id = this.data.id

    wx.request({
      url: app.globalData.baseUrl + '/comments/getList',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "id": id,
        "type": 2,
        "pageIndex": 0,
        "pageSize": 20
      },
      success(res) {
        console.log(TAG + ' getComments success')
        if (res.data.code != 0) {
          console.error(TAG + ' getComments success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据错误 ' + res.data.msg,
            icon: 'none'
          })
        } else {
          var comments = res.data.data
          if (comments == null) {
            console.error(TAG + ' getComments comments == null')
            wx.showToast({
              title: '数据错误 ' + res.data.msg,
              icon: 'none'
            })
            return
          }

          var showComments = []

          for (var i = 0; i < 5 && i < comments.length; i++) {
            showComments.push(comments[i])
          }

          that.setData({
            comments: showComments,
            commentsTotal: res.header.total
          })
        }
      },
      fail(res) {
        console.error(TAG + ' getComments fail res ' + res.errMsg)
        wx.showToast({
          title: '数据错误 ' + res.errMsg,
          icon: 'none'
        })
      },
      complete(res) {}
    })
  },

  tapMoreComments(event) {
    console.log('tapMoreComments')
    let id = this.data.id

    wx.navigateTo({
      url: '/pages/comments/comments?id=' + id + '&type=2',
      success: function (res) {

      },
      fail(res) {
        console.error(tag + ' tapMoreComments fail ' + res.errMsg)
      }
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

    let id = this.data.id
    let that = this
    let commentsTotal = Number(this.data.commentsTotal)
    let comments = this.data.comments

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/comments/addNewsComment',
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "newsId": Number(id),
        "comment": {
          "content": content
        }
      },
      success(res) {
        console.log(TAG + ' sendComment success')
        if (res.data.code != 0) {
          console.error(TAG + ' sendComment success code != 0, msg ' + res.data.msg)

          if (res.data.code == config.server.tokenCode) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: config.server.tokenExpiredTip,
              success (res) {
                if (res.confirm) {
                  
                } else if (res.cancel) {
                  
                }
              }
            })
          } else {
            wx.showToast({
              title: '评论失败 ' + res.data.msg,
              icon: 'none'
            })
          }
        } else {
          var comment = res.data.data
          if (comment == null) {
            console.error(TAG + ' sendComment comment == null')
            wx.showToast({
              title: '评论失败 ' + res.data.msg,
              icon: 'none'
            })
            return
          }

          if (commentsTotal < 5) {
            comments.unshift(comment)
          }
          that.setData({
            comments: comments,
            commentsTotal: commentsTotal + 1,
            lastCommentValue: ''
          })
        }
      },
      fail(res) {
        console.error(TAG + ' sendComment fail res ' + res.errMsg)
        wx.showToast({
          title: '评论失败 ' + res.errMsg,
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

  addVisitCount(newsId) {
    wx.request({
      url: app.globalData.baseUrl + '/user/visitNews',
      method: "GET",
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        newsId: Number(newsId)
      },
      success(res) {
        if (res.data.code != 0) {
          console.error('addVisitCount res.data.code != 0', res.data.msg)
        }
      },
      fail(res) {
        console.error('addVisitCount fail', res.errMsg)
      }
    })
  }  
})