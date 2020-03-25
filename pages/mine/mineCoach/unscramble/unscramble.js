// pages/mine/mineCoach/unscramble/unscramble.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    userInfo:{},
    source:'',//是否来源于搜索页面
    tabMsg:'逐条解读',//tab信息
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    yw:{},//政策原文数据
    zjjd:{},//专家解读
    sdjd:{},//深度解读
    dbjd: {},//对比解读
    gfjd: {},//官方解读
    type: '1',//文章类型 1 政策 2 文章
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      console.log(options)
      this.setData({
        id:options.id,
        source: options.source,
        userInfo: app.globalData.userInfo,
      });
    if (options.type==2){
      this.setData({
        type: options.type,
        tabMsg: '原文',
        source:'article'
      });
    }
    this.getMsg();
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

  //页面加载数据
  getMsg:function(){
    var that=this;
    //原文
    app.ajax("/applet/policy/original", {
      "id": this.data.id,
    }, function (res) {
      res.data.data.officialReleaseDate = app.format(res.data.data.officialReleaseDate);
      that.setData({
        yw: res.data.data
      })
    });

    //专家解读
    app.ajax("/applet/policy/expert", {
      "id": this.data.id,
    }, function (res) {
      that.setData({
        zjjd: res.data.data
      })
    });

    //深度解读
    app.ajax("/applet/policy/depth", {
      "id": this.data.id,
      "type": '1'
    }, function (res) {
      that.setData({
        sdjd: res.data.data
      })
    });

    //对比解读
    app.ajax("/applet/policy/depth", {
      "id": this.data.id,
      "type": '2'
    }, function (res) {
      that.setData({
        dbjd: res.data.data
      })
    });

    //官方解读
    app.ajax("/applet/policy/depth", {
      "id": this.data.id,
      "type": '3'
    }, function (res) {
      that.setData({
        gfjd: res.data.data
      })
    });
  },

  //tab点击
  tabClick:function(e){
    this.setData({
      tabMsg: e.currentTarget.dataset.value
    })
  },

  //音频相关
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  },

  //去评估
  goMineAssessment:function(){
    var that=this;
    //评估结果
    app.ajax("/applet/user/evaluation", {
      id: this.data.id
    }, function (res) {
      if (res.data.data != null) {
        wx.navigateTo({
          url: '../assessmentResult/assessmentResult?id=' + that.data.id,
        })
      }else{
        wx.navigateTo({
          url: '../mineAssessment/mineAssessment?id=' + that.data.id,
        }) 
      }
    });
    
  },

  //测试按钮点击
  goTest:function(){
    var that=this;
    app.ajax("/applet/exam/button",{
      "id":this.data.id
    },function(res){
      var code=res.data.data;
      if (code==0){
        wx.showToast({
          title: '暂无试题',
          icon: 'none',
          duration: 3000
        })
      }else if(code==1){
        wx.showModal({
          title: '提示',
          content: '本政策与您的行业不匹配,无需测试!',
          success(res) {
            if (res.confirm) {
              // wx.navigateTo({
              //   url: '../../../test/resitTest/resitTest?id=' + that.data.id,
              // })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else if (code == 2) {
        wx.navigateTo({
          url: '../../../test/currentTestCard/currentTestCard?id=' + that.data.id,
        })
      }else if (code == 3) {
        wx.navigateTo({
          url: '../../../test/test?id=' + that.data.id,
        })
      }
    })
  },

  //相关政策点击
  goRelative:function(e){
    // this.setData({
    //   id: e.currentTarget.dataset.id,
    //   tabMsg: '原文',//tab信息
    // });
    // this.getMsg();
    wx.navigateTo({
      url: 'unscramble?source='+this.data.source+'&id=' + e.currentTarget.dataset.id
    })
  },
  downLoad:function(e){
    var that=this,
        dataUrl="https://"+e.currentTarget.dataset.url;
    var url="https://"+e.currentTarget.dataset.url,
        fileUrl=url.split("/"),
        fileUrl=fileUrl[fileUrl.length-1];
        var rootPath = wx.env.USER_DATA_PATH,
        cachePath = rootPath+"/cache";
        wx.getFileSystemManager().access({
          // path: cachePath+"/"+fileUrl,
          path:cachePath+"/"+fileUrl,
          success: function(res) {
            console.log(res);
            wx.openDocument({
              filePath:cachePath+"/"+fileUrl,
              success: function (res) {
                console.log('打开文档成功')
              }
            })
          },
          fail: function(res) {
            wx.getFileSystemManager().mkdir({
              dirPath: cachePath,
              recursive: true,
              success: function(res) {
                console.log(res);
               that.downLoadHS(dataUrl,cachePath,fileUrl)
              },
              fail: function(res) {
                console.log(res);
                if(res.errMsg.indexOf("already exists")>-1){
                  that.downLoadHS(dataUrl,cachePath,fileUrl)
                }
              }
            })
          }
        })

  },
  downLoadHS:function(url,cachePath,fileUrl){
    wx.showLoading({
      title: '下载中',
    });   
      wx.downloadFile({
        url:url, //仅为示例，并非真实的资源
        filePath:cachePath+'/'+fileUrl,
        success (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          wx.hideLoading();
          if (res.statusCode === 200) {
            // const filePath = res.filePath;
            // console.log(filePath+"/"+fileUrl)
            wx.openDocument({
              filePath: res.filePath,
              success: function (res) {
                console.log('打开文档成功')
              }
            })
            console.log(res.filePath)
          }
        },
        fail:function(res){
          console.log(res)
          wx.hideLoading();
          wx.showToast({
            title: "下载失败",
            icon: 'none',
            duration: 2000
          })
        }
      })
  }
})