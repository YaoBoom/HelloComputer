const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// 配置文件
const USE_OSS = process.env.USE_OSS === 'true';
const OSS_CONFIG = {
  region: process.env.OSS_REGION || 'oss-cn-beijing',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.OSS_BUCKET || ''
};

// 本地存储配置
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: localStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('只支持上传图片文件 (jpeg, jpg, png, gif, webp)'));
  }
});

// 单图上传
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '请选择要上传的图片' });
    }

    let imageUrl;
    
    if (USE_OSS) {
      // 阿里云 OSS 上传
      imageUrl = await uploadToOSS(req.file);
    } else {
      // 本地存储
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({ success: false, message: error.message || '上传失败' });
  }
});

// 多图上传
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: '请选择要上传的图片' });
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    
    const results = req.files.map(file => {
      let url;
      if (USE_OSS) {
        url = file.ossUrl;
      } else {
        url = `${baseUrl}/uploads/${file.filename}`;
      }
      return {
        url,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      };
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({ success: false, message: error.message || '上传失败' });
  }
});

// 阿里云 OSS 上传函数
async function uploadToOSS(file) {
  // 如果没有配置 OSS，返回本地路径
  if (!OSS_CONFIG.accessKeyId || !OSS_CONFIG.bucket) {
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    return `${baseUrl}/uploads/${file.filename}`;
  }

  try {
    const OSS = require('ali-oss');
    const client = new OSS({
      region: OSS_CONFIG.region,
      accessKeyId: OSS_CONFIG.accessKeyId,
      accessKeySecret: OSS_CONFIG.accessKeySecret,
      bucket: OSS_CONFIG.bucket
    });

    const ext = path.extname(file.originalname);
    const objectName = `uploads/${uuidv4()}${ext}`;

    const result = await client.put(objectName, file.path);
    
    // 删除本地临时文件
    fs.unlinkSync(file.path);

    return result.url;
  } catch (error) {
    console.error('OSS 上传失败:', error);
    // OSS 上传失败时返回本地路径作为备选
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    return `${baseUrl}/uploads/${file.filename}`;
  }
}

// 错误处理中间件
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: '文件大小不能超过 10MB' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

module.exports = router;
