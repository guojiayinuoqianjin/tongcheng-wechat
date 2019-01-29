const app = getApp()
Page({
  data: {
    newPost : {
      title:'',
      content:'',
      showDurtion:-1,
      usrOpenId:'1',
      top:0,
      regionId:1,
      hometownId:1
    }
  },
  onLoad: function () {},
  //监听标题输入
  bindTitleInput: function (e) {
    var value = e.detail.value;
    // var len = parseInt(value.length);
    this.data.newPost.title = value
  },
  //监听内容输入
  bindContentInput: function (e) {
    var value = e.detail.value;
    // var len = parseInt(value.length);
    this.data.newPost.content = value
  },
  //提交新帖
  onCreatePost: function () {
    if(this.data.newPost.title && this.data.newPost.content){
      // app.globalData.loginInfo.uidthis.globalData.userInfo
      this.data.newPost.regionId = app.globalData.userInfo.regionId
      this.data.newPost.hometownId = app.globalData.userInfo.hometownId
      this.data.newPost.usrOpenId = app.globalData.userInfo.token
      console.log('发表新帖', this.data);
      console.log('发表新帖时app.globalData', app.globalData);
      app.Api.createPost(this.data.newPost).then(res => {
        console.log('res:', res)
        let {code} = res || {}
        if (code === 200) {
          let newPost = this.data.newPost
          newPost.title = ''
          newPost.content = ''
          this.setData({
            newPost
          })
          let url = '/pages/index/index'
          wx.switchTab({
            url
          })
        }
      })
    }else{
      wx.showToast({
        title: '必填标题内容',  //标题
        icon: 'loading',  //图标，支持"success"、"loading"
        // image: '../image/img.png',  //自定义图标的本地路径，image 的优先级高于 icon
      })
    }
  }
})
