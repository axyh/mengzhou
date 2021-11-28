// components/artical-list/artical-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handle_img(e) {
      wx.previewImage({
        urls: e.currentTarget.dataset.imgs,
        current: e.currentTarget.dataset.url,
        showmenu: true
      })
    },
    handle_topic(e) {
      wx.navigateTo({
        url: `/model-topic/topic-detail/topic-detail?topic_id=${e.currentTarget.dataset.id}`,
      })
    }
  }
})