const { get, run } = require('./database');

async function initData() {
  const serviceCount = (await get('SELECT COUNT(*) as count FROM services')).count;
  if (serviceCount > 0) {
    console.log('Data already exists, skipping initialization');
    return;
  }

  const services = [
    { name: '绿萝日常养护', description: '专业的绿萝养护服务，包括浇水、修剪、施肥、病虫害防治等', price: 80, duration: 60, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400' },
    { name: '多肉植物养护', description: '多肉植物专属养护，包括换盆、修剪、病虫害防治', price: 100, duration: 45, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400' },
    { name: '发财树养护', description: '发财树专业养护，包括修剪造型、施肥、病虫害防治', price: 150, duration: 90, image: 'https://images.unsplash.com/photo-1602923668104-8f9e03e77e62?w=400' },
    { name: '吊兰养护', description: '吊兰日常养护服务，保持吊兰健康美观', price: 60, duration: 45, image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400' },
    { name: '龟背竹养护', description: '龟背竹专业养护，包括修剪、换盆、施肥', price: 120, duration: 60, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400' },
    { name: '君子兰养护', description: '君子兰专属养护，包括花期管理、病虫害防治', price: 200, duration: 90, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }
  ];

  const insertStmt = 'INSERT INTO services (name, description, price, duration, image) VALUES (?, ?, ?, ?, ?)';
  for (const service of services) {
    await run(insertStmt, [service.name, service.description, service.price, service.duration, service.image]);
  }

  console.log('Sample services initialized successfully');
}

module.exports = { initData };
