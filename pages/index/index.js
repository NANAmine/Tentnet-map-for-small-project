const app = getApp();
const system = app.getAppSysInfo();
var request = require('../../utils/request.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var amapInstance;
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    //selectcolor
    //text是指推荐文本的颜色，img是指男女图标的颜色，span是指大号实时人数字体的颜色
    changeclass: [{
      "text": "selectcolor","img":"img","span":"td3"
    }, {
        "text": "", "img": "img1", "span": ""
    }, {
        "text": "", "img": "img1", "span": ""
    }],
    changetype:0,
    selected_id: 0,//选中地址id
    selected_ID:0,
    Height: 0,
    sysheigth: 350,
    scale: 16,
    latitude: "1",
    longitude: "1",
    cid: '',
    markersid: 0,
    markers: [],
    polyline: [],
    latandlon: [],
    controls: [],
    circles: [],
    dingshiqiflag:0,
    change: {
      "path": "",
      "id": ""
    },
    pagelist2: [{
      "man": "",
      "woman": ""
    }, {
      "man": "-",
        "woman": "-"
    }, {
      "man": "-",
      "woman": "-"
    }]
  },

  onLoad: function(option) {
    var that = this;
    console.log(option)
    that.setData({
     // cid: option.cid
    });
    // amapInstance = new amapFile.AMapWX({ key: 'cd17f895f7d70ef688f4bf600e067a8e' });
    amapInstance = new QQMapWX({
      key: 'SKBBZ-LK6RX-Z2J4V-ZPIGA-QHGGE-GABSX' //此处使用你自己申请的key
      }),
      wx.getSystemInfo({
        success: function(res) {
          //设置map高度，根据当前设备宽高满屏显示
          that.setData({
            view: {
              Height: res.windowHeight
            },
            syshigth: res.windowHeight - 150
          })
        }
      })


    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res) {
       // console.log(" wx.getLocation:" + res.latitude + "," + res.longitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        if(that.data.dingshiqiflag==0){
          that.dingshiqi();
          that.dingshiqi2();
          that.setData({
            lat: res.latitude,
            lon: res.longitude
          })
        }
        that.getData();
        if (that.data.dingshiqiflag==1){
         that.getoldmarkes();
        }
       
        
        // 
        
      }
    })
    // 获取地图麻点
  },
  //当页面刷新后，获得之前选中的图标
  getoldmarkes:function(){
if(this.data.selected_ID!=""){
  var id="";
  for(var k=0;k<this.data.latandlon.length;k++){
    if (this.data.selected_ID == this.data.latandlon[k].id){
      id=k;
    }
  }
  if(id!=""){
    var that = this;

    //点击标点，之前选中图标回复，选中图标变化
    //区别之前选中图标是否是推荐图标
    var str1 = "markers[" + that.data.selected_id + "].width";
    var str2 = "markers[" + that.data.selected_id + "].height";
    if (that.data.selected_id < 3) {
      that.setData({
        [str1]: 32,
        [str2]: 44
      })
    }
    else {
      that.setData({
        [str1]: 24,
        [str2]: 33
      })
    }
    //改变新图标
    
    var str3 = "markers[" + id + "].width";
    var str4 = "markers[" + id + "].height";
    that.setData({
      [str3]: 40,
      [str4]: 55
    })
    that.setData({
      selected_id: id,
      selected_ID: that.data.latandlon[id].id
    })
    // changeclass: [{
    //   "text": "selectcolor", "img": "img", "span": "td3"
    // }, {
    //   "text": "", "img": "img1", "span": ""
    // }, {
    //   "text": "", "img": "img1", "span": ""
    // }],
    //以下是对应调节文字区显示的变化
    for (var k = 0; k < 3; k++) {
      var str = "changeclass[" + k + "].text";
      var str1 = "changeclass[" + k + "].img";
      var str2 = "changeclass[" + k + "].span";
      that.setData({
        [str]: "",
        [str1]: "img1",
        [str2]: ""
      })
    }
    if (id >= 0 & id <= 2) {
      var str = "changeclass[" + id + "].text";
      var str1 = "changeclass[" + id + "].img";
      var str2 = "changeclass[" + id + "].span";
      that.setData({
        [str]: "selectcolor",
        [str1]: "img",
        [str2]: "td3"
      })
    }
  }
}
  },
