// pages/ridecode/Ridecode.js
const {
  activityTime
} = getApp().globalData;
const $api = require('../../utils/api').API;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityTime,
    userInfo: {},
    activityId: 2,
    commodityList: [],
    commodityA: {
      price: 0.01
    },
    commodityB: {
      price: 0.01
    },
    systemTipsShow: false,
    guideShow: false,
    activityShow: false,
    confirmShow: false,
    openid: null,
    session_key: null,
    show: false,
    commodityType: 0,
    refundReason: null,
    message: null,
    describe: null,
    iconType: null,
    commodityInfo: {},
    isNewCustomer: false,
    isPay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleGetOpenid();
    this.queryCommodity();
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
          })
      }
    });
  },

  /**
   * 查询用户信息
   */
  queryAccount() {
    $api.queryAccount(this.data.openid).then(res => {
      if (res) {
        this.setData({
          userInfo: res
        })
        this.queryUserHistoryOrder();
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
          this.queryUserHistoryOrder();
        })
      }
    })
  },
  /**
   * 查询订单列表
   */
  queryUserHistoryOrder() {
    const {
      userInfo,
      activityId
    } = this.data;
    $api.queryUserHistoryOrder(userInfo.id, activityId).then(res => {
      const orderList = res || [];
      let isNewCustomer = orderList.length ? false : true;
      this.setData({
        isNewCustomer,
        isPay: true
      })
    })
  },
  /**
   * 查询商品列表
   */
  queryCommodity() {
    $api.queryCommodity(this.data.activityId).then(res => {
      let commodityA = null,
        commodityB = null;
      res.forEach(item => {
        //新客
        if (item.commodityType == 0) {
          commodityA = item;
        }
        //老客
        if (item.commodityType == 1) {
          commodityB = item;
        }
      })
      this.setData({
        commodityList: res,
        commodityA,
        commodityB
      })
    }).catch(err => {
      //请求失败
      console.log(err, "请求错误");
    })
  },

  /**
   * 跳转订单列表
   */
  handleToOrderList() {
    const that = this;
    wx.navigateTo({
      url: `/pages/orderList/orderList?userId=${that.data.userInfo.id}&activityId=${that.data.activityId}`,
    })
  },

  /**
   * 跳转到活动页
   */
  handleToActive() {
    wx.navigateTo({
      url: '/pages/pageCcq/pageCcq',
      success: function (res) {
        // 通过 eventChannel 向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: 'test'
        })
      }
    })
  },

  handleToCreate() {
    wx.navigateTo({
      url: '/pages/pageBank/pageBank',
      success: function (res) {
        // 通过 eventChannel 向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: 'test'
        })
      }
    })
  },

  /**
   * 手机号授权
   */
  getPhoneNumber(phoneData) {
    const that = this;
    const {
      commodityType
    } = phoneData.currentTarget.dataset;
    const {
      encryptedData,
      iv
    } = phoneData.detail;
    if (!encryptedData || !iv) {
      return;
    }
    const {
      session_key,
      openid
    } = this.data;
    $api.decodeUserInfo({
      encryptedData,
      iv,
      sessionKey: session_key
    }).then(res => {
      // 更新用户信息
      $api.updateAccount({
        weChatOpenId: openid,
        phone: res
      }, this.data.userInfo.id).then(() => {
        const {
          userInfo
        } = this.data;
        userInfo.phone = res
        that.setData({
          userInfo,
          commodityType
        })
        this.createOrder();
      })
    })
  },
  /**
   * 下单
   */
  handleCreateOrder(e) {
    const {
      commodityType
    } = e.currentTarget.dataset;
    this.setData({
      commodityType
    })
    const {
      phone
    } = this.data.userInfo;
    if (!phone) {
      // 获取手机号
      this.setData({
        show: true
      })
      return;
    }
    this.createOrder();
  },
  /**
   * @name 开始下单
   */
  createOrder() {
    const {
      commodityType
    } = this.data;
    let commodityInfo = null;
    if (commodityType == 0) {
      commodityInfo = this.data.commodityA;
    }
    if (commodityType == 1) {
      commodityInfo = this.data.commodityB;
    }
    this.setData({
      commodityInfo,
      confirmShow: true
    })
  },
  /**
   * @name 确认购买
   */
  onMyEvent(data) {
    const {
      id
    } = data.detail;
    const that = this;
    const params = {
      activityId: this.data.activityId,
      commodityId: id,
      userId: this.data.userInfo.id
    }
    $api.createOrder(params).then(res => {
      const {
        nonceStr,
        prepayId,
        signature,
        timeStamp
      } = res;

      that.setData({
        confirmShow: false,
      })

      wx.requestPayment({
        timeStamp: timeStamp + '',
        nonceStr: nonceStr,
        package: `prepay_id=${prepayId}`,
        signType: 'RSA',
        paySign: signature,
        success(data) {
          // 查询支付状态
          setTimeout(() => {
            $api.queryUserOrder({
              activityId: that.data.activityId,
              userId: that.data.userInfo.id
            }).then(res => {
              const {
                payState,
              } = res;
              // 支付成功
              if (payState == 1) {
                that.setData({
                  isNewCustomer: false,
                  systemTipsShow: true,
                  message: "支付成功",
                  describe: "参与活动成功 您可在订单列表查看发券明细",
                  iconType: "success"
                })
              }
              // 支付失败
              if (payState == 2 || payState == 3) {
                that.setData({
                  systemTipsShow: true,
                  message: "支付失败",
                  describe: "非农行信用卡支付，金额退回",
                  iconType: "error"
                })
              }
            })
          }, 500)
        },
        fail() {
          that.setData({
            confirmShow: false,
          })
        }
      })
    }).catch((res) => {
      that.setData({
        confirmShow: false,
        systemTipsShow: true,
        message: "系统提示",
        describe: res || "系统错误",
        iconType: "error"
      })
    })
  },
  /**
   * 查询用户是否有当前用户
   */
  onClickShow(e) {
    const {
      type
    } = e.currentTarget.dataset;
    this.setData({
      [type]: true,
    })
  },
})