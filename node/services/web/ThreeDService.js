const ThreeDModel = require('../../models/ThreeDModel')
const ThreeDService ={
    getlist:async ({_id})=>{
        return _id?ThreeDModel.find({_id,isPublish:1}):ThreeDModel.find({isPublish:1}) 
    },
}




module.exports =  ThreeDService