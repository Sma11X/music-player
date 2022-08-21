// pages/music-player/index.js
import { getSongDetail } from "../../service/api_player"
Page({
  data: {
    id: 0,
    currentSong: [],
    currentPage: 0,
    contentHeight: 0
  },

  onLoad(options) {
    // 获取传入的id
    const id = options.id
    this.setData({ id })
    // 根据id获取歌曲信息
    this.getPageData(id)
    // 动态计算内容高度
    const globaData = getApp().globalData
    const screenHeight = globaData.screenHeight
    const statusBarHeight = globaData.statusBarHeight
    const navBarHeight = globaData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight })
    // 创建播放器
    const audioContext = wx.createInnerAudioContext()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.play()
  },
  // 网络请求
  getPageData: function (id) {
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0] })
    })
  },
  // 事件处理
  handelSwiperChange: function (event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  }
})