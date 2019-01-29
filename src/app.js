import * as Constants from './constants/constants'
import filters from './utils/filter'
import common from './utils/common'
import * as Api from './api/index'

const wechat = require('./utils/wechat')
let appConfig = {
  Constants,
  filters,
  common,
  wechat,
  Api,
  onLaunch: function (options) {
    console.log('---app-launch-options---\n', options)
    //启动小程序调用登陆信息
    this.getUserLogin()
    this.getSystemInfo()
  },
  /**
   * 获取系统信息
   */
  getSystemInfo(){
    wechat.promise('getSystemInfo').then(res => {
      console.log('++app-getSystemInfo-res++\n', res)
      this.globalData.screenHeight = res.windowHeight
      let model = res.model.substring(0, res.model.indexOf('X')) + 'X'
      console.log('++app-getSystemInfo-model++\n', model)
      if(model === 'iPhone X'){
        this.globalData.isIpx = true
        console.log('++app-getSystemInfo-model++\n', this.globalData)
      }
    })
  },
  /**
   * 遍历获取返回结果需要的字段传入组件，o是传入组件参数对象，r是接口返回结果
   */
  getNeedField(o={}, r={}){
    if(Object.prototype.toString.call(r) !== '[object String]') {
      for (let key in o) {
        if (r.hasOwnProperty(key)) {//判断返回结果里是否包含o中所含的key值
          o[key] = r[key]
        }
      }
    }else{
      return r
    }
    return o
  },
  /**
   * 组装ajax返回的数据
   */
  groupField({originData, targetData} = {}) {
    let fields
    //是否为数组类型
    let isArray = obj => Object.prototype.toString.call(obj) === '[object Array]'
    //是否为对象类型s
    let isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'
    if(isArray(originData)){
      fields = []
      for (let i=0;i<originData.length;i++){
        let item = this.getNeedField(targetData, originData[i])
        // item = Object.assign({}, item)
        fields.push(item)
      }
    }else if (isObject(originData)){
      fields = this.getNeedField(targetData, originData)
    }
    return fields || originData
  },
  getUserLogin(){
    return (
      wechat.promise('login')
        .then(res => {
          let {code: authCode = ''} = res
          let data = {
            authCode
          }
          console.log('---app--getUserLogin--getLogin--res---\n', res)
          return Api.getLogin(data)
        })
        //wx.login是否能注册登陆成功
        .then(res => {
          console.log('---app--getUserLogin--getLogin--res---\n', res)
          //存储用户信息
          this.globalData.userInfo = res.data || {}
          wx.setStorageSync(
            Constants.STORAGE_KEY.USER_INFO,
            this.globalData.userInfo
          )
          return this.setLoginInfo(res)
          }
        )
    )
  },
  /**
   * 用户登陆信息
   * @param res
   */
  setLoginInfo(res ={}){
    let {data = {}, code} = res || {}
    if(code === 200){
      let{userFlag, token, uid} = data || {}
      this.globalData.loginInfo = {
        userFlag,
        token,
        uid
      }
      //userFlag>0则为新用户
      this.isAuthSetting()
      //有token则为登陆成功
      if(token){
        // let [first, second, ...rest] = token.space('.')
        // let decodeToken = Base64.decode(second)
        // decodeToken = JSON.parse(decodeToken) || {}
        let {sub:uid = ''} = token
        this.globalData.loginInfo.uid = uid
        console.log('---app--setLoginInfo--token-first-decodeToken-globalData---\n',
          // first,
          // decodeToken,
          // rest,
          this.globalData)
      }else {
        //未登录
        console.log('---app--setLoginInfo--token-first-decodeToken-globalData-notlogin---\n')
        wx.navigateTo({
          'url':'/pages/login/index'
        })
        // wechat.promise('getUserInfo').then(res => {
        //   app.globalData.userInfo = res.userInfo
        //   this.setData({
        //     userInfo:res.userInfo
        //   })
        //   let obj = {
        //     detail:res
        //   }
        //   this.onGotUserInfo(obj)
        // })
      }
      //存储登陆信息
      wx.setStorageSync(
        Constants.STORAGE_KEY.LOGIN_INFO,
        this.globalData.loginInfo
      )
    }
    return this.globalData.loginInfo
  },
  /**
   * 获取用户授权信息
   */
  // onGotUserInfo(e){
  //   let { token =''} = this.globalData.loginInfo ||
  //     ex.getStorageSync(Constants.STORAGE_KEY.LOGIN_INFO) || {}
  //   let {encryptedData='',iv='',rawData='', signature=''} = e.detail || {}
  //   //新用户必须授权
  //   if(signature){
  //     this.globalData.userInfo = e.detail.userInfo || {}
  //   }
  //   wx.setStorageSync(Constants.STORAGE_KEY.USER_INFO, this.globalData.userInfo)
  //   let userLoginPromise
  //   //防止异步事件发生意外，再次校验新用户是否走登陆接口
  //   if(!token) {
  //     userLoginPromise = this.getUserLogin().then(res => {
  //       let {uid='',token=''} = res || {}
  //       if(signature && token){
  //         return this.getUserInfo({
  //           uid,
  //           encryptedData,
  //           iv,
  //           rawData,
  //           signature
  //         })
  //       }
  //     })
  //   }else{
  //     userLoginPromise = new Promise(resolve => {
  //       resolve(
  //         this.globalData.loginInfo || wx.getStorageSync(Constants.STORAGE_KEY.LOGIN_INFO)
  //       )
  //     })
  //     //存储登陆信息
  //     wx.setStorageSync(
  //       Constants.STORAGE_KEY.LOGIN_INFO,
  //       this.globalData.loginInfo
  //     )
  //   }
  //   return userLoginPromise
  // },
  /**
   * 唤起用户登陆授权，调用注册接口
   */
  getUserInfo(userInfo = {}){
    return Api.getLogin(userInfo, false).then(res => {
      console.log('--app--getUserInfo--res---\n', res)
      return this.setLoginInfo(res)
    })
  },
  /**
   * 是否授权过
   */
  isAuthSetting(){
    //可以通过wx.getSetting先查询一下用户是否授权了"scope.record" 这个scope
    return wechat.promise('getSetting').then(res => {
      let { loginInfo = {}} = this.globalData
      console.log('---app--isAuthSetting--res---\n', res)
      console.log('---app--isAuthSetting--loginInfo---\n', loginInfo)
      this.globalData.authSetting = {
        'scope.userInfo': res.authSetting['scope.userInfo'],
        isUserInfo: !res.authSetting['scope.userInfo']
      }
      return this.globalData.authSetting
    })
  },
  /**
   * 是否登陆
   */
  isLogin(res={}){
    let {loginInfo = {}} = this.globalData
    let {token=''} = loginInfo || {}
    if(res.data === 401 && !token){
      return this.getUserLogin()
    }
    return new Promise(resolve => {
      resolve(this.globalData.loginInfo)
    })
  },
  globalData:{
    isIpx: false,
    userName:'',
    userInfo:'',
    globalLoginFlag:'',
    appid:'',
    loginInfo:{
      openId:'1',
      id:'1',
      avatar:'images/icon-snatch-laoxiang.png',
      nickname:'祁明'
    },
    screenHeight:0
  }
}
App(appConfig)
