<template>
  <div id="app">
    <MarketChart :data="chartData" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import MarketChart from './components/MarketChart.vue';
import WebSocketService from './services/fetchMarketDataService';

export default {
  name: 'App',
  components: {
    MarketChart
  },
  setup() {
    const chartData = ref([]);

    const handleBinanceMessage = (data) => {
      console.log("data:", data);
      if (data && data.k) {
        const transformedData = {
          time: data.k.t / 1000,
          open: data.k.o,
          high: data.k.h,
          low: data.k.l,
          close: data.k.c
        };
        chartData.value.push(transformedData);
      } else {
        console.error(data);
      }
    };


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

    const binanceWS = new WebSocketService('wss://stream.binance.com:9443/ws/btcusdt@kline_1m', handleBinanceMessage);
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
