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