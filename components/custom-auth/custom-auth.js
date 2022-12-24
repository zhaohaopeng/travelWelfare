Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: ""
    },
    message: {
      type: String,
      value: "系统提示"
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
      value: "error"
    },
    commodityType: {
      type: Number,
      value: null
    },
    activityId: {
      type: Number,
      value: null
    }
  },
  data: {

  },
  methods: {
    onClickHide() {
      this.setData({
        show: false
      })
    },
    handleToPath() {
      const that = this;
      const id = this.data.activityId;
      wx.navigateTo({
        url: id == 2 ? '/pages/pageCcq/pageCcq' : '/pages/pageWx/pageWx',
        success: function () {
          that.setData({
            show: false
          })
        }
      })
    },
    getPhoneNumber(phoneData) {
      this.setData({
        show: false
      })
      this.triggerEvent("myevent", {
        phoneData
      })
    }
  }

})