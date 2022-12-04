// components/custom-guide/custom-guide.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        console.log(newVal, "::::::::newVal");
      }
    },
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