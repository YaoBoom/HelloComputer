require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models/database');

// 引入路由
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const bannerRoutes = require('./routes/banner');
const siteInfoRoutes = require('./routes/siteInfo');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（上传的图片）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 路由
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/siteinfo', siteInfoRoutes);
app.use('/api/upload', uploadRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行中' });
});

// 初始化数据库
db.initDatabase();

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📁 图片访问地址: http://localhost:${PORT}/uploads`);
});
