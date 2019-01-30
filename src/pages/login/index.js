import * as Constants from '../../constants/constants'
const app = getApp()
Page({
  data: {
    // provinces: ['北京', '新疆', '山东', '河北'],

    name:'',
    provinces: [
      {
        id: 0,
        name: '北京'
      },
      {
        id: 1,
        name: '天津'
      },
      {
        id: 2,
        name: '河北'
      },
      {
        id: 3,
        name: '山西'
      },
      {
        id: 4,
        name: '内蒙古'
      },
      {
        id: 5,
        name: '辽宁'
      },
      {
        id: 6,
        name: '吉林'
      },
      {
        id: 7,
        name: '黑龙江'
      },
      {
        id: 8,
        name: '上海'
      },
      {
        id: 9,
        name: '江苏'
      },
      {
        id: 10,
        name: '浙江省'
      },
      {
        id: 11,
        name: '安徽'
      },
      {
        id: 12,
        name: '福建'
      },
      {
        id: 13,
        name: '江西'
      },
      {
        id: 14,
        name: '山东'
      },
      {
        id: 15,
        name: '河南'
      },
      {
        id: 16,
        name: '湖北'
      },
      {
        id: 17,
        name: '广东'
      },
      {
        id: 18,
        name: '广西'
      },
      {
        id: 19,
        name: '海南'
      },
      {
        id: 20,
        name: '重庆'
      },
      {
        id: 21,
        name: '四川'
      },
      {
        id: 22,
        name: '贵州'
      },
      {
        id: 23,
        name: '云南'
      },
      {
        id: 24,
        name: '西藏'
      },
      {
        id: 25,
        name: '陕西'
      },
      {
        id: 26,
        name: '甘肃'
      },
      {
        id: 27,
        name: '青海'
      },
      {
        id: 28,
        name: '宁夏'
      },
      {
        id: 29,
        name: '新疆'
      },
      {
        id: 30,
        name: '台湾'
      },
      {
        id: 31,
        name: '香港'
      },
      {
        id: 32,
        name: '澳门'
      }
    ],
    genders: [
      {
        id: 0,
        name: '男'
      },
      {
        id: 1,
        name: '女'
      }
    ],
    genderIndex:0,
    hometownIndex:0,
    regionIndex:0,
    canIUse: true//wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  bindGetUserInfo(e) {
    if( ! this.data.name){
      wx.showToast({
        title: '必须填写称呼',  //标题
        icon: 'loading',  //图标，支持"success"、"loading"
        // image: '../image/img.png',  //自定义图标的本地路径，image 的优先级高于 icon
      })
      return
    }
    console.log('---login--bindGetUserInfo--userInfo---\n', e.detail.userInfo)
    // let userInfo = e.detail.userInfo
    let name = this.data.name
    let regionId = this.data.regionIndex
    let hometownId = this.data.hometownIndex
    let sex = this.data.genderIndex
    wx.getUserInfo({
      success(res) {
        console.log('---login--bindGetUserInfo--getUserInfo---\n', res)
        let data = {
          authCode:'',
          encryptedData:res.encryptedData,
          inviteCode:'',
          iv:res.iv,
          rawData:res.rawData,
          signature:res.signature,
          uid:app.globalData.loginInfo.uid,
          name:name,
          regionId:regionId,
          hometownId:hometownId,
          sex:sex
        }
        console.log('---login--bindGetUserInfo--registeAndLogin--data---\n', data)
        app.Api.registeAndLogin(data).then(res => {
          console.log('--login--bindGetUserInfo--registeAndLogin--res---\n', res)
          //存储用户信息
          app.globalData.userInfo = res.data || {}
          app.globalData.userInfo.regionId = data.regionId
          app.globalData.userInfo.hometownId = data.hometownId
          app.globalData.userInfo.token = data.uid
          wx.setStorageSync(
            Constants.STORAGE_KEY.USER_INFO,
            app.globalData.userInfo
          )
          // if() {
          wx.navigateTo({
            'url': '/pages/index/index'
          }),
          wx.redirectTo({
            url: '/pages/index/index'
          })
          // }
        })
      }
    })
  },
  bindGenderChange(e){
    console.log('--bindGenderChange--e', e)
    this.setData({
      genderIndex:e.detail.value
    })
  },
  bindHometownChange(e){
    console.log(e)
    this.setData({
      hometownIndex:e.detail.value
    })
  },
  bindRegionChange(e){
    console.log(e)
    this.setData({
      regionIndex:e.detail.value
    })
  },
  bindNameInput(e){
    console.log(e)
    this.setData({
      name:e.detail.value
    })
  },
  onCheckName(e){
    console.log(e)
  }
})
