// pages/mine/mineCoach/mineAssessment/mineAssessment.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:'',//政策id
      showNum:1,
      oneValue:1,//第一题选择
      starNum:0,//星星数量
      shadowTitle:'',//弹框标题
      shadowMsg:'',//弹框内容
      shadow:false,//弹框状态
      zjyj:'',//专家意见
      ckyj:'',//参考意见
      result:{},//评估结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      id:options.id
    })

    //评估结果
    app.ajax("/applet/user/evaluation", {
      id: this.data.id
      }, function (res) {
        if(res.data.data!=null){
          that.setData({
            result: res.data.data,
            starNum: res.data.data.affectExtent,
            oneValue: res.data.data.related
          })
        }
    });

    //专家意见
    app.ajax("/applet/expert/forecast",{
      id:this.data.id
      },function(res){
      that.setData({
        zjyj:res.data.data
      })
    });

    //参考意见
    app.ajax("/applet/opinion/forecast", {
      id: this.data.id
      }, function (res) {
      that.setData({
        ckyj: res.data.data
      })
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

  //第一题选择
  oneCheck:function(e){
    this.setData({
      oneValue: e.currentTarget.dataset.value
    })
  },

  //首页下一步点击
  indexNextClick:function(){
    var that=this;
    var showNum_change=this.data.showNum+1;
    if(this.data.oneValue==1){
      this.setData({
        showNum: showNum_change
      })
    }else{
      app.ajax("/applet/evaluation/add", {
        "id": this.data.result.id,
        "policyId": this.data.id,
        "related": this.data.oneValue,
      }, function (res) {
        if(res.data.code==10000){
          wx.navigateTo({
            url: '../assessmentResult/assessmentResult?assessment=yes&id=' + that.data.id,
          })
        }
      })
     
    }
  },

  //两个按钮上一步点击
  twoBtnPreClick:function(){
    this.setData({
      showNum: this.data.showNum - 1
    })
  },

  //两个按钮下一步点击
  twoBtnNextClick: function () {
    if (this.data.showNum == 2 && (this.data.starNum == 0 || this.data.result.affect == '' || this.data.result.affect == null || this.data.result.affect == undefined)){
      wx.showToast({
        title: '对公司的影响度和影响内容不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }else{
      this.setData({
        showNum: this.data.showNum + 1
      })
    }
   
  },

  //星星点击
  starClick:function(e){
    this.setData({
      starNum: e.currentTarget.dataset.value
    })
  },

  //保存按钮点击
  subAssessment:function(){
    var that=this;
    app.ajax("/applet/evaluation/add",{
      "affect": this.data.result.affect,
      "affectExtent": this.data.starNum,
      "executive": this.data.result.executive,
      "id": this.data.result.id,
      "opinion": this.data.result.opinion,
      "policyId": this.data.id,
      "related": this.data.oneValue,
      },function(res){
        console.log(res)
        if (res.data.code == 10000) {
          wx.navigateTo({
            url: '../assessmentResult/assessmentResult?assessment=yes&id=' + that.data.id,
          })
        }
    })
  },

  //关闭弹框
  closeShadow:function(){
    this.setData({
      shadow:false
    })
  },

  //专家意见点击
  expertIdealClick:function(){
    this.setData({
      shadow: true,
      shadowTitle:'专家意见',
      shadowMsg:this.data.zjyj
    })
  },

  //参考意见点击
  referIdealClick:function(){
    this.setData({
      shadow: true,
      shadowTitle: '参考意见',
      shadowMsg: this.data.ckyj
    })
  },

  //影响度输入
  affectInput:function(e){
    this.data.result.affect=e.detail.value;
    this.setData({
      result: this.data.result
    })
  },

  //意见度输入
  opinionInput: function (e) {
    this.data.result.opinion = e.detail.value;
    this.setData({
      result: this.data.result
    })
  },

  //执行办法度输入
  executiveInput: function (e) {
    this.data.result.executive = e.detail.value;
    this.setData({
      result: this.data.result
    })
  },
})