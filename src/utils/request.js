import {STORAGE_KEY} from '../constants/constants'

class Request{
  constructor (api = '', {authLoginUrl = '/pages/welcome/index'} = {}){
    this.api = api
    this.authLoginUrl = authLoginUrl
  }

  _setHeaders = () => {
    const ptKey = wx.getStorageSync('login_pt_key') || ''
    const ptPin = wx.getStorageSync('login_pt_pin') || ''
    const guid = wx.getStorageSync('login_guid') || ''
    const lsid = wx.getStorageSync('login_lsid') || ''
    const authCookie = 'guid=' + encodeURIComponent(guid) +
      'lsid=' + encodeURIComponent(lsid) +
      'pt_pin=' + encodeURIComponent(ptPin) +
      'pt_key=' + encodeURIComponent(ptKey)
    const loginInfo = wx.getStorageSync(STORAGE_KEY.LOGIN_INFO) ||{}
    console.log('---request--_setHeader--loginInfo--\n', loginInfo)
    return {
      'Content-type': 'application/json',
      'x-auth-token': loginInfo.token || '',
      cookie: authCookie
    }
  }

  //组装请求对象
  _handleRequestObj = ({
    method = '',
    url='',
    data=null,
    isLoading=true,
    header={}
  }) => {
    header = Object.assign(this._setHeaders(), header)
    return {
      url: this.api + url,
      data,
      header,
      method,
      isLoading
    }
  }

  //promis包装微信请求
  _request = obj =>{
    return new Promise((resolve, reject) => {
      obj.success = response => resolve(response)
      obj.fail = response => reject(response)
      wx.request(obj)
    })
  }

  //执行请求
  _http = obj => {
    obj = this._handleRequestObj(obj)
    console.log('---in request, obj:', obj)
    //请求拦截器，需要加loading
    obj.isLoading &&
      wx.showToast({
        titile: '加载中',
        icon: 'loading',
        duration: 150000,
        mask:!0
      })

    let promise = this._request(obj)
    const isSuccess = res => {
      let rst = res.statusCode === 200 &&
        Object.prototype.toString.call(res.data) ==='[object Object]' &&
        'code' in res.data
      return rst
    }
    //响应拦截器
    promise = promise.then(
      response => {
        //判断是否登陆
        wx.hideToast()
        if (isSuccess(response)) {
          console.log('---in request--_http-isSuccess--response--\n, response:', response)
          if(response.data.code === 405) {
            wx.removeStorageSync(STORAGE_KEY.LOGIN_INFO)
            wx.navigateTo({
              url: this.authLoginUrl
            })
            return response.data
          }else{
            return response.data
          }
        }else{
          return Promise.reject()
        }
      }, err => {
        return Promise.reject(err)
      }
    )
    return promise
  }

  get = request => {
    return this._http(Object.assign({}, request, {method: 'GET'}))
  }

  post = request => {
    return this._http(Object.assign({}, request, {method: 'POST'}))
  }

  put = request => {
    return this._http(Object.assign({}, request, {method: 'PUT'}))
  }

  delete = request => {
    return this._http(Object.assign({}, request, {method: 'DELETEE'}))
  }
}

export default Request
