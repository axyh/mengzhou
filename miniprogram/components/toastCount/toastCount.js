Component({
  properties: {
    count: {
      type: String,
      value: '0'
    }
  },
  data: {

  },
  methods: {
    handel_count() {
      wx.showToast({
        title: this.data.count,
        icon: "none"
      })
    }
  }
})