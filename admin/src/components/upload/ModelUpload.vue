<template>
  <el-upload
    class="model-uploader"
    :show-file-list="false"
    :auto-upload="false"
    :accept="modelFormats"
    :on-change="handleFileChange"
    :limit="1"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
  >
    <!-- 上传区域 -->
    <div class="upload-content">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        <span>拖放3D文件或<em>点击上传</em></span>
      </div>
    </div>
    
    <template #tip>
      <div class="el-upload__tip">
        支持格式: {{ formattedModelFormats }}，大小不超过{{ maxSize }}MB
      </div>
    </template>
  </el-upload>

  <!-- 显示上传成功的文件名 -->
  <div v-if="uploadedFileName" class="file-success-display">
    <el-icon class="success-icon"><circle-check-filled /></el-icon>
    <span class="file-name">{{ uploadedFileName }}</span>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, computed, ref } from 'vue';
import { UploadFilled, CircleCheckFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelPath: String,        // 接收已有模型路径
  maxSize: {                // 文件大小限制
    type: Number,
    default: 10
  }
});

// 支持的3D模型格式
const modelFormats = '.glb,.gltf,.fbx,.obj,.stl,.dae';

// 格式化显示的支持格式
const formattedModelFormats = computed(() => {
  return modelFormats.split(',').join(',').replace(/\./g, '');
});

const emit = defineEmits(['fileChange']);
const uploadedFileName = ref('');

const handleFileChange = (file) => {
  if (validateFile(file)) {
    uploadedFileName.value = file.name;
    emit('fileChange', file.raw);
  }
};

const uploaModel = computed(() =>
  props.modelPath.includes('blob')
    ? props.modelPath
    : 'http://47.95.37.174:3000' + props.modelPath
);

// 文件验证方法
const validateFile = (file) => {
  const isValidFormat = modelFormats
    .split(',')
    .some(format => file.name.toLowerCase().endsWith(format.replace('.', '')));
  
  const isValidSize = file.size / 1024 / 1024 < props.maxSize;

  if (!isValidFormat) {
    ElMessage.error('不支持的文件格式');
    return false;
  }

  if (!isValidSize) {
    ElMessage.error(`文件大小不能超过${props.maxSize}MB`);
    return false;
  }

  return true;
};
</script>
<style scoped lang="scss">
.model-uploader {
max-width: 600px;
margin: 20px auto;

:deep(.el-upload) {
  width: 100%;
  
  &:hover {
    .upload-content {
      border-color: var(--el-color-primary);
      background-color: rgba(var(--el-color-primary-rgb), 0.05);
    }
  }
}

.upload-content {
  position: relative;
  width: 100%;
  padding: 40px;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
  background-color: var(--el-fill-color-light);

  .el-icon--upload {
    font-size: 48px;
    color: var(--el-text-color-secondary);
    margin-bottom: 16px;
  }

  .el-upload__text {
    font-size: 14px;
    color: var(--el-text-color-regular);

    em {
      color: var(--el-color-primary);
      font-style: normal;
      font-weight: 500;
      margin-left: 4px;
    }
  }
}

.el-upload__tip {
  margin-top: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: center;
}
}

.file-success-display {
display: flex;
align-items: center;
justify-content: center;
margin-top: 15px;
padding: 8px 16px;
background-color: #f0f9eb;
border-radius: 4px;
max-width: 600px;
margin-left: auto;
margin-right: auto;
border: 1px solid #e1f3d8;

.success-icon {
  color: #67c23a;
  margin-right: 8px;
  font-size: 16px;
}

.file-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
}
</style>