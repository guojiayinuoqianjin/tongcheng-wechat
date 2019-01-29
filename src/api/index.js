import Request from '../utils/request'
import { API_BASE_URL } from '../constants/constants'

const request = new Request(API_BASE_URL)
console.log('request:', request)
/**
 * 轮播图
 */
export function getBanners () {
  return request.get({
    url:'index/banner'
  })
}

/**
 * 广播消息
 */
export function getNotice () {
  return request.get({
    url:'index/scrollmsg'
  })
}

/**
 * 获取最新帖子列表
 */
export function getAllPosts (data = {}) {
  let queryConditons= {}
  Object.assign(queryConditons, data)
  return request.get({
    url:'post/list',
    data: queryConditons
  })
}

/**
 * 获取单个帖子信息
 */
export function getPostDetail (data = {}) {
  let queryConditons= {}
  Object.assign(queryConditons, data)
  return request.get({
    url:'post/query',
    data: queryConditons
  })
}

/**
 * 发帖
 */
export function createPost (data = {}) {
  let postData = {}
  Object.assign(postData, data)
  return request.post({
    url:'post/create',
    data: postData
  })
}

/**
 * 获取单个帖子的所有回复信息
 */
export function getAllPostReply (data = {}) {
  let queryConditons= {}
  Object.assign(queryConditons, data)
  return request.get({
    url:'reply/list',
    data: queryConditons
  })
}

/**
 * 回复帖子
 */
export function createReply (data = {}) {
  let replyData= {}
  Object.assign(replyData, data)
  return request.post({
    url:'reply/create',
    data: replyData
  })
}

/**
 * 授权码登陆方式
 */
export function getLogin (
  data = {
    authCode:'',
    encryptedData:'',
    inviteCode:'',
    iv:'',
    rawData:'',
    signature:'',
    uid:''
  },
  hasUUID = true
) {
  //userFlag "新老用户标识，0-老用户，1-新用户"
  //token "会话标识" 若根据授权码能取到unionId，会返回值，否则为空，前端应引导用户授权
  //token采用JWT规范，以英文.分割三段，每一段都是base64编码，第二段解析后获取subject，作为用户标识
  //若用户使用微信授权码获取不到unionId，需引导授权，此时需包含使用对称加密算法加密后的openId返回给前端，此加密后的数据设置到uid
  let url = hasUUID ? 'login/wxmp/authcode':'login/wxmp/userInfo'
  console.log('getLogin-data', data)
  return request.post({
    url,
    isLoading:false,
    data
  })
}

/**
 * 登陆注册
 */
export function registeAndLogin (
  data = {
    authCode:'',
    encryptedData:'',
    inviteCode:'',
    iv:'',
    rawData:'',
    signature:'',
    uid:'',
    name:'',
    regionId:'',
    hometownId:'',
    sex:0
  }
) {
  //userFlag "新老用户标识，0-老用户，1-新用户"
  //token "会话标识" 若根据授权码能取到unionId，会返回值，否则为空，前端应引导用户授权
  //token采用JWT规范，以英文.分割三段，每一段都是base64编码，第二段解析后获取subject，作为用户标识
  //若用户使用微信授权码获取不到unionId，需引导授权，此时需包含使用对称加密算法加密后的openId返回给前端，此加密后的数据设置到uid
  let url = 'login/wxmp/userInfo'
  console.log('registeAndLogin-data', data)
  return request.post({
    url,
    isLoading:false,
    data
  })
}
