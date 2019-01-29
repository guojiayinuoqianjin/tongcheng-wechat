const errorForPage = (info = '服务器开小差，请稍后再试') => {
  wx.showToast({
    title: info,
    icon: 'none',
    duration: 2000
  })
}

// export function getCurrentPageUrl () {
//   let pages = getCurrentPages()
//   let currentPage = pages[pages.length - 1]
//   let route = currentPage.route
//   let options = currentPage.options
//
//   let optionArr = []
//   for (let key in options){
//     let value = options[key]
//     optionArr.push(key + '=' + value)
//   }
//
//   return {
//     route,
//     options,
//     optionSerialize: optionArr.join('&')
//   }
// }

export default {
  errorForPage
  // getCurrentPageUrl
}
