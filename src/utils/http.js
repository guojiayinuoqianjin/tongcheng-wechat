import __config from '../config/config'

class HttpBase {
  constructor (){
    Object.assign(this, {
      basePath: __config.API_SERVER,
      prefix: __config.API_PREFIX,
      authLoginUrl: __config.AUTH_LOGIN_URL,
      isErrTips: true
    })
    this.__init()
  }

  __init(){
    this.__initDefaults()
    this.__initMethods()
  }

  __initDefaults(){
    this.suffix = ''
    this.instanceSource = {
      method:[
        'OPTIONS',
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'DELETE',
        'TRACE',
        'CONNECT'
      ]
    }
  }

  /**
   * 遍历对象构造方法，方法名以小写字母+后缀名
   * @private
   */
  __initMethods(){
    for(let key in this.instanceSource){
      this.instanceSource[key].forEach(method => {
        this[method.toLowerCase() + this.suffix] = (...args) =>
          this.__defaultRequest(method, ...args)
      })
    }
  }

  /**
   * 以wx.request作为底层方法
   * @param {String} method 请求方法
   * @param {String} url    请求地址
   * @param {Object} params 请求参数
   * @param {Object} header 设置请求的header
   * @param {String} dataType 请求的数据类型
   */
  __defaultRequest(
    method = '',
    url = '',
    params = {},
    header = {},
    dataType = 'json'
  ) {
    const HEADER = Object.assign({}, this.setHeaders(), header)
    const URL = this.setUrl(url)

    //注入拦截器
    const chainInterceptors = (promise, interceptors) => {
      for (let i=0, ii=interceptors.length;i<ii;){
        let thenFn = interceptors[i++]
        let rejectFn = interceptors[i++]
        promise = promise.then(thenFn, rejectFn)
      }
      return promise
    }
    //加入version信息
    params.version = wx.getStorageSync('version') || + new Date()
    //请求参数配置
    const CONFIG = {
      url:URL,
      data:params,
      header:HEADER,
      method:method,
      dataType:dataType
    }
    let requestInterceptors = []
    let responseInterceptors = []
    let reversedInterceptors = this.setInterceptors()
    let promise = this.__resolve(CONFIG)
    //缓存拦截器
    reversedInterceptors.forEach(n => {
      if(n.request || n.requestError){
        requestInterceptors.push(n.requestError, n.requestError)
      }
      if(n.response || n.responseError){
        responseInterceptors.unshift(n.response, n.responseError)
      }
    })
    //注入请求拦截器
    promise = chainInterceptors(promise, requestInterceptors)
    //发起https请求
    promise = promise.then(this.__http)
    //注入响应拦截器
    promise = chainInterceptors(promise, responseInterceptors)
    //接口调用成功，res={data：服务器返回的内容}
    promise = promise.then(res => res.data, err => err)
    return promise
  }

  __http(obj){
    return new Promise((resolve, reject) => {
      obj.success = res => resolve(res)
      obj.fail = res => reject(res)
      wx.request(obj)
    })
  }

  __resolve(res){
    return new Promise((resolve) => {
      resolve(res)
    })
  }

  __reject(res){
    return new Promise((resolve, reject) => {
      reject(res)
    })
  }

  /**
   * 设置请求路径
   */
  setUrl(url){
    let isHttpUrl = url.indexOf('https://') > -1 || url.indexOf('http://') > -1
    url = isHttpUrl ? url : `${this.basePath}${this.prefix}$url`
    return url
  }

  /**
   * 设置请求的header， header中不能设置referer
   */
  setHeaders(){
    const pt_key = wx.getStorageSync('login_pt_key') || '' //登陆状态
    const pt_pin = wx.getStorageSync('login_pt_pin') || '' //登陆状态
    const guid = wx.getStorageSync('login_guid') || '' //登陆状态
    const lsid = wx.getStorageSync('login_lsid') || '' //登陆状态

    const authCookie = 'guid=' + encodeURIComponent(guid) +
      'lsid=' + encodeURIComponent(lsid) +
      'pt_pin=' + encodeURIComponent(pt_pin) +
      'pt_key=' + encodeURIComponent(pt_key)
    return {
      //'Accept':'application/json',
      'Content-type':'application/json',
      // 'Content-type':'application/x-www-form-urlencoded',
      cookie: authCookie
    }
  }

  /**
   * 设置request拦截器
   */
  setInterceptors(){
    return [
      {
        request: request => {
          console.log('request', request)
          request.head = request.head || {}
          request.requestTimestamp = new Date().getTime()
          //如果token在header中，token在参数中注入if(request.url.indexOf('/api' !== -1 && wx.getStorageSync('token'))
          //如果请求参数中设置isLoading=false，不加载loading，默认为加载loading
          let {isLoading = true} = request.data || {}
          if (request.data && request.data.hasOwnProperty('isErrTips')){
            this.isErrTips = request.data.isErrTips
          }
          isLoading &&
            wx.showToast({
              title: '加载中',
              icon:'loading',
              duration: 15000,
              mask: !0
            })
          console.log('request', request)
          return request
        },
        requestError: requestError => {
          wx.hideToast()
          console.log('error--')
          return requestError
        },
        response: response => {
          wx.hideToast()
          console.log('response', response)
          response.responseTimestamp = new Date().getTime()
          console.log('res-code', response.data.code)
          if(
            response.statusCode === 401 ||
              response.statusCode == 403 ||
              response.data.code === 203
          ){
            wx.removeStorageSync('idToken')
            wx.removeStorageSync('userinfo')
            //授权失败，跳转到登陆授权页
            console.log(
              'response $(response.statusCode), 即将跳转:',
              this.authLoginUrl
            )
            wx.navigateTo({
              url: this.authLoginUrl
            })
            return
          }
          if (
            response.status >= 500 ||
            (response.data.code === -1 &&
            response.data.tips === '云客户端连接失败')
          ){
            let msg = '服务器异常'
            console.log(
              `${response.statusCode} response`,
              response,
              typeof response.data
            )
            if (typeof response.data === 'object'){
              msg = response.data.message || '服务器端错误'
            }
            this.isErrTips &&
              wx.showToast({
                title:msg,
                icon:'none',
                duration: 1400,
                mask: !1
              })
            return
          }
          return response
        },
        responseError: responseError => {
          wx.hideToast()
          return responseError
        }
      }
    ]
  }
}

export default HttpBase
