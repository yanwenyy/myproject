// pages/mine/minePresentation/selfPresentationDetail/selfPresentationDetail.js
const app=getApp();
const base64src = require('../../../../utils/base64src.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//政策包id
    source:'',//来源
    msg:{},//详情信息
    uuid:'',//查阅人观看时用户的id
    date:'',//政策日期
    num:'',//政策期数
    userInfo: '',
    // 分享
    shadow: false,
    shadowTitle: '',//分享弹框标题
    shareName: '',
    share_pintuan_productid: 0,
    phonewidth: 750,
    fixwidth: 750,
    margin: 0,
    canvas: false,
    code_src: '',
    qrcodeUrl: '',//转换的base64
    headImg: '',//分享的用户头像
    shareMsgShow: '',//分享图里的内容
    shareIcon: '',//政策的icon
    //分享结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      id:options.id,
      source:options.source,
      uuid:options.uuid,
      date:options.date,
      num:options.num,
      userInfo: app.globalData.userInfo
    });
    wx.getImageInfo({
      src: that.data.userInfo.headImg,
      success: function (res) {
        // console.log(res.path)
        that.setData({
          headImg: res.path
        })
      }
    });

    if (this.data.source =="manager"){
      //详情信息
      app.ajax("/applet/someone/evaluation/details", {
        id: this.data.id,
        uuid: this.data.uuid
      }, function (res) {
        console.log(res);
        that.setData({
          msg: res.data.data
        })
      })
    }else{
      //详情信息
      app.ajax("/applet/user/evaluation/details", {
        id: this.data.id,
      }, function (res) {
        console.log(res);
        that.setData({
          msg: res.data.data
        })
      })
    }
    
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(this.data.shareId)
      console.log(this.data.uuid)
      console.log(this.data.shareName)
      if (this.data.shareName == "zc") {
        return {
          title: '您有一份财税政策变动评估单待查看',
          path: 'pages/share/assessmentZc/assessmentZc?id=' + this.data.shareId + "&uuid=" + this.data.uuid + "&url=" + app.public.url,
          imageUrl: '../../../../img/share-zc.png'
        }
      } else {
        return {
          title: '您有一份财税政策变动评估单待查看',
          path: 'pages/share/assessmentZcb/assessmentZcb?id=' + this.data.shareId + "&uuid=" + this.data.uuid + "&url=" + app.public.url,
          imageUrl: '../../../../img/share-zc.png'
        }
      }
    }
  },

  //查看评估结果
  goResult:function(e){
    wx.navigateTo({
      url: '../../mineCoach/assessmentResult/assessmentResult?source=manager&id=' + e.currentTarget.dataset.id + "&uuid=" + e.currentTarget.dataset.uuid,
    })
  },

  //去分享页面
  goShare: function (e) {
    this.setData({
      shadow: true,
      shareName: e.currentTarget.dataset.name,
      shadowTitle: e.currentTarget.dataset.msg,
      shareId: e.currentTarget.dataset.id,
      qrcodeUrl: ''
    })
    this.shareMsg(this.data.shareName);
    // if (this.data.shareName == "zc") {
    //   this.saveCode('pages/share/assessmentZc/assessmentZc?id=' + this.data.shareId + "&uuid=" + app.globalData.userInfo.uuid + "&url=" + app.public.url);
    // } else {
    //   this.saveCode('pages/share/assessmentZcb/assessmentZcb?id=' + this.data.shareId + "&uuid=" + app.globalData.userInfo.uuid + "&url=" + app.public.url)
    // }
  },

  //关闭分享
  closeShadow: function () {
    this.setData({
      shadow: false
    })
  },

  /**
  * 生成分享图
  */
  share: function () {
    var that = this;
    if (this.data.shareName == "zc") {
      this.saveCode('pages/share/assessmentZc/assessmentZc?id=' + this.data.shareId + "&uuid=" + app.globalData.userInfo.uuid + "&url=" + app.public.url);
    } else {
      this.saveCode('pages/share/assessmentZcb/assessmentZcb?id=' + this.data.shareId + "&uuid=" + app.globalData.userInfo.uuid + "&url=" + app.public.url)
    }
    // if (this.data.shareName == "zc") {
    //   this.canvasZc();
    // } else {
    //   this.canvasZcb();
    // }

  },

  /**
  * 保存到相册
  */
  save: function () {
    var that = this;
    console.log(that.data.prurl)
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                canvas: false,
                margin: '80%',
              })
              // setTimeout(function () {
              //   wx.navigateBack({});
              // }, 1000)
            }
          }
        })
      },
      fail: function (err) {
        if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击图片即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
                fail(failData) {
                  console.log("failData", failData)
                },
                complete(finishData) {
                  console.log("finishData", finishData)
                }
              })
            }
          })
        }
      },
    })

  },
  
  //小程序码
  saveCode: function (url) {
    var that = this;
    //小程序码
    app.ajax_nodata("/applet/getAccessToken", function (res) {
      if (res.data.code == 10000) {
        app.ajax("/applet/getQrcode", {
          "accessToken": res.data.data,
          "path": url,
          "width": 430
        }, function (res) {
          // console.log(res);
          var base64 = base64src.base64src("data:image/png;base64," + res.data.data);
          base64.then(function (filePath) {
            // console.log(filePath);
            that.setData({
              qrcodeUrl: filePath
            });
            if (that.data.shareName == "zc") {
              that.canvasZc();
            } else {
              that.canvasZcb();
            }
          });
          that.setData({
            code_src: res.data.data
          })
        })
      }
    })
  },

  //政策分享canvas
  canvasZc: function () {
    var that = this;
    const ctx = wx.createCanvasContext('shareImg');
    ctx.drawImage('../../../../img/canvas-share-bg.png', 0, 0, 297, 454);
    ctx.save();
    ctx.arc(72, 70, 18, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.data.headImg, 54, 52, 37, 37);
    ctx.restore();
    ctx.setFontSize('16');
    ctx.setFillStyle('#333');
    ctx.fillText(this.data.userInfo.realName || this.data.userInfo.userName, 110, 73);
    ctx.fillText('财税政策变更评估报告', 54, 116);
    ctx.save();
    ctx.setFillStyle('#fff');
    ctx.setShadow(0, 1.5, 17, '#eee');
    ctx.fillRect(44, 131, 215, 122);
    ctx.restore();
    ctx.drawImage("../../../../img/coachDetail-zcbg.png", 64, 151, 35, 35);
    ctx.setFontSize('12');
    ctx.setFillStyle('#333333');
    ctx.fillText(this.data.shareMsgShow.title.slice(0, 10), 104, 161);
    ctx.fillText(this.data.shareMsgShow.title.slice(10, 20), 104, 181);
    ctx.setFontSize('9');
    ctx.setFillStyle('#999999');
    ctx.fillText(this.data.shareMsgShow.fileNum.slice(0, 13), 104, 200);
    ctx.save();
    ctx.setFillStyle('#EEEEEE');
    ctx.fillRect(104, 215, 112, 1);
    ctx.restore();
    ctx.drawImage(this.data.shareMsgShow.affectExtent >= 1 ? "../../../../img/pg-star-sel.png" : '../../../../img/pg-star.png', 104, 225, 14, 14);
    ctx.drawImage(this.data.shareMsgShow.affectExtent >= 2 ? "../../../../img/pg-star-sel.png" : '../../../../img/pg-star.png', 124, 225, 14, 14);
    ctx.drawImage(this.data.shareMsgShow.affectExtent >= 3 ? "../../../../img/pg-star-sel.png" : '../../../../img/pg-star.png', 144, 225, 14, 14);
    ctx.drawImage(this.data.shareMsgShow.affectExtent >= 4 ? "../../../../img/pg-star-sel.png" : '../../../../img/pg-star.png', 164, 225, 14, 14);
    ctx.drawImage(this.data.shareMsgShow.affectExtent >= 5 ? "../../../../img/pg-star-sel.png" : '../../../../img/pg-star.png', 184, 225, 14, 14);
    ctx.setFontSize('7');
    ctx.setFillStyle('#fff');
    ctx.fillText('省税一哥', 20, 400);
    ctx.setFontSize('10');
    ctx.fillText('您的财税顾问', 20, 422);
    // ctx.drawImage("data:image/png;base64," + this.data.code_src, 212, 346, 66, 66);
    ctx.drawImage(this.data.qrcodeUrl, 212, 346, 66, 66);
    ctx.fillText('长按二维码查看', 212, 430);
    ctx.draw(false, function () {
      wx.showLoading({
        title: '努力生成中...'
      })
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 297,
        height: 454,
        destWidth: 1188,
        destHeight: 1816,
        canvasId: 'shareImg',
        fileType: 'jpg',
        quality: 1,
        success: function (res) {
          that.setData({
            prurl: res.tempFilePath,
            canvas: true,
            margin: '0',
          });
          wx.hideLoading()
        },
        fail: function (res) {
          console.log(res)
        }
      })
    });
  },

  //政策包分享
  canvasZcb: function () {
    var that = this;
    const ctx = wx.createCanvasContext('shareImg');
    ctx.drawImage('../../../../img/canvas-share-bg.png', 0, 0, 297, 454);
    ctx.save();
    ctx.arc(72, 70, 18, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.data.headImg, 54, 52, 37, 37);
    ctx.restore();
    ctx.setFontSize('16');
    ctx.setFillStyle('#333');
    ctx.fillText(this.data.userInfo.realName || this.data.userInfo.userName, 110, 73);
    ctx.setFontSize('14');
    ctx.fillText('本月财税政策有变动，请查看报告', 54, 116);
    ctx.save();
    ctx.setFillStyle('#fff');
    ctx.setShadow(0, 1.5, 17, '#eee');
    ctx.fillRect(44, 131, 215, 80);
    ctx.restore();
    ctx.setFontSize('15');
    ctx.setFillStyle('#333333');
    ctx.fillText('财税政策变更评估报告', 56, 170);
    ctx.setFontSize('12');
    ctx.setFillStyle('#999');
    ctx.fillText('评估人：', 56, 190);
    ctx.fillText(this.data.shareMsgShow.realName || this.data.shareMsgShow.userName, 96, 190);
    ctx.fillText(app.format(this.data.shareMsgShow.policyDate), 176, 190);
    ctx.setFontSize('7');
    ctx.setFillStyle('#fff');
    ctx.fillText('省税一哥', 20, 400);
    ctx.setFontSize('10');
    ctx.fillText('您的财税顾问', 20, 422);
    // ctx.drawImage("data:image/png;base64," + this.data.code_src, 212, 346, 66, 66);
    ctx.drawImage(this.data.qrcodeUrl, 212, 346, 66, 66);
    ctx.fillText('长按二维码查看', 212, 430);
    ctx.draw(false, function () {
      wx.showLoading({
        title: '努力生成中...'
      })
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 297,
        height: 454,
        destWidth: 1188,
        destHeight: 1816,
        canvasId: 'shareImg',
        fileType: 'jpg',
        quality: 1,
        success: function (res) {
          that.setData({
            prurl: res.tempFilePath,
            canvas: true,
            margin: '0',
          });
          wx.hideLoading()
        },
        fail: function (res) {
          console.log(res)
        }
      })
    });
  },

  //分享的内容
  shareMsg: function (name) {
    var that = this;
    if (name == "zc") {
      app.ajax("/share/policy/evaluation", {
        "id": this.data.shareId,
        "uuid": this.data.uuid
      }, function (res) {
        that.setData({
          shareMsgShow: res.data.data
        });
      })
    } else {
      app.ajax("/share/evaluation/policypack", {
        "id": this.data.shareId,
        "uuid": this.data.uuid
      }, function (res) {
        that.setData({
          shareMsgShow: res.data.data
        });
      })
    }
  },

  //关闭生成分享图
  closeCanvas: function () {
    this.setData({
      canvas: false,
      margin: '70%',
    })
  }
})