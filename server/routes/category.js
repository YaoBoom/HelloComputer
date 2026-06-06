const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../models/database');

// 获取所有分类
router.get('/', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY sort ASC, createdAt ASC').all();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ success: false, message: '获取分类失败' });
  }
});

// 获取单个分类
router.get('/:id', (req, res) => {
  try {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
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
router.post('/', (req, res) => {
  try {
    const { name, icon, sort } = req.body;
    const id = uuidv4();
    
    db.prepare('INSERT INTO categories (id, name, icon, sort) VALUES (?, ?, ?, ?)')
      .run(id, name, icon || '', sort || 0);
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({ success: false, message: '创建分类失败' });
  }
});

// 更新分类
router.put('/:id', (req, res) => {
  try {
    const { name, icon, sort } = req.body;
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    
    db.prepare('UPDATE categories SET name = ?, icon = ?, sort = ? WHERE id = ?')
      .run(name, icon || '', sort ?? existing.sort, id);
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({ success: false, message: '更新分类失败' });
  }
});

// 删除分类
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({ success: false, message: '删除分类失败' });
  }
});

module.exports = router;
