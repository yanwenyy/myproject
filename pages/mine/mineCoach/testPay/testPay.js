// pages/mine/mineCoach/testPay/testPay.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',//日期
    data_ms:'',//日期时间戳
    id:'',//政策包id
    goods:{},//商品信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      date: this.format(Number(options.date)),
      data_ms: options.date,
      id: options.id,
    });
    //商品详情
    app.ajax("/applet/goods/list",{
      "productType": 2
      },function(res){
      that.setData({
        goods:res.data.data[0]
      })
    });


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

  //去支付
  payTest:function(){
    var that=this;
    app.ajax("/api/weixin/jsSdkPay", {
      "amount":1,
      "makeUpDate": this.data.data_ms,
      "openid": app.globalData.logMsg.openid,
      "phone": wx.getStorageSync('phone'),
      "policyPackId":this.data.id,
      "productId": this.data.goods.goodsId,
      "productName": this.data.goods.goodsName,
      "productType": this.data.goods.productType,
      "unitPrice": this.data.goods.price
    }, function (res) {
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success(res) {
          wx.navigateTo({
            url: '../resitTestList/resitTestList?source=pay&id=' + that.data.id,
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    })
  },

  format: function (shijianchuo) {
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + app.add0(m);
  },
})