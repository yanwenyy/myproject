// pages/propaganda/propaganda.js
const app=getApp();
const base64src = require('../../utils/base64src.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},//用户信息
    hasUserInfo: false,
    //开通类型
    breed: [
      { name: '1', value: '365顾问宝——个人版', checked: 'true'  },
      { name: '2', value: '365顾问宝——公司版'},
    ],
    shadow:false,
    //开通类型的值
    breedValue:'1',
    kt:false,
    kt_num:false,
    kt_company:true,//填写公司名字
    companyName:'',//公司名称
    company_num:1,//开通人数
    kt_btn:false,//获取手机号按钮
    sq_btn:true,//授权按钮
    cckt_btn:false,//已经授权过的开通按钮
    hygz:false,//会员规则
    // 分享
    shadowShare: false,
    share_pintuan_productid: 0,
    phonewidth: 750,
    fixwidth: 750,
    margin: 0,
    canvas: false,
    userInfo: '',
    code_src: '',//小程序码
    qrcodeUrl: '',//转换的base64
    headImg: '',//分享的用户头像
    productClass:false,//套餐类型状态
    productVlaue:'',//商品类型的值
     ///套餐类型
     product: [
      { name: '1', value: '新政辅导会员', checked: 'true' ,money:'999.00' },
      { name: '2', value: '新政辅导系统PLUS会员',money:'9999.00' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      lang: "zh_CN",
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.ajax("/applet/getUserInfo", {
          "encryptedData": res.encryptedData,
          "iv": res.iv,
          "openid": app.globalData.logMsg.openid,
          "phone": wx.getStorageSync('phone'),
          "rawData": res.rawData,
          "signature": res.signature
        }, function (res) {
          var userInfo = res.data.data;
          that.setData({
            userInfo: userInfo
          });
          wx.getImageInfo({
            src: that.data.userInfo.headImg,
            success: function (res) {
              console.log(res.path)
              that.setData({
                headImg: res.path
              })
            }
          });
          if (userInfo.phone != '' && userInfo.phone != null) {
            that.setData({
              sq_btn: false,
              cckt_btn: true,//获取手机号按钮
            })
          }
          if (userInfo.companyId != '' && userInfo.companyId != null){
            that.setData({
              companyName: userInfo.companyName,
              userInfo: userInfo
            })
          }
        })
      }
    })
   
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '这个产品有点厉害',
        path: 'pages/propaganda/propaganda',
        imageUrl: '../../img/share-pro.png'
      }
    }
  },

  //获取用户信息
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      kt_btn: true,
      sq_btn: false
    })
    var that=this;
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
    //         that.setData({
    //           kt_btn:true,
    //           sq_btn:false
    //         })
    //         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //         // 所以此处加入 callback 以防止这种情况
    //         if (app.userInfoReadyCallback) {
    //           app.userInfoReadyCallback(res)
    //         }
    //       }
    //     })

    //   }
    // })
  },

  //获取手机号
  getPhoneNumber(e) {
    var that=this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData);
    app.ajax('/applet/getPhoneNumber', {
      "encryptedData": e.detail.encryptedData,
      "iv": e.detail.iv,
      "openid": app.globalData.logMsg.openid
      },function(res){
        app.globalData.phone=res.data.data;
        wx.getUserInfo({
          lang: "zh_CN",
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            wx.request({
              url: app.puplic.url + '/applet/getUserInfo', //仅为示例，并非真实的接口地址
              data: {
                "encryptedData": res.encryptedData,
                "iv": res.iv,
                'phone': app.globalData.phone,
                "openid": app.globalData.logMsg.openid,
                "rawData": res.rawData,
                "signature": res.signature
              },
              method: "POST",
              header: {
                'content-type': 'application/json', // 默认值
                'cookieId': app.globalData.logMsg.cookieId
              },
              success(res) {
                app.globalData.userInfo = res.data.data;
               
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (res.data.code == 10000) {
                  // that.setData({
                  //   shadow: true
                  // })

                  app.ajax("/applet/goods/list",{
                    "productType": 1
                  },function(res){
                    that.setData({
                      product:res.data.data,
                      productClass:true
                    })
                  })

                  // wx.redirectTo({
                  //   url: './pay/pay?source=company&num=' + that.data.company_num + "&name=" + that.data.companyName
                  // })
                }
              }
            })

          }
        })
    })
    
  },

  //已经授权过的用户点开通
  commenKt:function(){
    var that = this;
    // if (this.data.userInfo.companyId != '' && this.data.userInfo.companyId != null) {
    //   wx.redirectTo({
    //     url: './pay/pay?source=company&num=' + that.data.company_num + "&name=" + that.data.companyName
    //   })
    // } else {
    //   this.setData({
    //     shadow: true
    //   })
    // }
    
    // wx.redirectTo({
    //   url: './pay/pay?source=company&num=' + that.data.company_num + "&name=" + that.data.companyName
    // })
    
    app.ajax("/applet/goods/list",{
      "productType": 1
    },function(res){
      that.setData({
        product:res.data.data,
        productClass:true
      })
    })
  },

  //单选框改变
  radioChange: function (e) {
    this.setData({
      breedValue: e.detail.value
    })
  },
  
  //开通类型按钮点击
  ktBreed:function(){
    var that=this;
    // if (this.data.breedValue==1){
    //   wx.redirectTo({
    //     url:'./pay/pay?source=personal'
    //   })
    // }else{
    //   this.setData({
    //     kt: false,
    //     kt_num: true
    //   })
    // }
    wx.redirectTo({
      url: './pay/pay?source=company&num=' + that.data.company_num + "&name=" + that.data.companyName
    })
  },

  //开通商品类型点击
  ktprodut:function(){
    var that=this;
   if(this.data.productVlaue==''||this.data.productVlaue==null){
    wx.showToast({
      title: '请选择商品类型',
      icon: 'none',
      duration: 2000
    })
   }else{
    wx.redirectTo({
      url: './pay/pay?source=company&num=' + that.data.company_num + "&name=" + that.data.companyName+"&goodsid="+that.data.productVlaue
    })
   }
  },
  
  //关闭商品类型
  closeProduct:function(){
    this.setData({
      productClass:false
    })
  },

  // 商品类型改变
  productChange:function(e){
    console.log(e);
    this.setData({
      productVlaue: e.detail.value
    })
    console.log(this.data.productVlaue);
  },

  //加按钮点击
  plus:function(){
    this.setData({
      company_num: this.data.company_num+1
    })
  },

  //减按钮点击
  reduce:function(){
    if (this.data.company_num>2){
      this.setData({
        company_num: this.data.company_num - 1
      })
    }
  },

  //公司立即支付按钮点击
  companyPay:function(){
    wx.redirectTo({
      url: './pay/pay?source=company&num=' + this.data.company_num
    })
  },

  //公司名称输入
  companyNameInput:function(e){
    this.setData({
      companyName:e.detail.value
    })
  },

  //企业名称提交
  subCompanyName:function(){
    var that=this;
    if (this.data.userInfo.companyId != '' && this.data.userInfo.companyId != null){
      wx.redirectTo({
        url: './pay/pay?source=company&num=' + that.data.company_num + "&name=" + that.data.companyName
      })
    }else{
      if (this.data.companyName!=''){
        app.ajax("/applet/saveOrUpdateCompany", {
          "companyName": this.data.companyName,
        }, function (res) {
          if (res.data.code == 10000) {
            wx.redirectTo({
              url: './pay/pay?source=company&num=' + that.data.company_num + "&name=" + that.data.companyName
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }else{
        wx.showToast({
          title: '企业名称不能为空',
          icon: 'none',
          duration: 2000
        })
      }
      
    }
  },

  //打开会员规则
  openHygz:function(){
    this.setData({
      hygz:true
    })
  },

  //关闭会员规则
  closeHygz:function(){
    this.setData({
      hygz: false
    })
  },

  //去会员权益页面
  goHyqy:function(){
    wx.navigateTo({
      url: './vipIntroduce/vipIntroduce',
    })
  },

  //去分享页面
  goShare: function (e) {
    this.setData({
      shadowShare: true,
      shareName: e.currentTarget.dataset.name,
      shadowTitle: e.currentTarget.dataset.msg,
      qrcodeUrl: ''
    })
  },

  //关闭分享
  closeShadow: function () {
    this.setData({
      shadowShare: false
    })
  },

  /**
  * 生成分享图
  */
  share: function () {
    var that = this;
    this.saveCode('pages/propaganda/propaganda')
  },

  /**
  * 保存到相册
  */
  save: function () {
    var that = this;
    console.log(that.data.prurl)
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                canvas: false,
                margin: '70%',
              })
              // setTimeout(function () {
              //   wx.navigateBack({});
              // }, 1000)
            }
          }
        })
      },
      fail: function (err) {
        if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击图片即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
                fail(failData) {
                  console.log("failData", failData)
                },
                complete(finishData) {
                  console.log("finishData", finishData)
                }
              })
            }
          })
        }
      },
    })

  },


  //小程序码
  saveCode: function (url) {
    var that = this;
    //小程序码
    app.ajax_nodata("/applet/getAccessToken", function (res) {
      if (res.data.code == 10000) {
        app.ajax("/applet/getQrcode", {
          "accessToken": res.data.data,
          "path": url,
          "width": 430
        }, function (res) {
          // console.log(res);
          var base64 = base64src.base64src("data:image/png;base64," + res.data.data);
          base64.then(function (filePath) {
            // console.log(filePath);
            that.setData({
              qrcodeUrl: filePath
            })
            that.data.qrcodeUrl = filePath;
            if (that.data.shareName == "yqts") {
              that.canvasYqts();
            } else {
              that.canvasFxdy();
            }
          });
          that.setData({
            code_src: res.data.data
          });

        })
      }
    })
  },

  //分享代言
  canvasFxdy: function () {
    var that = this;
    const ctx = wx.createCanvasContext('shareImg');
    ctx.drawImage('../../img/canvas-share-bg.png', 0, 0, 297, 454);
    ctx.save();
    ctx.arc(72, 70, 18, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.data.headImg, 54, 52, 37, 37);
    ctx.restore();
    ctx.setFontSize('16');
    ctx.setFillStyle('#333');
    ctx.fillText(this.data.userInfo.realName || this.data.userInfo.userName, 110, 73);
    ctx.fillText('推荐一款好的产品给您～', 54, 116);
    ctx.drawImage('../../img/yqts-share-pro.png', 44, 149, 209, 122);
    ctx.setFontSize('7');
    ctx.setFillStyle('#fff');
    ctx.fillText('省税一哥', 20, 400);
    ctx.setFontSize('10');
    ctx.fillText('您的财税顾问', 20, 422);
    // ctx.drawImage("data:image/png;base64," + this.data.code_src, 212, 346, 66, 66);
    ctx.drawImage(this.data.qrcodeUrl, 212, 346, 66, 66);
    ctx.fillText('长按二维码查看', 212, 430);
    ctx.draw(false, function () {
      wx.showLoading({
        title: '努力生成中...'
      })
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 297,
        height: 454,
        destWidth: 1188,
        destHeight: 1816,
        canvasId: 'shareImg',
        fileType: 'jpg',
        quality: 1,
        success: function (res) {
          that.setData({
            prurl: res.tempFilePath,
            canvas: true,
            margin: '0',
          });
          wx.hideLoading()
        },
        fail: function (res) {
          console.log(res)
        }
      })
    });
  },

  //关闭生成分享图
  closeCanvas: function () {
    this.setData({
      canvas: false,
      margin: '70%',
    })
  }
})