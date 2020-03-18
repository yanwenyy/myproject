// pages/share/assessmentZc/assessmentZc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starNum: 0,//星星数量
    result: {},//评估结果
    msg: {},//政策信息
    id:'',
    uuid:'',
    url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      id: options.id,
      uuid:options.uuid,
      url: options.url
    })

    //评估结果
    this.ajax("/share/policy/evaluation", {
      id: this.data.id,
      uuid:this.data.uuid
    }, function (res) {
      if (res.data.data != null) {
        that.setData({
          result: res.data.data,
          starNum: res.data.data.affectExtent,
        })
      }
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
    wx.redirectTo({
      url: '../../../index/index'
    })
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

  //修改评估点击
  editAssessment: function () {
    wx.navigateTo({
      url: '../mineAssessment/mineAssessment?id=' + this.data.id,
    })
  },

  //ajax
  ajax: function (url, data, succ) {
    wx.request({
      url: this.data.url + url, //仅为示例，并非真实的接口地址
      data: JSON.stringify(data),
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(res) {
        succ(res)
      }
    })
  },
})