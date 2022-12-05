Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: "确认付款"
    },
    buttontext: {
      type: String,
      value: "确定"
    },
    commodit: {
      type: Object,
      value: () => {
        return {
          giftBagList: []
        }
      },
      observer: function (newData) {
        if (newData.commodityType == 0 && newData.giftBagList && newData.giftBagList.length) {
          this.setData({
            name: newData.giftBagList[0].name,
            actionShow: false,
            id: newData.giftBagList[0].id,
            price: newData.giftBagList[0].price
          })
        } else {
          this.setData({
            name: newData.name,
            actionShow: false,
            id: newData.id,
            price: newData.price
          })
        }
      }
    },
    payText: {
      type: String,
      value: "仅限农行信用卡支付",
    }
  },
  data: {
    name: "",
    options: [],
    actionShow: false,
    id: null,
    price: "0.01"
  },
  methods: {
    handleActionClick(res) {
      const {
        detail
      } = res;
      this.setData({
        actionShow: false,
        name: detail.name,
        id: detail.id,
        price: detail.price
      })
    },
    handleActionCancel() {
      this.setData({
        actionShow: false,
      })
    },
    onClickHide() {
      this.setData({
        show: false
      })
    },
    handleSelect() {
      if (this.data.commodit.giftBagList && this.data.commodit.giftBagList) {
        const options = this.data.commodit.giftBagList;
        this.setData({
          options,
          actionShow: true
        })
      }
    },
    handleConfirm() {
      const {
        id
      } = this.data;
      this.triggerEvent("myevent", {
        id
      })
    }
  }

})