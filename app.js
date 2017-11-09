//app.js
var AV = require('./utils/av-weapp-min.js');

AV.init({
  appId: 'USlk0bLnWlu4qw9xnJJJllDL-gzGzoHsz',
  appKey: 'aq2eTrtsxE3eU5mf5rYg4JyL'
})

App({
  // onShow: function(){
  //   var that = this;
  //   var query = new AV.Query('Config');
  //   query.get('59fffbf426a9130067db1ee0').then(function (res) {
  //     that.globalData.config = res._serverData
  //     console.log(that.globalData.config)
  //   });
  // },
  userLogin: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      var user = {};
      wx.login({
        success: (res) => {
          var code = res.code;
          that.globalData.code = code
          that.getUserInfo()
        }
      })
    }
  },
  getUserInfo: function(){
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

        wx.request({
          // url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.config.appId + '&secret=' + that.globalData.config.appSecret+'&js_code=' + that.globalData.code + '&grant_type=authorization_code',
          url: 'https://xww-photo.leanapp.cn/oauth.php',
          header: {
            'content-type': 'application/json'
          },
          data: {
            code: that.globalData.code
          },
          success: (res) => {
            userInfo.openid = res.data.openid;

            var query = new AV.Query('Users');
            query.equalTo('openid', userInfo.openid);
            query.first().then(res => {
              if (res) {
                wx.setStorageSync('userid', res.id)
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
      },
      fail: function (err) {
        that.applyNotice()
      }
    })
  },
  applyNotice: function () {
    var that = this;
    if (wx.openSetting) {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.userInfo"]) {
            wx.openSetting({
              success: (res) => {
                if(res.authSetting["scope.userInfo"]){
                  that.getUserInfo()
                }
              }
            })
            return;
          }
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  globalData: {
    userInfo: null,
    code: '',
    config: null
  }
})