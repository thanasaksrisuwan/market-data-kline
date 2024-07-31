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
      // Assuming data contains an array of candlestick data
      // Modify according to the actual data structure
      chartData.value = data.k; // Adjust based on the actual response format
    };

    const handleHuobiMessage = (data) => {
      // Assuming data contains candlestick data
      // Modify according to the actual data structure
      chartData.value = data.tick; // Adjust based on the actual response format
    };

    const binanceWS = new WebSocketService('wss://stream.binance.com:9443/ws/btcusdt@kline_1m', handleBinanceMessage);
    const huobiWS = new WebSocketService('wss://api.huobi.pro/ws', handleHuobiMessage);

    onMounted(() => {
      binanceWS.connect();
      huobiWS.connect();
    });

    onUnmounted(() => {
      binanceWS.disconnect();
      huobiWS.disconnect();
    });

    return { chartData };
  }
}
</script>
