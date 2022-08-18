import xxRequest from './index'

export function getTopMV(offset, limit = 10) {
  return xxRequest.get('/top/mv', {
    offset,
    limit
  })
}