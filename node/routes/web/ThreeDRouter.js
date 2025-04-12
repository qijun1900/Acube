var express = require('express');
const ThreeeDController = require('../../controllers/web/ThreeeDController');
var ThreeDRouter = express.Router();


//路由
ThreeDRouter.get('/webapi/model/list',ThreeeDController.getList)
ThreeDRouter.get('/webapi/model/list/:id',ThreeeDController.getList)


module.exports = ThreeDRouter; 