<template>
  <!-- 当model存在时，渲染3D模型 -->
  <primitive v-if="model" :object="model" />
</template>

<script setup>
// Vue相关导入
import {defineProps,watchEffect,shallowRef,ref,defineExpose} from 'vue'
import { useFBX } from '@tresjs/cientos'
import { useLoader } from '@tresjs/core'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'


// 定义组件props，接收模型URL
const props = defineProps({
  modeldataurl: String,
});

// 使用shallowRef创建模型引用，避免深度响应式带来的性能问题
const model = shallowRef(null)
// 添加一个响应式变量保存初始缩放比例
const initialScale = ref(1)

watchEffect(async () => {
  if(!props.modeldataurl) return

  const url = `http://47.95.37.174:3000${props.modeldataurl}`
  const extension = url.split('.').pop().toLowerCase()
  
  try {
    if(extension === 'fbx') {
      model.value = await useFBX(url)
      // 记录初始缩放值
      initialScale.value = 0.01
      model.value.scale.set(initialScale.value, initialScale.value, initialScale.value)
    } else if(extension === 'glb' || extension === 'gltf') {
      const { scene } = await useLoader(GLTFLoader, url)
      initialScale.value = 1
      scene.scale.set(initialScale.value, initialScale.value, initialScale.value)
      model.value = scene
    }
    
    if(model.value) {
      model.value.position.set(0, Math.max(0, 1), 0)
    }
  } catch (error) {
    console.error('模型加载失败:', error)
    model.value = null
  }
})

// 添加缩放控制方法
// 修改updateTransform方法
const updateTransform = (position, scale) => {
  if (model.value) {
    const baseScale = initialScale.value;
    const adjustedScale = Math.max(0.1, Math.min(20, scale));
    
    // 确保缩放应用在三个轴上
    model.value.scale.set(
      baseScale * adjustedScale,
      baseScale * adjustedScale,
      baseScale * adjustedScale
    );
    
    // 使用Math.max确保Y轴最小为0
    model.value.position.set(
      position[0],
      Math.max(0, position[1]),  // 防止模型沉入地下
      position[2]
    );
  }
};

// 暴露方法给父组件
defineExpose({
  updateTransform
});
</script>