const ThreeDService = require("../../services/admin/ThreeDService");

const ThreeDController ={
    add:async (req,res)=>{
        console.log(req.body)
        const modeldata = req.file?`/modeluploads/${req.file.filename}`:""
        const {title,category,isPublish} = req.body
        await ThreeDService.add({
            title,
            category:Number(category),
            isPublish:Number(isPublish),
            modeldata,
            editTime:new Date()
        })
        res.send({
            ActionType: "OK",
        })

    },
    getList:async (req,res)=>{
        const result = await ThreeDService.getlist({_id:req.params.id})
        res.send({
            ActionType: "OK",
            data: result
        })
    },
    publish:async (req,res)=>{
        await ThreeDService.publish({
            ...req.body,
            editTime:new Date()
        })
        res.send({
            ActionType: "OK",
        })
    },
    delList: async (req,res)=>{
        await ThreeDService.delList({_id:req.params.id})
        res.send({
            ActionType: "OK",
        })
    },
    updatelist: async (req,res)=>{
        const modeldata = req.file?`/modeluploads/${req.file.filename}`:""
        const {title,content,category,isPublish,_id } = req.body
        await ThreeDService.updatelist({
            title,
            content,
            category:Number(category),
            isPublish:Number(isPublish),
            modeldata,
            editTime:new Date(),
            _id
        })
        res.send({
            ActionType: "OK",
        })
    }
}


module.exports = ThreeDController