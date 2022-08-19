import xxRequest from './index'

export function getTopMV(offset, limit = 10) {
  return xxRequest.get('/top/mv', {
    offset,
    limit
  })
}

/** 
 * 请求MV的播放地址
 * @param {number} id 
*/
export function getMVURL(id) {
  return xxRequest.get("/mv/url", {
    id
  })
}

/** 
 * 请求MV的详情
 * @param {number} mvid 
*/
export function getMVDetail(mvid) {
  return xxRequest.get("/mv/detail", {
    mvid
  })
}

/** 
 * 请求相关视频
 * @param {number} id 
*/
export function getRealtedVideo(id) {
  return xxRequest.get("/related/allvideo", {
    id
  })
}