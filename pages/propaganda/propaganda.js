// pages/propaganda/propaganda.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //开通类型
    breed: [
      { name: '1', value: '365顾问宝——个人版', checked: 'true'  },
      { name: '2', value: '365顾问宝——公司版'},
    ],
    shadow:false,
    //开通类型的值
    breedValue:'1',
    kt:true,
    kt_num:false,
    company_num:1
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取手机号
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData);
    this.setData({
      shadow:true
    })
  },
  //单选框改变
  radioChange: function (e) {
    this.setData({
      breedValue: e.detail.value
    })
  },
  //开通类型按钮点击
  ktBreed:function(){
    if (this.data.breedValue==1){
      wx.redirectTo({
        url:'../propaganda/editMsg/editMsg'
      })
    }else{
      this.setData({
        kt: false,
        kt_num: true
      })
    }
  },
  //加按钮点击
  plus:function(){
    this.setData({
      company_num: this.data.company_num+1
    })
  },
  //减按钮点击
  reduce:function(){
    if (this.data.company_num>0){
      this.setData({
        company_num: this.data.company_num - 1
      })
    }
  },
  //公司立即支付按钮点击
  companyPay:function(){
    wx.redirectTo({
      url: '../propaganda/editMsg/editMsg'
    })
  }
})