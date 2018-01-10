
class H5 {
  constructor(){
    this.page = [];
  }
  addPage(cfg){
    var cfg = cfg || {};
    var page = {};
    page.bg = cfg.bg || '';
    page.list = [];
    this.page.push(page)
    if ((typeof this.addCommonComponent) == 'function'){
      this.addCommonComponent()
    }
    return this;
  }
  addComponent(cfg, edit = true){
    var page = this.page.slice(-1)[0]; 
    var firstPage = this.page[0];
    var component = {};

    // 页面标题
    component.text = cfg.text ? cfg.text : '';

    // 元素父级样式
    component.parentStyle = "";
    if (cfg.width) component.parentStyle += "width: " + cfg.width / 2 + "px;";
    if (cfg.height) component.parentStyle += "height: " + cfg.height / 2 + "px;";
    if (cfg.center) component.parentStyle += "left:50%;margin-left:" + (cfg.width / 4 * -1) + "px;";
    if (cfg.parentCss){
      for (let [key, value] of Object.entries(cfg.parentCss)){
        component.parentStyle += key + ":" + value + ";";
      }
    }
    // 元素样式 -> bg
    component.style = "";
    if (cfg.bg) component.image = cfg.bg;
    if (cfg.css) {
      for (let [key, value] of Object.entries(cfg.css)) {
        component.style += key + ":" + value + ";";
      }
    }

    //图片样式 -> img
    component.imgStyle = "";
    if (cfg.img) {
      for (let [key, value] of Object.entries(cfg.img)) {
        component.imgStyle += key + ":" + value + ";";
      }
    }


    // 自定义事件
    if(cfg.bindTap) component.bindTap = cfg.bindTap;

    // 自定义class
    if(cfg.class) component.class = cfg.class;

    // 动画效果
    if(cfg.animateIn) {
      if (cfg.animateIn.name == undefined){
        return this;
      }
      if (cfg.animateIn.duration == undefined){
        cfg.animateIn.duration = '1s';
      }
      var animate = '';
      for (let [key, value] of Object.entries(cfg.animateIn)) {
        animate += value + " ";
      }
      if (page == firstPage && edit) component.style += "animation: "+animate+";";
      component.animateIn = "animation: " + animate + ";";
      component.animateInName = cfg.animateIn.name;
    }
    if (cfg.animateOut) component.animateOut = cfg.animateOut;

    // 追加元素
    page.list.push(component);
    return this;
  }


}

export default H5;