import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from "../service/api_player"
import { parseLyric } from "../utils/parse-lyric"

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,

    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    isPlaying: false,

    playModeIndex: 0, // 0循环 1单曲 2随机
    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      ctx.id = id

      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""

      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })

      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true

      if (ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },

    setupAudioContextListenerAction(ctx) {
      audioContext.onCanplay(() => {
        audioContext.play()
      })

      audioContext.onTimeUpdate(() => {
        // 当前时间
        const currentTime = audioContext.currentTime * 1000
        // 根据当前时间修改内容
        ctx.currentTime = currentTime
        // 根据当前时间去查歌词
        if (!ctx.lyricInfos.length) return
        let i = 0
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }

        // 设置当前歌词索引和内容
        const currentIndex = i - 1
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricText = currentLyricInfo.text
          ctx.currentLyricIndex = currentIndex
        }
      })

      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })
    },

    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },

    changeNewMusicAction(ctx, isNext = true) {
      let index = ctx.playListIndex
      switch (ctx.playModeIndex) {
        case 0:
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playListSongs.length - 1
          if (index === ctx.playListSongs.length) index = 0
          break
        case 1:
          break
        case 2:
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }
      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        ctx.playListIndex = index
      }

      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true })
    }
  }
})

export {
  audioContext,
  playerStore
}