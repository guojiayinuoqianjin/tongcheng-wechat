const app = getApp()
Page({
  data: {
    postData:{
      id:'1',
      author:'',
      authorRegion:'',
      authorHometown:'',
      title:'',
      content:'',
      praiseCnt:0,
      visitCnt:0,
      replyCnt:0
    },
    replyDatas: {
      currentPage:1,
      pageSize:100,
      totalNum:5,
      isMore:0,
      totalPage:1,
      startIndex:0,
      items: [
        {
          id: '',
          nickname: '',
          author: '',
          authorRegion: '',
          authorHometown: '',
          content: '',
        }
      ]
    },
    newReply:{
      content:'',
      openId:'',
      replyId:'',
      postId:'',
      regionId:'',
      hometownId:''
    },
    height: 0,
    replyTxt:''
  },
  onLoad: function (options) {
    console.log('in post-deatil, options', options)
    let { postId=''} = options || {}
    this.getPostDetail(postId)
    this.getPostReply(postId)
  },
  //获取帖子详情
  getPostDetail: function(postId){
    let queryConditions = {
      postId
    }
    app.Api.getPostDetail(queryConditions).then(res => {
      console.log('res:', res)
      let {code, data: originData} = res || {}
      if (code === 200) {
        let targetData = this.data.postData
        let postData = app.groupField({
          originData,
          targetData
        })
        this.setData({
          postData
        })
      }
    })
  },
  //获取帖子回复列表
  getPostReply: function(postId){
    let queryConditions = {
      currentPage:1,
      pageSize:100,
      postId
    }
    app.Api.getAllPostReply(queryConditions).then(res => {
      console.log('res:', res)
      let {code, data: originData} = res || {}
      if (code === 200) {
        let targetData = this.data.replyDatas
        let replyDatas = app.groupField({
          originData,
          targetData
        })
        this.setData({
          replyDatas
        })
      }
    })
  },
  //点击回复事件
  onTapContentEvent:function (e) {
    console.log('in post-deatil, onTapContentEvent e', e)
    let reply = e.currentTarget.dataset.reply
    this.data.newReply.replyId = reply.id
  },
  //监听input获得焦点
  bindfocus: function(e) {
    let that = this;
    let height = 0;
    let currentScreenHeight = 0;
    wx.getSystemInfo({
      success: function (res) {
        currentScreenHeight = res.windowHeight;
      }
    })
    app.wechat.promise('getSystemInfo').then(res => {
      currentScreenHeight = res.windowHeight
      //e.detail.height是小键盘拉起的高度
      height = e.detail.height - (app.globalData.screenHeight - currentScreenHeight);
      that.setData({
        height: height,
      })
      console.log('获得焦点的 e is', e);
    })
  },
//监听input失去焦点
  bindblur: function(e) {
    this.setData({
      height: 0,
    });
    console.log('失去焦点的 e is', e);
  },
  //监听文本输入
  bindinput: function (e) {
    var value = e.detail.value;
    // var len = parseInt(value.length);
    this.data.replyTxt=value
  },
  //提交回复
  onReply: function () {
    if(this.data.replyTxt){
      console.log('提交回复', this.data.replyTxt);
      this.data.newReply.content = this.data.replyTxt
      this.data.newReply.postId = this.data.postData.id
      this.data.newReply.regionId = app.globalData.userInfo.regionId
      this.data.newReply.hometownId = app.globalData.userInfo.hometownId
      this.data.newReply.openId = app.globalData.userInfo.token
      // this.data.newReply.regionId = 1
      // this.data.newReply.hometownId = 1
      app.Api.createReply(this.data.newReply).then(res => {
        console.log('res:', res)
        let {code} = res || {}
        if (code === 200) {
          this.setData({
            replyTxt: '',
          });
          let postId = this.data.postData.id
          let newReply = {
              content:'',
              openId:'',
              replyId:'',
              postId:'',
              regionId:'',
              hometownId:''
          }
          this.setData({
            newReply
          })
          this.onLoad({postId})
        }
      })
    }
  }
})
