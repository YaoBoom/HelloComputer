const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data.db');
const db = new Database(dbPath);

// 启用外键约束
db.pragma('foreign_keys = ON');

function initDatabase() {
  // 创建分类表
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      sort INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建商品表
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price TEXT,
      categoryId TEXT,
      images TEXT,
      sort INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // 创建轮播图表
  db.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      title TEXT,
      imageUrl TEXT,
      link TEXT,
      sort INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建设置表
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_info (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT DEFAULT '哈喽精品数码',
      subtitle TEXT DEFAULT 'DIGITAL HARDWARE SOLUTION',
      address TEXT,
      phone TEXT,
      douyin TEXT,
      wechat TEXT,
      logo TEXT
    )
  `);

  // 插入默认站点信息（如果不存在）
  const existing = db.prepare('SELECT * FROM site_info WHERE id = 1').get();
  if (!existing) {
    db.prepare(`
      INSERT INTO site_info (id, name, subtitle) VALUES (1, '哈喽精品数码', 'DIGITAL HARDWARE SOLUTION')
    `).run();
  }

  console.log('✅ 数据库初始化完成');
}

module.exports = {
  db,
  initDatabase
};
