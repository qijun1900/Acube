const ThreeDService = require("../../services/web/ThreeDService");
const ThreeDController ={
    getList:async (req,res)=>{
        const result = await ThreeDService.getlist({_id:req.params.id})
        res.send({
            ActionType: "OK",
            data: result
        })
    }
}

module.exports = ThreeDController