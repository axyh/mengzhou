const api = require('../../api/api')
Page({
  data: {
    page: 0,
    topic: {},
    list: []
  },
  onLoad: function (options) {
    this.setData({
      topic_id: options.topic_id
    }, () => {
      this.getTopics();
      this.getList();
    })
  },
  async getTopics() {
    let res = await api.topic_list({
      where: {
        _id: this.data.topic_id
      }
    });
    if (res.result.data.length > 0) {
      this.setData({
        topic: res.result.data[0]
      })
    }
  },
  async getList() {
    let res = await api.get_artical_list({
      where: {
        status: 1,
        topic_id: this.data.topic_id
      },
      page: this.data.page
    });
    this.setData({
      list: this.data.page === 0 ? res.result.data : this.data.list.concat(res.result.data),
      page: this.data.page + 1
    }, () => {
      wx.stopPullDownRefresh()
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 0
    }, () => {
      this.getList();
    })
  },
  onReachBottom: function () {
    this.getList();
  },
  onShareAppMessage: function () {

  }
})