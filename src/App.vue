<template>
  <div id="app">
    <MarketChart :data="chartData" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import MarketChart from './components/MarketChart.vue';
import fetchMarketDataService from './services/fetchMarketDataService';

export default {
  name: 'App',
  components: {
    MarketChart
  },
  setup() {
    const chartData = ref([]);
    const dataMap = new Map();

    const handleBinanceMessage = (data) => {
      console.log("get data:", data);
      if (data && data.k) {
        const transformedData = {
          time: convertDate(data.k.t / 1000),
          open: parseFloat(data.k.o),
          high: parseFloat(data.k.h),
          low: parseFloat(data.k.l),
          close: parseFloat(data.k.c)
        };

        // Group by time
        dataMap.set(transformedData.time, transformedData);

        // Convert dataMap to sorted array
        const sortedData = Array.from(dataMap.values()).sort((a, b) => new Date(a.time) - new Date(b.time));
        chartData.value = sortedData;
        
      } else {
        console.error('Invalid data:', data);
      }
    };

    function convertDate(timestamp) {
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    // const handleHuobiMessage = (data) => {
    //   const transformedData = data.tick.data.map(item => ({
    //     time: item[0] / 1000, 
    //     open: item[1],
    //     high: item[2],
    //     low: item[3],
    //     close: item[4]
    //   }));
    //   chartData.value = transformedData;
    // };
    const binanceWS = new fetchMarketDataService('wss://stream.binance.com:9443/ws/btcusdt@kline_1m', handleBinanceMessage);
    // const huobiWS = new WebSocketService('wss://api.huobi.pro/ws', handleHuobiMessage);

    onMounted(() => {
      binanceWS.connect();
      // huobiWS.connect();
    });

    onUnmounted(() => {
      binanceWS.disconnect();
      // huobiWS.disconnect();
    });

    return { chartData };
  }
}
</script>
