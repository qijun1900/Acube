var express = require('express');
const ThreeeDController = require('../../controllers/admin/ThreeDController');
var ThreeDRouter = express.Router();
const multer  = require('multer')
const  storage_model = require('../../config/multer.config')//上传模型配置文件（上传源文件）
const upload = multer({storage: storage_model})

//涉及文件上传
ThreeDRouter.post('/adminapi/model/add',upload.single('file'),ThreeeDController.add)
ThreeDRouter.get('/adminapi/model/list',ThreeeDController.getList)
ThreeDRouter.put('/adminapi/model/publish',upload.single('file'),ThreeeDController.publish)
ThreeDRouter.delete('/adminapi/model/list/:id',ThreeeDController.delList)
ThreeDRouter.get('/adminapi/model/list/:id',ThreeeDController.getList)
ThreeDRouter.post('/adminapi/model/list',upload.single('file'),ThreeeDController.updatelist)



module.exports = ThreeDRouter; 