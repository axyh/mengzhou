const api = require('../../api/api')
const utils = require('../../utils/utils')
Page({
    data: {
        page: 0,
        list: [],
        topicList: []
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        this.getUser()
        this.getList();
        this.getTopics();
    },
    async getUser() {
        let res = await api.getUser();
        wx.hideLoading()
        if (res) {
            this.setData({
                user: res.result.data.user[0] ?? null,
                text: res.result.data.text,
                message_count: res.result.data.message_count
            })
        }
    },
    async getList() {
        let res = await api.get_artical_list({
            where: {
                status: 1
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
    async getTopics() {
        let res = await api.topic_list({
            page: 0,
            limit: 5
        });
        if (res) {
            this.setData({
                topicList: res.result.data
            })
        }
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

    },
})