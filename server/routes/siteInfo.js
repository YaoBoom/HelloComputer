const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../models/database');

// 获取站点信息
router.get('/', async (req, res) => {
  try {
    const data = readDB();
    res.json({ success: true, data: data.siteInfo });
  } catch (error) {
    console.error('获取站点信息失败:', error);
    res.status(500).json({ success: false, message: '获取站点信息失败' });
  }
});

// 更新站点信息
router.put('/', async (req, res) => {
  try {
    const { name, subtitle, address, phone, douyin, wechat, logo } = req.body;
    
    const data = readDB();
    data.siteInfo = {
      ...data.siteInfo,
      name,
      subtitle,
      address,
      phone,
      douyin,
      wechat,
      logo
    };
    writeDB(data);
    
    res.json({ success: true, data: data.siteInfo });
  } catch (error) {
    console.error('更新站点信息失败:', error);
    res.status(500).json({ success: false, message: '更新站点信息失败' });
  }
});

module.exports = router;
