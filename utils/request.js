const POST = 'POST';
const baseURL = 'https://m.szduopin.com/traffic';
// const baseURL = 'http://1.14.239.23:15001/traffic';

function request(method, url, data) {
  wx.showLoading({
    title: '加载中',
  })
  return new Promise(function (resolve, reject) {
    let header = {
      'content-type': 'application/json',
    };
    wx.request({
      url: baseURL + url,
      method: method,
      data: method === POST ? JSON.stringify(data) : data,
      header: header,
      success(res) {
        wx.hideLoading();
        //请求成功
        //判断状态码---errCode状态根据后端定义来判断
        if (res.statusCode == 0 || res.statusCode == 200) {
          if (res.data.code == 0) {
            resolve(res.data.data);
          } else {
            if (res.data.code != "8001") {
              wx.showToast({
                title: res.data.msg,
                icon: 'error',
                duration: 2000
              })
            }
            reject(res.data.data);
          }
        } else {
          //其他异常
          wx.showToast({
            title: "运行时错误,请稍后再试",
            icon: 'error',
            duration: 2000
          })
          reject('运行时错误,请稍后再试');
        }
      },
      fail(err) {
        wx.hideLoading();
        //请求失败
        reject(err)
      }
    })
  })
}
module.exports = {
  request: request
}