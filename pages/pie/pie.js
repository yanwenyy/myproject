import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    // 标题组件，包含主标题和副标题
    title: {
      show: true,
      text: "执行任务",
      x: "center",
      textStyle: {
        fontSize: "15",
        color: "green",
        fontWeight: "bold",
      }


    },
    //  提示框组件
    tooltip: {
      //是否显示提示框组件，包括提示框浮层和 axisPointe
      show: false,
      // 触发类型: item:数据项触发，axis：坐标轴触发
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    // // 图例
    // legend: {
    //     orient: 'vertical',
    //     x: 'left',
    //     data:['完成率']
    // },

    // 系列列表。每个系列通过 type 决定自己的图表类型
    series: [
      {
        // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
        name: '任务进度',
        type: 'pie',
        // 饼图的半径，数组的第一项是内半径，第二项是外半径
        radius: ['50%', '70%'],
        // 是否启用防止标签重叠策略，默认开启
        avoidLabelOverlap: false,
        hoverAnimation: false,
        // 标签的视觉引导线样式，在 label 位置 设置为'outside'的时候会显示视觉引导线
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {   // 数据值
            value: 20,
            // 数据项名称
            name: '完成率',
            //该数据项是否被选中
            selected: false,
            // 单个扇区的标签配置
            label: {
              normal: {
                // 是显示标签
                show: true,
                position: 'center',
                fontSize: 20,
                // 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行
                formatter: '{b}\n{d}%',
              }

            },
            itemStyle:{
              color:'green'
            }
          },
          {
            value: 100,
            label: {
              normal: {
                show: false,

              }
            },
            itemStyle: {
              color: '#f2f2f2'
            }
          },

        ]
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
    }
  },

  onReady() {
  },

  echartInit (e) {
    console.log(e)
    initChart(e.detail.canvas, e.detail.width, e.detail.height);
  }
});
