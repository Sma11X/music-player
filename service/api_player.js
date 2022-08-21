import xxRequest from './index'

export function getSongDetail(ids) {
  return xxRequest.get("/song/detail", {
    ids
  })
}

export function getSongLyric(id) {
  return xxRequest.get("/lyric", {
    id
  })
}