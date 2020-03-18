// pages/propaganda/pay/pay.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    source:'',
    name:'',//企业名称
    productType: '',//商品类型 0 省税一哥个人 1 省税一哥企业 2补考
    company: true,//企业用户
    personal: false,//个人用户
    product:'',//商品信息
    money:'700',
    checkbox_status:false,//辅导协议勾选
    company_num:1,//开通人数
    goodsid:'',//商品id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      source: options.source,
      name:options.name
    });
    if (options.source =="company"){
      this.setData({
        company: true,
        personal: false,
        productType:'1',
        company_num:options.num,
        goodsid:options.goodsid
      });
    }else{
      this.setData({
        personal: true,
        company: false,
        productType: '0'
      });
    };

    //商品查询
    app.ajax("/applet/getGoods",{
      "productType": this.data.productType,
      "goodsid":this.data.goodsid
    },function(res){
        res.data.data.vaildStartTime = app.format(res.data.data.vaildStartTime);
        res.data.data.vaildLastTime = app.format(res.data.data.vaildLastTime);
        res.data.data.coachStartTime = app.format(res.data.data.coachStartTime);
        res.data.data.coachEndTime = app.format(res.data.data.coachEndTime);
        that.setData({
          product:res.data.data
        })
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
  onShareAppMessage: function () {

  },

  //去编辑信息页面
  goEditMsg:function(){
    var that=this;
    //暂时隐藏用户协议,加了之后改成false
    if (this.data.checkbox_status==false){
      app.ajax("/api/weixin/jsSdkPay",{
        "amount": this.data.productType == 0 ? 1 : this.data.company_num,
        "openid": app.globalData.logMsg.openid,
        "phone": wx.getStorageSync('phone'),
        "productId": this.data.product.goodsId,
        "productName": this.data.product.goodsName,
        "productType": this.data.product.productType,
        "unitPrice": this.data.product.price
        },function(res){
          console.log(res);
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success(res) { 
            console.log(res);
            if (app.globalData.userInfo.companyName != '' && app.globalData.userInfo.companyName != null) {
               wx.reLaunch({
                 url: '../../index/index',
               })         
            }else{
              wx.redirectTo({
                url: '../editMsg/editMsg?source=' + that.data.source + "&name=" + that.data.name
              })
            }
            
          },
          fail(res) { 
            console.log(res)
          }
        })
      })
      // wx.reLaunch({
      //   url: '../editMsg/editMsg?source=' + this.data.source
      // })
      
     
    }else{
      wx.showToast({
        title: '请勾选省税一哥签约辅导协议',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //复选框改变
  checkboxChange:function(e){
    if (e.detail.value!=''){
      this.setData({
        checkbox_status:true
      })
    }else{
      this.setData({
        checkbox_status: false
      })
    }
  },

  //加按钮点击
  plus: function () {
    this.setData({
      company_num: this.data.company_num + 1
    })
  },

  //减按钮点击
  reduce: function () {
    if (this.data.company_num > 2) {
      this.setData({
        company_num: this.data.company_num - 1
      })
    }
  },
})