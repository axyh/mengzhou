const api = require('../../api/api')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    custom: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    attached: function () {
      this.setData({
        statusBarHeight: getApp().globalData.statusBarHeight,
        safeHeight: getApp().globalData.safeHeight,
        safeWidth: getApp().globalData.safeWidth,
        navHeight: getApp().globalData.navHeight,
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handel_delete(e) {
      let that = this;
      wx.vibrateLong();
      wx.showModal({
        title: "你确定要删除这条记录吗？",
        async success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '正在删除',
              mask:true
            })
            await api.remove_note(e.currentTarget.dataset.id)
            wx.hideLoading()
            let arr = that.data.list;
            let index = arr.findIndex((item) => item._id === e.currentTarget.dataset.id);
            arr.splice(index, 1)
            that.setData({
              list: arr
            })
          }
        }
      })
    }
  }
})