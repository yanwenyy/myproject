// pages/mine/minePresentation/mangerPresentationSum/mangerPresentationSum.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',//日期
    num:'',//期数
    id:'',//政策包id
    list:[],//列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      date:options.date,
      num:options.num,
      id:options.id
    });

    //月报告汇总列表
    app.ajax("/applet/month/evaluationlist",{
      id:this.data.id
    },function(res){
      console.log(res)
      that.setData({
        list:res.data.data
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

  //去详情页面
  goDetail:function(e){
    wx.navigateTo({
      url: '../selfPresentationDetail/selfPresentationDetail?source=manager&id=' + this.data.id + "&uuid=" + e.currentTarget.dataset.uuid + "&num=" + this.data.num + "&date=" + this.data.date,
    })
  }
})