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
    const {
      id
    } = this.data.userInfo;
    this.setData({
      loading: true
    })
    if (id) {
      const params = {
        cdkCode: this.data.cdkCode,
        userId: id
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
    } else {
      this.handleGetOpenid();
    }
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
        that.handleChange();
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
          that.handleChange();
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
})