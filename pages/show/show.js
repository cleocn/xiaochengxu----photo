// pages/show.js

const app = getApp()

import H5 from '../../service/H5.js';
import ShowService from '../../service/show-service.js';


Page({
  data: {
    swiper: []
  },
  onLoad: function(options){
    this.id = options.pageid;
    this._loadTpl()
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
  _loadTpl: function (){
    var _this = this;
    var h5 = new H5();
    var res = [
      {
        "isPage": 1,
        "text": "first",
        "bg": "http://ac-uslk0bln.clouddn.com/63942625017f584dabec.png"
      },
      {
        "bg": "http://ac-uslk0bln.clouddn.com/b234b461b40de7011d6e.png",
        "width": 422,
        "height": 106,
        "center": true,
        "parentCss": {
          "top": "40%",
          "position": "absolute"
        },
        "css": {
          
        },
        "img": {
          "width": "211px",
          "height": "53px"
        },
        "animateIn": {
          "name": "fadeInUp",
          "duration": "1s",
          "timing": "ease",
          "delay": "0s",
          "iteration": 1,
          "direction": "normal",
          "mode": "both"
        },
        "animateOut": "fadeOutDown"
      },
      {
        "bg": "http://ac-uslk0bln.clouddn.com/35a908cc542ce4987f1e.jpg",
        "width": 264,
        "height": 264,
        "center": true,
        "parentCss": {
          "top": "15%",
          "position": "absolute"
        },
        "css": {
        },
        "img": {
          "width": "132px",
          "height": "132px",
          "border-radius": "50%"
        },
        "animateIn": {
          "name": "fadeInDown",
          "duration": "1s",
          "timing": "ease",
          "delay": "0s",
          "iteration": 1,
          "direction": "normal",
          "mode": "both"
        },
        "animateOut": "fadeOutUp"
      }
    ]
    console.log(res)
   ShowService.getComponentData(_this.id, res => {
      res.forEach(function (item, index) {
        if (item.isPage) {
          h5.addPage(item)
        } else {
          h5.addComponent(item)
        }
      })
      _this.setData({
        swiper: h5.page
      })
    })
  }
})