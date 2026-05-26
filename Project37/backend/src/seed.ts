import { DataSource, DataSourceOptions } from 'typeorm';
import { FitnessPlan } from './entities/fitness-plan.entity';
import { CheckIn } from './entities/check-in.entity';
import { format, subDays } from 'date-fns';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'fitness_db',
  entities: [FitnessPlan, CheckIn],
  synchronize: true,
} as DataSourceOptions);

async function seed() {
  await dataSource.initialize();
  console.log('Seeding database...');

  const planRepository = dataSource.getRepository(FitnessPlan);
  const checkInRepository = dataSource.getRepository(CheckIn);

  const existingPlans = await planRepository.find();
  if (existingPlans.length > 0) {
    console.log('Database already seeded. Skipping...');
    await dataSource.destroy();
    return;
  }

  const fitnessPlans = [
    {
      name: '入门燃脂计划',
      description: '适合初学者的全身燃脂训练方案，包含基础有氧和力量训练',
      duration: 30,
      exercises: ['快走', '慢跑', '深蹲', '俯卧撑', '平板支撑'],
      frequencyPerWeek: 3,
      difficulty: 'beginner',
      isActive: true,
    },
    {
      name: '增肌塑形计划',
      description: '针对主要肌群的力量训练，帮助增加肌肉量和塑形',
      duration: 45,
      exercises: ['卧推', '硬拉', '引体向上', '肩推', '弯举'],
      frequencyPerWeek: 4,
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      name: 'HIIT高强度间歇',
      description: '高强度间歇训练，短时间内达到最佳燃脂效果',
      duration: 20,
      exercises: ['波比跳', '高抬腿', '登山跑', '开合跳', '跳绳'],
      frequencyPerWeek: 3,
      difficulty: 'advanced',
      isActive: true,
    },
    {
      name: '瑜伽放松计划',
      description: '舒缓身心的瑜伽练习，改善柔韧性和平衡能力',
      duration: 60,
      exercises: ['太阳式', '下犬式', '战士式', '鸽子式', '冥想'],
      frequencyPerWeek: 2,
      difficulty: 'beginner',
      isActive: true,
    },
  ];

  const savedPlans = await planRepository.save(fitnessPlans);
  console.log(`Created ${savedPlans.length} fitness plans`);

  const checkIns = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');

    for (const plan of savedPlans) {
      if (Math.random() > 0.4) {
        checkIns.push({
          fitnessPlanId: plan.id,
          checkInDate: new Date(dateStr),
          completed: true,
          caloriesBurned: Math.floor(Math.random() * 300) + 100,
          durationMinutes: Math.floor(Math.random() * 30) + 20,
          notes: i === 0 ? '今日训练完成，感觉很棒！' : '',
        });
      }
    }
  }

  await checkInRepository.save(checkIns);
  console.log(`Created ${checkIns.length} check-ins`);

  await dataSource.destroy();
  console.log('Seeding completed!');
}

seed().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
