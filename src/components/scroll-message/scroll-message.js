/**
 *滚动信息
 **/
Component({
  externalClasses: ['external-scroll-message'],
  properties:{
    messages:{
      type:Array,
      value:[]
    }
  },
  data:{
    indicatorDots:false,
    autoplay:true,
    interval: 2000,
    duration: 1000,
    circular: true,
    vertical: true
  },
  method:{
  }
})
