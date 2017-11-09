

var AV = require('../utils/av-weapp-min.js');

class IndexService{
  getPageData(id,callback){      
    var pages = [];
    var userPhoto = new AV.Object.createWithoutData('UserPhoto',id);
    var relation = userPhoto.relation('photosys');
    var query = relation.query();
    query.find().then(res=>{
      for(let i in res){
        res[i]._serverData.id = res[i].id;
        pages.push(res[i]._serverData)
      }
      callback && callback(pages)
    })
  }
  getBgMusic(id,callback){
    var query = new AV.Query('UserPhoto');
    
    query.get(id).then(res => {
      // var bgmusic = res.get('bgmusic');
      callback && callback(res._serverData);
    })
  }
}

export default new IndexService;
