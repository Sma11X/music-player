// pages/home-music/index.js
import { rankingStore } from "../../store/index";
import { getBanners } from "../../service/api_music"
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect)

Page({
  data: {
    banners: [],
    swiperHeight: 0,
    recommendSongs: []
  },

  onLoad: function (options) {
    this.getPageData()
    // 共享数据的请求
    rankingStore.dispatch("getRankingDataAction")
    // 从store获取共享的数
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })
  },
  // 网络请求
  getPageData: function () {
    getBanners().then(res => {
      // setData设置data数据上是同步的
      // 通过最新的数据对wxml进行渲染，渲染过程是异步的
      this.setData({ banners: res.banners })
    })
  },
  // 事件处理
  handleSearchClick: function () {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  handleSwiperImageLoaded: function () {
    // 获取图片的高度（如何去获取某个组件高度）
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      this.setData({ swiperHeight: rect.height })
    })
  },
  onUnload: function () {

  }

})