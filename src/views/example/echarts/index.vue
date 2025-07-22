<template>
    <neon-container>
        <template #content>
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">文字描边</h2>
                    <StrokeChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">柱状图</h2>
                    <BarChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">折线图</h2>
                    <LineChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">饼状图</h2>
                    <PieChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">散点图</h2>
                    <ScatterChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">雷达图</h2>
                    <RadarChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">仪表图</h2>
                    <SpeedChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">河流流向图</h2>
                    <RiverChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">漏斗图</h2>
                    <FunnelChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">K线图</h2>
                    <CandlestickChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">旭日图</h2>
                    <SunburstChart />
                </div>
                <div
                    class="border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4 mb-4">
                        柱状图数据集
                    </h2>
                    <DatasetChart />
                </div>
                <div
                    class="col-span-2 md:col-span-3 xl:col-span-2 border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4 mb-4">中国地图</h2>
                    <ChinaChart />
                </div>
                <div
                    class="col-span-2 md:col-span-3 xl:col-span-2 border border-default rounded-md shadow-sm bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4 mb-4">世界地图</h2>
                    <WorldChart />
                </div>
            </div>
        </template>
    </neon-container>
</template>

<script setup>
import StrokeChart from './modules/StrokeChart'
import BarChart from './modules/BarChart'
import LineChart from './modules/LineChart'
import PieChart from './modules/PieChart'
import ScatterChart from './modules/ScatterChart'
import RadarChart from './modules/RadarChart'
import SpeedChart from './modules/SpeedChart'
import RiverChart from './modules/RiverChart'
import FunnelChart from './modules/FunnelChart'
import CandlestickChart from './modules/CandlestickChart'
import SunburstChart from './modules/SunburstChart'
import DatasetChart from './modules/DatasetChart'
import ChinaChart from './modules/ChinaChart'
import WorldChart from './modules/WorldChart'
</script>
