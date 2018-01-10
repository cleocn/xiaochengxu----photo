// pages/edit/edit.js
const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

import H5 from '../../service/H5.js';
import IndexService from '../../service/index-service.js';
import ListService from '../../service/list-service.js';
import DetailService from '../../service/detail-service.js';

Page({
  data: {
    swiper: [],
    swiperData: [],
    bgmusic: '',
    activeIndex: 1,
    changeIndex: false,
    indexArr: [],
    existIndex: false,
    audioState: true,
    mubanData: [],
    checks: [],
    current: 0
  },
  onLoad: function (options) {
    this.id = options.id;
    this._loadMusic();
    wx.removeStorageSync('editCurrentIndex');
  },
  onShow: function () {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    if (!userInfo) {
      app.userLogin();
      return
    }
  },
  onReady: function () {
    this._loadTpl();
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.play()
  },
  _loadMusic: function () {
    var _this = this;
    // IndexService.getBgMusic(this.id,res=>{
    //   _this.setData({
    //     bgmusic: res.bgmusic,
    //     title: res.title
    //   })
    // })
    wx.getStorage({
      key: 'music',
      success: function (res) {
        _this.setData({ ...res.data })
      }
    })
  },
  _loadTpl: function () {
    var _this = this;
    IndexService.getPageData(_this.id, res => {
      _this.setData({
        swiper: res,
        swiperData: res
      })
    })
  },
  playOrPause: function (e) {
    if (this.data.audioState) {
      this.audioCtx.play()
    } else {
      this.audioCtx.pause()
    }
  },
  play: function (e) {
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
    var preIndex = wx.getStorageSync('editCurrentIndex');
    var currentIndex = event.detail.current;
    var swiper = this.data.swiper;
    var indexArr = this.data.indexArr;
    if (!indexArr.includes(currentIndex)) {
      indexArr.push(currentIndex)
      this.setData({
        indexArr,
        existIndex: true
      })
    } else {
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
    wx.setStorageSync('editCurrentIndex', currentIndex)
  },
  chooseActive: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    if (index == 2) {
      ListService.getPageData(res => {
        _this.setData({
          mubanData: res
        })
      });
    } else if (index == 3){
      ListService.getMusicData(res => {
        _this.setData({
          musicData: res
        })
      })
    } else if (index == 4){
      var swiper = this.data.swiper;
      var swiperData = this.data.swiperData;
      var h5 = new H5();
      console.log(this.data.checks.length, this.data.swiper.length)
      if (this.data.checks.length){
        DetailService.getPageData(this.data.checks, res => {
          res.forEach(function (item, index) {
            if (item.isPage) {
              h5.addPage(item)
            } else {
              h5.addComponent(item, false)
            }
          })
          // swiper.push.apply(swiper, h5.page)
          swiperData.push.apply(swiperData, h5.page)
          _this.setData({
            swiper: swiperData,
            changeIndex: false,
            swiperData
          })
        })
      } else if (this.data.checks.length === 0 && this.data.swiper.length === 0){
        wx.showToast({
          title: '请选择模板',
          image: '/asset/img/x_alt.png'
        })
        return;
      }
      index = 1;
    } 
    this.setData({
      activeIndex: index
    })
  },
  checkboxChange: function (e) {
    this.setData({
      checks: e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      bgmusic: e.detail.value
    })
  },
  chooseImg: function (e) {
    var _this = this;
    var swiper = _this.data.swiper;
    var swiperData = _this.data.swiperData;
    var idx = e.currentTarget.dataset.idx;
    var index = e.currentTarget.dataset.index;
    // var reg = new RegExp(/url\((.*)\);/);
    // var matchs = swiper[idx].list[index].style.match(reg);
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0];
        // new AV.File('file-name', {
        //   blob: {
        //     uri: tempFilePath,
        //   },
        // }).save().then(
        //   file => {
        //     swiper[idx].list[index].style = swiper[idx].list[index].style.replace(matchs[1], file.url())
        //     swiperData[idx].list[index].style = swiperData[idx].list[index].style.replace(matchs[1], file.url())
        //     _this.setData({
        //       swiper,
        //       swiperData
        //     })
        //   }
        //   ).catch(console.error);
        wx.uploadFile({
          url: 'https://xww-photo.leanapp.cn/upload.php',
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            // swiper[idx].list[index].style = swiper[idx].list[index].style.replace(matchs[1], res.data)
            // swiperData[idx].list[index].style = swiperData[idx].list[index].style.replace(matchs[1], res.data)
            swiper[idx].list[index].image = res.data
            swiperData[idx].list[index].image = res.data
            _this.setData({
              swiper,
              swiperData
            })
            _this.audioCtx.play()
          }
        })
      }
    })
  },
  del: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var swiper = this.data.swiper;
    var swiperData = this.data.swiperData;
    var _this = this;
    swiper.splice(idx, 1);
    swiperData.splice(idx, 1);
    if (swiper.length == 0) {
      if(this.data.mubanData.length === 0){
        ListService.getPageData(res => {
          _this.setData({
            mubanData: res
          })
        });
      }
      this.setData({
        activeIndex: 2,
        bgmusic: '',
        checks: []
      })
    }
    this.setData({
      swiper: swiperData,
      swiperData,
      current: idx ? idx - 1 : 0
    })
    wx.removeStorageSync('listCurrentIndex');
  },
  save: function () {
    var _this = this;
    var swiper = _this.data.swiper;
    var swiperData = _this.data.swiperData;
    var reg = new RegExp(/url\((.*)\);/);
    var matchs = swiperData[0].list[1] ? swiperData[0].list[1].style.match(reg) : swiperData[0].list[0].style.match(reg);
    var userPhoto = new AV.Object.createWithoutData('UserPhoto',_this.id);
    userPhoto.set('thumb', matchs[1]);
    userPhoto.set('bgmusic', _this.data.bgmusic);
    var oldUserPhotos = [];
    for (let i = 0, len = swiper.length; i < len; i++) {
      let userPhotoSys = new AV.Object.createWithoutData('UserPhotoSys', _this.data.swiperData[i].id);
      oldUserPhotos.push(userPhotoSys);
    }
    AV.Object.destroyAll(oldUserPhotos);
    var userPhotos = [];
    for (var i = 0, len = swiper.length; i < len; i++) {
      let userPhotoSys = new AV.Object('UserPhotoSys');
      userPhotoSys.set('bg', swiperData[i].bg);
      userPhotoSys.set('list', swiperData[i].list);
      userPhotos.push(userPhotoSys);
    }
    AV.Object.saveAll(userPhotos).then(function (res) {
      var relation = userPhoto.relation('photosys');
      userPhotos.map(relation.add.bind(relation));
      userPhoto.save().then(res => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          mask: true,
          duration: 1000,
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/user/user',
              })
            }, 1000)
          }
        })
      })
    })
  }
})