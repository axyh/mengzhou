const api = require('../../api/api')
Page({
  data: {
    content: '',
    safe_bottom: getApp().globalData.safeBottom,
    comment_id: '',
    comment: null
  },
  onLoad: function (options) {
    this.setData({
      comment_id: options.comment_id
    }, () => {
      this.initData()
    })
  },
  async initData() {
    let res = await api.get_comment_detail({
      comment_id: this.data.comment_id
    });
    this.setData({
      comment: res.result.data
    })
  },
  async handle_comment() {
    let res = await api.comment_add({
      artical_id: this.data.comment.artical_id,
      reply_comment_id: this.data.comment_id,
      accepter_openid: this.data.comment.sender_openid,
      content: this.data.content,
      type: 'reply'
    });
    if (res) {
      wx.navigateBack({
        delta: 0,
      }, () => {
        wx.showToast({
          title: '发送成功',
        })
      })
    }
  },
  bindinput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  onShareAppMessage: function () {

  }
})