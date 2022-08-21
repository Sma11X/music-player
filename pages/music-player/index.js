// pages/music-player/index.js
import { getSongDetail, getSongLyric } from "../../service/api_player"
import { parseLyric } from "../../utils/parse-lyric"
import { audioContext } from '../../store/index'
Page({
  data: {
    id: 0,
    currentSong: [],
    durationTime: 0,
    currentTime: 0,
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: "",

    isMusicLyric: true,
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false
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
    const deviceRadio = globaData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })
    // 使用audioContext播放
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true
    // audioContext事件监听
    this.setupAudioContextListener()
  },
  // 网络请求
  getPageData: function (id) {
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
    })
    getSongLyric(id).then(res => {
      const lyricString = res.lrc.lyric
      const lyrics = parseLyric(lyricString)
      this.setData({ lyricInfos: lyrics })
    })
  },
  // 事件监听
  setupAudioContextListener: function () {
    audioContext.onCanplay(() => {
      audioContext.play()
    })

    audioContext.onTimeUpdate(() => {
      // 当前时间
      const currentTime = audioContext.currentTime * 1000
      // 根据当前时间修改内容
      if (!this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ sliderValue, currentTime })
      }
      // 根据当前时间去查歌词
      let i = 0
      for (; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i]
        if (currentTime < lyricInfo.time) {
          break
        }
      }

      // 设置当前歌词索引和内容
      const currentIndex = i - 1
      if (this.data.currentLyricIndex !== currentIndex) {
        const currentLyricInfo = this.data.lyricInfos[currentIndex]
        this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex })
      }
    })
  },
  // 事件处理
  handelSwiperChange: function (event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },
  handleSliderChange: function (event) {
    // 获取slider变化的值
    const value = event.detail.value
    // 计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100
    // 设置context播放currentTime位置
    audioContext.pause()
    audioContext.seek(currentTime / 1000)
    // 记录最新的sliderValue
    this.setData({ sliderValue: value, isSliderChanging: false })
  },
  handleSliderchanging: function (event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime, sliderValue: value })
  }
})