// pages/detail-video/index.js
import { getMVURL, getMVDetail, getRealtedVideo } from "../../service/api_video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.getPageData(id)
  },

  getPageData: function (id) {
    // 1.请求播放地址
    getMVURL(id).then(res => {
      this.setData({ mvURLInfo: res.data })
    })
    // 2.请求视频信息
    getMVDetail(id).then(res => {
      this.setData({ mvDetail: res.data })
    })
    // 3.请求相关视频
    getRealtedVideo(id).then(res => {
      this.setData({ relatedVideos: res.data })
    })
  }
})