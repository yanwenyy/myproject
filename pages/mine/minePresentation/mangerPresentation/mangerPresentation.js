// pages/mine/minePresentation/mangerPresentation/mangerPresentation.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],//列表数据
    background: [],//轮播图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.ajax_nodata("/applet/manager/evaluationlist",function(res){
      //console.log(res);
      var datas=res.data.data,i;
      for (i in datas){
        datas[i].policyDate = that.format(datas[i].policyDate)
      }
      that.setData({
        list:datas
      })
    });

    //轮播图地址
    app.ajax("/applet/banner/list", {
      "type": "4"
    }, function (res) {
      that.setData({
        background: res.data.data
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

  //去月报告汇总
  goMothSum:function(e){
    var target = e.currentTarget.dataset;
    var id = target.id,
        date=target.date,
        num=target.num;
    wx.navigateTo({
      url: '../mangerPresentationSum/mangerPresentationSum?id='+id+"&date="+date+"&num="+num,
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

  //去规则页面
  goRule: function () {
    wx.navigateTo({
      url: '../managePresentationRule/managePresentationRule',
    })
  }
})