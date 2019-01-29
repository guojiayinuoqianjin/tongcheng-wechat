const app = getApp()
// const Constants = app.Constants
Page({
  data: {
    userInfo:{
    },
    banners:[
      {
        imageUrl:'http://qijunrong.cn/banner/banner1.jpg'
      },
      {
        imageUrl:'http://qijunrong.cn/banner/banner2.jpg'
      },
      {
        imageUrl:'http://qijunrong.cn/banner/banner3.jpg'
      }
    ],
    messages:[
      '欢迎访问老乡同城情'
    ],
    //帖子列表
    posts: {
      currentPage:1,
      pageSize:100,
      totalNum:5,
      isMore:0,
      totalPage:1,
      startIndex:0,
      items: [
        {
          id: '',
          author: '',
          authorRegion: '',
          authorHometown: '',
          title: '',
          content: '',
          praiseCnt: 0,
          visitCnt: 0,
          replyCnt: 0
        }
      ]
    }
  },
  onLoad: function (options) {
    let {returnUrl:url='', navType=''} = options
    console.log("navType", navType)
    console.log("url", url)
    // this.getBanners()
    this.getNotice()
    this.getAllPosts()
  },
  onShow: function (options) {
    console.log("on show options", options)
    // this.getBanners()
    this.getNotice()
    this.getAllPosts()
  },
  //获取轮播图
  getBanners(){
    app.Api.getBanners().then(res => {
      console.log('res:', res)
      let { code, data:originData} = res || {}
      if(code === 200){
        let [targetData] = this.data.banners
        let banners = app.groupField({
          originData,
          targetData
        })
        this.setData({
          banners
        })
      }
    })
  },
  //获取广播消息
  getNotice() {
    app.Api.getNotice().then(res => {
      console.log('res:', res)
      let {code, data: originData} = res || {}
      if (code === 200) {
        let [targetData] = this.data.messages
        let messages = app.groupField({
          originData,
          targetData
        })
        this.setData({
          messages
        })
      }
    })
  },
  //获取最新帖子列表
  getAllPosts(){
    let queryConditions = {
      currentPage:1,
      pageSize:100,
      // regionId:1,
      // hometownId:1,
      // authorId:1
    }
    app.Api.getAllPosts(queryConditions).then(res => {
      console.log('res:', res)
      let {code, data: originData} = res || {}
      if (code === 200) {
        let targetData = this.data.posts
        let posts = app.groupField({
          originData,
          targetData
        })
        this.setData({
          posts
        })
      }
    })
  }
})
