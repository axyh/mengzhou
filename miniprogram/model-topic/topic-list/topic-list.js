const api = require('../../api/api');
Page({
  data: {
    list: [],
    page: 0,
  },

  onLoad: function (options) {
    this.getTopics()
  },
  async getTopics() {
    let res = await api.topic_list({
      page: this.data.page,
      limit: 20
    });
    if (res) {
      this.setData({
        list: this.data.page === 0 ? res.result.data : this.data.list.concate(res.result.data)
      })
    }
  },


  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})