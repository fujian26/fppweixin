// pages/house/search/search.js
let tag = 'pages/house/search/search.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    areas: [{
        area_code: '510102',
        area_name: '高新区'
      },
      {
        area_code: '510104',
        area_name: '锦江区'
      },
      {
        area_code: '510116',
        area_name: '双流区'
      },
    ],
    selectArea: null,
    roomTypes: [{
        name: '一室',
        num: 1
      },
      {
        name: '二室',
        num: 2
      },
      {
        name: '三室',
        num: 3
      },
      {
        name: '四室',
        num: 4
      },
      {
        name: '四室以上',
        num: 5
      }
    ],
    selectRoomType: null,
    prices: [{
        name: '50万以下',
        startPrice: 500000,
        endPrice: 0,
      },
      {
        name: '50-90万',
        startPrice: 500000,
        endPrice: 900000,
      },
      {
        name: '90-150万',
        startPrice: 900000,
        endPrice: 1500000,
      },
      {
        name: '150-200万',
        startPrice: 1500000,
        endPrice: 2000000,
      },
      {
        name: '200-300万',
        startPrice: 2000000,
        endPrice: 3000000,
      },
      {
        name: '300万以上',
        startPrice: 3000000,
        endPrice: -1,
      }
    ],
    selectPrice: null,
    towards: [
      '南北', '朝南', '朝东', '朝北', '朝西'
    ],
    selectToward: null,
    squares: [{
        name: '50㎡以下',
        start: 0,
        end: 50,
      },
      {
        name: '50-80㎡',
        start: 50,
        end: 80,
      },
      {
        name: '80-110㎡',
        start: 80,
        end: 110,
      },
      {
        name: '110-150㎡',
        start: 110,
        end: 150,
      },
      {
        name: '150-200㎡',
        start: 150,
        end: 200,
      },
      {
        name: '200㎡以上',
        start: 200,
        end: -1,
      }
    ],
    selectSquare: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  },

  tapFilterRoomType(event) {
    console.log('tapFilterRoomType')
  },

  tapFilterPrice(event) {
    console.log('tapFilterPrice')
  },

  tapFilterMore(event) {
    console.log('tapFilterMore')
  }
})