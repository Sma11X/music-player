import xxRequest from './index'

export function getBanners() {
  return xxRequest.get("/banner", {
    type: 2
  })
}

export function getRankings(id) {
  return xxRequest.get("/playlist/detail", {
    id
  })
}

export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return xxRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return xxRequest.get("/playlist/detail/dynamic", {
    id
  })
}