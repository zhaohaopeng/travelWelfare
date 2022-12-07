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
    orderList: [],
    pageName: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      userId,
      activityId,
      pageName
    } = options;
    this.setData({
      userId,
      activityId,
      pageName
    })
    this.queryVoucherStatistics();
    this.queryUserHistoryOrder();
  },
  hadnleUpdateData() {
    wx.showLoading({
      title: '加载中',
    })
    this.queryVoucherStatistics(() => {
      wx.showToast({
        title: "已刷新",
        icon: 'success',
        duration: 2000
      })
    });
  },
  /**
   * 查询订单状态
   */
  queryVoucherStatistics(cb) {
    const {
      pageName
    } = this.data;
    if (pageName && pageName == "cdk") {
      $api.queryCdkVoucherStatistics(this.data.userId).then(res => {
        this.setData({
          info: res
        })
        if (cb && typeof cb == "function") {
          cb();
        }
      })
    } else {
      $api.queryVoucherStatistics({
        userId: this.data.userId,
        activityId: this.data.activityId
      }).then(res => {
        this.setData({
          info: res
        })
        if (cb && typeof cb == "function") {
          cb();
        }
      })
    }
  },
  /**
   * 查询订单列表
   */
  queryUserHistoryOrder() {
    const {
      pageName,
      userId,
      activityId
    } = this.data;
    if (pageName && pageName == "cdk") {
      $api.queryRecordCdk(userId).then(res => {
        this.setData({
          orderList: res || []
        })
      })
    } else {
      $api.queryUserHistoryOrder(userId, activityId).then(res => {
        this.setData({
          orderList: res || []
        })
      })
    }
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
        message: !info.enable ? '确认暂停派发吗？' : '确认继续派发吗？',
      })
      .then(() => {
        const params = {
          enable: !info.enable ? 1 : 0,
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