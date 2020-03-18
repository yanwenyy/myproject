// pages/microConsultation/microConsultationList/microConsultationList.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    headSrc:'',//头像路径
    start: 1,//起始页
    num: 1,
    end: 10,//每页显示条数
    status: true,//是否还有数据
    time:0,//剩余次数
    c_uuid:'',//企业的所有用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      headSrc: app.public.head_src,
      userInfo:app.globalData.userInfo
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
    var that=this;
    this.setData({
      list: [],
      start: 1,//起始页
      num: 1,
      end: 10,//每页显示条数
      status: true,//是否还有数据
    })
    // this.data.list=[];
    // this.data.start = 1;
    // this.data.end = 10;
    // this.data.num = 1;
    //获取剩余次数
    app.ajax_nodata("/applet/getQuestionNum",function(res){
      that.setData({
        time:res.data.data
      })
    })
    
    //获取用户id
    app.ajax("/applet/getUserIdByCompanyId",{
      companyId: app.globalData.userInfo.companyId
      },function(res){
        that.setData({
          c_uuid:res.data.data
        });
        //获取列表数据
        that.getList(that.data.start, that.data.end, that.data.c_uuid)
    })

    
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
      this.getList(this.data.start, this.data.end, this.data.c_uuid)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //去问答规则
  goRule:function(){
    wx.navigateTo({
      url: '../rule/rule',
    })
  },

  //获取列表
  getList: function (start, num, uuid){
    var that = this;
    app.ajax_wzx("/question/companyQuestionList/third", {
      "sinceId": start, 
      "maxId": num, 
      "uuid":app.globalData.userInfo.uuid,
      'userIds': uuid
    }, function (res) {
      if (res.data.questions != '') {
        var datas = res.data.questions,
            i,
            list_change = that.data.list;
        for (i in datas) {
          datas[i].date = app.format(datas[i].date);
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

  //去提问页面
  goQues:function(){
    if (app.globalData.userInfo.province != '' && app.globalData.userInfo.province != null){
      //获取剩余次数
      app.ajax_nodata("/applet/getQuestionNum", function (res) {
        if (res.data.data > 0) {
          wx.navigateTo({
            url: '../ques/ques',
          })
        } else {
          wx.showToast({
            title: '没有次数了',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      wx.showToast({
        title: '请先完善个人信息的地区',
        icon: 'none',
        duration: 2000
      })
    }
    
  },

  //去详情页面
  goDetail:function(e){
    wx.navigateTo({
      url: '../quesDetail/quesDetail?id=' + e.currentTarget.dataset.id + "&uuid="+e.currentTarget.dataset.uuid,
    })
  }
})