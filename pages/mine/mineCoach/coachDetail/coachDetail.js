// pages/mine/mineCoach/coachDetail/coachDetail.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//政策id
    start:1,//起始页
    num:5,//每页显示条数
    status:true,//是否还有数据
    list:[],//政策列表
    userInfo:{},//用户信息
    endtime:'',
    change_time:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      id:options.id
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
    this.data.list = [];
    //用户信息
    app.ajax('/applet/policy/pack/statistics/details', {
      "id": this.data.id
    }, function (res) {
      var rightPercent = res.data.data.rightPercent;
      if (rightPercent) {
          rightPercent =( rightPercent * 100).toFixed(1)
      } else {
        rightPercent = 0;
      }
      res.data.data.rightPercent = rightPercent
      that.setData({
        userInfo: res.data.data,
        endtime: res.data.data.policyDate
      })
    });
    this.data.start = 1; this.data.num=5;
    //列表
    this.getList(this.data.start, this.data.num, this.data.id);

    //倒计时
    setInterval(function () {
      var change_time = that.countDown(that.data.endtime);
      that.setData({ change_time: change_time })
    }, 1000)
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
      this.setData({
        start: this.data.start + 1
      });
      this.getList(this.data.start,this.data.num,this.data.id)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //错题集点击
  goWrongTest:function(){
    wx.navigateTo({
      url: '../../../test/wrontTest/wrontTest?id=' + this.data.id + "&againExam=" + this.data.userInfo.againExam + "&date=" + this.data.userInfo.packDate,
    })
  },

  //去答题卡
  goTestCard:function(){
    wx.navigateTo({
      url: '../testCard/testCard?againExam=' + this.data.userInfo.againExam + "&&id=" + this.data.id + "&status=" + this.data.userInfo.status + "&date=" + this.data.userInfo.packDate,
    })
  },

  //政策列表
  getList:function(start,num,id){
    var that=this;
    app.ajax("/applet/policy/pack/list/details",{
        "current": start,
        "id": id,
        "pageSize": num
      },function(res){
        var datas = res.data.data;
        if (datas && datas!=''){
          var list_change=that.data.list;
          for (var i in datas){
            datas[i].officialReleaseDate = app.format(datas[i].officialReleaseDate);
            if (datas[i].tags){
              datas[i].tags = datas[i].tags.split(",")
            };
            list_change.push(datas[i])
          }
          that.setData({
            list: list_change
          });
        }else{
          that.setData({
            status:false
          });
        }
    })
  },

  //倒计时函数
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown(o) {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    //let endTimeList = this.data.actEndTimeList;
    //let endTime = new Date(o).getTime();
    let endTime = o;
    let obj = null;
    // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else {//活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    return obj;
  },

  //去解读页面
  goUnscramble:function(e){
    wx.navigateTo({
      url: '../unscramble/unscramble?id=' + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type,
    })
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
          url: '../testPay/testPay?id=' + that.data.id + "&date=" + e.currentTarget.dataset.date,
        })
      } else {
        wx.navigateTo({
          url: '../resitTestList/resitTestList?id=' + that.data.id,
        })
      }
    })
  }
})