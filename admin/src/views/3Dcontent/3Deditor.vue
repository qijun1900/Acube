<template>
    <div>
        <el-page-header content="编辑模型" title="模型管理" @back="handleBack()"></el-page-header>
        <el-form
            ref="modelFormRef"
            :model="modelForm"
            :rules="modelFormrules"
            label-width="auto"
            class="demo-ruleForm">
                <el-form-item 
                    label="模型名称：" 
                    prop="title">
                    <el-input v-model="modelForm.title" />
                </el-form-item>
                <el-form-item 
                    label="分类选择：" 
                    prop="category">
                        <el-select
                            v-model="modelForm.category"
                            placeholder="Select">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                        </el-select>
                </el-form-item>
                <el-form-item 
                    label="模型上传：" 
                    prop="modeldata">
                    <ModelUpload
                    :model='modelForm.modeldata'
                    @fileChange="handleChange"/> 
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" 
                    @click="submitForm" 
                    class="login-button">
                    更新模型
                    </el-button>
                </el-form-item>
        </el-form> 
    </div>
</template>
<script setup>
import { ref,reactive,onMounted } from 'vue';
import ModelUpload from '@/components/upload/ModelUpload.vue';
import modelupload from '@/util/modelupload'
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute()
const router = useRouter()
const modelFormRef = ref()
const modelForm  = reactive({
    title:"",
    category:1,//1:最新动态，2典型案例，3通知公告
    modeldata:"",
    file:null,
    isPublish:0//0:未发布，1：发布
})
const modelFormrules = reactive({
    title:[
        {
        required: true,
        message: '请输入标题', 
        trigger: 'blur'
        }
    ],
    category:[
        {
        required: true,
        message: '请选择分类', 
        trigger: 'blur'      
        }
    ],
    modeldata:[
        {
        required: true,
        message: '请选择文件', 
        trigger: 'blur'      
        }
    ],

})

//类别选择字段
const options = [
    {
        label:'模型列表1',
        value:1
    },
    {
        label:'模型列表2',
        value:2
    },
    {
        label:'模型列表3',
        value:3
    },
]
const handleChange = (file)=>{
    modelForm.modeldata= URL.createObjectURL(file)
    modelForm.file = file
}
const submitForm = ()=>{
    modelFormRef.value.validate( async(valid)=>{
        if(valid){
            console.log(modelForm)
            await modelupload("/adminapi/model/list",modelForm)
            router.push('/threeD/modellist')
        }
    })
}

//返回事件
const  handleBack = ()=>{
    router.back() 
}

//取当前页面数据
onMounted(async ()=>{
    const res = await axios.get(`adminapi/model/list/${route.params.id}`)
    console.log(res.data.data[0])
    Object.assign(modelForm,res.data.data[0])
})

</script>

<style scoped>
.demo-ruleForm{
    margin-top: 40px;
}
</style>