const {
  activityTime
} = getApp().globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityTime,
    width: null,
    height: null,
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleSaveImage() {
    const that = this;
    that.setData({
      loading: true
    })
    wx.downloadFile({
      url: 'https://m.szduopin.com/image/registered-bank.png',
      success(res) {
        const {
          statusCode,
          tempFilePath
        } = res;
        if (statusCode == 200) {
          that.savePoster(tempFilePath)
          that.setData({
            loading: false
          })
        } else {
          that.setData({
            loading: false
          })
          wx.showToast({
            title: '图片获取失败',
            icon: 'error',
            duration: 1500
          });
        }
      }
    })
  },
  savePoster(filePath) {
    const that = this;
    wx.saveImageToPhotosAlbum({
      filePath,
      success: function () {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1500
        });
      },
      fail(err) {
        if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.saveImageToPhotosAlbum({
                      filePath: that.data.imgUrl,
                      success: function () {
                        wx.showToast({
                          title: '保存成功',
                          icon: 'success',
                          duration: 2000
                        })
                      },
                    })
                  } else {
                    wx.showToast({
                      title: '授权失败，请稍后重新获取',
                      icon: 'none',
                      duration: 1500
                    });
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})