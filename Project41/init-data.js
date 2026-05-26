const { init, run } = require('./db');

console.log('Initializing data...');

async function initData() {
  try {
    await init();
    await run('DELETE FROM participants');
    await run('DELETE FROM activities');
    await run("DELETE FROM sqlite_sequence WHERE name IN ('activities', 'participants')");

    const activities = [
      {
        title: '夕阳红合唱团排练',
        description: '组织社区老年人合唱团排练经典老歌，欢迎有兴趣的长辈参加。每周一次，培养音乐兴趣，丰富晚年生活。',
        location: '社区文化活动中心 3楼 多功能厅',
        activity_date: '2026-05-28',
        start_time: '09:00',
        end_time: '11:00',
        max_participants: 30,
        category: '文娱活动',
        status: 'upcoming'
      },
      {
        title: '太极拳培训班（初级）',
        description: '邀请专业太极拳教练授课，从基础动作开始教学，适合初学者。强身健体，修身养性。',
        location: '社区广场',
        activity_date: '2026-05-29',
        start_time: '07:00',
        end_time: '08:30',
        max_participants: 25,
        category: '健身活动',
        status: 'upcoming'
      },
      {
        title: '书法绘画兴趣班',
        description: '由资深书画家指导，学习中国传统书法和国画技艺。提供笔墨纸砚，零基础也可参加。',
        location: '社区文化活动中心 2楼 书画室',
        activity_date: '2026-05-30',
        start_time: '14:00',
        end_time: '16:00',
        max_participants: 20,
        category: '文娱活动',
        status: 'upcoming'
      },
      {
        title: '健康知识讲座：高血压防治',
        description: '邀请社区医院医生讲解高血压的预防与治疗知识，现场免费测量血压，解答健康疑问。',
        location: '社区会议室 1楼',
        activity_date: '2026-05-31',
        start_time: '10:00',
        end_time: '11:30',
        max_participants: 50,
        category: '健康讲座',
        status: 'upcoming'
      },
      {
        title: '端午节包粽子活动',
        description: '传统节日活动，一起包粽子、话家常，感受节日氛围。材料由社区提供，包好的粽子可带走。',
        location: '社区食堂',
        activity_date: '2026-06-10',
        start_time: '09:30',
        end_time: '12:00',
        max_participants: 40,
        category: '节庆活动',
        status: 'upcoming'
      },
      {
        title: '广场舞展示活动',
        description: '各广场舞队伍展示精彩节目，增进邻里交流，欢迎围观和参与。',
        location: '社区广场',
        activity_date: '2026-06-15',
        start_time: '18:00',
        end_time: '20:00',
        max_participants: 60,
        category: '文娱活动',
        status: 'upcoming'
      },
      {
        title: '智能手机使用培训',
        description: '帮助老年人学习使用智能手机，包括微信、视频通话、拍照等常用功能。',
        location: '社区电子阅览室',
        activity_date: '2026-05-25',
        start_time: '14:00',
        end_time: '16:00',
        max_participants: 20,
        category: '技能培训',
        status: 'ongoing'
      },
      {
        title: '春季老年运动会',
        description: '设置适合老年人的运动项目，包括门球、趣味投篮、定点投沙包等，设有参与奖。',
        location: '社区运动场',
        activity_date: '2026-04-20',
        start_time: '08:30',
        end_time: '11:30',
        max_participants: 80,
        category: '健身活动',
        status: 'completed'
      }
    ];

    const insertActivitySql = `
      INSERT INTO activities (title, description, location, activity_date, start_time, end_time, max_participants, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const activityIds = [];
    for (const a of activities) {
      const result = await run(insertActivitySql, [
        a.title, a.description, a.location, a.activity_date,
        a.start_time, a.end_time, a.max_participants, a.category, a.status
      ]);
      activityIds.push(result.lastID);
    }

    const participants = [
      { activity_id: 1, name: '张桂芳', gender: 'female', age: 65, phone: '13800138001', id_card: '110101196001011234', emergency_contact: '王建国', emergency_phone: '13900139001', health_note: '高血压，需按时服药' },
      { activity_id: 1, name: '李秀兰', gender: 'female', age: 68, phone: '13800138002', id_card: '110101195703151234', emergency_contact: '李明', emergency_phone: '13900139002', health_note: '' },
      { activity_id: 1, name: '王德福', gender: 'male', age: 72, phone: '13800138003', id_card: '110101195305201234', emergency_contact: '王小红', emergency_phone: '13900139003', health_note: '糖尿病' },
      { activity_id: 1, name: '赵美玲', gender: 'female', age: 63, phone: '13800138004', id_card: '110101196208081234', emergency_contact: '赵刚', emergency_phone: '13900139004', health_note: '' },
      { activity_id: 1, name: '陈国强', gender: 'male', age: 70, phone: '13800138005', id_card: '110101195511111234', emergency_contact: '陈丽', emergency_phone: '13900139005', health_note: '关节不太好' },
      
      { activity_id: 2, name: '刘振华', gender: 'male', age: 67, phone: '13800138006', id_card: '110101195802021234', emergency_contact: '刘芳', emergency_phone: '13900139006', health_note: '' },
      { activity_id: 2, name: '孙秀珍', gender: 'female', age: 64, phone: '13800138007', id_card: '110101196104151234', emergency_contact: '孙伟', emergency_phone: '13900139007', health_note: '轻微腰间盘突出' },
      { activity_id: 2, name: '周志勇', gender: 'male', age: 71, phone: '13800138008', id_card: '110101195407071234', emergency_contact: '周婷', emergency_phone: '13900139008', health_note: '' },
      { activity_id: 2, name: '吴玉兰', gender: 'female', age: 66, phone: '13800138009', id_card: '110101195909091234', emergency_contact: '吴强', emergency_phone: '13900139009', health_note: '' },
      
      { activity_id: 3, name: '郑文华', gender: 'male', age: 69, phone: '13800138010', id_card: '110101195606061234', emergency_contact: '郑丽', emergency_phone: '13900139010', health_note: '' },
      { activity_id: 3, name: '钱雪梅', gender: 'female', age: 62, phone: '13800138011', id_card: '110101196303031234', emergency_contact: '钱明', emergency_phone: '13900139011', health_note: '' },
      { activity_id: 3, name: '马国庆', gender: 'male', age: 74, phone: '13800138012', id_card: '110101195110011234', emergency_contact: '马小红', emergency_phone: '13900139012', health_note: '高血压、心脏病' },
      
      { activity_id: 4, name: '胡慧敏', gender: 'female', age: 65, phone: '13800138013', id_card: '110101196005051234', emergency_contact: '胡军', emergency_phone: '13900139013', health_note: '高血压' },
      { activity_id: 4, name: '林建华', gender: 'male', age: 68, phone: '13800138014', id_card: '110101195712121234', emergency_contact: '林芳', emergency_phone: '13900139014', health_note: '' },
      { activity_id: 4, name: '高秀云', gender: 'female', age: 70, phone: '13800138015', id_card: '110101195508081234', emergency_contact: '高伟', emergency_phone: '13900139015', health_note: '糖尿病' },
      { activity_id: 4, name: '何志强', gender: 'male', age: 73, phone: '13800138016', id_card: '110101195202021234', emergency_contact: '何丽', emergency_phone: '13900139016', health_note: '' },
      { activity_id: 4, name: '曹桂英', gender: 'female', age: 67, phone: '13800138017', id_card: '110101195811111234', emergency_contact: '曹明', emergency_phone: '13900139017', health_note: '' },
      
      { activity_id: 5, name: '许丽华', gender: 'female', age: 63, phone: '13800138018', id_card: '110101196204041234', emergency_contact: '许强', emergency_phone: '13900139018', health_note: '' },
      { activity_id: 5, name: '邓伟民', gender: 'male', age: 66, phone: '13800138019', id_card: '110101195909091234', emergency_contact: '邓芳', emergency_phone: '13900139019', health_note: '' },
      { activity_id: 5, name: '冯翠萍', gender: 'female', age: 71, phone: '13800138020', id_card: '110101195412121234', emergency_contact: '冯军', emergency_phone: '13900139020', health_note: '关节炎' },
      { activity_id: 5, name: '彭志远', gender: 'male', age: 69, phone: '13800138021', id_card: '110101195607071234', emergency_contact: '彭丽', emergency_phone: '13900139021', health_note: '' },
      
      { activity_id: 6, name: '曾美华', gender: 'female', age: 64, phone: '13800138022', id_card: '110101196103031234', emergency_contact: '曾伟', emergency_phone: '13900139022', health_note: '' },
      { activity_id: 6, name: '田国富', gender: 'male', age: 72, phone: '13800138023', id_card: '110101195306061234', emergency_contact: '田小红', emergency_phone: '13900139023', health_note: '' },
      
      { activity_id: 7, name: '肖玉兰', gender: 'female', age: 68, phone: '13800138024', id_card: '110101195710101234', emergency_contact: '肖明', emergency_phone: '13900139024', health_note: '' },
      { activity_id: 7, name: '董建华', gender: 'male', age: 65, phone: '13800138025', id_card: '110101196002021234', emergency_contact: '董芳', emergency_phone: '13900139025', health_note: '' },
      { activity_id: 7, name: '袁桂珍', gender: 'female', age: 70, phone: '13800138026', id_card: '110101195511111234', emergency_contact: '袁军', emergency_phone: '13900139026', health_note: '高血压' },
      { activity_id: 7, name: '潘志勇', gender: 'male', age: 67, phone: '13800138027', id_card: '110101195808081234', emergency_contact: '潘丽', emergency_phone: '13900139027', health_note: '' },
      { activity_id: 7, name: '蒋秀梅', gender: 'female', age: 66, phone: '13800138028', id_card: '110101195905051234', emergency_contact: '蒋明', emergency_phone: '13900139028', health_note: '' },
      
      { activity_id: 8, name: '蔡国强', gender: 'male', age: 71, phone: '13800138029', id_card: '110101195404041234', emergency_contact: '蔡伟', emergency_phone: '13900139029', health_note: '' },
      { activity_id: 8, name: '沈丽华', gender: 'female', age: 69, phone: '13800138030', id_card: '110101195612121234', emergency_contact: '沈强', emergency_phone: '13900139030', health_note: '' },
      { activity_id: 8, name: '魏秀兰', gender: 'female', age: 73, phone: '13800138031', id_card: '110101195209091234', emergency_contact: '魏芳', emergency_phone: '13900139031', health_note: '糖尿病' },
      { activity_id: 8, name: '丁德胜', gender: 'male', age: 68, phone: '13800138032', id_card: '110101195707071234', emergency_contact: '丁军', emergency_phone: '13900139032', health_note: '' },
      { activity_id: 8, name: '贾美玲', gender: 'female', age: 65, phone: '13800138033', id_card: '110101196001011234', emergency_contact: '贾明', emergency_phone: '13900139033', health_note: '' },
      { activity_id: 8, name: '薛建军', gender: 'male', age: 70, phone: '13800138034', id_card: '110101195506061234', emergency_contact: '薛丽', emergency_phone: '13900139034', health_note: '' }
    ];

    const insertParticipantSql = `
      INSERT INTO participants (activity_id, name, gender, age, phone, id_card, emergency_contact, emergency_phone, health_note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const p of participants) {
      await run(insertParticipantSql, [
        p.activity_id, p.name, p.gender, p.age, p.phone,
        p.id_card, p.emergency_contact, p.emergency_phone, p.health_note
      ]);
    }

    console.log('Data initialized successfully!');
    console.log('Activities: ' + activities.length + ' records');
    console.log('Participants: ' + participants.length + ' records');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize data:', err);
    process.exit(1);
  }
}

initData();
