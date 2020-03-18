// pages/mine/mine/mineOrder/mineOrder.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],//列表数据
    start: 1,//起始页
    num:1,
    end: 10,//每页显示条数
    status: true,//是否还有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.getList(this.data.start,this.data.end);
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
    if (this.data.status == true) {
      var num = this.data.num + 1
      this.setData({
        num: num,
        start: ((num - 1) * 10) + 1,
        end: num * 10
      });
      this.getList(this.data.start, this.data.end)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //订单列表
  getList: function (start, end) {
    var that = this;
    app.ajax("/applet/meWxOrder", {
      "maxId": end,
      "sinceId": start,
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          datas[i].officialReleaseDate = app.format(datas[i].officialReleaseDate);
          datas[i].makeUpDate = app.format(datas[i].makeUpDate);
          if (datas[i].tags) {
            datas[i].tags = datas.tags.split(",")
          };
          list_change.push(datas[i])
        }
        that.setData({
          list: list_change
        });
      } else {
        that.setData({
          status: false
        });
      }
    })
  },
})