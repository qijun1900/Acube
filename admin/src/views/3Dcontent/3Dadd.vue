<template>
    <div>
        <el-page-header content="添加模型" icon="" title="模型管理"></el-page-header>
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
                    添加模型
                    </el-button>
                </el-form-item>
        </el-form> 
    </div>
</template>
<script setup>
import { ref,reactive } from 'vue';
import ModelUpload from '@/components/upload/ModelUpload.vue';
import modelupload from '@/util/modelupload'
import { useRouter } from 'vue-router';


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
            await modelupload("/adminapi/model/add",modelForm)
            router.push('/threeD/modellist')
        }
    })
}



</script>

<style scoped>
.demo-ruleForm{
    margin-top: 40px;
}
</style>