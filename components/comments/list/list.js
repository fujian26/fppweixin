// components/comments/list/list.js
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    commentsNum: {
      type: Number,
      value: 0
    },
    comments: {
      type: Array
    },
    limitNum: {
      type: Number,
      value: 3
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showComments: []
  },

  attached() {

    setTimeout(() => {

      let limitNum = this.properties.limitNum
      let oldDatas = this.properties.comments
      var newDatas = []

      if (limitNum > 0) {
        for (var i = 0; i < limitNum && i < oldDatas.length; i++) {
          newDatas.push(oldDatas[i])
        }

        this.setData({
          comments: newDatas
        })
      }
    }, 100);
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})