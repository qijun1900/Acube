const mongoose = require('mongoose')

const MoedlSchema = new mongoose.Schema({
    title: String,
    category:Number,//0,1,2
    modeldata:String,
    isPublish:Number,//0:未发布，1：发布
    editTime:Date,
})

const ThreeDModel  = mongoose.model("model",MoedlSchema)

module.exports = ThreeDModel