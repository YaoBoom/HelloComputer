const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../models/database');

// 获取所有轮播图
router.get('/', async (req, res) => {
  try {
    const data = readDB();
    const banners = data.banners
      .sort((a, b) => a.sort - b.sort)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('获取轮播图失败:', error);
    res.status(500).json({ success: false, message: '获取轮播图失败' });
  }
});

// 创建轮播图
router.post('/', async (req, res) => {
  try {
    const { title, imageUrl, link, sort } = req.body;
    const banner = {
      id: uuidv4(),
      title: title || '',
      imageUrl: imageUrl || '',
      link: link || '',
      sort: sort || 0,
      createdAt: new Date().toISOString()
    };
    
    const data = readDB();
    data.banners.push(banner);
    writeDB(data);
    
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    console.error('创建轮播图失败:', error);
    res.status(500).json({ success: false, message: '创建轮播图失败' });
  }
});

// 更新轮播图
router.put('/:id', async (req, res) => {
  try {
    const { title, imageUrl, link, sort } = req.body;
    const { id } = req.params;
    
    const data = readDB();
    const index = data.banners.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: '轮播图不存在' });
    }
    
    data.banners[index] = {
      ...data.banners[index],
      title,
      imageUrl: imageUrl || '',
      link: link || '',
      sort: sort ?? data.banners[index].sort
    };
    writeDB(data);
    
    res.json({ success: true, data: data.banners[index] });
  } catch (error) {
    console.error('更新轮播图失败:', error);
    res.status(500).json({ success: false, message: '更新轮播图失败' });
  }
});

// 删除轮播图
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = readDB();
    const index = data.banners.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: '轮播图不存在' });
    }
    
    data.banners.splice(index, 1);
    writeDB(data);
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除轮播图失败:', error);
    res.status(500).json({ success: false, message: '删除轮播图失败' });
  }
});

module.exports = router;
