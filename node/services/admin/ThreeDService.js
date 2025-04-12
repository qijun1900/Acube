const ThreeDModel = require('../../models/ThreeDModel')
const ThreeService ={
    add: async ({title,category,isPublish,modeldata,editTime})=>{
        return ThreeDModel.create({
            title,
            category,
            isPublish,
            modeldata,
            editTime
        })
    },
    getlist:async ({_id})=>{
        return _id?ThreeDModel.find({_id}):ThreeDModel.find({})
    },
    publish:async ({_id,isPublish,editTime})=>{
        return ThreeDModel.updateOne({_id},{isPublish,editTime})
    },
    delList: async ({_id})=>{
        return ThreeDModel.deleteOne({_id})
    },
    updatelist: async ({title,category,isPublish,modeldata,editTime,_id})=>{
        if(modeldata){
            return ThreeDModel.updateOne({_id},{
                title,category,isPublish,modeldata,editTime 
            })
        }else{
            return ThreeDModel.updateOne({_id},{
                title,category,isPublish,editTime 
            })
        }
    }
}

module.exports = ThreeService