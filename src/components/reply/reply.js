/**
 * 用于展示帖子信息
 **/
Component({
  externalClasses: ['external-reply-card'],
  options:{
    multipleSlots: true //在组件定义时的选项中启用多slot支持
  },
  properties:{
    data:{
      type:Object,
      value:{
        id:'',
        authorNickname:'作者昵称',
        authorAvatarUrl:'',
        authorRegionName:'',
        authorHometownName:'',
        replyContent:'回复内容',
      },
      observer: function (newVal) {
        this.groupData(newVal)
      }
    }
  },
  attached:function () {
  },
  ready:function () {
  },
  data:{
    item:{}
  },
  methods:{
    groupData(data){
      this.setData({
        item:data
      })
      return data
    },
    //跳转
    onInternal(){
      console.log('in reply card onInternal', this.data)
      // let { id=''} = this.data.item || {}
      // let url = '/pages/post-detail/index?postId=' + id
      // if(url){
      //   wx.navigateTo({
      //     url
      //   })
      // }
    },
    //点击内容回复
    _tapContentEvent(){
      console.log('in reply card _tapContentEvent', this.data)
      this.triggerEvent("tapContentEvent");
    }
  }
})
