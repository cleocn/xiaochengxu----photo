// user.js
const app = getApp()

import UserService from '../../service/user-service.js';

Page({
  data: {
    userInfo: {},
    photos: []
  },
  onLoad: function(){
    this._loadTpl();
  },
  onShow: function(){
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    if (!userInfo){
      app.userLogin(); 
      return
    }
    this._loadTpl();
  },
  _loadTpl: function(){
    var _this = this;
    wx.showLoading({
      title: 'loading'
    })
    UserService.getPageData(res=>{
      wx.hideLoading()
      _this.setData({
        photos: res
      })
    })
  },
  del: function(e){
    var _this = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function(res){
        if(res.confirm){
          UserService.delUserPhoto(id);
          // wx.navigateTo({
          //   url: '/pages/user/user',
          // })
          _this._loadTpl();
        }
      }
    })
  },
  edit: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/edit/edit?id=' + id,
    })
  },
  open: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/index?id='+id,
    })
  },
  create: function () {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})