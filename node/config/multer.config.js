const multer = require('multer')
const path = require('path')
const storage_model = multer.diskStorage({
    // 用来配置文件上传的位置
    destination: (req, file, cb) => {
      // 调用 cb 即可实现上传位置的配置
      cb(null, 'public/modeluploads/')
    },
    // 用来配置上传文件的名称（包含后缀）
    filename: (req, file, cb) => {
      //filename 用于确定文件夹中的文件名的确定。 如果没有设置 filename，每个文件将设置为一个随机文件名，并且是没有扩展名的。
      // 获取文件的后缀
      let ext = path.extname(file.originalname)
      // 拼凑文件名
      cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})

module.exports = storage_model
