

var AV = require('../utils/av-weapp-min.js');

class ShowService{
  getComponentData(pageid,callback) {
    var pageQuery = new AV.Query('Photo');
    pageQuery.equalTo("objectId", pageid);

    var componentQuery = new AV.Query('Photo');
    componentQuery.equalTo("pageId", pageid)

    var query = AV.Query.or(pageQuery,componentQuery);

    query.find().then(res => {
      let page = [];
      let component = [];
      res.forEach(function(item,index){
        if(item._serverData.cfg.isPage){
          page.push(item._serverData.cfg)
        }else{
          component.push(item._serverData.cfg)
        }
      })
      page.push.apply(page,component)

      callback && callback(page)
    })
  }
}

export default new ShowService;