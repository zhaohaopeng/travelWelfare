// pages/change/change.js
const {
  activityTime
} = getApp().globalData;
const $api = require('../../utils/api').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityTime: activityTime,
    activityId: 2,
    guideShow: false,
    cdkCode: null,
    openid: null,
    session_key: null,
    userInfo: {},
    loading: false,
    systemTipsShow: false,
    message: null,
    describe: null,
    iconType: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleGetOpenid();
  },
  handleChange() {
    const that = this;
    if (!this.data.cdkCode || this.data.cdkCode.length == 0) {
      wx.showToast({
        title: '请输入兑换码',
        icon: "none",
        duration: 2000
      })
      return;
    }
    this.setData({
      loading: true
    })
    const params = {
      cdkCode: this.data.cdkCode,
      userId: this.data.userInfo.id
    }
    $api.changeCdk(params).then(res => {
      that.setData({
        systemTipsShow: true,
        message: "兑换成功",
        describe: `X张优惠券派发您账户中，您可在【微信APP—我—卡包-券和礼品卡】中查看已成功领取的优惠券`,
        iconType: "success"
      })
      this.setData({
        loading: false
      })
    }).catch(() => {
      this.setData({
        loading: false
      })
      that.setData({
        systemTipsShow: true,
        message: "兑换失败",
        describe: `您的兑换码已使用`,
        iconType: "error"
      })
    })
  },
  onClickShow() {
    this.setData({
      guideShow: true
    })
  },
  /**
   * 静默获取OPENID
   */
  handleGetOpenid() {
    wx.login({
      success: res => {
        const code = res.code;
        $api.getOpenid(code)
          .then((res) => {
            const {
              openid,
              session_key
            } = res;
            this.setData({
              openid,
              session_key
            })
            this.queryAccount();
          }).catch(() => {
            this.setData({
              loading: false
            })
          })
      }
    });
  },

  /**
   * 查询用户信息
   */
  queryAccount() {
    const that = this;
    $api.queryAccount(this.data.openid).then(res => {
      if (res) {
        this.setData({
          userInfo: res
        })
      } else {
        $api.createAccount({
          weChatOpenId: this.data.openid
        }).then(data => {
          this.setData({
            userInfo: {
              id: data,
              weChatOpenId: this.data.openid,
              phone: null
            }
          })
        }).catch(() => {
          this.setData({
            loading: false
          })
        })
      }
    }).catch(() => {
      this.setData({
        loading: false
      })
    })
  },
  /**
   * 跳转订单列表
   */
  handleToOrderList() {
    const that = this;
    wx.navigateTo({
      url: `/pages/orderList/orderList?userId=${that.data.userInfo.id}&activityId=${that.data.activityId}&pageName=cdk`,
    })
  }
})