// pages/pageBank/pageBank.js
import Wxml2Canvas from 'wxml2canvas';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: null,
    height: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * @name 保存图片
   */
  handleSaveImage() {
    wx.showLoading()
    const that = this
    const query = wx.createSelectorQuery().in(this);
    query.select('#my-canvas').fields({ // 选择需要生成canvas的范围
      size: true,
      scrollOffset: true
    }, data => {
      console.log(data, ":data");
      let width = data.width;
      let height = data.height;
      that.setData({
        width,
        height
      })
      setTimeout(() => {
        that.startDraw()
      }, 1500);
    }).exec()

  },

  startDraw() {
    let that = this

    // 创建wxml2canvas对象
    let drawMyImage = new Wxml2Canvas({
      element: 'myCanvas', // canvas的id,
      obj: that, // 传入当前组件的this
      width: that.data.width * 2,
      height: that.data.height * 2,
      background: '#B6F3E0', // 生成图片的背景色
      progress(percent) { // 进度
        // console.log(percent);
      },
      finish(url) { // 生成的图片
        wx.hideLoading()
        console.log(url, ":url");
        that.savePoster(url)
      },
      error(res) { // 失败原因
        console.log(res);
        wx.hideLoading()
      }
    }, this);
    let data = {
      // 获取wxml数据
      list: [{
        type: 'wxml',
        class: '.my_canvas .my_draw_canvas',
        limit: '.my_canvas',
        x: 0,
        y: 0
      }]
    }
    // 绘制canvas
    drawMyImage.draw(data, this)

  },
  savePoster(url) {
    const that = this
    wx.saveImageToPhotosAlbum({
      filePath: url,
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