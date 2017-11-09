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
    bgmusic: 'http://ac-uslk0bln.clouddn.com/b2cc1522fbef474de711.mp3',
    activeIndex: 2,
    changeIndex: false,
    indexArr: [],
    existIndex: false,
    audioState: true,
    mubanData: [],
    checks: [],
    current: 0,
    title: '',
    istitle: false
  },
  onLoad: function (options) {
    wx.removeStorageSync('listCurrentIndex');
    this._loadTpl();
    wx.showModal({
      title: '提示',
      content: '按选择顺序可进行排序',
      showCancel: false
    })
  },
  onShow: function(){
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
    this.audioCtx = wx.createAudioContext('myAudio');
    this.audioCtx.play();
  },
  _loadTpl: function () {
    var _this = this;
    ListService.getPageData(res => {
      _this.setData({
        mubanData: res
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
    var preIndex = wx.getStorageSync('listCurrentIndex');
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
    wx.setStorageSync('listCurrentIndex', currentIndex)
  },
  chooseActive: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    if (index == 2) {
      ListService.getPageData(res => {
        _this.setData({
          mubanData: res,
          checks: []
        })
      });
    } else if (index == 3){
      ListService.getMusicData(res => {
        _this.setData({
          musicData: res
        })
      })
    } else if (index == 4) {
      if (this.data.checks.length == 0 && this.data.swiper.length == 0){
        wx.showToast({
          title: '请选择模板',
          image: '/asset/img/x_alt.png'
        })
        return;
      } else if (this.data.checks.length > 0){
        var swiper = this.data.swiper;
        var swiperData = this.data.swiperData;
        H5.prototype.addCommonComponent = function () {
          this.addComponent({
            "width": 60,
            "height": 60,
            "bg": "http://ac-uslk0bln.clouddn.com/b983124457ea85aef86a.svg",
            "css": {
              "right": "20px",
              "top": "20px",
              "z-index": 99999
            },
            "bgCss": {
              "width": "100%",
              "height": "100%"
            },
            "class": "audio_music",
            "id": "music",
            "bindTap": "playOrPause"
          })
        }
        var h5 = new H5();
        DetailService.getPageData(this.data.checks, res => {
          res.forEach(function (item, index) {
            if (item.isPage) {
              h5.addPage(item)
            } else {
              let isFirst = swiper.length ? false : true;
              h5.addComponent(item, isFirst)
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
      }
      index = this.data.istitle ? 1 : 5;
    } else if(index == 5){
      _this.setData({
        istitle: true
      })
      index = 1;
    }
    _this.setData({
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
    var reg = new RegExp(/url\((.*)\);/);
    var matchs = swiper[idx].list[index].style.match(reg);
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
        //     console.log(file.url(),5555)
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
            swiper[idx].list[index].style = swiper[idx].list[index].style.replace(matchs[1], res.data)
            swiperData[idx].list[index].style = swiperData[idx].list[index].style.replace(matchs[1], res.data)
            _this.setData({
              swiper,
              swiperData
            })
          }
        })
      }
    })
  },
  show: function (e) {
    var pageid = e.currentTarget.dataset.pageid;
    wx.navigateTo({
      url: '/pages/show/show?pageid=' + pageid,
    })
  },
  del: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var swiper = this.data.swiper;
    var swiperData = this.data.swiperData;
    swiper.splice(idx, 1);
    swiperData.splice(idx, 1);
    if(swiper.length == 0){
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
  saveTitle: function(e){
    this.setData({
      title: e.detail.value
    })
  },
  save: function () {
    var _this = this;
    var swiper = _this.data.swiper;
    var swiperData = _this.data.swiperData;
    var reg = new RegExp(/url\((.*)\);/);
    var matchs = swiperData[0].list[1] ? swiperData[0].list[1].style.match(reg) : swiperData[0].list[0].style.match(reg);
    var userPhoto = new AV.Object('UserPhoto');
    userPhoto.set('userid', wx.getStorageSync('userid'));
    userPhoto.set('thumb', matchs[1]);
    userPhoto.set('bgmusic', _this.data.bgmusic);
    userPhoto.set('title',_this.data.title);
    var userPhotos = [];
    for (var i = 0, len = swiper.length; i < len; i++) {
      var userPhotoSys = new AV.Object('UserPhotoSys');
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
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/user/user',
              })
            }, 2000)
          }
        })
      })
    })
  }
})