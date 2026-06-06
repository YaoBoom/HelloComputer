const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../models/database');

// 获取所有商品（或按分类筛选）
router.get('/', (req, res) => {
  try {
    const { categoryId } = req.query;
    
    let products;
    if (categoryId) {
      products = db.prepare('SELECT * FROM products WHERE categoryId = ? ORDER BY sort ASC, createdAt DESC').all(categoryId);
    } else {
      products = db.prepare('SELECT * FROM products ORDER BY sort ASC, createdAt DESC').all();
    }
    
    // 解析 images JSON 字段
    products = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('获取商品失败:', error);
    res.status(500).json({ success: false, message: '获取商品失败' });
  }
});

// 获取单个商品
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: '商品不存在' });
    }
    
    product.images = product.images ? JSON.parse(product.images) : [];
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('获取商品失败:', error);
    res.status(500).json({ success: false, message: '获取商品失败' });
  }
});

// 创建商品
router.post('/', (req, res) => {
  try {
    const { name, description, price, categoryId, images, sort } = req.body;
    const id = uuidv4();
    
    db.prepare(`
      INSERT INTO products (id, name, description, price, categoryId, images, sort)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, description || '', price || '', categoryId || '', JSON.stringify(images || []), sort || 0);
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    product.images = product.images ? JSON.parse(product.images) : [];
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('创建商品失败:', error);
    res.status(500).json({ success: false, message: '创建商品失败' });
  }
});

// 更新商品
router.put('/:id', (req, res) => {
  try {
    const { name, description, price, categoryId, images, sort } = req.body;
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: '商品不存在' });
    }
    
    db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, categoryId = ?, images = ?, sort = ?
      WHERE id = ?
    `).run(
      name,
      description || '',
      price || '',
      categoryId || existing.categoryId,
      JSON.stringify(images || []),
      sort ?? existing.sort,
      id
    );
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    product.images = product.images ? JSON.parse(product.images) : [];
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('更新商品失败:', error);
    res.status(500).json({ success: false, message: '更新商品失败' });
  }
});

// 删除商品
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: '商品不存在' });
    }
    
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除商品失败:', error);
    res.status(500).json({ success: false, message: '删除商品失败' });
  }
});

module.exports = router;
