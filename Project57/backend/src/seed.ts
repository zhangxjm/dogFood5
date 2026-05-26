import { createConnection } from 'typeorm';
import { Course } from './modules/course/course.entity';
import { Registration } from './modules/registration/registration.entity';
import { Schedule } from './modules/schedule/schedule.entity';
import { Attendance } from './modules/attendance/attendance.entity';

async function seed() {
  const connection = await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'craft',
    password: 'craft123',
    database: 'craft_course',
    entities: [Course, Registration, Schedule, Attendance],
    synchronize: true,
  });

  console.log('Seeding database...');

  const courseRepository = connection.getRepository(Course);
  const scheduleRepository = connection.getRepository(Schedule);
  const registrationRepository = connection.getRepository(Registration);

  const existingCourses = await courseRepository.count();
  if (existingCourses > 0) {
    console.log('Database already seeded. Skipping...');
    await connection.close();
    return;
  }

  const courses = [
    {
      name: '创意黏土手工课',
      description: '通过黏土创作各种有趣的造型，锻炼孩子动手能力和想象力，适合4-8岁儿童。',
      price: 128.00,
      capacity: 10,
      imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400',
      isActive: true,
    },
    {
      name: '趣味折纸艺术课',
      description: '学习传统与现代折纸技巧，制作可爱的动物和花朵造型，培养专注力。',
      price: 98.00,
      capacity: 12,
      imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400',
      isActive: true,
    },
    {
      name: '亲子DIY烘焙课',
      description: '家长与孩子一起制作小饼干、蛋糕等甜点，享受甜蜜亲子时光，学习烘焙基础。',
      price: 198.00,
      capacity: 8,
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400',
      isActive: true,
    },
    {
      name: '水彩绘画启蒙课',
      description: '从基础色彩认知开始，学习简单的水彩技法，培养孩子的艺术感知力。',
      price: 108.00,
      capacity: 10,
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
      isActive: true,
    },
    {
      name: '木质拼装模型课',
      description: '动手拼装木质模型，了解基本的机械原理和结构知识，适合6-12岁儿童。',
      price: 158.00,
      capacity: 8,
      imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400',
      isActive: true,
    },
    {
      name: '创意手工皂制作课',
      description: '学习手工皂的制作过程，调配喜欢的颜色和香味，制作属于自己的特色手工皂。',
      price: 138.00,
      capacity: 10,
      imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400',
      isActive: true,
    },
  ];

  const savedCourses = await courseRepository.save(courses);
  console.log(`Saved ${savedCourses.length} courses`);

  const schedules = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    savedCourses.forEach((course, index) => {
      if (i % 2 === index % 2) {
        schedules.push({
          courseId: course.id,
          scheduleDate: dateStr,
          startTime: index % 2 === 0 ? '09:00' : '14:00',
          endTime: index % 2 === 0 ? '10:30' : '15:30',
          location: '创意工坊A室',
          teacher: ['李老师', '王老师', '张老师'][index % 3],
          maxStudents: course.capacity,
        });
      }
    });
  }

  const savedSchedules = await scheduleRepository.save(schedules);
  console.log(`Saved ${savedSchedules.length} schedules`);

  const sampleParents = [
    { parentName: '张美丽', parentPhone: '13800138001', childName: '张小明', childAge: 5 },
    { parentName: '李红', parentPhone: '13800138002', childName: '李小红', childAge: 6 },
    { parentName: '王丽', parentPhone: '13800138003', childName: '王小华', childAge: 4 },
    { parentName: '赵敏', parentPhone: '13800138004', childName: '赵小雨', childAge: 7 },
    { parentName: '陈静', parentPhone: '13800138005', childName: '陈小芳', childAge: 5 },
  ];

  const registrations = [];
  sampleParents.forEach((parent, idx) => {
    registrations.push({
      courseId: savedCourses[idx % savedCourses.length].id,
      parentName: parent.parentName,
      parentPhone: parent.parentPhone,
      childName: parent.childName,
      childAge: parent.childAge,
      amount: savedCourses[idx % savedCourses.length].price,
      paymentStatus: 'paid',
      remark: '',
    });
  });

  const savedRegistrations = await registrationRepository.save(registrations);
  console.log(`Saved ${savedRegistrations.length} registrations`);

  console.log('Database seeding completed!');
  await connection.close();
}

seed().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
