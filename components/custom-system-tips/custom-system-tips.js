// components/custom-system-tips/custom-system-tips.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        console.log(newVal, "::::::::newVal");
      }
    },
    title: {
      type: String,
      value: ""
    },
    message: {
      type: String,
      value: "支付成功"
    },
    describe: {
      type: String,
      value: "参与活动成功 您可在订单列表查看发券明细"
    },
    buttontext: {
      type: String,
      value: "我知道了"
    },
    iconType: {
      type: String,
      value: "success"
    }
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