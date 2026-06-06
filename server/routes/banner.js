const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../models/database');

// 获取所有轮播图
router.get('/', (req, res) => {
  try {
    const banners = db.prepare('SELECT * FROM banners ORDER BY sort ASC, createdAt ASC').all();
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('获取轮播图失败:', error);
    res.status(500).json({ success: false, message: '获取轮播图失败' });
  }
});

// 创建轮播图
router.post('/', (req, res) => {
  try {
    const { title, imageUrl, link, sort } = req.body;
    const id = uuidv4();
    
    db.prepare('INSERT INTO banners (id, title, imageUrl, link, sort) VALUES (?, ?, ?, ?, ?)')
      .run(id, title || '', imageUrl || '', link || '', sort || 0);
    
    const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    console.error('创建轮播图失败:', error);
    res.status(500).json({ success: false, message: '创建轮播图失败' });
  }
});

// 更新轮播图
router.put('/:id', (req, res) => {
  try {
    const { title, imageUrl, link, sort } = req.body;
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: '轮播图不存在' });
    }
    
    db.prepare('UPDATE banners SET title = ?, imageUrl = ?, link = ?, sort = ? WHERE id = ?')
      .run(title, imageUrl || '', link || '', sort ?? existing.sort, id);
    
    const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);
    res.json({ success: true, data: banner });
  } catch (error) {
    console.error('更新轮播图失败:', error);
    res.status(500).json({ success: false, message: '更新轮播图失败' });
  }
});

// 删除轮播图
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: '轮播图不存在' });
    }
    
    db.prepare('DELETE FROM banners WHERE id = ?').run(id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除轮播图失败:', error);
    res.status(500).json({ success: false, message: '删除轮播图失败' });
  }
});

module.exports = router;
