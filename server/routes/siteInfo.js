const express = require('express');
const router = express.Router();
const { db } = require('../models/database');

// 获取站点信息
router.get('/', (req, res) => {
  try {
    const siteInfo = db.prepare('SELECT * FROM site_info WHERE id = 1').get();
    res.json({ success: true, data: siteInfo });
  } catch (error) {
    console.error('获取站点信息失败:', error);
    res.status(500).json({ success: false, message: '获取站点信息失败' });
  }
});

// 更新站点信息
router.put('/', (req, res) => {
  try {
    const { name, subtitle, address, phone, douyin, wechat, logo } = req.body;
    
    db.prepare(`
      UPDATE site_info 
      SET name = ?, subtitle = ?, address = ?, phone = ?, douyin = ?, wechat = ?, logo = ?
      WHERE id = 1
    `).run(name, subtitle, address, phone, douyin, wechat, logo);
    
    const siteInfo = db.prepare('SELECT * FROM site_info WHERE id = 1').get();
    res.json({ success: true, data: siteInfo });
  } catch (error) {
    console.error('更新站点信息失败:', error);
    res.status(500).json({ success: false, message: '更新站点信息失败' });
  }
});

module.exports = router;
