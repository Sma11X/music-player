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