const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../models/database');

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const data = readDB();
    const categories = data.categories
      .sort((a, b) => a.sort - b.sort)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ success: false, message: '获取分类失败' });
  }
});

// 获取单个分类
router.get('/:id', async (req, res) => {
  try {
    const data = readDB();
    const category = data.categories.find(c => c.id === req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ success: false, message: '获取分类失败' });
  }
});

// 创建分类
router.post('/', async (req, res) => {
  try {
    const { name, icon, sort } = req.body;
    const category = {
      id: uuidv4(),
      name,
      icon: icon || '',
      sort: sort || 0,
      createdAt: new Date().toISOString()
    };
    
    const data = readDB();
    data.categories.push(category);
    writeDB(data);
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({ success: false, message: '创建分类失败' });
  }
});

// 更新分类
router.put('/:id', async (req, res) => {
  try {
    const { name, icon, sort } = req.body;
    const { id } = req.params;
    
    const data = readDB();
    const index = data.categories.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    
    data.categories[index] = {
      ...data.categories[index],
      name,
      icon: icon || '',
      sort: sort ?? data.categories[index].sort
    };
    writeDB(data);
    
    res.json({ success: true, data: data.categories[index] });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({ success: false, message: '更新分类失败' });
  }
});

// 删除分类
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = readDB();
    const index = data.categories.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    
    data.categories.splice(index, 1);
    data.products = data.products.filter(p => p.categoryId !== id);
    writeDB(data);
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({ success: false, message: '删除分类失败' });
  }
});

module.exports = router;
