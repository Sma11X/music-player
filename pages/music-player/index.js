// pages/music-player/index.js
import { audioContext, playerStore } from '../../store/index'

const playModeNames = ["order", "repeat", "random"]

Page({
  data: {
    id: 0,
    currentSong: [],
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    isPlaying: false,
    playingName: "pause",

    playModeIndex: 0,
    playModeName: "order",

    isMusicLyric: true,
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0
  },

  onLoad(options) {
    // 获取传入的id
    const id = options.id
    this.setData({ id })
    // 根据id获取歌曲信息
    this.setupPlayerStoreListener()
    // 动态计算内容高度
    const globaData = getApp().globalData
    const screenHeight = globaData.screenHeight
    const statusBarHeight = globaData.statusBarHeight
    const navBarHeight = globaData.navBarHeight
    const deviceRadio = globaData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })
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
    this.setData({ isSliderChanging: true, currentTime })
  },
  handleBackClick: function () {
    wx.navigateBack()
  },
  handleModeBtnClick: function () {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    playerStore.setState("playModeIndex", playModeIndex)
  },
  handlePlayBtnClick: function () {
    playerStore.dispatch("changeMusicPlayStatusAction")
  },
  setupPlayerStoreListener: function () {
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({ currentSong, durationTime, lyricInfos }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })

    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({ currentTime, currentLyricIndex, currentLyricText }) => {
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) this.setData({ currentLyricText })
    })

    playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
      if (playModeIndex !== undefined) {
        this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] })
      }

      if (isPlaying !== undefined) {
        this.setData({ isPlaying, playingName: isPlaying ? "pause": "resume" })
      }
    })
  }
})