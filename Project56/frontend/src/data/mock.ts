import { Course, Schedule, Enrollment, AttendanceRecord } from '@/types';

export const mockCourses: Course[] = [
  {
    id: 1,
    name: '创意彩泥手工坊',
    description: '通过彩泥捏制各种有趣的造型，培养孩子的动手能力和创造力。课程包含动物、食物、卡通形象等多种主题。',
    price: 99,
    originalPrice: 159,
    image: 'https://picsum.photos/id/1025/600/400',
    category: '创意手工',
    duration: '90分钟',
    ageRange: '4-8岁',
    materials: ['彩泥套装', '工具套装', '垫板', '彩泥收纳盒'],
    difficulty: 'easy',
    teacher: '李老师',
    tags: ['热门', '亲子', '创意'],
    scheduleCount: 8,
    enrolledCount: 128,
    rating: 4.9
  },
  {
    id: 2,
    name: '趣味折纸小课堂',
    description: '学习基础折纸技巧，制作小动物、花朵、纸飞机等作品。锻炼手指灵活性，培养耐心和专注力。',
    price: 79,
    originalPrice: 129,
    image: 'https://picsum.photos/id/237/600/400',
    category: '折纸艺术',
    duration: '60分钟',
    ageRange: '5-10岁',
    materials: ['彩纸套装', '折纸书', '剪刀', '胶棒'],
    difficulty: 'easy',
    teacher: '王老师',
    tags: ['新开', '亲子'],
    scheduleCount: 6,
    enrolledCount: 86,
    rating: 4.8
  },
  {
    id: 3,
    name: '儿童创意绘画',
    description: '使用水彩、蜡笔、马克笔等多种材料，学习色彩搭配和基础绘画技巧，激发孩子的艺术天赋。',
    price: 129,
    originalPrice: 199,
    image: 'https://picsum.photos/id/64/600/400',
    category: '美术绘画',
    duration: '120分钟',
    ageRange: '5-12岁',
    materials: ['水彩颜料', '画笔套装', '画纸', '调色盘', '围裙'],
    difficulty: 'medium',
    teacher: '张老师',
    tags: ['热门', '艺术'],
    scheduleCount: 10,
    enrolledCount: 156,
    rating: 4.9
  },
  {
    id: 4,
    name: 'DIY串珠首饰',
    description: '学习串珠技巧，制作手链、项链、钥匙扣等饰品。培养审美能力和精细动作能力。',
    price: 89,
    originalPrice: 149,
    image: 'https://picsum.photos/id/91/600/400',
    category: '手工饰品',
    duration: '90分钟',
    ageRange: '6-12岁',
    materials: ['珠子套装', '弹力线', '金属配件', '剪刀'],
    difficulty: 'medium',
    teacher: '陈老师',
    tags: ['女生最爱', '亲子'],
    scheduleCount: 5,
    enrolledCount: 72,
    rating: 4.7
  },
  {
    id: 5,
    name: '科学实验工坊',
    description: '趣味科学小实验，包含火山爆发、彩虹雨、水晶生长等项目。边玩边学科学知识。',
    price: 149,
    originalPrice: 229,
    image: 'https://picsum.photos/id/201/600/400',
    category: '科学实验',
    duration: '120分钟',
    ageRange: '6-12岁',
    materials: ['实验材料包', '护目镜', '实验手册'],
    difficulty: 'medium',
    teacher: '刘老师',
    tags: ['热门', '科普', '亲子'],
    scheduleCount: 7,
    enrolledCount: 98,
    rating: 4.9
  },
  {
    id: 6,
    name: '陶艺制作体验',
    description: '体验陶土制作的乐趣，学习捏塑、盘条、拉坯等技法，制作专属陶艺作品。',
    price: 169,
    originalPrice: 259,
    image: 'https://picsum.photos/id/177/600/400',
    category: '陶艺雕塑',
    duration: '150分钟',
    ageRange: '7-14岁',
    materials: ['陶土', '陶艺工具', '围裙', '烧制服务'],
    difficulty: 'hard',
    teacher: '赵老师',
    tags: ['精品', '亲子'],
    scheduleCount: 4,
    enrolledCount: 45,
    rating: 4.8
  }
];

