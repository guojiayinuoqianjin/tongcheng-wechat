/**
 * wx原生接口
 **/

function promise (
  apiName,
  params = {
    original: wx
  },
  original = wx){
  return new Promise((resolve, reject) => {
      params.success = res => resolve(res)
    params.fail = res => reject(res)
    original[apiName] && original[apiName](params)
    }).catch(err => {
      console.error('err', err)
  })
}

module.exports = {
  promise,
  original: wx
}
