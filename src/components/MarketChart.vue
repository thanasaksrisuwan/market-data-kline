<template>
    <h1 class="header">btcusdt</h1>
    <div ref="chartContainer" class="chart-container"></div>
</template>

<script>
import { createChart } from 'lightweight-charts';
import { onMounted, onUnmounted, ref, watch } from 'vue';

export default {
    name: 'LightweightChart',
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const chartContainer = ref(null);
        let chart = null;
        let series = null;

        onMounted(() => {
            chart = createChart(chartContainer.value, {
                width: 600,
                height: 300,
                layout: {
                    background: { type: 'solid', color: '#ffffff' },
                    textColor: '#333',
                },
                grid: {
                    vertLines: { color: '#e0e0e0' },
                    horzLines: { color: '#e0e0e0' },
                },
            });

            series = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

            watch(() => props.data, (newData) => {
                series.setData(newData);
                chart.timeScale().fitContent();
            }, { immediate: true });

        });

        onUnmounted(() => {
            if (chart) {
                chart.remove();
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
    width: 600px;
    height: 300px;
}
.header {
    margin: 50px;
}
</style>