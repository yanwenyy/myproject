// pages/mine/mineCoach/mineCoach.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:{},//用户信息
      policyNums:[],//政策包列表
      timer:null,
      tryNum:'',//试用天数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    
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
    var that = this;
    app.ajax_nodata("/applet/user/conach", function (res) {
      res.data.data.myConach.coachStartTime = that.format(res.data.data.myConach.coachStartTime);
      res.data.data.myConach.coachEndTime = that.format(res.data.data.myConach.coachEndTime);
      var policyNums = res.data.data.policyNums;
      for (var i in policyNums) {
        policyNums[i].rightPercent = policyNums[i].rightPercent ? (policyNums[i].rightPercent * 100).toFixed(1) : 0;
      }
      that.setData({
        userInfo: res.data.data.myConach,
        policyNums: res.data.data.policyNums
      })
    });

     //试用天数
     app.ajax_nodata("/applet/is/tryvip",function(res){
      if(res.data.data.tryNum&&res.data.data.status==2){
        that.setData({
          tryNum:res.data.data.tryNum
        })
      }
    })

    //考试倒计时
    this.timer = setInterval(function () {
      that.time(that.data.policyNums)
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.timer);
    this.timer = null;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer);
    this.timer = null;
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

  //时间戳转换
  add0:function(m){
    return m < 10 ? '0' + m : m
  },
  format: function (shijianchuo){
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '.' + this.add0(m) + '.' + this.add0(d);
  },

  //倒计时函数
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown(o) {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
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
  time:function(val){
    for(var i in val){
      val[i].policyDate_change = this.countDown(val[i].policyDate);
      // val[i].rightPercent = val[i].rightPercent ? val[i].rightPercent.toFixed(1) * 100:0;
      this.setData({
        policyNums:val
      })
    }
  },

  //去政策包详情
  goCoachDetail:function(e){
    wx.navigateTo({
      url: '../mineCoach/coachDetail/coachDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  //去补考
  goResitTest:function(e){
    app.ajax("/applet/makeup/policy/qu", {
      "id": e.currentTarget.dataset.id
      }, function (res) {
      if(res.data.code==10){
        // wx.showToast({
        //   title: res.data.msg,
        //   icon: 'none',
        //   duration: 2000
        // });
        console.log('./testPay/testPay?id=' + e.currentTarget.dataset.id + "&date=" + e.currentTarget.dataset.date)
        wx.navigateTo({
          url: './testPay/testPay?id=' + e.currentTarget.dataset.id + "&date=" + e.currentTarget.dataset.date,
        })
      }else{
        wx.navigateTo({
          url: './resitTestList/resitTestList?id=' + e.currentTarget.dataset.id,
        })
      }
    })
    // wx.navigateTo({
    //   url: './resitTestList/resitTestList?id=' + e.currentTarget.dataset.id,
    // })
  }
})