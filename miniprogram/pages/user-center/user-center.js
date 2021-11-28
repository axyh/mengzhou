const utils = require('../../utils/utils.js')
const api = require('../../api/api')
Page({
    data: {
        user: {}
    },
    async getUser() {
        let res = await api.getUser();
        wx.hideLoading()
        if (res) {
            this.setData({
                user: res.result.data.user[0] ?? null,
                text: res.result.data.text
            })
        } else {
            wx.navigateTo({
                url: '/pages/login/login',
            })
        }
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
            mask: true,
        })
        this.getUser();
    },
    onReady: function () {

    },



})