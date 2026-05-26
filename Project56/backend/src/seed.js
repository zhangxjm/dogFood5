const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('craft_course.db');

console.log('[Seed] Starting data seeding...');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      originalPrice REAL,
      image TEXT,
      category TEXT,
      duration TEXT,
      ageRange TEXT,
      materials TEXT,
      difficulty TEXT,
      teacher TEXT,
      tags TEXT,
      scheduleCount INTEGER DEFAULT 0,
      enrolledCount INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER,
      courseName TEXT,
      date TEXT,
      startTime TEXT,
      endTime TEXT,
      capacity INTEGER DEFAULT 12,
      enrolled INTEGER DEFAULT 0,
      classroom TEXT,
      teacher TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER,
      courseName TEXT,
      courseImage TEXT,
      scheduleId INTEGER,
      scheduleDate TEXT,
      scheduleTime TEXT,
      childName TEXT,
      childAge INTEGER,
      parentName TEXT,
      parentPhone TEXT,
      amount REAL,
      status TEXT DEFAULT 'pending',
      payTime DATETIME,
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS attendances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollmentId INTEGER,
      courseId INTEGER,
      courseName TEXT,
      scheduleId INTEGER,
      scheduleDate TEXT,
      childName TEXT,
      status TEXT DEFAULT 'present',
      checkInTime TEXT,
      remark TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run('DELETE FROM attendances');
  db.run('DELETE FROM enrollments');
  db.run('DELETE FROM schedules');
  db.run('DELETE FROM courses');

  const courses = [
    {
      name: 'Creative Clay Workshop',
      description: 'Create fun shapes with clay, develop hands-on skills and creativity. Includes animals, food, cartoon characters and more.',
      price: 99,
      originalPrice: 159,
      image: 'https://picsum.photos/id/1025/600/400',
      category: 'Creative Craft',
      duration: '90 minutes',
      ageRange: '4-8 years',
      materials: JSON.stringify(['Clay set', 'Tool set', 'Mat', 'Storage box']),
      difficulty: 'easy',
      teacher: 'Ms. Li',
      tags: JSON.stringify(['Hot', 'Parent-Child', 'Creative']),
      scheduleCount: 8,
      enrolledCount: 128,
      rating: 4.9,
    },
    {
      name: 'Fun Origami Class',
      description: 'Learn basic origami techniques to make animals, flowers, paper planes. Improve finger flexibility and patience.',
      price: 79,
      originalPrice: 129,
      image: 'https://picsum.photos/id/237/600/400',
      category: 'Origami Art',
      duration: '60 minutes',
      ageRange: '5-10 years',
      materials: JSON.stringify(['Color paper', 'Origami book', 'Scissors', 'Glue']),
      difficulty: 'easy',
      teacher: 'Ms. Wang',
      tags: JSON.stringify(['New', 'Parent-Child']),
      scheduleCount: 6,
      enrolledCount: 86,
      rating: 4.8,
    },
    {
      name: 'Creative Painting',
      description: 'Use watercolor, crayons, markers to learn color matching and basic painting skills.',
      price: 129,
      originalPrice: 199,
      image: 'https://picsum.photos/id/64/600/400',
      category: 'Art Painting',
      duration: '120 minutes',
      ageRange: '5-12 years',
      materials: JSON.stringify(['Watercolor', 'Brush set', 'Paper', 'Palette', 'Apron']),
      difficulty: 'medium',
      teacher: 'Ms. Zhang',
      tags: JSON.stringify(['Hot', 'Art']),
      scheduleCount: 10,
      enrolledCount: 156,
      rating: 4.9,
    },
    {
      name: 'DIY Beaded Jewelry',
      description: 'Learn beading techniques to make bracelets, necklaces, keychains. Develop aesthetic ability.',
      price: 89,
      originalPrice: 149,
      image: 'https://picsum.photos/id/91/600/400',
      category: 'Handmade Jewelry',
      duration: '90 minutes',
      ageRange: '6-12 years',
      materials: JSON.stringify(['Bead set', 'Elastic cord', 'Metal parts', 'Scissors']),
      difficulty: 'medium',
      teacher: 'Ms. Chen',
      tags: JSON.stringify(['Girls Favorite', 'Parent-Child']),
      scheduleCount: 5,
      enrolledCount: 72,
      rating: 4.7,
    },
    {
      name: 'Science Lab',
      description: 'Fun science experiments including volcano, rainbow rain, crystal growth. Learn while playing.',
      price: 149,
      originalPrice: 229,
      image: 'https://picsum.photos/id/201/600/400',
      category: 'Science Experiment',
      duration: '120 minutes',
      ageRange: '6-12 years',
      materials: JSON.stringify(['Experiment kit', 'Goggles', 'Manual']),
      difficulty: 'medium',
      teacher: 'Mr. Liu',
      tags: JSON.stringify(['Hot', 'Science', 'Parent-Child']),
      scheduleCount: 7,
      enrolledCount: 98,
      rating: 4.9,
    },
    {
      name: 'Pottery Experience',
      description: 'Experience pottery making, learn pinching, coiling, wheel throwing techniques.',
      price: 169,
      originalPrice: 259,
      image: 'https://picsum.photos/id/177/600/400',
      category: 'Pottery Sculpture',
      duration: '150 minutes',
      ageRange: '7-14 years',
      materials: JSON.stringify(['Clay', 'Pottery tools', 'Apron', 'Firing service']),
      difficulty: 'hard',
      teacher: 'Mr. Zhao',
      tags: JSON.stringify(['Premium', 'Parent-Child']),
      scheduleCount: 4,
      enrolledCount: 45,
      rating: 4.8,
    },
  ];

  const insertCourse = db.prepare(`
    INSERT INTO courses (name, description, price, originalPrice, image, category, duration, ageRange, materials, difficulty, teacher, tags, scheduleCount, enrolledCount, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let courseCount = 0;
  courses.forEach(course => {
    insertCourse.run(
      course.name, course.description, course.price, course.originalPrice, course.image,
      course.category, course.duration, course.ageRange, course.materials, course.difficulty,
      course.teacher, course.tags, course.scheduleCount, course.enrolledCount, course.rating,
      function(err) {
        if (err) console.error('[Seed] Error inserting course:', err);
        courseCount++;
      }
    );
  });

  const schedules = [
    { courseId: 1, courseName: 'Creative Clay Workshop', date: '2026-05-30', startTime: '09:00', endTime: '10:30', capacity: 12, enrolled: 8, classroom: 'Room A101', teacher: 'Ms. Li' },
    { courseId: 1, courseName: 'Creative Clay Workshop', date: '2026-05-30', startTime: '14:00', endTime: '15:30', capacity: 12, enrolled: 10, classroom: 'Room A101', teacher: 'Ms. Li' },
    { courseId: 1, courseName: 'Creative Clay Workshop', date: '2026-06-01', startTime: '09:00', endTime: '10:30', capacity: 12, enrolled: 5, classroom: 'Room A101', teacher: 'Ms. Li' },
    { courseId: 2, courseName: 'Fun Origami Class', date: '2026-05-31', startTime: '10:00', endTime: '11:00', capacity: 15, enrolled: 12, classroom: 'Room B201', teacher: 'Ms. Wang' },
    { courseId: 2, courseName: 'Fun Origami Class', date: '2026-06-02', startTime: '15:00', endTime: '16:00', capacity: 15, enrolled: 9, classroom: 'Room B201', teacher: 'Ms. Wang' },
    { courseId: 3, courseName: 'Creative Painting', date: '2026-05-30', startTime: '09:00', endTime: '11:00', capacity: 10, enrolled: 9, classroom: 'Room C301', teacher: 'Ms. Zhang' },
    { courseId: 3, courseName: 'Creative Painting', date: '2026-06-01', startTime: '14:00', endTime: '16:00', capacity: 10, enrolled: 7, classroom: 'Room C301', teacher: 'Ms. Zhang' },
    { courseId: 5, courseName: 'Science Lab', date: '2026-05-31', startTime: '09:00', endTime: '11:00', capacity: 8, enrolled: 8, classroom: 'Lab D401', teacher: 'Mr. Liu' },
  ];

  const insertSchedule = db.prepare(`
    INSERT INTO schedules (courseId, courseName, date, startTime, endTime, capacity, enrolled, classroom, teacher)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  schedules.forEach(schedule => {
    insertSchedule.run(
      schedule.courseId, schedule.courseName, schedule.date, schedule.startTime,
      schedule.endTime, schedule.capacity, schedule.enrolled, schedule.classroom, schedule.teacher
    );
  });

  const enrollments = [
    { courseId: 1, courseName: 'Creative Clay Workshop', courseImage: 'https://picsum.photos/id/1025/200/200', scheduleId: 1, scheduleDate: '2026-05-30', scheduleTime: '09:00-10:30', childName: 'Xiaoming', childAge: 5, parentName: 'Ms. Zhang', parentPhone: '138****8888', amount: 99, status: 'paid', payTime: '2026-05-25 14:30:00' },
    { courseId: 3, courseName: 'Creative Painting', courseImage: 'https://picsum.photos/id/64/200/200', scheduleId: 6, scheduleDate: '2026-05-30', scheduleTime: '09:00-11:00', childName: 'Xiaohong', childAge: 6, parentName: 'Ms. Li', parentPhone: '139****9999', amount: 129, status: 'paid', payTime: '2026-05-24 10:15:00' },
    { courseId: 2, courseName: 'Fun Origami Class', courseImage: 'https://picsum.photos/id/237/200/200', scheduleId: 4, scheduleDate: '2026-05-31', scheduleTime: '10:00-11:00', childName: 'Xiaohua', childAge: 7, parentName: 'Mr. Wang', parentPhone: '137****7777', amount: 79, status: 'pending', payTime: null },
    { courseId: 5, courseName: 'Science Lab', courseImage: 'https://picsum.photos/id/201/200/200', scheduleId: 8, scheduleDate: '2026-05-31', scheduleTime: '09:00-11:00', childName: 'Xiaogang', childAge: 8, parentName: 'Mr. Chen', parentPhone: '136****6666', amount: 149, status: 'completed', payTime: '2026-05-20 16:00:00' },
  ];

  const insertEnrollment = db.prepare(`
    INSERT INTO enrollments (courseId, courseName, courseImage, scheduleId, scheduleDate, scheduleTime, childName, childAge, parentName, parentPhone, amount, status, payTime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  enrollments.forEach(enrollment => {
    insertEnrollment.run(
      enrollment.courseId, enrollment.courseName, enrollment.courseImage, enrollment.scheduleId,
      enrollment.scheduleDate, enrollment.scheduleTime, enrollment.childName, enrollment.childAge,
      enrollment.parentName, enrollment.parentPhone, enrollment.amount, enrollment.status, enrollment.payTime
    );
  });

  const attendances = [
    { enrollmentId: 1, courseId: 1, courseName: 'Creative Clay Workshop', scheduleId: 1, scheduleDate: '2026-05-23', childName: 'Xiaoming', status: 'present', checkInTime: '09:02', remark: '' },
    { enrollmentId: 1, courseId: 1, courseName: 'Creative Clay Workshop', scheduleId: 2, scheduleDate: '2026-05-24', childName: 'Xiaoming', status: 'present', checkInTime: '09:00', remark: '' },
    { enrollmentId: 4, courseId: 5, courseName: 'Science Lab', scheduleId: 8, scheduleDate: '2026-05-21', childName: 'Xiaogang', status: 'present', checkInTime: '08:58', remark: '' },
    { enrollmentId: 4, courseId: 5, courseName: 'Science Lab', scheduleId: 8, scheduleDate: '2026-05-22', childName: 'Xiaogang', status: 'leave', checkInTime: null, remark: 'Sick leave' },
  ];

  const insertAttendance = db.prepare(`
    INSERT INTO attendances (enrollmentId, courseId, courseName, scheduleId, scheduleDate, childName, status, checkInTime, remark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  attendances.forEach(attendance => {
    insertAttendance.run(
      attendance.enrollmentId, attendance.courseId, attendance.courseName, attendance.scheduleId,
      attendance.scheduleDate, attendance.childName, attendance.status, attendance.checkInTime, attendance.remark
    );
  });

  setTimeout(() => {
    console.log(`[Seed] ${courses.length} courses seeded`);
    console.log(`[Seed] ${schedules.length} schedules seeded`);
    console.log(`[Seed] ${enrollments.length} enrollments seeded`);
    console.log(`[Seed] ${attendances.length} attendances seeded`);
    console.log('[Seed] All data seeded successfully!');
    db.close();
  }, 1000);
});
