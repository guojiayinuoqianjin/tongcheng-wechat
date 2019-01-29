/**
 * 用于展示帖子信息
 **/
Component({
  externalClasses: ['external-post-card'],
  options:{
    multipleSlots: true //在组件定义时的选项中启用多slot支持
  },
  properties:{
    needNavigate:{
      type:Boolean
    }, //用此位标识是否跳转
    data:{
      type:Object,
      value:{
        id:'',
        authorNickname:'作者昵称',
        authorAvatarUrl:'',
        authorRegionName:'',
        authorHometownName:'',
        title:'帖子标题',
        content:'帖子内容',
        praiseCnt:0,
        visitCnt:0,
        replyCnt:0
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
      console.log('in card onInternal', this.data)
      let { id=''} = this.data.item || {}
      let url = '/pages/post-detail/index?postId=' + id
      if(this.data.needNavigate && url){
        wx.navigateTo({
          url
        })
      }
    }
  }
})
