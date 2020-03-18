// pages/mine/mineCoach/testCard/testCard.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    againExam:'',//是否需要补考
    id:'',//政策id
    userInfo:{},//用户信息
    start: 1,//起始页
    num: 5,//每页显示条数
    status: true,//是否还有数据
    list:[],
    status:'',//政策包状态
    date:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //去补考状态
      this.setData({
        againExam: options.againExam,
        id: options.id,
        status: options.status,
        date:options.date
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
    var that=this;
    this.data.list=[];
    //用户信息
    app.ajax('/applet/policy/pack/statistics/details', {
      "id": this.data.id
      }, function (res) {
      var rightPercent = res.data.data.rightPercent;
      if (rightPercent) {
        rightPercent = (rightPercent * 100).toFixed(1)
      } else {
        rightPercent = 0;
      }
      res.data.data.rightPercent = rightPercent
      that.setData({
        userInfo: res.data.data
      })
    });

    //列表数据
    this.getList(this.data.start, this.data.num, this.data.id);
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
  getList: function (start, num, id){
    var that = this;
    app.ajax("/applet/user/answer/sheet", {
      "current": start,
      "id": id,
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
  goTestCard:function(e){
    console.log(e)
    console.log(this.data.status)
    if (e.currentTarget.dataset.examtype==1&&(this.data.status==1||this.data.status==2)){
      wx.navigateTo({
        url: '../../../test/test?id=' + e.currentTarget.dataset.id,
      })
    }else{
      wx.navigateTo({
        url: '../../../test/testResult/testResult?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  //去补考
  goResitTest: function (e) {
    var that = this;
    console.log(e)
    app.ajax("/applet/makeup/policy/qu", {
      "id": this.data.id
    }, function (res) {
      if (res.data.code == 10) {
        wx.navigateTo({
          url: '../testPay/testPay?id=' + that.data.id + "&date=" + that.data.date,
        })
      } else {
        wx.navigateTo({
          url: '../resitTestList/resitTestList?id=' + that.data.id,
        })
      }
    })
  }
})