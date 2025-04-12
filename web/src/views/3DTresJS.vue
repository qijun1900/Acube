<template>
  <div class="page-container">
    <el-page-header 
      class="page-header"
      content="模型预览" 
      title="模型详情" 
      @back="handleBack"
    >
      <template #extra>
        <el-text type="info">ID: {{ modelInfo._id }}</el-text>
      </template>
    </el-page-header>

    <el-row :gutter="15" class="main-content">
      <el-col :span="15">
        <div class="canvas-container">
          <TresCanvas 
            :clear-color="backgroundColor" 
            preset="realistic"
            tone-mapping="ACESFilmic" 
            :shadows="true"
            :alpha="false"
            :shadow-map-soft="true"
            :ambient-occlusion="true"
            :antialias="true"
            :physically-correct-lights="true"
            output-color-space="srgb"  
            :exposure="1.2"
          >
            <TresPerspectiveCamera :position="cameraPosition" />
            <OrbitControls />
            <TresGridHelper 
              v-if="showGrid" 
              :args="gridArgs"
              :key="`grid-${gridArgs[0]}-${gridArgs[1]}`" 
            />
            <TresAxesHelper 
              v-if="showAxes" 
              :args="axesArgs"
              :key="`axes-${axesArgs[0]}`"  
            />
            <TresAmbientLight :intensity="LightIntensity" />
            <Suspense>
              <ModelLoad
                ref="modelLoadRef"
                v-if="modeldataurl"
                :modeldataurl="modeldataurl"/>
            </Suspense>
          </TresCanvas>
        </div>
      </el-col>
      
      <el-col :span="9">
        <div class="control-panel">
          <el-card shadow="hover" class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon><Setting /></el-icon>
                <span>参数调节</span>
              </div>
            </template>
            <div class="pane-container" ref="paneContainer"></div>
          </el-card>

          <el-card shadow="hover" class="info-card">
            <template #header>
              <div class="card-header">
                <el-icon><InfoFilled /></el-icon>
                <span>模型信息</span>
              </div>
            </template>
            <el-descriptions :column="1">
              <el-descriptions-item label="模型名称">
                <el-tag effect="dark" type="info">{{ modelInfo.title }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="模型分类">
                <el-tag :type="['','success','warning'][modelInfo.category-1]" effect="light">
                  {{ categoryFromat(modelInfo.category) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                <el-text type="info">{{ formatTime.getTime(modelInfo.time) }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="模型尺寸">
                <el-text>{{ modelInfo.size || '--' }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// 保持原有script代码不变
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { useRouter } from 'vue-router';
import ModelLoad from '@/components/TresJS/ModelLoad.vue';
import { onMounted, ref, watchEffect } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { Pane } from 'tweakpane';
import formatTime from '@/util/formatTime'
import { Setting, InfoFilled } from '@element-plus/icons-vue'

const router = useRouter();
const route = useRoute()
const modeldataurl = ref('')
const paneContainer = ref(null)
const backgroundColor = ref("#d6f7ef")
const showGrid = ref(true)
const showAxes = ref(true)
const LightIntensity = ref(0.5)
const modelInfo = ref({})
const cameraPosition = ref([0, 2, 10])
const gridArgs = ref([15, 15])
const axesArgs = ref([50])
const modelPosition = ref([0, 1, 0]);
const modelScale = ref(1);
const modelLoadRef = ref(null);

onMounted(async() => {
  const res = await axios.get(`webapi/model/list/${route.params.id}`)
  modeldataurl.value = res.data.data[0].modeldata
  modelInfo.value = res.data.data[0]
  
  if (paneContainer.value) {
    // 在PARAMS对象中修改初始值
    const PARAMS = {
      背景颜色: '#d6f7ef',
      显示网格: true,
      显示坐标轴: true,
      环境灯光强度: 0.5,
      相机位置X: 0,
      相机位置Y: 2,
      相机位置Z: 10,
      网格尺寸: 15,
      网格分段数: 15,
      坐标轴尺寸: 20,
      模型缩放: 1 , // 这个1代表初始比例系数
      缩放比例: 1.0,    // 新增缩放参数
      缩放位置X: 0,        // 新增位置参数
      缩放位置Y: 1,
      缩放位置Z: 0
    };
    

    const pane = new Pane({
      container: paneContainer.value,
      title: '调整参数面板',
    });
    
    // 相机位置控制也需要同样处理
    pane.addBinding(PARAMS, '相机位置X', { min: -20, max: 20, step: 1 })
      .on('change', (ev) => {
        cameraPosition.value = [ev.value, cameraPosition.value[1], cameraPosition.value[2]]
      });
    pane.addBinding(PARAMS, '相机位置Y', { min: -20, max: 20, step: 1 })
      .on('change', (ev) => {
        cameraPosition.value = [cameraPosition.value[0], ev.value, cameraPosition.value[2]]
      });
    pane.addBinding(PARAMS, '相机位置Z', { min: -20, max: 20, step: 1 })
      .on('change', (ev) => {
        cameraPosition.value = [cameraPosition.value[0], cameraPosition.value[1], ev.value]
      });

    pane.addBinding(PARAMS, '背景颜色', {
      picker: 'inline',
      expanded: true,
    }).on('change', (ev) => {
      backgroundColor.value = ev.value;});

    // 网格参数控制
    pane.addBinding(PARAMS, '显示网格')
      .on('change', (ev) => showGrid.value = ev.value);
    pane.addBinding(PARAMS, '网格尺寸', { min: 1, max: 100, step: 1 })
      .on('change', (ev) => {
        gridArgs.value = [ev.value, gridArgs.value[1]] // 创建新数组
      });
    pane.addBinding(PARAMS, '网格分段数', { min: 1, max: 100, step: 1 })
      .on('change', (ev) => {
        gridArgs.value = [gridArgs.value[0], ev.value] // 创建新数组
      });

    // 坐标轴参数控制
    pane.addBinding(PARAMS, '显示坐标轴')
      .on('change', (ev) => showAxes.value = ev.value);
    pane.addBinding(PARAMS, '坐标轴尺寸', { min: 1, max: 100, step: 1 })
      .on('change', (ev) => {
        axesArgs.value = [ev.value] // 创建新数组
      });
      
    // 环境灯光强度控制
    pane.addBinding(PARAMS, '环境灯光强度', { min: 0, max: 1, step: 0.01 })
    .on('change', (ev) => LightIntensity.value = ev.value);
    
    // 添加缩放控制
      pane.addBinding(PARAMS, '缩放比例', {
        min: 0.1,
        max: 20,
        step: 0.1
      }).on('change', (ev) => {
        modelLoadRef.value?.updateTransform(
          [PARAMS.缩放位置X, PARAMS.缩放位置Y, PARAMS.缩放位置Z],
          ev.value
        );
      });

      // 添加缩放后位置控制
      const folder = pane.addFolder({ title: '位置调整' });
      folder.addBinding(PARAMS, '缩放位置X', { min: -5, max: 5, step: 0.1 });
      folder.addBinding(PARAMS, '缩放位置Y', { min: -20, max: 20, step: 0.1 });
      folder.addBinding(PARAMS, '缩放位置Z', { min: -5, max: 5, step: 0.1 });
      folder.on('change', () => {
        modelLoadRef.value?.updateTransform(
          [PARAMS.缩放位置X, PARAMS.缩放位置Y, PARAMS.缩放位置Z],
          PARAMS.缩放比例
        );
      });
  }
})

//返回事件
const  handleBack = ()=>{
    router.back() 
}

//格式化信息
const categoryFromat = (category)=>{
    const arr =['模型列表01','模型列表02','模型列表03']
    return arr[category-1]
}

// 添加监听器同步参数到子组件
watchEffect(() => {
  if (modelLoadRef.value) {
    modelLoadRef.value.updateTransform(modelPosition.value, modelScale.value);
  }
});


</script>

<style scoped>
.container {
  height: calc(100vh - 220px); /* 根据视口高度自适应 */
  position: relative;
  margin-top: 20px;
}

.el-row {
  height: 100vh;
  overflow: hidden; /* 禁止整个页面滚动 */
}

.el-col-9 {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px); /* 留出顶部导航空间 */
}

.el-card {
  margin-top: 20px;
  border-radius: 15px;
}

.el-card:first-child {
  flex: 1; /* 参数面板区域自动填充剩余空间 */
  min-height: 300px; /* 最小高度保证 */
  display: flex;
  flex-direction: column;
}

/* 为pane容器添加样式 */
.pane-container {
  padding: 2px;
  height: 260px; /* 设置一个固定高度或根据需求调整 */
  overflow: auto; /* 如果内容过多可以滚动 */
}

/* 调整Tweakpane的样式 */
:deep(.tp-dfwv) {
  width: 100% !important;
  background: var(--el-bg-color-overlay) !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.tp-lblv_l) {
  color: var(--el-text-color-regular) !important;
}

.page-container {
  padding: 20px;
  background: #f8fafc;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.canvas-container {
  height: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
}

.control-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}



.settings-card:hover,
.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #6366f1;
}

.pane-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.info-card :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
}

:deep(.el-descriptions__label) {
  width: 80px;
  justify-content: flex-end;
  color: #64748b;
}

:deep(.el-card__header) {
  background: linear-gradient(45deg, #f8fafc, #ffffff);
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

:deep(.tp-dfwv) {
  --tw-shadow: 0 1px 2px rgba(0,0,0,0.05);
  box-shadow: var(--tw-shadow);
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px;
}

:deep(.tp-lblv_l) {
  font-size: 13px !important;
  color: #475569 !important;
}
</style>

