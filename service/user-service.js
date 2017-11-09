

var AV = require('../utils/av-weapp-min.js');

class UserService{
  getPageData(callback){      
    var query = new AV.Query('UserPhoto');
    query.equalTo('userid',wx.getStorageSync('userid'));
    query.find().then(res=>{
      var pages = [];
      for (let i in res) {
        res[i]._serverData.id = res[i].id;
        pages.push(res[i]._serverData)
      }
      callback && callback(pages)
    })
  }
  delUserPhoto(id){
    var userPhoto = AV.Object.createWithoutData('UserPhoto', id);
    userPhoto.destroy().then(function (res) {
      wx.showToast({
        title: '删除成功'
      })
    })
  }
  userView(id){
    var userPhoto = AV.Object.createWithoutData('UserPhoto', id);
    userPhoto.increment('view',1);
    userPhoto.save()
  }
  userShare(id) {
    var userPhoto = AV.Object.createWithoutData('UserPhoto', id);
    userPhoto.increment('share', 1);
    userPhoto.save()
  }
}

export default new UserService;
