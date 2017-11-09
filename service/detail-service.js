

var AV = require('../utils/av-weapp-min.js');

class DetailService {
  getPageData(pageids,callback) {
    var queryArr = [];
    pageids.forEach(function (item, index) {
      var queryIndex = new AV.Query('Photo');
      queryIndex.equalTo('objectId',item)
      queryArr.push(queryIndex)
    })
    pageids.forEach(function (item, index) {
      var queryIndex = new AV.Query('Photo');
      queryIndex.equalTo('pageId', item)
      queryArr.push(queryIndex)
    })

    var query = AV.Query.or(...queryArr);
    query.find().then(res => {
      var pages = [];
      // res.reverse()
      for(let x in pageids){
        for (let i in res) {
          if (pageids[x] == res[i].id){
            if (res[i]._serverData.pageId == 'ispage') {
              pages.push(res[i]._serverData.cfg)
              for (let j in res) {
                if (res[i].id == res[j]._serverData.pageId) {
                  pages.push(res[j]._serverData.cfg)
                }
              }
            }
          }
        } 
      }
      callback && callback(pages)
    })
  }
}

export default new DetailService;
