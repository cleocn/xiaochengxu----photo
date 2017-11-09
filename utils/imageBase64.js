
export default function(){
  wx.request({
    url: '/asset/img/111.jpeg',
    header: {
      'content-type': 'application/octet-stream',
    },  
    success: function(res){
      console.log(res)
    }
  })
}
