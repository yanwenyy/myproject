//app.js
App({

  onLaunch: function () {
    var that=this;
    //判断场景值
    var stage=wx.getLaunchOptionsSync();
    if(stage.scene==1011){
      // wx.reLaunch({
      //   url: 'pages/propaganda/propaganda',
      // })
    }
    //全局公共变量设置
    this.puplic=this.test;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
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
            that.globalData.ifvip = true;
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
      
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
  },
  formal:{
    url:'https://api.jieshuibao.com/',
    head_src:'https://api.jieshuibao.com/showImg/head/'
  },
  test: {
    url: 'http://test.jieshuibao.com:8090/',
    head_src: 'http://test.jieshuibao.com/jsb_webserver/showImg/head/'
  },
  public:{},
  succBack:function(e){
   if(e==2){
     wx.reLaunch({
       url: '../propaganda/propaganda',
     })
   }
  }
})