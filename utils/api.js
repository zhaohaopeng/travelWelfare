const request = require('./request').request;
const API = {
  getOpenid: (data) => request('GET', `/account/getOpenId?code=${data}`),
  createAccount: (data) => request('POST', `/account/create`, data),
  createOrder: (data) => request('POST', `/order/create`, data),
  queryAccount: (data) => request('GET', `/account/query?weChatOpenId=${data}`),
  updateAccount: (data, id) => request('POST', `/account/${id}`, data),
  queryInfoActivity: (data) => request('GET', `/activity/queryInfo?activityId=${data}`),
  queryCommodity: (data) => request('GET', `/commodity/query/list?activityId=${data}`),
  decodeUserInfo: (data) => request('POST', `/account/decodeUserInfo`, data),
  queryUserOrder: (data) => request('GET', `/order/queryUserOrder?activityId=${data.activityId}&userId=${data.userId}`),
  queryVoucherStatistics: (data) => request('GET', `/coupon/queryVoucherStatistics?userId=${data}`),
  updateVoucherStatus: (data) => request('POST', `/account/updateVoucherStatus`, data),
  queryUserHistoryOrder: (userId, activityId) => request('GET', `/order/queryUserHistoryOrder?userId=${userId}&activityId=${activityId}`),
  changeCdk: (data) => request('POST', `/cdk/activation`, data),

};

module.exports = {
  API: API
}