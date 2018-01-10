//index.js
//获取应用实例
const app = getApp()

import H5 from '../../service/H5.js';
import IndexService from '../../service/index-service.js';
import UserService from '../../service/user-service.js';

Page({
  data: {
    swiper: [],
    bgmusic: '',
    title: '',
    changeIndex: false,
    indexArr: [],
    existIndex: false,
    audioState: true,
    share: false
  },
  onLoad: function (options) {
    this.id = options.id;
    if(options.share){
      this.setData({
        share: true
      })
    }
    this._loadMusic();
    // this._loadTpl();
    UserService.userView(this.id);
    wx.removeStorageSync('indexCurrentIndex');
  },
  onReady: function () {
    this._loadTpl();
    this.audioCtx = wx.createAudioContext('myAudio');
    this.audioCtx.play();
  },
  _loadMusic: function(){
    var _this = this;
    // IndexService.getBgMusic(this.id,res=>{
    //   _this.setData({
    //     bgmusic: res.bgmusic,
    //     title: res.title
    //   })
    // })
    wx.getStorage({
      key: 'music',
      success: function(res) {
        _this.setData({...res.data})
      }
    })
  },
  _loadTpl: function(){
    var _this = this;
    wx.showLoading({
      title: 'loading'
    })
    IndexService.getPageData(this.id, res => {console.log(res)
      wx.hideLoading()
      _this.setData({
        swiper: res
      })
    })
  },
  playOrPause: function(){
    if (this.data.audioState) {
      this.audioCtx.play()
    }else{
      this.audioCtx.pause()
    }
  },
  play: function(e){
    this.setData({
      audioState: false
    })
  },
  pause: function (e) {
    this.setData({
      audioState: true
    })
  },
  change: function (event) {
    var preIndex = wx.getStorageSync('indexCurrentIndex');
    var currentIndex = event.detail.current;
    var swiper = this.data.swiper;
    var indexArr = this.data.indexArr;
    if (!indexArr.includes(currentIndex)){
      indexArr.push(currentIndex)
      this.setData({
        indexArr,
        existIndex: true
      })
    }else{
      this.setData({
        existIndex: false
      })
    }
    
    if (preIndex == '') {
      for (let [key, value] of Object.entries(swiper[0].list)) {
        value.style = value.style.replace(value.animateInName, value.animateOut)
      }
    } else if (preIndex === 0 || Boolean(preIndex)) {
      for (let [key, value] of Object.entries(swiper[preIndex].list)) {
        value.style = value.style.replace(value.animateInName, value.animateOut)
      }
    }
    for (let [key, value] of Object.entries(swiper[currentIndex].list)) {
      if (!this.data.changeIndex && this.data.existIndex) {
        value.style += value.animateIn;
      }
      value.style = value.style.replace(value.animateOut, value.animateInName)
    }

    if (currentIndex + 1 == swiper.length) {
      this.setData({
        changeIndex: true
      })
    }

    this.setData({
      swiper
    })
    wx.setStorageSync('indexCurrentIndex', currentIndex)
  },
  make: function(){
    wx.navigateTo({
      url: '/pages/user/user'
    })
  },
  onShareAppMessage: function () {
    var _this = this;
    return {
      title: _this.data.title.length ? _this.data.title : '小琬琬音乐相册',
      path: '/pages/index/index?id=' + _this.id + '&share=1',
      success: function(){
        UserService.userShare(_this.id);
      }
    }
  }
})