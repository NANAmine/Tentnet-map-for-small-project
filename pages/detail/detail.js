const app = getApp()
var request = require('../../utils/request.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var amapInstance;
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    time:'',
    display:'none',
    detid:'',
    point:{},
    addresslist:[],
    lists: {Mnum: '3', Wnum: '3', Cnum: '2'},
    lat:'',
    lon: '',
    address: "",
    distance: "",
    image: '../../image/1.png',
  },
  onLoad: function (options) {
    wx.request({
      // url: 'https://apis.map.qq.com/ws/streetview/v1/getpano?id=10011504120403141232200&radius=100&key=L6FBZ-YQ4CG-URYQY-IH36I-SXRFZ-IEBI5',
      url: 'https://apis.map.qq.com/ws/streetview/v1/image?size=640x480&pano=370140V6140408202127300&pitch=-15& heading=119 &key=SKBBZ-LK6RX-Z2J4V-ZPIGA-QHGGE-GABSX',
      success: function (res) {
        //console.log(res.data.detail.description);
        console.log(res.data);
        // that.setData({
        //   user: data.user
        // })
      },
    })
    this.dingshiqi();
      var id = options.id;
    // var lon = parseFloat(options.lon);
     console.log("id:"+id),
    // console.log(lon)
    this.setData({
      detid:id
    })
    console.log(this.data.detid)
    var that = this;
    amapInstance = new QQMapWX({
      key: 'SKBBZ-LK6RX-Z2J4V-ZPIGA-QHGGE-GABSX' //此处使用你自己申请的key
    })
    // amapInstance.reverseGeocoder({
    //   location: {
    //     latitude: lat,
    //     longitude: lon
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     that.setData({
    //       address: res.result.address
    //     })
    //     console.log(this.distance)
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // })
//     amapInstance.calculateDistance({
//       to: [{
//         latitude: lat,
//         longitude: lon
//       },  {
//           latitude: lat,
//           longitude: lon
//         }],
//       success:  function(res)  {
//         console.log(res);
//         that.setData({
//           distance: res.result.elements[0].distance
//         })
//         console.log(this.distance)
//       },
//       fail:  function(res)  {
//         console.log(res);
       
//       },
//       complete:  function(res)  {
//         console.log(res);
        
//       }
// })
  },
  //周边地址获取
  onShow: function () {
    var that = this;
    //that.getData();
    amapInstance.search({
      keyword: '厕所',
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]._distance < 1000) {
            if(that.data.detid==res.data[i].id){
              if(i<3){
                that.setData({
                  display: ''
                })
              }
              var time =res.data[i]._distance/50
              var times=parseInt(time);
              res.data[i]._distance = parseInt(res.data[i]._distance)
                that.setData({
                   time: times,
                   point:res.data[i]
                })
            }
            var addresss = "addresslist[" + i + "]";
            that.setData({
              [addresss]: res.data[i]
            })
          } else {
            return
          }
        }

      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    })
  },
  dingshiqi: function () {
   var that=this;
      var mannum = Math.floor(Math.random() * 5);
      var womannum = Math.floor(Math.random() * 5);
    var listis = { Mnum: mannum, Wnum: womannum, Cnum: 0}
    that.setData({
      lists: listis
    })
    setTimeout(function () {
      that.dingshiqi()
    }, 3000)
  },
  // 距离
  openmap: function (e) {
    var that=this;
    // 调用腾讯接口
            wx.openLocation({
              latitude: that.data.point.location.lat,
              longitude: that.data.point.location.lng,
              address: that.data.point.address,
              scale: 14
            })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  
})