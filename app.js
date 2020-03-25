//app.js
App({
  onShow : function () {
    var that=this;
    //判断场景值
    var stage=wx.getLaunchOptionsSync();
    if(stage.scene==1011){
     
    }
    //全局公共变量设置
    this.puplic = this.formal;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        
        wx.request({
          url: this.puplic.url+'/wx/login', //仅为示例，并非真实的接口地址
          data: {
            js_code: res.code
          },
          method:"POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            that.globalData.cookieId = "222";
            that.globalData.logMsg = res.data.data;
            that.globalData.cookieId = res.data.data.cookieId;
            if (that.cookieIdCallback) {
              that.cookieIdCallback(res.data.data.cookieId);
            }
            // 获取用户信息
            wx.getSetting({
              success: res => {
        
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                 
                  wx.getUserInfo({
                    lang: "zh_CN",
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      wx.request({
                        url: that.puplic.url +'/applet/getUserInfo', //仅为示例，并非真实的接口地址
                        data: {
                          "encryptedData": res.encryptedData,
                          "iv": res.iv,
                          "phone": wx.getStorageSync('phone'),
                          "openid": that.globalData.logMsg.openid,
                          "rawData": res.rawData,
                          "signature": res.signature
                        },
                        method: "POST",
                        header: {
                          'content-type': 'application/json', // 默认值
                          'cookieId': that.globalData.logMsg.cookieId
                        },
                        success(res) {
                          //console.log(res.data)
                          that.globalData.userInfo = res.data.data;
                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          if (res.data.data.ifMember == 1 && res.data.data.role == 0&&(res.data.data.trade == null || res.data.data.trade=='')){
                            wx.reLaunch({
                              url: '../propaganda/editMsg/editMsg?must=1&source=company&name=' + res.data.data.companyName,
                            })
                          }
                          if (res.data.data.ifMember == 1 && res.data.data.role == 1 && (res.data.data.trade == null || res.data.data.trade == '')) {
                            wx.navigateTo({
                              url: '../mine/mine/mineMsg/mineMsg',
                            })
                          }
                          if (that.userInfoReadyCallback) {
                            that.userInfoReadyCallback(res)
                          }
                        }
                      })
              
                    }
                  })
                }else{
              
                  wx.reLaunch({
                    url: '../scope/scope',
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  globalData: {
    userInfo: '',
    logMsg: '',
    cookieId: '',
    phone:'',
    token:'',
  },
  formal:{
    url:'https://1g.jieshuibao.com',
    token_url: 'https://api.jieshuibao.com/',
    head_src: 'https://api.jieshuibao.com/showImg/head/',
    question_src: 'https://api.jieshuibao.com/showImg/question/'
  },
  test: {
    url: 'https://test.jieshuibao.com/jsb_applet/',
    token_url:'https://test.jieshuibao.com/jsb_webserver/',
    head_src: 'https://test.jieshuibao.com/jsb_webserver/showImg/head/',
    question_src:'https://test.jieshuibao.com/jsb_webserver/showImg/question/'
  },
  public:{
    url:'https://1g.jieshuibao.com',
    token_url: 'https://api.jieshuibao.com/',
    head_src: 'https://api.jieshuibao.com/showImg/head/',
    question_src: 'https://api.jieshuibao.com/showImg/question/'
  },
  succBack:function(e){
   if(e==2){
     wx.reLaunch({
       url: '../propaganda/propaganda',
     })
   }
  },

  //ajax
  ajax: function (url,data,succ){
    wx.request({
      url: this.puplic.url + url, //仅为示例，并非真实的接口地址
      data: JSON.stringify(data),
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'cookieId': this.globalData.logMsg.cookieId
      },
      success(res) {
        succ(res)
      }
    })
  },
  ajax_nodata: function (url, succ) {
    wx.request({
      url: this.puplic.url + url, //仅为示例，并非真实的接口地址
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'cookieId': this.globalData.cookieId
      },
      success(res) {
        succ(res)
      }
    })
  },

  //微咨询获取token
  getToken:function(){
    var that=this;
    wx.request({
      url: this.puplic.token_url + "/app/accessToken/third", //仅为示例，并非真实的接口地址
      data: { "appid": "gwb", "secret": "4f6f9adefc52b88458c6bc08f98d0601" },
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'cookieId': this.globalData.logMsg.cookieId
      },
      success(res) {
        that.globalData.token = res.data.token;
      }
    })
  },
  ajax_wzx:function(url,data,succ){
    wx.request({
      url: this.puplic.token_url + url, //仅为示例，并非真实的接口地址
      data: JSON.stringify(data),
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'token': this.globalData.token,
      },
      success(res) {
        succ(res)
      }
    })
  },


  get_user:function(){
    var that=this;
    wx.getUserInfo({
      lang: "zh_CN",
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.ajax("/applet/getUserInfo", {
          "encryptedData": res.encryptedData,
          "iv": res.iv,
          "openid": that.globalData.logMsg.openid,
          "phone": wx.getStorageSync('phone'),
          "rawData": res.rawData,
          "signature": res.signature
        }, function (res) {
          var data = res.data.data;
          that.globalData.userInfo=res.data.data;
          console.log(res);
          if (data.ifMember == 1 && (data.trade == null || data.trade == '')) {
            wx.reLaunch({
              url: '../propaganda/editMsg/editMsg?must=1&source=company&name=' + res.data.data.companyName,
            })
          }
        })
      }
    })
  },
  //时间戳转换
  add0: function (m) {
    return m < 10 ? '0' + m : m
  },
  format: function (shijianchuo) {
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + this.add0(m) + '-' + this.add0(d);
  },

  //答案代码显示
  code: function (n) {
    n = Number(n);
    var val = '';
    switch (n) {
      case 0:
        val = 'A'
        break;
      case 1:
        val = 'B'
        break;
      case 2:
        val = 'C'
        break;
      case 3:
        val = 'D'
        break;
      case 4:
        val = 'E'
        break;
      case 5:
        val = 'F'
        break;
      case 6:
        val = 'G'
        break;
      case 7:
        val = 'H'
        break;
      case 8:
        val = 'I'
        break;
      case 9:
        val = 'J'
        break;
      case 10:
        val = 'K'
        break;
      case 11:
        val = 'L'
        break;
      case 12:
        val = 'M'
        break;
      case 13:
        val = 'N'
        break;
      case 14:
        val = 'O'
        break;
      case 15:
        val = 'P'
        break;
      case 16:
        val = 'Q'
        break;
      case 17:
        val = 'R'
        break;
      case 18:
        val = 'S'
        break;
      case 19:
        val = 'T'
        break;
      case 20:
        val = 'U'
        break;
      case 21:
        val = 'V'
        break;
      case 22:
        val = 'W'
        break;
      case 23:
        val = 'X'
        break;
      case 24:
        val = 'Y'
        break;
      case 25:
        val = 'Z'
        break;
    }
    return val;
  },

  //倒计时函数
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown(o) {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    //let endTimeList = this.data.actEndTimeList;
    //let endTime = new Date(o).getTime();
    let endTime = o;
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

  //去除数组里某项
  indexOf :function (arr,val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) return i;
    }
    return -1;
  },
  remove :function (arr,val) {
    var index = this.indexOf(arr,val);
    if (index > -1) {
      arr.splice(index, 1);
    }
  },
})