//循环建造标记点
  getData: function() {
    var that=this;
    amapInstance.search({
      keyword: '厕所',
      success: function  (res) {
        //  console.log("返回数据");
        console.log(res);
        for (var k = 0; k < res.data.length; k++) {
          // console.log("详细数据");
          if (res.data[k]._distance <= 1000) {
            var str = "latandlon[" + k + "]";
            // "latitude": 39.5128, "longitude": 116.75065
            var datas = {
              "latitude": res.data[k].location.lat,
              "longitude": res.data[k].location.lng,
              "distance": Math.round(res.data[k]._distance),
              "id": res.data[k].id
            }
            that.setData({
              [str]: datas
            })
          }
        }
        if(that.data.polyline==""){
          var lat = that.data.latandlon[0].latitude;
          var lon = that.data.latandlon[0].longitude;
          that.end(lat, lon);
        }
        
        for (var k = 0; k < that.data.latandlon.length; k++) {
          //传入经纬度
          that.addmarkert(that.data.latandlon[k].latitude, that.data.latandlon[k].longitude);
        }
      },
      fail: function  (res) {
        //  console.log(res);
      },
      complete: function  (res) {
        // console.log(res);
      }
    })
  },
//标记点生成函数
  addmarkert: function(latitude, longitude) {
  //  console.log("添加标记");
    var that = this;
    var id = this.data.markersid;
    if(id==0){
      var mark = {
        id: id,
        iconPath: "../../image/bz" + id + ".png", //显示图标
        latitude: latitude, //纬度
        longitude: longitude, //经度
        width: 40,
        height: 55
      }
    }
    else if (id < 3&&id>=1) {
     // console.log(id);
      var mark = {
        id: id,
        iconPath: "../../image/bz" + id + ".png", //显示图标
        latitude: latitude, //纬度
        longitude: longitude, //经度
        width: 32,
        height: 44
      }
     // console.log(mark.iconPath);
    } else if (id >= 3 && id < 10) {
     // console.log(id);
      var mark = {
        id: id,
        iconPath: "../../image/bz3.png", //显示图标
        latitude: latitude, //纬度
        longitude: longitude, //经度
        width: 24,
        height: 33
      }
    } else if (id >= 10) {
     // console.log(id);
      return;
    }
    var markerss = this.data.markers;
    markerss.push(mark);
    that.setData({
      markers: markerss,
      markersid: id + 1
    })
  },
  //定时器，循环执行自身,动态改变人数
  dingshiqi: function() {
    var that = this;
    that.setData({
      dingshiqiflag: 1
    });
   // console.log("人数刷新");
    
    var Wnum = Math.floor(Math.random() * 5);
    var Mnum = Math.floor(Math.random() * 5);
    var list = {
      "man": Mnum,
      "woman": Wnum
    };
    var str = "pagelist2[0]";
    that.setData({
      [str]: list
    });
    setTimeout(function() {
      that.dingshiqi()
    }, 3000)
  },
  //定时器2，循环执行自身,实现图标动画
  dingshiqi2: function () {
   
    var that=this;
    that.onLoad();
   //console.log("重载页面");
    setTimeout(function () {
      that.dingshiqi2()
    },60000)
  },

  
