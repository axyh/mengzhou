/**
 * 200 success
 * 401 未登陆
 * 300 正常返回数据，会toast
 * 500 error
 */
function callback(res) {
  if (res.result.code === 200) {
    return res
  } else if (res.result.code === 401) {
    wx.hideLoading();
    wx.showModal({
      content: "未登陆",
      showCancel: false,
      confirmText: '好的',
      success() {
        wx.reLaunch({
          url: '/pages/login/login',
        });
      }
    });
    return null
  } else if (res.result.code === 300) { //会返回数据给页面
    wx.hideLoading();
    wx.showToast({
      title: res.result.msg,
      icon: 'none',
      duration: 2000
    });
    return res
  } else if (res.result.code === 400) {
    wx.hideLoading();
    wx.showModal({
      title: res.result.msg,
      showCancel: false,
      confirmText: '好的'
    })
    return null
  } else {
    wx.hideLoading();
    return res
  }
}
export default callback