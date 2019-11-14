// pages/test/test.js
const query = wx.createSelectorQuery()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quest: [{
      id: 1,
      type: 1, //类型，1.单选，2.多选
      question: "1.你有女朋友吗？(单选)",
      answers: [{
                  content: 'A.有'
                }, {
                  content: 'B.没有'
                }]
      }, {
      id: 2,
      type: 1,
      question: "2.目前薪资在哪个范围？(单选)",
      answers: [{
                  content: 'A.3-6k'
                }, {
                  content: 'B.6-8k'
                }, {
                  content: 'C.8-10k'
                }, {
                  content: 'D.10k以上'
                }]
      }, {
      id: 3,
      type: 2,
      question: "3.你喜欢哪一种编程语言？(多选)",
      answers: [{
                  content: 'A.Java'
                }, {
                  content: 'B.C语言'
                }, {
                  content: 'C.PHP'
                }, {
                  content: 'D.Python'
                }, {
                  content: 'E.JavaScript'
                }, {
                  content: 'F.其他'
                }]
    }],
    showNum:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('test_fail')){
      var test_fail = JSON.parse(wx.getStorageSync('test_fail'));
        this.setData({
          quest:test_fail
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
    var i = 0,
      len = this.data.quest.length,
      result = [], 
      once_test=false;
    for (; i < len; i++) {
      var change_v = this.data.quest[i];
      if (change_v.result) {
        once_test=true;
      } else if (!change_v.result && once_test==true){
        wx.setStorageSync('test_fail', JSON.stringify(this.data.quest))
      }
    }
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
  //选择
  answerSelected(e) {
    let outidx = e.currentTarget.dataset.outidx;
    let idx = e.currentTarget.dataset.idx;
    let question = this.data.quest[outidx];
    if (question.type == 1) {
      //单选
      for (let item of question.answers) {
        item.selected = false;
      }
      question.answers[idx].selected = true;
      question.result = [e.currentTarget.dataset.value];
      this.setData({
        quest: this.data.quest
      });
    } else if (question.type == 2) {
      //多选
      question.answers[idx].selected = !question.answers[idx].selected;
      this.setData({
        quest: this.data.quest
      });
      var i = 0,
        len = question.answers.length,
        result = [];
      for(;i<len;i++){
        var change_v = question.answers[i];
        if (change_v.selected == true && !result[change_v.content]){
          result.push(change_v.content)
        }
      }
      question.result = result;
    }
  },
  //上一题
  preQues:function(){
    if (this.data.showNum>0){
      this.setData({
        showNum: this.data.showNum-1
      })
    }
  },
  //下一题
  nextQues: function () {
    var total=this.data.quest.length-1;
    if (this.data.showNum <total){
      this.setData({
        showNum: this.data.showNum + 1
      })
    }
  },
  //提交答案
  subResult:function(){
    var i=0,
        len=this.data.quest.length,
        result=[];
    for(;i<len;i++){
      var change_v = this.data.quest[i];
      if (change_v.result){
       //result[change_v.id] = change_v.result;
        var val={
          "id": change_v.id,
          "result": change_v.result
        };
        result.push(val);
      }else{
        wx.showModal({
          title: '提示',
          content: '请完善答案',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        });
        return false;
      }
    }
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    });
    wx.clearStorage("test_fail")
  }
})