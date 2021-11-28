const api = require("../../api/api")
Page({
  data: {},
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  handel_author_userinfo: async function (info) {
    if (info.detail.errMsg === 'getUserInfo:ok') {
      wx.showLoading({
        title: '正在登陆',
        mask: true,
      });
      await api.login({
        name: info.detail.userInfo.nickName,
        avatar: info.detail.userInfo.avatarUrl,
      })
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      wx.hideLoading();
      wx.showToast({
        title: '授权失败',
        icon: 'none',
      })
    }
  },
  getUserProfile: function () {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于个人中心展示', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: async (res) => {
        wx.showLoading({
          title: '正在登陆',
          mask: true,
        });
        await api.login(
          res.userInfo.nickName,
          res.userInfo.avatarUrl,
        )
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  },
})