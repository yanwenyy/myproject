// pages/share/share.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    id: 0,
    share_pintuan_productid: 0,
    phonewidth: 750,
    fixwidth: 750
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // const ctx = wx.createCanvasContext('shareImg')
    // var fixwidth = this.data.fixwidth;
    // //主要就是计算好各个图文的位置
    // ctx.drawImage('../../img/pay-bg.png', 0, 0, 375, 500);
    // ctx.drawImage('../../img/pg-star-sel.png', 125, 10, 30, 30);
    // ctx.drawImage('../../img/pg-star-sel.png', 125, 60, 30, 30);
    // ctx.setFontSize(20);
    // ctx.setFillStyle('#fff')
    // ctx.fillText('Hello', 20, 60);
    // ctx.fillText('MINA', 100, 150);
    // ctx.draw();

  },


  /**
   * 生成分享图
   */
  share: function() {
    var that = this;
    const ctx = wx.createCanvasContext('shareImg');
    ctx.drawImage('../../img/pay-bg.png', 0, 0, 375, 500);
    ctx.drawImage('../../img/pg-star-sel.png', 125, 10, 30, 30);
    ctx.drawImage('../../img/pg-star-sel.png', 125, 60, 30, 30);
    ctx.setFontSize(20);
    ctx.setFillStyle('#fff')
    ctx.fillText('Hello', 20, 60);
    ctx.fillText('MINA', 100, 150);
    ctx.draw(false,function(){
      wx.showLoading({
        title: '努力生成中...'
      })
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 720 * that.data.fixwidth,
        height: 1080 * that.data.fixwidth,
        destWidth: 1440,
        destHeight: 2160,
        canvasId: 'shareImg',
        success: function (res) {
          that.setData({
            prurl: res.tempFilePath,
            // hidden: false
          });
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
                      hidden: true
                    })
                    setTimeout(function () {
                      wx.navigateBack({});
                    }, 1000)
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
          wx.hideLoading()
        },
        fail: function (res) {
          console.log(res)
        }
      })
    });
   
  },

  /**
   * 保存到相册
   */
  save: function() {
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
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
              setTimeout(function() {
                wx.navigateBack({});
              }, 1000)
            }
          }
        })
      },
      fail: function(err) {
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

  }
})