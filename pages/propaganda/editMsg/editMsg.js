// pages/propaganda/editMsg/editMsg.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    company: true, //企业用户
    personal: false, //个人用户
    tryVip: false, //试用领取
    source: '', //来源
    companyName: '',
    userName: '',
    region: ['北京市', '北京市', '东城区'], //地区
    industry: [], //行业
    industryindex: -1, //公司行业下标
    personalIndustryindex: -1, //个人行业下标
    companyNature: [], //公司性质
    companyNatureIndex: -1, //公司性质下标
    companyScalee: [], //规模
    companyScaleeIndex: -1, //规模下标
    post: [], //职务
    postIndex: -1, //职务下标
    userInfo: {},
    must: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      lang: "zh_CN",
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.ajax("/applet/getUserInfo", {
          "encryptedData": res.encryptedData,
          "iv": res.iv,
          "openid": app.globalData.logMsg.openid,
          "phone": wx.getStorageSync('phone'),
          "rawData": res.rawData,
          "signature": res.signature
        }, function (res) {
          var data = res.data.data;
          // data.vaildLastTime = app.format(data.vaildLastTime);
          if(options.source == "tryVip"){
            that.setData({
              userInfo: data
            });
          }
        })
      }
    })
    if (options.must == 1) {
      wx.hideHomeButton();
      this.setData({
        must: options.must
      })
    }
    this.setData({
      source: options.source,
      companyName: options.name != null && options.name != 'null' ? options.name : null
    });
    console.log(typeof (this.data.companyName))
    if (options.source == "company" || options.source == "tryVip") {
      this.setData({
        company: true,
        personal: false,
        // tryVip:false
      });
    } else {
      this.setData({
        personal: true,
        company: false,
        tryVip: false
      });
    };

    //行业
    app.ajax_nodata("/applet/getTrade", function (res) {
      that.setData({
        industry: res.data.data
      })
    });

    //公司性质
    app.ajax("/applet/getSysCode", {
      "category": "3"
    }, function (res) {
      that.setData({
        companyNature: res.data.data
      })
    });

    //规模
    app.ajax("/applet/getSysCode", {
      "category": "2"
    }, function (res) {
      that.setData({
        companyScalee: res.data.data
      })
    });

    //职务
    app.ajax("/applet/getSysCode", {
      "category": "1"
    }, function (res) {
      that.setData({
        post: res.data.data
      })
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

  //地区选择
  bindRegionChange: function (e) {
    if (e.detail.value[0] == "北京市" || e.detail.value[0] == "上海市" || e.detail.value[0] == "天津市" || e.detail.value[0] == "重庆市") {
      e.detail.value[0] = e.detail.value[0].split("市")[0];
      e.detail.value[1] = e.detail.value[1].split("市")[0];
    } else {
      e.detail.value[0] = e.detail.value[0].split("省")[0];
      e.detail.value[1] = e.detail.value[1].split("市")[0];
    }
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  //行业选择器
  industryChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      industryindex: e.detail.value
    })
  },

  //个人行业选择
  personalIndustryChange: function (e) {
    this.setData({
      personalIndustryindex: e.detail.value
    })
  },

  //职务选择
  postChange: function (e) {
    this.setData({
      postIndex: e.detail.value
    })
  },

  //规模选择
  companyScaleeChange: function (e) {
    this.setData({
      companyScaleeIndex: e.detail.value
    })
  },

  //公司性质选择
  companyNatureChange: function (e) {
    this.setData({
      companyNatureIndex: e.detail.value
    })
  },

  //公司姓名
  companyNameInput: function (e) {
    this.setData({
      companyName: e.detail.value
    })
  },

  //用户昵称
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },

  //确定按钮点击
  subMsg: function () {
    var data = this.data;
    var that = this;
    if (data.source == "company") {
      if (data.companyName != '' && data.companyNatureIndex > -1 && data.companyScaleeIndex > -1 && data.industryindex > -1 && data.userName != '' && data.personalIndustryindex > -1 && data.postIndex > -1) {
        app.ajax("/applet/saveOrUpdateCompany", {
          "companyName": data.companyName,
          "companyNature": data.companyNature[data.companyNatureIndex].uuid,
          "companyScale": data.companyScalee[data.companyScaleeIndex].uuid,
          "trade": data.industry[data.industryindex].tradeId,
          "companyId": this.data.userInfo.companyId
        }, function (res) {
          if (data.personalIndustryindex > -1 && data.userName != '') {
            app.ajax("/applet/editUserInfo", {
              "city": data.region[1],
              'province': data.region[0],
              "companyId": res.data.uuid,
              "companyName": data.companyName,
              "openid": app.globalData.logMsg.openid,
              "positiotn": data.post[data.postIndex].uuid,
              "realName": data.userName,
              "trade": "," + data.industry[data.personalIndustryindex].tradeId + ",",
            }, function (data) {
              if (that.data.must == 1) {
                wx.reLaunch({
                  url: '../../index/index',
                })
              } else {
                wx.reLaunch({
                  url: '../invitationStaff/invitationStaff?name=' + that.data.companyName,
                })
              }

            })
          } else {
            wx.showToast({
              title: '请完善个人信息',
              icon: 'none',
              duration: 2000
            })
          }

        })
      } else {
        wx.showToast({
          title: '请完善公司信息',
          icon: 'none',
          duration: 2000
        })
      }
    } else if (data.source == "tryVip") {
      console.log("来自试用");
      if (data.companyName != '' && data.companyNatureIndex > -1 && data.companyScaleeIndex > -1 && data.industryindex > -1 && data.userName != '' && data.personalIndustryindex > -1 && data.postIndex > -1 && data.personalIndustryindex > -1 && data.userName != '') {
        console.log("已完成");
        app.ajax("/applet/compay/receive/tryout", {
          "city": data.region[1],
          "companyName": data.companyName,
          "ePCompanyName": data.companyName,
          "ePCompanyNature": data.companyNature[data.companyNatureIndex].uuid,
          // "ePcity": data.region[1],
          // "ePprovince": data.region[0],
          "ePtrade": data.industry[data.industryindex].tradeId,
          "epCompanyScale": data.companyScalee[data.companyScaleeIndex].uuid,
          // "nickname": "string",
          "positiotn": data.post[data.postIndex].uuid,
          "province": data.region[0],
          "realName": data.userName,
          "trades": "," + data.industry[data.personalIndustryindex].tradeId + ",",
          // "userName": "string"
        }, function (res) {
          if(res.data.code==10000){
            wx.reLaunch({
              url: '../../index/index?form=tryEdit&companyName='+data.companyName,
            })
            // wx.showModal({
            //   title: '试用领取成功!',
            //   content: '您可以邀请两位同事一同试用',
            //   showCancel:false,
            //   confirmText:'邀请同事',
            //   success (res) {
            //     if (res.confirm) {
            //       console.log('用户点击确定');
            //       wx.reLaunch({
            //         url: '../../index/index?form=tryEdit',
            //       })
            //     } 
            //   }
            // })
          }
        })
      } else {
        wx.showToast({
          title: '请完善信息',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      if (data.companyName != '' && data.userName != '' && data.personalIndustryindex > -1 && data.postIndex > -1) {
        app.ajax("/applet/editUserInfo", {
          "province": data.region[1],
          "city": data.region[2],
          "companyName": data.companyName,
          "openid": app.globalData.logMsg.openid,
          "positiotn": data.post[data.postIndex].uuid,
          "realName": data.userName,
          "trade": data.industry[data.personalIndustryindex].tradeId,
        }, function (data) {
          console.log(data)
        })
      } else {
        wx.showToast({
          title: '请完善公司信息',
          icon: 'none',
          duration: 2000
        })
      }
    }


  }
})