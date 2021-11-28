const api = require('../../api/api')
const utils = require('../../utils/utils')
Page({
  data: {
    page: 0,
    list: []
  },
  onLoad: function (options) {
    this.getList()
  },
  async getList() {
    let res = await api.message_list({
      page: this.data.page
    });
    this.setData({
      list: this.data.page === 0 ? res.result.data : this.data.list.concat(res.result.data),
      page: this.data.page + 1
    }, () => {
      wx.stopPullDownRefresh()
    })
    console.log(res)
  },
  onPullDownRefresh: function () {

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
})