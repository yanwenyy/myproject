// pages/mine/mineCoach/resitTestList/resitTestList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: 1, //起始页
    num: 5, //每页显示条数
    status: true, //是否还有数据
    list: [], //补考列表
    source:'',//页面来源
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      id: options.id,
      source: options.source
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.list=[];
    this.getList(this.data.id);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.data.source =="pay"){
      wx.navigateBack({
        delta: 2
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(111)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //补考列表
  getList: function(id) {
    var that = this;
    app.ajax("/applet/makeup/policy/qu", {
      "id": id
    }, function(res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        datas.policyDate = app.format(datas.policyDate);
        that.setData({
          list: datas
        });
      } else {
        that.setData({
          status: false
        });
      }
      
    })
  },

  //去补考
  goTestResit: function(e) {
    var num = e.currentTarget.dataset.index,
      data = this.data,
      qus = data.list.policyQuDtos[num].qus,
      i, qus_list = [];
    for (i in qus) {
      qus_list.push(qus[i].quId)
    }
    var qusId = qus_list.join(",");
    wx.navigateTo({
      url: '../../../test/resitTest/resitTest?id=' + qusId + "&reviewStatus=" + e.currentTarget.dataset.status,
    })
  },

  //提交答案
  subResitTest: function() {
    var that = this;
    var policyQuDtos = this.data.list.policyQuDtos,
      i, ids = [];
    for (var i in policyQuDtos) {
      ids.push(policyQuDtos[i].id);
    }
    console.log(ids);
    app.ajax("/applet/makeup/submit/policy", {
      "ids": ids,
      "makeUpNum": this.data.list.makeUpNum,
    }, function(res) {
      console.log(res);
      if (res.data.code == 10000) {
        // wx.navigateTo({
        //   url: '../coachDetail/coachDetail?id=' + that.data.list.id,
        // })
        wx.navigateBack();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})