// pages/house/search/search.js
let tag = 'pages/house/search/search.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basebarHeight: 0,
    cityCode: '5101', //todo 暂定成都
    cityName: '成都', //todo 暂定成都
    tabs: [{
        name: '房源',
        pageIndex: 0,
      },
      {
        name: "小区",
        pageIndex: 0,
      },
    ],
    currentIndex: 0,
    selectArea: null,
    selectRoomType: null,
    selectPrice: null,
    selectMore: null,
    showFilters: false,
    filterIndex: 0,
    houses: [],
    housePageIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(() => {

      let that = this

      wx.createSelectorQuery()
        .in(that)
        .select('#basebar')
        .boundingClientRect()
        .exec(function (res) {
          console.log(tag + ' createSelectorQuery res ' + res[0].height) // unit is px
          var basebarHeight = res[0].height * app.globalData.pixelRatio
          that.setData({
            basebarHeight: basebarHeight
          })
        })

    }, 100)
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

  tapTab(event) {
    let index = event.currentTarget.dataset.index
    console.log('tapTab index: ' + index)

    this.setData({
      currentIndex: index
    })
  },

  tapFilterArea(event) {
    console.log('tapFilterArea')
    this.setData({
      showFilters: true,
      filterIndex: 0
    })
  },

  tapFilterRoomType(event) {
    console.log('tapFilterRoomType')
    this.setData({
      showFilters: true,
      filterIndex: 1
    })
  },

  tapFilterPrice(event) {
    console.log('tapFilterPrice')
    this.setData({
      showFilters: true,
      filterIndex: 2
    })
  },

  tapFilterMore(event) {
    console.log('tapFilterMore')
    this.setData({
      showFilters: true,
      filterIndex: 3
    })
  },

  onFilterConfirmed(event) {
    let type = event.detail.type
    let that = this
    console.log(tag + ' onFilterConfirmed type: ' + type)

    this.setData({
      showFilters: false
    })

    switch (type) {
      case 0: // 区域
        wx.getStorage({
          key: 'selectArea',
          success(res) {
            that.setData({
              selectArea: res.data
            })
          },
          fail(res) {
            console.error('onFilterConfirmed fail: ' + res.errMsg)
          }
        })
        break
      case 1: // 户型
        wx.getStorage({
          key: 'selectRoomType',
          success(res) {
            that.setData({
              selectRoomType: res.data
            })
          },
          fail(res) {
            console.error('onFilterConfirmed fail: ' + res.errMsg)
          }
        })
        break
      case 2: // 总价
        wx.getStorage({
          key: 'selectPrice',
          success(res) {            
            that.setData({
              selectPrice: res.data
            })
          },
          fail(res) {
            console.error('onFilterConfirmed fail: ' + res.errMsg)
          }
        })
        break
      case 3: // 更多
        wx.getStorage({
          key: 'selectMore',
          success(res) {
            that.setData({
              selectMore: res.data
            })
          },
          fail(res) {
            console.error('onFilterConfirmed fail: ' + res.errMsg)
          }
        })
        break
      default:
        console.error('onFilterConfirmed unsupport type: ' + type)
        break
    }
  },

  getHouses() {

    let selectArea = this.data.selectArea
    let selectRoomType = this.data.selectRoomType
    let selectPrice = this.data.selectPrice
    let selectMore = this.data.selectMore
    let housePageIndex = this.data.housePageIndex
    let that = this

    var areaCode = ''
    var streetCode = ''
    
    wx.showLoading({
      title: '',
    })

    
  }
})