const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data.json');

// 初始数据结构
const defaultData = {
  categories: [],
  products: [],
  banners: [],
  siteInfo: {
    id: 1,
    name: '哈喽精品数码',
    subtitle: 'DIGITAL HARDWARE SOLUTION',
    address: '',
    phone: '',
    douyin: '',
    wechat: '',
    logo: ''
  }
};

function readDB() {
  try {
    if (!fs.existsSync(dbPath)) {
      return { ...defaultData };
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { ...defaultData };
  }
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function initDatabase() {
  const data = readDB();
  if (!data.siteInfo) {
    writeDB(defaultData);
  }
  console.log('✅ 数据库初始化完成');
}

module.exports = {
  readDB,
  writeDB,
  initDatabase
};
