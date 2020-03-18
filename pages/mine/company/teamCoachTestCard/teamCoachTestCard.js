// pages/mine/company/teamCoachTestCard/teamCoachTestCard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    againExam: '',//是否需要补考
    id: '',//政策id
    userInfo: {},//用户信息
    start: 1,//起始页
    num: 5,//每页显示条数
    status: true,//是否还有数据
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //去补考状态
    this.setData({
      uuid: options.uuid,
      id: options.id
    });

    //用户信息
    app.ajax('/applet/teamconach/policy/pack/details', {
      "id": this.data.id,
      "uuid": this.data.uuid
    }, function (res) {
      var rightPercent = res.data.data.rightPercent;
      if (rightPercent) {
        rightPercent = rightPercent.toFixed(1) * 100
      } else {
        rightPercent = 0;
      }
      res.data.data.rightPercent = rightPercent.toFixed(1);
      res.data.data.policyDate = that.format(res.data.data.policyDate);
      that.setData({
        userInfo: res.data.data
      })
    });

    //列表数据
    this.getList(this.data.start, this.data.num, this.data.id,this.data.uuid);
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

  //列表数据
  getList: function (start, num, id,uuid) {
    var that = this;
    app.ajax("/applet/team/answer/sheet", {
      "current": start,
      "id": id,
      "uuid":uuid,
      "pageSize": num
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
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

  //去测试结果页面
  goTestCard: function (e) {
    wx.navigateTo({
      url: '../../../test/testResult/testResult?id=' + e.currentTarget.dataset.id+"&uuid="+this.data.uuid,
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