//点击标记点触发事件，
  markertap: function(e) {
    var that=this;
    
    //点击标点，之前选中图标回复，选中图标变化
    //区别之前选中图标是否是推荐图标
    var str1 = "markers[" + that.data.selected_id + "].width";
    var str2 = "markers[" + that.data.selected_id + "].height";
    if (that.data.selected_id<3){
      that.setData({
         [str1]: 32,
         [str2]:44
       })
    }
   else {
      that.setData({
        [str1]: 24,
        [str2]: 33
      })
    }
    //改变新图标
    var id = e.markerId;
    var str3 = "markers[" + e.markerId + "].width";
    var str4 = "markers[" + e.markerId + "].height";
    that.setData({
      [str3]:40,
      [str4]:55
    })
    that.setData({
      selected_id: id,
      selected_ID:that.data.latandlon[id].id
    })
    // changeclass: [{
    //   "text": "selectcolor", "img": "img", "span": "td3"
    // }, {
    //   "text": "", "img": "img1", "span": ""
    // }, {
    //   "text": "", "img": "img1", "span": ""
    // }],
//以下是对应调节文字区显示的变化
    for (var k = 0; k < 3; k++) {
      var str = "changeclass[" + k + "].text";
      var str1 = "changeclass[" + k + "].img";
      var str2 = "changeclass[" + k + "].span";
      that.setData({
        [str]: "",
        [str1]: "img1",
        [str2]: ""
      })
    }
    if (id >= 0 & id <= 2) {
      var str = "changeclass[" + id + "].text";
      var str1 = "changeclass[" + id + "].img";
      var str2 = "changeclass[" +id + "].span";
      that.setData({
        [str]: "selectcolor",
        [str1]: "img",
        [str2]: "td3"
      })
    }
    //调用路径生成函数
    var lat = that.data.latandlon[id].latitude;
    var lon = that.data.latandlon[id].longitude;
    this.end(lat, lon);
  },

  //点击缩放按钮动态请求数据
  controltap(e) {
    var that = this;
    // console.log("scale===" + this.data.scale)
    if (e.controlId === 1) {
      // if (this.data.scale === 13) {
      that.setData({
        scale: --this.data.scale
      })
      // }
    } else if (e.controlId === 2) {
      //  if (this.data.scale !== 13) {
      that.setData({
        scale: ++this.data.scale
      })
      // }
    } else if (e.controlId === 3) {
      wx.getLocation({
        type: 'gcj02',
        success: function(res) {
        //  console.log(res)
          var latitude = res.latitude
          var longitude = res.longitude
          that.setData({
            latitude: latitude,
            longitude: longitude
          })
        }
      })
    } else if (e.controlId === 4) {
      wx.navigateTo({
        url: '../classify/classify'
      })
    } else if (e.controlId === 5) {
      wx.navigateTo({
        url: '../huodong/huodong'
      })
    }
  },
  
  onShow: function() {
  },
  // 下拉刷新回调接口
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this
    // 调取数据
    that.getData();
    setTimeout(function() {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },
//路径生成函数
   end: function(lat, lon) {
    var coors;
    var that = this;
    // latitude: "1",
    //   longitude: "1",
    console.log(that.data.latitude + ',' + that.data.longitude);
    wx.request({
      url: 'https://apis.map.qq.com/ws/direction/v1/walking/?from=' + that.data.latitude + ',' + that.data.longitude + '&to=' + lat + ',' + lon + '&output=json&callback=cb&key=SKBBZ-LK6RX-Z2J4V-ZPIGA-QHGGE-GABSX',
      success: function(res) {
       // console.log(res);
        coors = res.data.result.routes[0].polyline
        for (var i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }
        //console.log(coors);
        var b = [];
        b[0]={
          latitude: that.data.latitude,
          longitude: that.data.longitude
        }
        for (var i = 0; i < coors.length; i = i + 2) {
          b[(i / 2)+1] = {
            latitude: coors[i],
            longitude: coors[i + 1]
          } 
     //     console.log(b[i / 2])
        }
        b[b.length]={
          latitude: lat,
          longitude:lon
        }
       // console.log(b.length);
        that.setData({
          polyline: [{
            points: b,
            color: "#40bfff",
            width: 4,
            dottedLine: false
          }],
        })

      }
    })   
  },
  //标签点击函数
  tapclick: function(e) {
    var that = this;
    //其他文字颜色回复
    for (var k = 0; k < 3; k++) {
      var str = "changeclass[" + k + "].text";
      var str1 = "changeclass[" + k + "].img";
      var str2 = "changeclass[" + k + "].span";
      that.setData({
        [str]: "",
        [str1]: "img1",
        [str2]: ""
      })
    }
    //改变选中文本颜色
    var id = e.target.id % 3
    if (id >= 0 & id <= 2) {
      var str = "changeclass[" +id+ "].text";
      var str1 = "changeclass[" + id + "].img";
      var str2 = "changeclass[" +id + "].span";
      that.setData({
        [str]: "selectcolor",
        [str1]: "img",
        [str2]: "td3"
      })
    }
    //对应改变上列图标
    var str1 = "markers[" + that.data.selected_id + "].width";
    var str2 = "markers[" + that.data.selected_id + "].height";
    if (that.data.selected_id < 3) {
      that.setData({
        [str1]: 30,
        [str2]: 40
      })
    }
    else {
      that.setData({
        [str1]: 21,
        [str2]: 28
      })
    }
    //改变新图标
    var str3 = "markers[" + id + "].width";
    var str4 = "markers[" + id + "].height";
    that.setData({
      [str3]: 39,
      [str4]: 52
    })
    that.setData({
      selected_id: id,
      selected_ID: that.data.latandlon[id].id
    })
    //调用路径生成函数
    var lat = that.data.latandlon[e.target.id % 3].latitude;
    var lon = that.data.latandlon[e.target.id % 3].longitude;
    this.end(lat, lon);
  },
  //更多
  more: function() {
   // console.log("点击更多");
    wx.navigateTo({
      url: '../classify/classify'
    })
  },
  //详情
  detail: function(e) {
    var that = this;
    console.log(that.data.selected_id);
    if (that.data.selected_id=="") {
      wx.navigateTo({
        url: '../detail/detail?id=' + that.data.latandlon[0].id
      })
    }else{
      wx.navigateTo({
        url: '../detail/detail?id=' + that.data.latandlon[that.data.selected_id].id
      })
    }
   
  },
  daohang: function() {
    var that = this;
    if (that.data.selected_id=="") {
      var address = {
        "latitude": that.data.latandlon[0].latitude,
        "longitude": that.data.latandlon[0].longitude
      };
    }else{
      var address = {
        "latitude": that.data.latandlon[that.data.selected_id].latitude,
        "longitude": that.data.latandlon[that.data.selected_id].longitude
      };
    }
    
    wx.openLocation({
      latitude: that.data.latandlon[that.data.selected_id].latitude,
      longitude: that.data.latandlon[that.data.selected_id].longitude,
      address: address,
      scale: 14
    })
  },
})