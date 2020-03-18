// pages/mine/mineCoach/assessmentResult/assessmentResult.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starNum:0,//星星数量
    result:null,//评估结果
    msg:{},//政策信息
    source:'',//来源
    uuid:null,//查阅人uuid
    assessment:'',//是否从评估页进来
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      id: options.id,
      source: options.source,
      uuid:options.uuid,
      assessment: options.assessment
    })

    //政策信息
    app.ajax("/applet/policy/icon", {
      id: this.data.id
      }, function (res) {
      if (res.data.data != null) {
        that.setData({
          msg: res.data.data,
        })
      }
    });

    //评估结果
    app.ajax("/applet/user/evaluation", {
      id: this.data.id,
      uuid:this.data.uuid
      }, function (res) {
      if (res.data.data != null) {
        that.setData({
          result: res.data.data,
          starNum: res.data.data.affectExtent,
        })
      }
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
    if (this.data.assessment =="yes"){
      wx.navigateBack({
        delta: 2
      })
    }
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

  //修改评估点击
  editAssessment:function(){
    wx.navigateTo({
      url: '../mineAssessment/mineAssessment?id='+this.data.id,
    })
  }
})