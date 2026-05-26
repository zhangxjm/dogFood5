const { Vehicle } = require('../models');

const initVehicles = async () => {
  const count = await Vehicle.count();
  if (count > 0) {
    console.log('Vehicle data already exists, skipping initialization.');
    return;
  }

  const vehicles = [
    {
      name: '面包车',
      size: '2.5×1.5×1.5米',
      capacity: '500kg',
      pricePerKm: 3.00,
      basePrice: 150.00,
      floorPrice: 10.00,
      description: '适合小型搬家，少量家具物品',
      isActive: true
    },
    {
      name: '小型货车',
      size: '3.0×1.8×1.8米',
      capacity: '800kg',
      pricePerKm: 4.50,
      basePrice: 260.00,
      floorPrice: 15.00,
      description: '适合中小型搬家，一般家庭家具',
      isActive: true
    },
    {
      name: '中型货车',
      size: '4.2×2.0×2.0米',
      capacity: '1500kg',
      pricePerKm: 6.00,
      basePrice: 380.00,
      floorPrice: 20.00,
      description: '适合中型搬家，三居室家具',
      isActive: true
    },
    {
      name: '大型货车',
      size: '5.5×2.3×2.3米',
      capacity: '2500kg',
      pricePerKm: 8.00,
      basePrice: 500.00,
      floorPrice: 25.00,
      description: '适合大型搬家，整套家具家电',
      isActive: true
    },
    {
      name: '厢式货车',
      size: '6.8×2.4×2.4米',
      capacity: '3500kg',
      pricePerKm: 10.00,
      basePrice: 680.00,
      floorPrice: 30.00,
      description: '适合大型搬家或公司搬迁',
      isActive: true
    }
  ];

  await Vehicle.bulkCreate(vehicles);
  console.log('Vehicle data initialized successfully.');
};

const initSampleData = async () => {
  const { MoveRequest, MoveRecord, Rating } = require('../models');

  const requestCount = await MoveRequest.count();
  if (requestCount > 0) {
    console.log('Sample data already exists, skipping initialization.');
    return;
  }

  const requests = [
    {
      customerName: '张三',
      phone: '13800138001',
      moveFrom: '北京市朝阳区建国路88号',
      moveTo: '北京市海淀区中关村大街15号',
      moveDate: new Date('2025-06-15'),
      floorFrom: 3,
      floorTo: 6,
      hasElevator: true,
      distance: 15.5,
      description: '沙发、床、衣柜、冰箱、洗衣机',
      status: 'completed'
    },
    {
      customerName: '李四',
      phone: '13800138002',
      moveFrom: '北京市西城区西长安街1号',
      moveTo: '北京市东城区东四十条',
      moveDate: new Date('2025-06-18'),
      floorFrom: 5,
      floorTo: 2,
      hasElevator: false,
      distance: 8.0,
      description: '电视机、餐桌、书柜',
      status: 'completed'
    },
    {
      customerName: '王五',
      phone: '13800138003',
      moveFrom: '北京市丰台区南三环西路',
      moveTo: '北京市通州区新华大街',
      moveDate: new Date('2025-06-20'),
      floorFrom: 1,
      floorTo: 12,
      hasElevator: true,
      distance: 25.0,
      description: '两居室整套家具',
      status: 'confirmed'
    }
  ];

  const createdRequests = await MoveRequest.bulkCreate(requests);
  console.log('Sample move requests created.');

  const records = [
    {
      requestId: createdRequests[0].id,
      vehicleId: 3,
      actualStartTime: new Date('2025-06-15T09:00:00'),
      actualEndTime: new Date('2025-06-15T13:00:00'),
      actualDistance: 16.0,
      totalAmount: 476.00,
      paymentStatus: 'paid',
      remarks: '客户非常满意，准时送达'
    },
    {
      requestId: createdRequests[1].id,
      vehicleId: 2,
      actualStartTime: new Date('2025-06-18T10:00:00'),
      actualEndTime: new Date('2025-06-18T13:30:00'),
      actualDistance: 8.5,
      totalAmount: 343.25,
      paymentStatus: 'paid',
      remarks: '无电梯楼层搬运，工人表现专业'
    }
  ];

  const createdRecords = await MoveRecord.bulkCreate(records);
  console.log('Sample move records created.');

  const ratings = [
    {
      recordId: createdRecords[0].id,
      requestId: createdRequests[0].id,
      overallRating: 5,
      serviceRating: 5,
      timelinessRating: 5,
      careRating: 5,
      comment: '非常专业的搬家服务，师傅们态度很好，物品完好无损，强烈推荐！',
      reviewerName: '张三'
    },
    {
      recordId: createdRecords[1].id,
      requestId: createdRequests[1].id,
      overallRating: 4,
      serviceRating: 5,
      timelinessRating: 4,
      careRating: 4,
      comment: '服务很好，就是稍微晚了一点，整体满意',
      reviewerName: '李四'
    }
  ];

  await Rating.bulkCreate(ratings);
  console.log('Sample ratings created.');
};

const initializeData = async () => {
  try {
    await initVehicles();
    await initSampleData();
    console.log('All data initialization completed.');
  } catch (error) {
    console.error('Data initialization failed:', error.message);
  }
};

module.exports = { initializeData, initVehicles, initSampleData };
