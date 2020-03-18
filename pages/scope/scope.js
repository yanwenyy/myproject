// pages/scope/scope.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},//用户信息
    hasUserInfo: false,
    phone:'',//用户手机号
    scope:true,//用户授权信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取用户信息
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.setData({
      scope:false
    })


    // wx.getUserInfo({
    //   lang: "zh_CN",
    //   success: res => {
    //     // 可以将 res 发送给后台解码出 unionId
    //     wx.request({
    //       url: app.puplic.url + '/applet/getUserInfo', //仅为示例，并非真实的接口地址
    //       data: {
    //         "encryptedData": res.encryptedData,
    //         "iv": res.iv,
    //         "openid": app.globalData.logMsg.openid,
    //         "rawData": res.rawData,
    //         "signature": res.signature
    //       },
    //       method: "POST",
    //       header: {
    //         'content-type': 'application/json', // 默认值
    //         'cookieId': app.globalData.logMsg.cookieId
    //       },
    //       success(res) {
    //         app.globalData.userInfo = res.data.data;
    //         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //         // 所以此处加入 callback 以防止这种情况
    //         if (app.userInfoReadyCallback) {
    //           app.userInfoReadyCallback(res)
    //         }
    //         wx.reLaunch({
    //           url: '../index/index',
    //         })
    //       }
    //     })

    //   }
    // })
  },

  //授权手机号
  getPhoneNumber(e) {
    var that=this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData);
    app.ajax('/applet/getPhoneNumber', {
      "encryptedData": e.detail.encryptedData,
      "iv": e.detail.iv,
      "openid": app.globalData.logMsg.openid},function(res){
        console.log(res);
        that.setData({
          phone:res.data.data
        })
        wx.setStorageSync('phone', res.data.data);
        wx.getUserInfo({
          lang: "zh_CN",
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            wx.request({
              url: app.puplic.url + '/applet/getUserInfo', //仅为示例，并非真实的接口地址
              data: {
                "encryptedData": res.encryptedData,
                "iv": res.iv,
                "openid": app.globalData.logMsg.openid,
                'phone': that.data.phone,
                "rawData": res.rawData,
                "signature": res.signature
              },
              method: "POST",
              header: {
                'content-type': 'application/json', // 默认值
                'cookieId': app.globalData.logMsg.cookieId
              },
              success(res) {
                console.log(res.data);
                if(res.data.code==10000){
                  app.globalData.userInfo = res.data.data;
                  // if (app.userInfoReadyCallback) {
                  //   app.userInfoReadyCallback(res)
                  // }
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }
               
              }
            })

          }
        })
    })
  },
})