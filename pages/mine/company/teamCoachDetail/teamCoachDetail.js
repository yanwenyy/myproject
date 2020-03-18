// pages/mine/company/teamCoachDetail/teamCoachDetail.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//政策包id
    list:[],//信息
    date:'',//日期
    userInfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      id:options.id,
      date:options.date,
      userInfo: app.globalData.userInfo
    });
    app.ajax("/applet/teamconach/details",{
      id:that.data.id
    },function(res){
      var list = res.data.data;
      for (var i in list) {
        list[i].rightPercent = list[i].rightPercent ? list[i].rightPercent.toFixed(1) * 100 : 0;
      }
      that.setData({
        list: list
      });
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

  //去团队答题卡
  goCard:function(e){
    wx.navigateTo({
      url: '../teamCoachTestCard/teamCoachTestCard?uuid='+e.currentTarget.dataset.uuid+"&id="+this.data.id,
    })
  }
})