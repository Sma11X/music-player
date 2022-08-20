// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest } from "../../service/api_search"
Page({
  data: {
    hotKeywords: [],
    suggestSongs: [],
    searchValue: ""
  },

  onLoad: function (options) {
    this.getPageData()
  },
  getPageData: function () {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },
  handleSearchChange: function (event) {
    const searchValue = event.detail
    this.setData({ searchValue })
    if (!searchValue.length) {
      this.setData({suggestSongs: []})
      return
    }
    getSearchSuggest(searchValue).then(res => {
      this.setData({ suggestSongs: res.result.allMatch })
    })
  }
})