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
    console.log(this.data.activityType, ":this.data.activityType");
  },
  data: {

  },
  methods: {
    onClickHide() {
      this.setData({
        show: false
      })
    }
  }
})