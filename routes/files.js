
const express = require('express');
const router = express.Router();
const multer = require('multer');

const fileController = require('../controllers/file_controller');
const upload = multer({dest:'uploads/files/csv/'});

   
router.post('/upload',upload.single('csv'),fileController.fileUpload);
router.get('/delete',fileController.deleteFile);
router.get('/view/:id',fileController.viewFile);

module.exports = router;