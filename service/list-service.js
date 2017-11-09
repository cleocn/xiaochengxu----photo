

var AV = require('../utils/av-weapp-min.js');

class ListService{
  getPageData(callback) {
    var query = new AV.Query('Photo');
    query.equalTo('pageId', 'ispage');
    query.find().then(res => {
      var pages = [];
      for (let i in res) {
        res[i]._serverData.cfg.pageid = res[i].id
        pages.push(res[i]._serverData.cfg)
      }
      callback && callback(pages)
    })
  }

  getMusicData(callback) {
    var query = new AV.Query('BgMusic');
    query.find().then(res => {
      var musics = [];
      for (let i in res) {
        musics.push(res[i]._serverData)
      }
      
      callback && callback(musics)
    })
  }
}

export default new ListService;