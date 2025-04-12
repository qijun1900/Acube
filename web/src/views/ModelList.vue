<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <div class="search-container">
      <div class="search">
        <el-popover placement="bottom" title="检索结果" width="50%" :visible="visible" :show-arrow="false">
          <template #reference>
            <el-input v-model="searchText" style="width: 100%" size="large" placeholder="请输入内容" :prefix-icon="Search"
              type="search" @input="visible = true" @blur="visible = false" />
          </template>
          <div v-if=" searchlist.length" class="search-results">
            <div v-for="data in searchlist" :key="data._id" class="result-item" @click="handleDetail(data._id)">
              {{ data.title }}
            </div>
          </div>
          <div v-else>
            <el-empty description="空空如也" :image-size="50" />
          </div>
        </el-popover>
      </div>
    </div>
    <div class="tabList">
      <el-tabs v-model="whichTab" class="custom-tabs">
        <el-tab-pane v-for="item in tabList" :key="item._id" :label="item.label" :name="item.name">
          <el-row :gutter="20" class="model-grid">
            <el-col v-for="data in tabnews[item.name]" :key="data._id" :xs="24" :sm="12" :md="8" :lg="6"
              class="card-col">
              <el-card shadow="hover" class="model-card" @click="handleDetail(data._id)">
                <div class="cover-image">
                  <img v-if="data.cover" :src="data.cover" alt="cover">
                  <div v-else class="default-cover">
                    <el-icon :size="40">
                      <Picture />
                    </el-icon>
                  </div>
                </div>
                <div class="card-content">
                  <div class="meta-info">
                    <el-text type="info" size="small" class="date-text">
                      <el-icon>
                        <Clock />
                      </el-icon>
                      {{ moment(data.createTime).format("YYYY-MM-DD") }}
                    </el-text>
                    <el-button type="primary" size="small" @click="handleDetail(data._id)" class="action-btn">
                      立即查看
                    </el-button>
                  </div>
                  <el-text class="model-title" truncated>
                    {{ data.title }}
                  </el-text>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup>
import { Search, Picture, Clock } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'vue-router'
import _ from 'lodash'

const searchText = ref('')
const visible = ref(false)
const modelList = ref([])
moment.locale("zh-cn")
const router = useRouter()
const whichTab = ref(1)

onMounted(async () => {
  const res = await axios.get("/webapi/model/list")
  modelList.value = res.data.data
})

const searchlist = computed(() => {
  return searchText.value ? modelList.value.filter(item => item.title?.includes(searchText.value)) : []
})//安全访问嵌套属性：当 item.title 为 null 或 undefined 时，阻止继续访问 includes 方法

const tabnews = computed(() => _.groupBy(modelList.value, item => item.category))

const handleDetail = (id) => {
  router.push(`/model/${id}`)
}

const tabList = [
  { label: '模型01', name: 1 },
  { label: '模型02', name: 2 },
  { label: '模型03', name: 3 }
]
</script>

<style scoped>
.container {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 0;
}

.search-container {
  max-width: 800px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

.search :deep(.el-input__wrapper) {
  border-radius: 30px;
  padding: 8px 20px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
}

.search :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
}

.result-item:hover {
  background-color: #f1f5f9;
}

.custom-tabs {
  --el-color-primary: #6366f1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.model-card {
  cursor: pointer;
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.model-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.cover-image {
  height: 200px;
  background-color: #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cover-image:hover img {
  transform: scale(1.05);
}

.default-cover {
  color: #94a3b8;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card-content {
  padding: 16px 0 0;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.date-text {
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.model-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.action-btn {
  background-color: #6366f1;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
}

.model-grid {
  margin-top: 20px;
}

.card-col {
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .container {
    padding: 20px 0;
  }

  .cover-image {
    height: 160px;
  }
}
</style>