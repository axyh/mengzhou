const api = require('../../api/api')
const utils = require('../../utils/utils')
Page({
    data: {
        artical_id: '',
        detail: null,
        page: 0,
        list: [],
        content: '',
        current_user: [],
        safe_bottom: getApp().globalData.safeBottom,
        reply_focus: false
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        this.setData({
            artical_id: options.artical_id
        }, () => {
            this.initData();
            this.get_comment_list();
            this.getUser();
        })
    },

    async initData() {
        let res = await api.get_artical_detail(this.data.artical_id);
        wx.hideLoading()
        if (res) {
            this.setData({
                detail: res.result.data
            })
        }
    },
    async getUser() {
        let res = await api.getUser();
        this.setData({
            current_user: res.result.data.user
        })
    },
    handle_img(e) {
        wx.previewImage({
            urls: this.data.detail.imgs,
            current: e.currentTarget.dataset.url,
            showmenu: true
        })
    },
    async get_comment_list() {
        let res = await api.get_comment_list({
            artical_id: this.data.artical_id,
            page: this.data.page
        });
        this.setData({
            list: this.data.page === 0 ? res.result.data : this.data.list.concat(res.result.data),
            page: this.data.page + 1
        }, () => {
            wx.stopPullDownRefresh()
        })
    },
    async handle_comment() {
        if (this.data.content.length === 0) {
            return;
        }
        if (this.data.current_user.length === 0) {
            wx.showModal({
                title: '请先登陆',
                confirmText: '去登陆',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/login/login',
                        });
                    }
                }
            });
            return;
        }
        let res = await api.comment_add({
            artical_id: this.data.artical_id,
            accepter_openid: this.data.detail.author._openid,
            content: this.data.content,
            type: 'comment'
        });
        if (res) {
            wx.showToast({
                title: '评论已发送',
                icon: "none"
            })
            this.setData({
                content: '',
                page: 0,
                'detail.comment_count': this.data.detail.comment_count + 1
            }, () => {
                this.get_comment_list();
            });

        }
    },
    bindinput(e) {
        this.setData({
            content: e.detail.value
        })
    },
    onPullDownRefresh() {
        this.setData({
            page: 0
        }, () => {
            this.get_comment_list();
        })
    },
    onReachBottom: function () {
        this.get_comment_list();
    },
    onShareAppMessage: function () {
        return {
            title: this.data.detail.content,
            imageUrl: this.data.detail.imgs.length > 0 ? this.data.detail.imgs[0] : 'cloud://pro-money.7072-pro-money-1300030060/logo/share.png'
        }
    },
    async handle_collect() {
        if (this.data.current_user.length === 0) {
            wx.showModal({
                title: '请先登陆',
                confirmText: '去登陆',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/login/login',
                        });
                    }
                }
            });
            return;
        }
        this.setData({
            'detail.collect_current': !this.data.detail.collect_current,
            'detail.collect_count': this.data.detail.collect_current ? this.data.detail.collect_count - 1 : this.data.detail.collect_count + 1
        })
        await api.collect_add({
            artical_id: this.data.artical_id,
            accepter_openid: this.data.detail.author._openid,
        });
    },
    handel_reply_focus() {
        this.setData({
            reply_focus: true
        })
    },
    handle_topic(e) {
        wx.navigateTo({
          url: `/model-topic/topic-detail/topic-detail?topic_id=${e.currentTarget.dataset.id}`,
        })
      }
})