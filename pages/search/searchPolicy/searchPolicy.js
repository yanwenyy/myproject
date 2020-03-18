// pages/search/searchPolicy/searchPolicy.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[],//列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.ajax_nodata("/applet/policy/all",function(res){
      var datas = res.data.data;
      if (datas && datas != '') {
        var list_change = that.data.list;
        for (var i in datas) {
          var tbPolicyActions = datas[i].tbPolicyActions;
          for (var u in tbPolicyActions ){
            tbPolicyActions[u].officialReleaseDate = app.format(tbPolicyActions[u].officialReleaseDate);
            if (tbPolicyActions[u].tags) {
              tbPolicyActions[u].tags = tbPolicyActions[u].tags.split(",")
            };
          }
          
          list_change.push(datas[i])
        }
        that.setData({
          list: list_change
        });
      }
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

  //去搜索页面
  goSearchPolicyList:function(){
    wx.navigateTo({
      url: '../searchPolicyList/searchPolicyList',
    })
  },

  //去解读页面
  goUnscramble: function (e) {
    wx.navigateTo({
      url: '../../mine/mineCoach/unscramble/unscramble?source=search&id=' + e.currentTarget.dataset.id+"&type="+e.currentTarget.dataset.type,
    })
  }
})