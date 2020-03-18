//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    num: 0.23456,
    progress: '', //用户进度
    userInfo: {}, //用户信息
    coaching: null, //当前辅导
    evaluating: null, //当前评测
    updating: null, //近期更新
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //ifvip:false,
    endtime: '',
    background: [], //轮播图地址
    ifSy: 0,
    tryNum: 0, //试用天数
    shadow: false, //弹窗
    receiveShadow: true, //领取弹窗
    hyShadow: false, //选行业弹窗
    hyList: [],
    hySelect: '',
    tryVipModel: false, //邀请完分享框
    companyName: '', //领取后邀请的公司名字
  },
  onLoad: function (options) {
    var that = this;
    if (options.form == 'tryEdit') {
      this.setData({
        tryVipModel: true,
        companyName: options.companyName
      })
    }
  },
  onShow: function (options) {
    var that = this;
    // console.log(app.globalData.userInfo.uuid)
    if (app.globalData.cookieId && app.globalData.cookieId != '') {
      this.getLoad();
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.cookieIdCallback = cookieId => {
        if (cookieId != '') {

          this.getLoad();


        }
      }
    };
    //获取用户信息
    if (app.globalData.userInfo) {
      console.log(1)
      // this.setData({
      //   userInfo: app.globalData.userInfo,
      //   hasUserInfo: true
      // })
      // 获取用户信息
      wx.getSetting({
        success: res => {

          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

            wx.getUserInfo({
              lang: "zh_CN",
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                wx.request({
                  url: app.puplic.url + '/applet/getUserInfo', //仅为示例，并非真实的接口地址
                  data: {
                    "encryptedData": res.encryptedData,
                    "iv": res.iv,
                    "phone": wx.getStorageSync('phone'),
                    "openid": app.globalData.logMsg.openid,
                    "rawData": res.rawData,
                    "signature": res.signature
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/json', // 默认值
                    'cookieId': app.globalData.logMsg.cookieId
                  },
                  success(res) {
                    //console.log(res.data)
                    app.globalData.userInfo = res.data.data;
                    that.setData({
                      userInfo: res.data.data,
                      hasUserInfo: true
                    })
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回


                  }
                })

              }
            })
          }
        }
      })
    } else if (this.data.canIUse) {
      console.log(2)
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        if (res.data.data.ifMember == 1 && (res.data.data.trade == null || res.data.data.trade == '')) {
          wx.reLaunch({
            url: '../propaganda/editMsg/editMsg?must=1&source=company&name=' + res.data.data.companyName,
          })
        }
        that.setData({
          userInfo: res.data.data,
          hasUserInfo: true
        })
      }

      // 获取用户信息
      // wx.getSetting({
      //   success: res => {

      //     if (res.authSetting['scope.userInfo']) {
      //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

      //       wx.getUserInfo({
      //         lang: "zh_CN",
      //         success: res => {
      //           // 可以将 res 发送给后台解码出 unionId
      //           wx.request({
      //             url: app.puplic.url + '/applet/getUserInfo', //仅为示例，并非真实的接口地址
      //             data: {
      //               "encryptedData": res.encryptedData,
      //               "iv": res.iv,
      //               "phone": wx.getStorageSync('phone'),
      //               "openid": app.globalData.logMsg.openid,
      //               "rawData": res.rawData,
      //               "signature": res.signature
      //             },
      //             method: "POST",
      //             header: {
      //               'content-type': 'application/json', // 默认值
      //               'cookieId': app.globalData.logMsg.cookieId
      //             },
      //             success(res) {
      //               //console.log(res.data)
      //               app.globalData.userInfo = res.data.data;
      //               that.setData({
      //                 userInfo: res.data.data,
      //                 hasUserInfo: true
      //               })
      //               console.log(that.data.userInfo)
      //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      //               // 所以此处加入 callback 以防止这种情况


      //             }
      //           })

      //         }
      //       })
      //     }
      //   }
      // })
    } else {
      console.log(3)
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          wx.request({
            url: app.puplic.url + '/applet/getUserInfo', //仅为示例，并非真实的接口地址
            data: {
              "encryptedData": res.encryptedData,
              "iv": res.iv,
              "phone": wx.getStorageSync('phone'),
              "openid": app.globalData.logMsg.openid,
              "rawData": res.rawData,
              "signature": res.signature
            },
            method: "POST",
            header: {
              'content-type': 'application/json', // 默认值
              'cookieId': app.globalData.logMsg.cookieId
            },
            success(res) {
              //console.log(res.data)
              app.globalData.userInfo = res.data.data
              that.setData({
                userInfo: res.data.data,
                hasUserInfo: true
              });
            }
          })
        }
      })
    };

  },

  onReady: function () {
    // 页面首次渲染完毕时执行
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log(app.globalData.userInfo.uuid)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);

    }
    return {
      title: app.globalData.userInfo.companyName + '邀请您的加入',
      path: 'pages/share/acceptShareMsg/acceptShareMsg?uuid=' + app.globalData.userInfo.uuid,
      imageUrl: '../../img/share-yq.png'
    }
  },

  //倒计时函数
  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown(o) { //倒计时函数
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
    } else { //活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    return obj;
  },

  //去我的辅导
  goTab: function (e) {
    if (e.currentTarget.dataset.type == "wzx" && (app.globalData.userInfo.ifMember == 1 || app.globalData.userInfo.isTryVip == 1)) {

      if (app.globalData.userInfo.isTryVip == 1) {
        wx.showToast({
          title: '企业会员服务,付费开通后可使用',
          icon: 'none',
          duration: 2000
        })
        return false;
      } else {
        if (app.globalData.userInfo.category == 1) {
          app.getToken();
          wx.navigateTo({
            url: e.currentTarget.dataset.tab,
          })
        }
        return false;
      }

    } else if (e.currentTarget.dataset.type == "bg" && app.globalData.userInfo.category == 1 && (app.globalData.userInfo.ifMember == 1 || app.globalData.userInfo.isTryVip == 1)) {
      wx.navigateTo({
        url: e.currentTarget.dataset.tab,
      })
      return false;
    } else if (this.ifvip() == 1) {
      wx.navigateTo({
        url: e.currentTarget.dataset.tab,
      })
      return false;
    }
  },

  //授权手机号
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData);
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
    // app.ajax('/applet/getPhoneNumber', {
    //   "encryptedData": e.detail.encryptedData,
    //   "iv": e.detail.iv,
    //   "openid": app.globalData.logMsg.openid},function(data){
    //   console.log(data)
    // })
  },

  //获取用户信息
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //去辅导
  goCoach: function (e) {
    if (this.ifvip() == 1) {
      wx.navigateTo({
        url: '../mine/mineCoach/coachDetail/coachDetail?id=' + e.currentTarget.dataset.id,
      })
    }

  },

  //去评估
  goAssessment: function () {
    wx.navigateTo({
      url: '../mine/mineCoach/mineAssessment/mineAssessment'
    })
  },

  getLoad: function () {
    var that = this;

    //轮播图地址
    app.ajax("/applet/banner/list", {
      "type": "1"
    }, function (res) {
      that.setData({
        background: res.data.data
      })
    })

    //用户进度
    app.ajax_nodata("/applet/user/rate", function (res) {
      that.setData({
        progress: res.data.data
      })
    });

    //评测期接口
    app.ajax_nodata("/applet/user/policypack", function (res) {
      if (res.data.data != '' && res.data.data != null) {
        var rightPercent = res.data.data.rightPercent;
        if (rightPercent) {
          rightPercent = (rightPercent * 100).toFixed(1)
        } else {
          rightPercent = 0;
        }
        res.data.data.rightPercent = rightPercent
        that.setData({
          evaluating: res.data.data
        });
        setInterval(function () {
          var change_time = that.countDown(that.data.evaluating.policyDate);
          that.setData({
            endtime: change_time
          })
        }, 1000)

      }

    });

    //更新期接口
    app.ajax_nodata("/applet/usernew/policypack/two", function (res) {
      if(res.data.data&&res.data.data!=''){
        var data = res.data.data;
        data.punshNum = parseInt(data.punshNum)
  
        that.setData({
          coaching: data
        })
      }
     
      //使用canvas
      // that.canvasRing = that.selectComponent("#canvasRing");
      // that.canvasRing.showCanvasRing();
      // that.canvasRing = that.selectComponent("#canvasRing2");
      // that.canvasRing.showCanvasRing();
      //结束
    });

    //近期更新进口
    app.ajax_nodata("/applet/recent/new/policy", function (res) {
      var datas = res.data.data;
      if (datas && datas != '') {
        for (var i in datas) {
          datas[i].officialReleaseDate = app.format(datas[i].officialReleaseDate);
          if (datas[i].tags) {
            datas[i].tags = datas[i].tags.split(",")
          };
        }
        that.setData({
          updating: datas
        });
      }
    });

    //是否有试用资格
    // app.ajax_nodata("/applet/is/tryout", function(res) {
    //   that.setData({
    //     ifSy: res.data.data
    //   })
    // });

    //试用天数,是否有试用资格
    app.ajax_nodata("/applet/comany/is/tryout", function (res) {
      var data = res.data.data;
      if (data) {
        that.setData({
          ifSy: data.ifQuali
        })
        if (data.tryNum) {
          that.setData({
            tryNum: data.tryNum
          })
        }
      }
    })
  },

  //当前评测按钮点击
  assessmentClick: function (e) {
    if (this.ifvip() == 1) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url + this.data.evaluating.id,
      })
    }
  },

  ifvip: function () {
    var ifMember = '';
    if (app.globalData.userInfo.ifMember == 1 || app.globalData.userInfo.isTryVip == 1) {
      //是会员
      // ifMember = app.globalData.userInfo.ifMember;
      ifMember = 1;
      return ifMember;
    } else {
      wx.navigateTo({
        url: '../propaganda/propaganda',
      })
    }
  },

  //去解读页面
  goUnscramble: function (e) {
    if (this.ifvip() == 1) {
      wx.navigateTo({
        url: '../mine/mineCoach/unscramble/unscramble?source=index&id=' + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type,
      })
    }
  },

  //打开弹窗
  openShadow: function () {
    this.setData({
      shadow: true
    })
  },

  //关闭弹窗
  closeShadow: function () {
    this.setData({
      shadow: false,
      receiveShadow: true,
      hyShadow: false,
      hySelect: ''
    })
  },

  //关闭领取弹框
  closetryShadow: function () {
    this.setData({
      tryVipModel: false
    })
  },

  //领取按钮点击
  receiveClick: function () {
    var that = this;
    //使用领取修改之前的逻辑
    // if (this.data.ifSy == 1) {
    //   this.setData({
    //     receiveShadow: false,
    //     hyShadow: true
    //   });
    //   app.ajax_nodata("/applet/getTrade", function(res) {
    //     that.setData({
    //       hyList: res.data.data
    //     })
    //   })
    // } else {
    //   app.ajax("/applet/receive/tryout", {
    //     "trades": ""
    //   }, function(res) {
    //     if (res.data.code == 10000) {
    //       wx.showModal({
    //         content: '试用体验领取成功,可免费试用3天！',
    //         showCancel: false,
    //         success(res) {
    //           that.setData({
    //             shadow: false,
    //             receiveShadow: true,
    //             hyShadow: false,
    //             hySelect: '',
    //             ifSy: 0,
    //           })
    //         }
    //       })
    //     }
    //   })
    // }


    //修改试用领取之后
    if (app.globalData.userInfo.trade != '' && app.globalData.userInfo.trade != null) {
      app.ajax("/applet/compay/receive/tryout",{},function(res){
       if(res.data.code==10000){
        that.setData({
          tryVipModel: true,
          companyName:app.globalData.userInfo.companyName,
          shadow: false,
          receiveShadow: true,
        })
       }
      })
    } else {
      wx.navigateTo({
        url: '../propaganda/editMsg/editMsg?source=tryVip',
      })
    }


  },

  //行业点击
  hyChange: function (e) {
    this.setData({
      hySelect: e.currentTarget.dataset.msg
    })
  },

  //行业确定按钮点击
  hySub: function () {
    var that = this;
    app.ajax("/applet/receive/tryout", {
      "trades": this.data.hySelect
    }, function (res) {
      if (res.data.code == 10000) {
        wx.showModal({
          content: '试用体验领取成功,可免费试用3天！',
          showCancel: false,
          success(res) {
            that.setData({
              shadow: false,
              receiveShadow: true,
              hyShadow: false,
              hySelect: '',
              ifSy: 0,
            })
          }
        })
      }
    })
  },

  //轮播图点击
  swiperClick: function () {
    wx.navigateTo({
      url: '../propaganda/propaganda',
    })
  }
})