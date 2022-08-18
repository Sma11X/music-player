// pages/home-video/index.js
import { getTopMV } from "../../service/api_video"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getTopMVData(0)
  },
  // 封装网络请求的方法
  getTopMVData: async function (offset) {
    // 判断是否请求
    if (!this.data.hasMore) return
    // 展示动画
    wx.showNavigationBarLoading()
    // 真正请求
    const res = await getTopMV(offset)
    let newData = this.data.topMVs
    offset === 0 ? (newData = res.data) : (newData = newData.concat(res.data))
    // 设置数据
    this.setData({ topMVs: newData })
    this.setData({ hasMore: res.hasMore })
    wx.hideNavigationBarLoading()
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },
  // 封装事件处理的方法
  handleVideoItemClick: function (event) {
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id,
    })
  },
  // 其他生命周期回调
  onPullDownRefresh: async function () {
    this.getTopMVData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    this.getTopMVData(this.data.topMVs.length)
  }
})