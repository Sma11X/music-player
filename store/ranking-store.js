import { HYEventStore } from 'hy-event-store'
import { getRankings } from "../service/api_music";

const rankingMap = {
  3778678: "hotRanking",
  3779629: "newRanking",
  2884035: "originRanking",
  19723756: "upRanking"
}
const rankingStore = new HYEventStore({
  state: {
    hotRanking: {},
    newRanking: {},
    originRanking: {},
    upRanking: {}
  },
  actions: {
    // 热歌3778678 新歌3779629 原创2884035 飙升19723756
    getRankingDataAction(ctx) {
      for (let item in rankingMap) {
        getRankings(item).then(res => {
          ctx[rankingMap[item]] = res.playlist
        })
      }
      // getRankings(3778678).then(res => {
      //   ctx.hotRanking = res.playlist
      // })
      // getRankings(3776929).then(res => {
      //   ctx.newRanking = res.playlist
      // })
      // getRankings(2884035).then(res => {
      //   ctx.originRanking = res.playlist
      // })
      // getRankings(19723756).then(res => {
      //   ctx.upRanking = res.playlist
      // })
    }
  }
})

export {
  rankingStore
}