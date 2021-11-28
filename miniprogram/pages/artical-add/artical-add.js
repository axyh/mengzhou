const api = require('../../api/api')
const utils = require('../../utils/utils')
Page({
  data: {
    focus: true,
    content: "",
    imgs: [],
    imgLinks: [],
    allowUpCount: 0,
    topic_id: '',
    topics: []
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (options.topic_id) {
      this.setData({
        topic_id: options.topic_id
      }, () => {
        this.getTopics()
      })
    }
    this.getUser();
  },
  async getTopics() {
    let res = await api.topic_list({
      where: {
        _id: this.data.topic_id
      }
    });
    if (res.result.data.length > 0) {
      this.setData({
        topics: res.result.data
      })
    }
  },
  async getUser() {
    let res = await api.getUser();
    wx.hideLoading()
    if (res.result.data.user.length === 0) {
      wx.showModal({
        title: '当前用户未注册',
        showCancel: false,
        confirmText: '去登陆',
        success() {
          wx.reLaunch({
            url: '/pages/login/login',
          });
        }
      })
    } else {
      this.setData({
        allowUpCount: res.result.data.allowUpCount ?? 1
      })
    }
  },
  handel_area() {
    this.setData({
      focus: true
    })
  },
  bindContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  async handle_select_img() {
    ///1、选择图片
    let chooseImg = await utils.chooseImg(this.data.allowUpCount - this.data.imgs.length);
    this.setData({
      imgs: [...this.data.imgs, ...chooseImg.tempFilePaths]
    })
  },
  handel_delete_img(e) {
    let index = this.data.imgs.indexOf(e.target.dataset.img);
    let arr = this.data.imgs
    arr.splice(index, 1)
    this.setData({
      imgs: arr
    })
  },
  handle_preview_img() {
    wx.previewImage({
      urls: this.data.imgs,
    })
  },
  async handle_publish() {
    if (this.data.content.length < 5) {
      wx.showToast({
        title: '内容要大于5个字',
        mask: true,
        icon: "none"
      });
      return;
    }
    wx.showLoading({
      title: '请稍候',
      mask: true
    })
    if (this.data.imgs.length > 0) {
      for (let item of this.data.imgs) {
        let upload = await utils.uploadImg(`artical`, item);
        this.setData({
          imgLinks: this.data.imgLinks.concat(upload)
        })
      }
    }
    let res = await api.add_artical_add({
      content: this.data.content.replace(/^\s+|\s+$/g, ''),
      imgs: this.data.imgLinks,
      topic_id: this.data.topic_id
    });
    if (res) {
      wx.redirectTo({
        url: `/pages/artical-detail/artical-detail?artical_id=${res.result.data._id}`,
      })
    }
  }
})