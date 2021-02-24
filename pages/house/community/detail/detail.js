// pages/house/community/detail/detail.js
let TAG = 'community-detail.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    community: null,
    tagListLocal: [],
    attentioned: false,
    attentionNum: 0,
    locationStr: '',
    recommendIndex: 0,
    showEdit: false,
    recommendTags: [
      '同小区房源', '周边房源', '划片小区'
    ],
    commentsNum: 0,
    comments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this

    wx.getStorage({
      key: 'community',
      success(res) {

        var community = res.data

        var buildTypeStr = ''
        switch (community.building_type) {
          case 1:
            buildTypeStr = '小高层'
            break
          case 2:
            buildTypeStr = '花园洋房'
            break
          default:
            buildTypeStr = '高层'
            break
        }

        community.buildTypeStr = buildTypeStr

        var tags = []
        tags.push({
          str: buildTypeStr,
          color: '#3E66D5',
          textColor: '#FFFFFF'
        })

        if (community.tags != null) {
          for (var i = 0; i < community.tagList.length; i++) {
            tags.push({
              str: community.tagList[i],
              color: '#99CCFF',
              textColor: '#3E66D5'
            })
          }
        }

        var streetName = community.street_name != null && community.street_name.length > 0 ? ('-' + community.street_name) : ''
        var locationStr = community.city_name + '-' + community.area_name + streetName

        that.setData({
          community: community,
          tagListLocal: tags,
          locationStr: locationStr
        })

        that.getComments(community)
      },
      fail(res) {
        console.error(TAG + ' community get fail res: ' + res.errMsg)
        wx.showToast({
          title: '数据错误',
          icon: ''
        })
      }
    })

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tapAddr(event) {    

    let community = this.data.community
    console.log('tapAddr, lng: ' + community.lng + ', lat: ' + community.lat)

    wx.navigateTo({
      url: '/pages/map/show/show?lng=' + community.lng + '&lat=' + community.lat,
      success: function (res) {

      },
      fail(res) {
        console.error(tag + ' tapAddr fail ' + res.errMsg)
      }
    })
  },

  tapRecommendTab(event) {
    let index = event.currentTarget.dataset.index
    console.log('tapRecommendTab index: ' + index)
    this.setData({
      recommendIndex: index
    })
  },

  tapHotTopic(event) {
    console.log('tapHotTopic')
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

  tapAttention(event) {
    console.log('tapAttention')
  },

  tapMoreComments(event) {
    
    console.log('tapMoreComments')
    let community = this.data.community

    wx.navigateTo({
      // url: '/pages/map/show/show?lng=' + community.lng + '&lat=' + community.lat,
      url: '/pages/comments/comments?id=' + community.id + '&type=0',
      success: function (res) {

      },
      fail(res) {
        console.error(tag + ' tapMoreComments fail ' + res.errMsg)
      }
    })
  },

  tapCommentFinalSend(event) {

    console.log('tapCommentFinalSend')

    let community = this.data.community
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
        "communityId": community.id,
        "comment": {
          "content": content
        }
      },
      success(res) {
        console.log('tapCommentFinalSend success')
        if (res.data.code != 0) {
          console.error('tapCommentFinalSend success code != 0, msg ' + res.data.msg)
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

          comments.push(res.data.data)

          that.setData({
            comments: comments,
            commentsNum: commentsNum + 1,
            lastCommentValue: ''
          })
        }
      },
      fail(res) {
        console.error('tapCommentFinalSend fail res ' + res.errMsg)
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

  // 监听评论输入
  onCommentInput(event) {
    this.data.commentContent = event.detail.value
  },

  getComments(community) {

    let that = this

    wx.request({
      url: app.globalData.baseUrl + '/comments/getCommunity',
      method: 'GET',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "communityId": community.id,
        "pageIndex": 0,
        "pageSize": 20
      },
      success(res) {
        console.log('getComments success')
        if (res.data.code != 0) {
          console.error('getComments success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据拉取失败 ' + res.data.msg,
            icon: 'none'
          })
        } else {

          console.log('getComments res.data.header.total: ' + res.header.total)

          that.setData({
            comments: res.data.data,
            commentsNum: res.header.total
          })
        }
      },
      fail(res) {
        console.error('getComments fail res ' + res.errMsg)
        wx.showToast({
          title: '数据拉取失败',
          icon: 'none'
        })
      },
      complete(res) {}
    })

  }
})