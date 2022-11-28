const request = require('./request').request;
const API = {
  getOpenid: (data) => request('GET', `/account/getOpenId?code=${data}`),
  createAccount: (data) => request('POST', `/account/create`, data),
  createOrder: (data) => request('POST', `/order/create`, data),
};

module.exports = {
  API: API
}