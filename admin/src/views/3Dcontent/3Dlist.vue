<template>
    <div>
        <el-page-header content="模型列表" icon="" title="模型管理"></el-page-header>
        <el-card shadow="always" class="box-card">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="title" label="模型名称" />
                <el-table-column  label="分类" >
                    <template #default="scope">
                       {{ categoryFromat(scope.row.category)}}
                    </template>
                </el-table-column>
                <el-table-column  label="更新时间" >
                    <template #default="scope">
                       {{ formatTime.getTime(scope.row.editTime)}}
                    </template>
                </el-table-column>
                <el-table-column  label="是否发布" >
                    <template #default="scope">
                        <el-switch v-model="scope.row.isPublish" 
                        :active-value="1"
                        :inactive-value="0"
                        @change="handleSwitchange(scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button 
                            size="small" 
                            circle
                            :icon="Star"
                            type="success"
                            @click="handlePreviewTresJS(scope.row)">
                        </el-button>
                        <el-button 
                            size="small" 
                            circle
                            :icon="Edit"
                            @click="handleEdit(scope.row)">
                        </el-button>
                        <el-popconfirm 
                            title="你确定要删除吗" 
                            confirm-button-text="确定" 
                            cancel-button-text="取消"
                            @confirm="handleDelete(scope.row)">
                            <template #reference>
                                <el-button 
                                    size="small" 
                                    circle
                                    :icon="Delete"
                                    type="danger"
                                    >
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import formatTime from '@/util/formatTime'
import {Star,Edit,Delete,StarFilled} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const tableData = ref([])
onMounted(() => {
    getTableData()//挂载时候就加载数据
})
const getTableData = async () => {
    const res = await axios.get(`/adminapi/model/list`)
    // console.log(res.data.data)
    tableData.value = res.data.data
   
}
//格式化信息
const categoryFromat = (category)=>{
    const arr =['模型01','模型02','模型03']
    return arr[category-1]
}
//开关回调
const handleSwitchange =async (item)=>{
    console.log(item)
    await axios.put(`/adminapi/model/publish`,{
        _id:item._id,
        isPublish:item.isPublish
    })
    await getTableData()//挂载时候就加载数据
}
//删除回调
const handleDelete = async (item)=>{
    await axios.delete(`/adminapi/model/list/${item._id}`)
    await getTableData()
}
//编辑回调
const handleEdit = (item)=>{
    //跳转到,重新编辑
    router.push(`/model/editmodel/${item._id}`)
}
//预览回调,TresJS
const handlePreviewTresJS = (item)=>{
    router.push(`/model/TresJSPreview/${item._id}`)
}

</script>
<style scoped>
.box-card {
    margin-top: 20px;
    border-radius: 15px;

}
.time{
    font-size: 12px;
    color: rgb(176, 173, 173);
}
::v-deep .content{
    img{
        max-width: 100%;
    }
}
</style>