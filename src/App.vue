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

    const handleBinanceMessage = (data) => {
      console.log("data:", data);
      if (data && data.k) {
        const transformedData = {
          time: data.k.t / 1000, //time
          open: data.k.o, // open
          high: data.k.h, // high
          low: data.k.l, // low
          close: data.k.c // close
        };
        console.log(transformedData);
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
