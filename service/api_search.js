import xxRequest from './index'

export function getSearchHot() {
  return xxRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return xxRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}