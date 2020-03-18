// pages/test/currentTestCard/currentTestCard.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    msg:'',//页面信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    var that = this;
    //使用canvas
    that.canvasRing = that.selectComponent("#canvasRing");
    that.canvasRing.showCanvasRing();
    app.ajax("/applet/sheet/question", { "id": options.id,},function(res){
      var rightPercent = res.data.data.rightPercent;
      if (rightPercent) {
        rightPercent = rightPercent.toFixed(1) * 100
      } else {
        rightPercent = 0;
      }
      res.data.data.rightPercent = rightPercent.toFixed(1)
      that.setData({
        msg:res.data.data
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

  goTestResult:function(){
    wx.navigateTo({
      url: '../testResult/testResult?id='+this.data.id,
    })
  }
})