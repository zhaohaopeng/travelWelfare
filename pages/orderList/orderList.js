// pages/orderList/orderList.js
import Dialog from '@vant/weapp/dialog/dialog';
const $api = require('../../utils/api').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stop: false,
    userId: null,
    info: {
      enable: 0
    },
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      userId
    } = options;
    console.log(userId, ":userId");
    this.setData({
      userId
    })
    this.queryVoucherStatistics();
    this.queryUserHistoryOrder();
  },
  /**
   * 查询订单状态
   */
  queryVoucherStatistics() {
    $api.queryVoucherStatistics(this.data.userId).then(res => {
      this.setData({
        info: res
      })
    })
  },
  /**
   * 查询订单列表
   */
  queryUserHistoryOrder() {
    $api.queryUserHistoryOrder(this.data.userId).then(res => {
      this.setData({
        orderList: res || []
      })
    })
  },
  /**
   * 暂停派发，继续派发
   */
  hadnleStop() {
    const that = this;
    const {
      userId,
      info
    } = that.data;
    Dialog.confirm({
        message: info.enable == 0 ? '确认暂停派发吗？' : '确认继续派发吗？',
      })
      .then(() => {
        const params = {
          enable: info.enable == 0 ? 1 : 0,
          userId
        }
        $api.updateVoucherStatus(params).then(res => {
          info.enable = params.enable;
          this.setData({
            info
          })
          wx.showToast({
            title: "状态修改成功",
            icon: 'success',
            duration: 2000
          })
        })

      })

  }
})