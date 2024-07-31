<template>
    <div ref="chartContainer" class="chart-container"></div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  import { createChart } from 'lightweight-charts';
  
  export default {
    name: 'MarketChart',
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    setup(props) {
      const chartContainer = ref(null);
      let chart = null;
      let series = null;
  
      onMounted(() => {
        chart = createChart(chartContainer.value, {
          width: chartContainer.value.clientWidth,
          height: chartContainer.value.clientHeight
        });
  
        series = chart.addCandlestickSeries({
          upColor: 'green',
          borderUpColor: 'green',
          wickUpColor: 'green',
          downColor: 'red',
          borderDownColor: 'red',
          wickDownColor: 'red'
        });
  
        if (props.data.length > 0) {
          series.setData(props.data);
        }
      });
  
      return {
        chartContainer
      };
    }
  }
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  </style>
  