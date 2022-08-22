const BASE_URL = "https://netease-cloud-music-api-git-master-sma11x.vercel.app"

const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class XXRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }
  request(url, method, params, header = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method: method,
        header: header,
        data: params,
        success: function (res) {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }

  get(url, params, header) {
    return this.request(url, "GET", params, header)
  }

  post(url, data, header) {
    return this.request(url, "POST", data, header)
  }
}

const xxRequest = new XXRequest(BASE_URL)
const xxLoginRequest = new XXRequest(LOGIN_BASE_URL)
export default xxRequest
export {
  xxLoginRequest
}