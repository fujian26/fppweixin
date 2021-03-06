// pages/house/community/detail/detail.js
import config from '../../../../config.js'
import util from '../../../../utils/util'

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
    showEdit: false,
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
        that.addVisitCount(community.id)

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

        if (community.tags != null && community.tagList != null) {
          for (var i = 0; i < community.tagList.length; i++) {
            tags.push({
              str: community.tagList[i],
              color: '#99CCFF',
              textColor: '#3E66D5'
            })
          }
        }

        var streetName = community.street_name != null && community.street_name.length > 0 ? ('-' + community.street_name) : ''
        var locationStr = community.city_name + '-' + community.area_name +
          '-' + community.detail_addr

        that.setData({
          community: community,
          tagListLocal: tags,
          locationStr: locationStr
        })

        that.getAttentionData(community.id)
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
    if (this.data.community != null) {
      this.getComments(this.data.community)
    }
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

  tapHotTopic(event) {
    console.log('tapHotTopic')
  },

  tapSendComment(event) {
    console.log('tapSendComment')

    if (util.isStringEmpty(app.globalData.token)) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: config.server.tokenExpiredTip,
        success(res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })      
      return
    }

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
    this.doAttention()
  },

  tapMoreComments(event) {

    if (util.isStringEmpty(app.globalData.token)) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: config.server.tokenExpiredTip,
        success(res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })      
      return
    }    

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

          if (res.data.code == config.server.tokenCode) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: config.server.tokenExpiredTip,
              success(res) {
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

  },

  getAttentionData(communityId) {

    let that = this

    if (util.isStringEmpty(app.globalData.token)) {
      console.error('token is empty, no need to get getAttentionData')
      return
    }

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/queryCommunityAttention',
      method: 'GET',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "communityId": communityId
      },
      success(res) {
        console.log('getAttentionData success')
        if (res.data.code != 0 || res.data.data == null) {
          console.error('getAttentionData success code != 0, msg ' + res.data.msg)
          wx.showToast({
            title: '数据拉取失败' + res.data.msg,
            icon: 'none'
          })
        } else {

          that.setData({
            attentionNum: res.data.data.attentionCount,
            attentioned: res.data.data.attentioned,
          })
        }
      },
      fail(res) {
        console.error('getAttentionData fail res ' + res.errMsg)
        wx.showToast({
          title: '数据拉取失败',
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

  doAttention() {

    if (util.isStringEmpty(app.globalData.token)) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: config.server.tokenExpiredTip,
        success(res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })      
      return
    }

    let community = this.data.community
    if (community == null) {
      console.error(TAG + ' doAttention community == null')
      return
    }

    let oldAttentioned = this.data.attentioned
    let that = this

    wx.showLoading({
      title: '',
    })

    wx.request({
      url: app.globalData.baseUrl + '/house/attentionCommunity',
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        "communityId": community.id,
        "attention": !oldAttentioned
      },
      success(res) {
        console.log(TAG + ' doAttention success')
        if (res.data.code != 0 || res.data.data == null) {
          console.error(TAG + ' doAttention success code != 0, msg ' + res.data.msg)

          if (res.data.code == config.server.tokenCode) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: config.server.tokenExpiredTip,
              success(res) {
                if (res.confirm) {

                } else if (res.cancel) {

                }
              }
            })
          } else {
            wx.showToast({
              title: '操作失败 ' + res.data.msg,
              icon: 'none'
            })
          }
        } else {

          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })

          that.setData({
            attentionNum: res.data.data.attentionCount,
            attentioned: res.data.data.attentioned,
          })
        }
      },
      fail(res) {
        console.error(TAG + ' doAttention fail res ' + res.errMsg)
        wx.showToast({
          title: '操作失败',
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

  addVisitCount(communityId) {
    wx.request({
      url: app.globalData.baseUrl + '/user/visitCommunity',
      method: "GET",
      header: {
        'token': app.globalData.token,
        'content-type': 'application/json'
      },
      data: {
        communityId: Number(communityId)
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