export const mockSchedules: Schedule[] = [
  { id: 1, courseId: 1, courseName: '创意彩泥手工坊', date: '2026-05-30', startTime: '09:00', endTime: '10:30', capacity: 12, enrolled: 8, classroom: 'A101教室', teacher: '李老师' },
  { id: 2, courseId: 1, courseName: '创意彩泥手工坊', date: '2026-05-30', startTime: '14:00', endTime: '15:30', capacity: 12, enrolled: 10, classroom: 'A101教室', teacher: '李老师' },
  { id: 3, courseId: 1, courseName: '创意彩泥手工坊', date: '2026-06-01', startTime: '09:00', endTime: '10:30', capacity: 12, enrolled: 5, classroom: 'A101教室', teacher: '李老师' },
  { id: 4, courseId: 2, courseName: '趣味折纸小课堂', date: '2026-05-31', startTime: '10:00', endTime: '11:00', capacity: 15, enrolled: 12, classroom: 'B201教室', teacher: '王老师' },
  { id: 5, courseId: 2, courseName: '趣味折纸小课堂', date: '2026-06-02', startTime: '15:00', endTime: '16:00', capacity: 15, enrolled: 9, classroom: 'B201教室', teacher: '王老师' },
  { id: 6, courseId: 3, courseName: '儿童创意绘画', date: '2026-05-30', startTime: '09:00', endTime: '11:00', capacity: 10, enrolled: 9, classroom: 'C301教室', teacher: '张老师' },
  { id: 7, courseId: 3, courseName: '儿童创意绘画', date: '2026-06-01', startTime: '14:00', endTime: '16:00', capacity: 10, enrolled: 7, classroom: 'C301教室', teacher: '张老师' },
  { id: 8, courseId: 5, courseName: '科学实验工坊', date: '2026-05-31', startTime: '09:00', endTime: '11:00', capacity: 8, enrolled: 8, classroom: 'D401实验室', teacher: '刘老师' }
];

export const mockEnrollments: Enrollment[] = [
  { id: 1, courseId: 1, courseName: '创意彩泥手工坊', courseImage: 'https://picsum.photos/id/1025/200/200', scheduleId: 1, scheduleDate: '2026-05-30', scheduleTime: '09:00-10:30', childName: '小明', childAge: 5, parentName: '张女士', parentPhone: '138****8888', amount: 99, status: 'paid', payTime: '2026-05-25 14:30:00', createTime: '2026-05-25 14:25:00' },
  { id: 2, courseId: 3, courseName: '儿童创意绘画', courseImage: 'https://picsum.photos/id/64/200/200', scheduleId: 6, scheduleDate: '2026-05-30', scheduleTime: '09:00-11:00', childName: '小红', childAge: 6, parentName: '李女士', parentPhone: '139****9999', amount: 129, status: 'paid', payTime: '2026-05-24 10:15:00', createTime: '2026-05-24 10:10:00' },
  { id: 3, courseId: 2, courseName: '趣味折纸小课堂', courseImage: 'https://picsum.photos/id/237/200/200', scheduleId: 4, scheduleDate: '2026-05-31', scheduleTime: '10:00-11:00', childName: '小华', childAge: 7, parentName: '王先生', parentPhone: '137****7777', amount: 79, status: 'pending', createTime: '2026-05-26 09:00:00' },
  { id: 4, courseId: 5, courseName: '科学实验工坊', courseImage: 'https://picsum.photos/id/201/200/200', scheduleId: 8, scheduleDate: '2026-05-31', scheduleTime: '09:00-11:00', childName: '小刚', childAge: 8, parentName: '陈先生', parentPhone: '136****6666', amount: 149, status: 'completed', payTime: '2026-05-20 16:00:00', createTime: '2026-05-20 15:55:00' }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 1, enrollmentId: 1, courseId: 1, courseName: '创意彩泥手工坊', scheduleId: 1, scheduleDate: '2026-05-23', childName: '小明', status: 'present', checkInTime: '09:02', remark: '' },
  { id: 2, enrollmentId: 1, courseId: 1, courseName: '创意彩泥手工坊', scheduleId: 2, scheduleDate: '2026-05-24', childName: '小明', status: 'present', checkInTime: '09:00', remark: '' },
  { id: 3, enrollmentId: 4, courseId: 5, courseName: '科学实验工坊', scheduleId: 8, scheduleDate: '2026-05-21', childName: '小刚', status: 'present', checkInTime: '08:58', remark: '' },
  { id: 4, enrollmentId: 4, courseId: 5, courseName: '科学实验工坊', scheduleId: 8, scheduleDate: '2026-05-22', childName: '小刚', status: 'leave', checkInTime: '', remark: '身体不适请假' }
];

export const categories = ['全部', '创意手工', '折纸艺术', '美术绘画', '手工饰品', '科学实验', '陶艺雕塑'];
