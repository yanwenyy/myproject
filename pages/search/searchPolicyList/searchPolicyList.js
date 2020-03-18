// pages/search/searchPolicyList/searchPolicyList.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: 1,//起始页
    num: 5,//每页显示条数
    status: true,//是否还有数据
    list: [],//政策列表
    content:'',//搜索内容
    noContent:false
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
      this.getList(this.data.start, this.data.num, this.data.content)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //去政策解读页面
  goUnscramble:function(e){
    wx.navigateTo({
      url: '../../mine/mineCoach/unscramble/unscramble?source=search&id=' + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type,
    })
  },

  //搜索列表
  getList: function (start, num, content){
    var that = this;
    app.ajax("/applet/policy/serarch", {
      "current": start,
      "content": content,
      "pageSize": num
    }, function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          datas[i].officialReleaseDate = app.format(datas[i].officialReleaseDate);
          if (datas[i].tags) {
            datas[i].tags = datas[i].tags.split(",")
          };
          list_change.push(datas[i])
        }
        that.setData({
          list: list_change
        });
      } else {
        that.setData({
          status: false,
          noContent:true
        });
      }
    })
  },

  //搜索输入事件
  searchInput:function(e){
    this.setData({
      content:e.detail.value
    })
  },

  //搜索按钮点击
  searchClick:function(){
    this.setData({
      list:[],
      start: 1,//起始页
      num: 5,//每页显示条数
      status: true,//是否还有数据
    })
    this.getList(this.data.start, this.data.num, this.data.content)
  }
})