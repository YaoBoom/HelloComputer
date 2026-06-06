const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../models/database');

// 获取所有商品（或按分类筛选）
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    
    const data = readDB();
    let products = data.products;
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }
    
    products = [...products]
      .sort((a, b) => a.sort - b.sort)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 确保 images 是数组
    products = products.map(p => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : []
    }));
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('获取商品失败:', error);
    res.status(500).json({ success: false, message: '获取商品失败' });
  }
});

// 获取单个商品
router.get('/:id', async (req, res) => {
  try {
    const data = readDB();
    const product = data.products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: '商品不存在' });
    }
    
    res.json({ 
      success: true, 
      data: {
        ...product,
        images: Array.isArray(product.images) ? product.images : []
      }
    });
  } catch (error) {
    console.error('获取商品失败:', error);
    res.status(500).json({ success: false, message: '获取商品失败' });
  }
});

// 创建商品
router.post('/', async (req, res) => {
  try {
    const { name, description, price, categoryId, images, sort } = req.body;
    const product = {
      id: uuidv4(),
      name,
      description: description || '',
      price: price || '',
      categoryId: categoryId || '',
      images: Array.isArray(images) ? images : [],
      sort: sort || 0,
      createdAt: new Date().toISOString()
    };
    
    const data = readDB();
    data.products.push(product);
    writeDB(data);
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('创建商品失败:', error);
    res.status(500).json({ success: false, message: '创建商品失败' });
  }
});

// 更新商品
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, categoryId, images, sort } = req.body;
    const { id } = req.params;
    
    const data = readDB();
    const index = data.products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: '商品不存在' });
    }
    
    data.products[index] = {
      ...data.products[index],
      name,
      description: description || '',
      price: price || '',
      categoryId: categoryId || data.products[index].categoryId,
      images: Array.isArray(images) ? images : data.products[index].images,
      sort: sort ?? data.products[index].sort
    };
    writeDB(data);
    
    res.json({ success: true, data: data.products[index] });
  } catch (error) {
    console.error('更新商品失败:', error);
    res.status(500).json({ success: false, message: '更新商品失败' });
  }
});

// 删除商品
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = readDB();
    const index = data.products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: '商品不存在' });
    }
    
    data.products.splice(index, 1);
    writeDB(data);
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除商品失败:', error);
    res.status(500).json({ success: false, message: '删除商品失败' });
  }
});

module.exports = router;
