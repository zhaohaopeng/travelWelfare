// index.js
// 获取应用实例
const app = getApp()
const $api = require('../../utils/api').API;

const {
  appId
} = app.globalData;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    openid: null,
    session_key: null,
    userId: null,
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.handleAuth();
  },
  /**
   * @name 授权CODE获取openid
   */
  handleAuth() {
    wx.login({
      success: res => {
        // 获取code 
        const code = res.code;
        // 获取到用户的 code 之后：res.code
        $api.getOpenid(code)
          .then((res) => {
            const {
              openid,
              session_key
            } = res.data;
            this.setData({
              openid,
              session_key
            })
            this.handleCreateAccount()
          })
          .catch(err => {
            //请求失败
            console.log(err, "请求错误");
          })
      }
    });
  },
  /**
   * @nmae 创建用户
   */
  handleCreateAccount() {
    const {
      openid
    } = this.data;

    $api.createAccount({
      weChatOpenId: openid
    }).then(res => {
      const userId = res.data;
      this.setData({
        userId
      })
    })
  },
  /**
   * @name 测试支付
   */
  handlePayment() {
    const {
      userId
    } = this.data;
    $api.createOrder({
      activityId: "1",
      commodityId: "21cef8d17b74a4bb3338ecda7a00096f",
      userId,
    }).then(res => {
      const {
        nonceStr,
        prepayId,
        signature,
        timeStamp
      } = res.data;

      wx.requestPayment({
        timeStamp: timeStamp + '',
        nonceStr: nonceStr,
        package: `prepay_id=${prepayId}`,
        signType: 'RSA',
        paySign: signature,
        success(data) {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail(data) {
          wx.showToast({
            title: '支付失败',
            icon: 'error',
            duration: 2000
          })
        }
      })
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})