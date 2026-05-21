const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../database.json');

let dbData = null;

const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    dbData = {
      categories: [],
      products: [],
      sales: []
    };
    
    const cat1 = { id: uuidv4(), name: '食品', description: '宠物主食、零食等' };
    const cat2 = { id: uuidv4(), name: '玩具', description: '宠物玩具、逗猫棒等' };
    const cat3 = { id: uuidv4(), name: '日用品', description: '猫砂、狗窝、食盆等' };
    const cat4 = { id: uuidv4(), name: '医疗保健', description: '药品、保健品等' };
    
    dbData.categories = [cat1, cat2, cat3, cat4];
    
    dbData.products = [
      { id: uuidv4(), name: '皇家猫粮', price: 128.00, stock: 50, CategoryId: cat1.id, description: '优质成猫粮' },
      { id: uuidv4(), name: '顽皮狗罐头', price: 15.90, stock: 100, CategoryId: cat1.id, description: '牛肉味狗罐头' },
      { id: uuidv4(), name: '逗猫棒', price: 19.90, stock: 80, CategoryId: cat2.id, description: '羽毛逗猫棒' },
      { id: uuidv4(), name: '猫砂', price: 29.90, stock: 60, CategoryId: cat3.id, description: '膨润土猫砂' }
    ];
    
    writeDB();
  } else {
    const content = fs.readFileSync(dbPath, 'utf-8');
    dbData = JSON.parse(content);
  }
  return dbData;
};

const writeDB = () => {
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
};

const initDatabase = async () => {
  readDB();
};

const Category = {
  findAll: async () => {
    const data = readDB();
    return data.categories.map(cat => ({
      ...cat,
      Products: data.products.filter(p => p.CategoryId === cat.id)
    }));
  },
  
  findByPk: async (id) => {
    const data = readDB();
    const category = data.categories.find(c => c.id === id);
    if (!category) return null;
    return {
      ...category,
      Products: data.products.filter(p => p.CategoryId === category.id),
      update: async (updateData) => {
        const idx = data.categories.findIndex(c => c.id === id);
        data.categories[idx] = { ...data.categories[idx], ...updateData };
        writeDB();
        return data.categories[idx];
      },
      destroy: async () => {
        data.categories = data.categories.filter(c => c.id !== id);
        writeDB();
      }
    };
  },
  
  create: async (createData) => {
    const data = readDB();
    const category = { id: uuidv4(), ...createData };
    data.categories.push(category);
    writeDB();
    return category;
  }
};

const Product = {
  findAll: async (options = {}) => {
    const data = readDB();
    let products = [...data.products];
    
    if (options.include && options.include === 'Category') {
      products = products.map(p => ({
        ...p,
        Category: data.categories.find(c => c.id === p.CategoryId)
      }));
    }
    
    return products;
  },
  
  findByPk: async (id) => {
    const data = readDB();
    const product = data.products.find(p => p.id === id);
    if (!product) return null;
    return {
      ...product,
      Category: data.categories.find(c => c.id === product.CategoryId),
      update: async (updateData) => {
        const idx = data.products.findIndex(p => p.id === id);
        data.products[idx] = { ...data.products[idx], ...updateData };
        writeDB();
        return data.products[idx];
      },
      destroy: async () => {
        data.products = data.products.filter(p => p.id !== id);
        writeDB();
      }
    };
  },
  
  create: async (createData) => {
    const data = readDB();
    const product = { id: uuidv4(), ...createData };
    data.products.push(product);
    writeDB();
    return product;
  },
  
  getHotProducts: async (limit = 10) => {
    const data = readDB();
    const productSales = {};
    
    data.sales.forEach(sale => {
      if (!productSales[sale.ProductId]) {
        productSales[sale.ProductId] = { totalSold: 0, totalRevenue: 0 };
      }
      productSales[sale.ProductId].totalSold += sale.quantity;
      productSales[sale.ProductId].totalRevenue += sale.totalPrice;
    });
    
    const hotProducts = data.products
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        totalSold: productSales[p.id]?.totalSold || 0,
        totalRevenue: productSales[p.id]?.totalRevenue || 0
      }))
      .filter(p => p.totalSold > 0)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);
    
    return hotProducts;
  }
};

const Sale = {
  findAll: async (options = {}) => {
    const data = readDB();
    let sales = [...data.sales].sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
    
    if (options.include && options.include === 'Product') {
      sales = sales.map(s => ({
        ...s,
        Product: data.products.find(p => p.id === s.ProductId)
      }));
    }
    
    return sales;
  },
  
  findByPk: async (id) => {
    const data = readDB();
    const sale = data.sales.find(s => s.id === id);
    if (!sale) return null;
    return {
      ...sale,
      Product: data.products.find(p => p.id === sale.ProductId)
    };
  },
  
  create: async (createData) => {
    const data = readDB();
    const sale = { id: uuidv4(), saleDate: new Date().toISOString(), ...createData };
    data.sales.push(sale);
    writeDB();
    return {
      ...sale,
      Product: data.products.find(p => p.id === sale.ProductId)
    };
  },
  
  destroy: async (id) => {
    const data = readDB();
    data.sales = data.sales.filter(s => s.id !== id);
    writeDB();
  }
};

const transaction = async (fn) => {
  const data = readDB();
  const originalData = JSON.parse(JSON.stringify(data));
  
  try {
    const result = await fn({
      Product: {
        findByPk: async (id) => {
          const product = data.products.find(p => p.id === id);
          if (!product) return null;
          return {
            ...product,
            update: async (updateData) => {
              const idx = data.products.findIndex(p => p.id === id);
              data.products[idx] = { ...data.products[idx], ...updateData };
              return data.products[idx];
            }
          };
        }
      },
      Sale: {
        create: async (createData) => {
          const sale = { id: uuidv4(), saleDate: new Date().toISOString(), ...createData };
          data.sales.push(sale);
          return sale;
        },
        findByPk: async (id) => data.sales.find(s => s.id === id),
        destroy: async (id) => {
          data.sales = data.sales.filter(s => s.id !== id);
        }
      },
      commit: async () => {
        writeDB();
      },
      rollback: async () => {
        Object.assign(data, originalData);
      }
    });
    return result;
  } catch (error) {
    Object.assign(data, originalData);
    throw error;
  }
};

module.exports = { Category, Product, Sale, initDatabase, transaction };
