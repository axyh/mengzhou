//app.js
App({
  onLaunch: async function (options) {
    this.check_up();
    this.getHeaderNums();
    if (!wx.cloud) {
      wx.showModal({
        title: '系统提示',
        content: '请升级微信'
      })
    } else {
      wx.cloud.init({
        // env: 'dev-okzbv',
        env: 'pro-4u868',
        traceUser: true,
      });
      wx.cloud.callFunction({
        name: 'Users'
      });
      wx.cloud.callFunction({
        name: 'Artical'
      });
      wx.cloud.callFunction({
        name: 'Utils'
      });
    }

  },
  globalData: {},

  check_up: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          wx.setStorageSync('showTip', true)
          updateManager.onUpdateReady(function () {
            updateManager.applyUpdate()
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
  },
  getHeaderNums: function () {
    let systemInfo = wx.getSystemInfoSync();
    let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
    let navBarHeight = (function () { //导航栏高度
      let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
      return 2 * gap + rect.height;
    })();
    let rightSpace = systemInfo.windowWidth - wx.getMenuButtonBoundingClientRect().right
    let bounceWidth = wx.getMenuButtonBoundingClientRect().width
    let windowWidth = systemInfo.windowWidth
    this.globalData = {
      statusBarHeight: systemInfo.statusBarHeight,
      safeHeight: navBarHeight,
      safeWidth: windowWidth - bounceWidth - rightSpace,
      navHeight: systemInfo.statusBarHeight + navBarHeight,
      safeBottom: systemInfo.screenHeight - systemInfo.safeArea.bottom
    }
  }
})