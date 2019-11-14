//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ifvip:false,
    endtime:'',
    background:[
'http://test.jieshuibao.com/jsb_webserver//showImg/rotation/0f5b666269c444fc8a800ecab009d69f',   'http://test.jieshuibao.com/jsb_webserver//showImg/rotation/f558069a369d4a6f82fdc0a0e2eb8a3f'
    ]
  },
  onLoad: function (options) {
    //使用canvas
    var that = this;
    that.canvasRing = that.selectComponent("#canvasRing");
    that.canvasRing.showCanvasRing();
    that.canvasRing = that.selectComponent("#canvasRing2");
    that.canvasRing.showCanvasRing();
    //结束


    // if (options.openid){

    // }else{
    //   app.succBack(2);
    // }

    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
    
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      })
    };
    //倒计时
    setInterval(function () {
      var change_time = that.countDown('2019/12/01 10:00:43');
      that.setData({ endtime: change_time })
    }, 1000)
  },
  onShow: function (options){
    //显示分享按钮
    wx.showShareMenu({
      withShareTicket: true
    })
    //console.log(wx.getLaunchOptionsSync().scene)
  },

  //倒计时函数
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown(o) {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let endTime = new Date(o).getTime();
    let obj = null;
    // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else {//活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    return obj;
  },

  //授权手机号
  getPhoneNumber(e) {
    console.log(e.currentTarget.dataset.value)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },

  //获取用户信息
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //去辅导
  goCoach:function(){
    wx.navigateTo({
      url: '../mine/mineCoach/coachDetail/coachDetail',
    })
  }
})
