// pages/microConsultation/mineQues/mineQues.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    start: 1,//起始页
    num: 1,
    end: 10,//每页显示条数
    status: true,//是否还有数据
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
    var that=this;
    this.data.list=[];
    this.data.start=1;
    this.data.end=10;
    this.data.num=1;
    //获取列表数据
    this.getList(this.data.start, this.data.end, app.globalData.userInfo.uuid);
    //考试倒计时
    this.timer = setInterval(function () {
      that.time(that.data.list)
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
      var num = this.data.num + 1
      this.setData({
        num: num,
        start: ((num - 1) * 10) + 1,
        end: num * 10
      });
      this.getList(this.data.start, this.data.end, app.globalData.userInfo.uuid)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取列表
  getList: function (start, num, uuid) {
    var that = this;
    app.ajax_wzx("/question/admireList/third", {
      "sinceId": start,
      "maxId": num,
      'uuid': uuid
    }, function (res) {
      if (res.data.questions != '') {
        var datas = res.data.questions,
          i,
          list_change = that.data.list;
        for (i in datas) {
          datas[i].date = that.format(datas[i].date);
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
  time: function (val) {
    for (var i in val) {
      val[i].date_change = this.countDown(val[i].endDate);
      this.setData({
        list: val
      })
    }
  },

  //去详情页面
  goDetail:function(e){
    wx.navigateTo({
      url: '../quesDetail/quesDetail?id=' + e.currentTarget.dataset.id + "&uuid="+e.currentTarget.dataset.uuid,
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
    return y + '-' + app.add0(m) + '-' + app.add0(d) + " " + app.add0(h) + ":" + app.add0(mm);
  }
})