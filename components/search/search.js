// components/search/search.js
let tag = 'components/search/search.js'
Component({
  
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    hint: {
      type: String,
      value: '请输入要查询的内容'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSearchInput(event) {    

      let value = event.detail.value
      console.log(tag + ' onSearchInput value ' + value)
      
      var eventDetail = { // detail对象，提供给事件监听函数
        value: value
      }

      var eventOption = {} // 触发事件的选项

      this.triggerEvent('onSearchInput', eventDetail, eventOption)
    },

    // 获得焦点
    onFocused(event) {
      console.log(tag + ' onFocused')
      this.triggerEvent('onFocused')
    },

    doSearch(event) {
      let value = event.detail.value
      console.log(tag + ' doSearch value ' + value)
      
      var eventDetail = { // detail对象，提供给事件监听函数
        value: value
      }

      var eventOption = {} // 触发事件的选项

      this.triggerEvent('doSearch', eventDetail, eventOption)
    }
  }
})