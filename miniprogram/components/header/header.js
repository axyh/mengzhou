Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showBack: {
      type: Boolean,
      value: false
    },
    fullWidth: {
      type: Boolean,
      value: false
    },
    bg: {
      type: String,
      value: "#eeeeee"
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
        width: this.data.fullWidth ? '100%' : `${getApp().globalData.safeWidth}px`
      })
    }
  },
  methods: {
    handel_back() {
      wx.navigateBack({
        delta: 1,
        fail() {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      })
    }
  }
})