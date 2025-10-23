import * as echarts from 'echarts'

export function useSalesTrendChart(data: { days: string[]; values: number[] }) {
  const option: echarts.EChartsOption = {
    title: {
      text: '销售趋势',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}：￥{c}',
    },
    grid: { left: '8%', right: '8%', bottom: '8%', top: '15%' },
    xAxis: {
      type: 'category',
      data: data.days,
      axisLine: { lineStyle: { color: '#ccc' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '销售额（￥）',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#eee' } },
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: data.values,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#5B8FF9' },
            { offset: 1, color: 'rgba(91, 143, 249, 0.1)' },
          ]),
        },
        lineStyle: { width: 2, color: '#5B8FF9' },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  }

  return option
}
