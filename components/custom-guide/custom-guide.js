// components/custom-guide/custom-guide.js

Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    activityType: {
      type: Number,
      value: 1,
    }
  },
  ready() {
    if (this.data.activityType == "1") {
      this.setData({
        style: "background: url('https://m.szduopin.com/image/guide-2.png') no-repeat top; background-size: 100% 100%;"
      })
    } else if (this.data.activityType == "2") {
      this.setData({
        style: "background: url('https://m.szduopin.com/image/guide-1.png') no-repeat top; background-size: 100% 100%;"
      })
    } else {
      this.setData({
        style: "background: url('https://m.szduopin.com/image/guide-3.png') no-repeat top; background-size: 100% 100%;"
      })
    }
  },
  data: {
    style: "background: url('https://m.szduopin.com/image/guide-1.png') no-repeat top; background-size: 100% 100%;"
  },
  methods: {
    onClickHide() {
      this.setData({
        show: false
      })
    }
  }
})