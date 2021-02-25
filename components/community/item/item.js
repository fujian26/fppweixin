// components/community/item/item.js
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    community: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showName: '',
    typeStr: ''
  },

  attached() {

    setTimeout(() => {

      let community = this.properties.community

      if (community != null) {

        var showName = ''
        if (community.area_name != null && community.area_name.length > 0) {
          showName = '[' + community.area_name + '] '
        }

        showName += community.name

        var typeStr = ''
        switch (community.type) {
          case 1:
            typeStr = '商住'
            break
          case 2:
            typeStr = '公寓'
            break
          default:
            typeStr = '普通住宅'
        }

        this.setData({
          showName: showName,
          typeStr: typeStr
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