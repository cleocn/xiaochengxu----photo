
class Base{

  request(params){
    var method = params.method || 'GET';
    var data = params.data || {};
    wx.request({
      url: params.url,
      data: params.data,
      header: {
        'content-type': 'application/json'
      },
      method: params.method,
      dataType: 'json',
      success:function(res){
        params.sCallback && params.sCallback(res)
      },
      fail(err){
        console.log(err);
      }
    })
  }

  getEventValue(event,key){
    return event.currentTarget.dataset[key];
  }
}

export default Base;