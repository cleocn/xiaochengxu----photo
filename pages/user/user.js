// user.js
const app = getApp()

import UserService from '../../service/user-service.js';
var AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    userInfo: {},
    photos: []
  },
  onLoad: function(){
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo){
      this.userLogin(); 
      return
    }
    this.setData({
      userInfo
    })
    this._loadTpl();
  },
  _loadTpl: function () {
    var _this = this;
    wx.showLoading({
      title: 'loading'
    })
    UserService.getPageData(res => {
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
  },
  userLogin: function (cb) {
    var that = this
    var user = {};
    wx.login({
      success: (res) => {
        var code = res.code;
        that.getUserInfo(code)
      }
    })
  },
  getUserInfo: function (code) {
    var that = this;
    //调用登录接口
    wx.getUserInfo({
      // withCredentials: false,
      success: function (res) {
        var rawData = JSON.parse(res.rawData)
        var userInfo = {
          nickname: rawData.nickName,
          avatar: rawData.avatarUrl
        }
        that.setData({
          userInfo
        })
        that.saveUserInfo(code, userInfo)
      },
      fail: function (err) {
        // that.applyNotice()
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                    wx.getUserInfo({
                      success: function (res) {
                        var userInfo = {
                          nickname: res.userInfo.nickName,
                          avatar: res.userInfo.avatarUrl
                        }
                        that.setData({
                          userInfo
                        })
                        that.saveUserInfo(code, userInfo)
                      }
                    })
                  }
                }, fail: function (res) {

                }
              })

            }
          }
        })

      }
    })
  },
  saveUserInfo: function (code, userInfo = {}){
    var that = this
    wx.request({
      url: 'https://xww-photo.leanapp.cn/oauth.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        code: code
      },
      success: (res) => {
        userInfo.openid = res.data.openid;

        var query = new AV.Query('Users');
        query.equalTo('openid', userInfo.openid);
        query.first().then(res => {
          if (res) {
            wx.setStorageSync('userid', res.id)
            that._loadTpl()
          } else {
            var users = new AV.Object('Users');
            users.set('openid', userInfo['openid']);
            users.set('nickname', userInfo['nickname']);
            users.set('avatar', userInfo['avatar']);
            users.save().then(res => {
              wx.setStorageSync('userid', res.id)
            })
          }
        })
        wx.setStorageSync('userInfo', userInfo)
      }
    })
  }
})