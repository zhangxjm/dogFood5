const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const ENCRYPTION_KEY = 'PasswordVault2024SecretKey';

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const defaultData = {
  groups: [
    { id: 1, name: '社交账号', color: '#e74c3c' },
    { id: 2, name: '工作账号', color: '#3498db' },
    { id: 3, name: '金融服务', color: '#2ecc71' },
    { id: 4, name: '购物网站', color: '#f39c12' },
    { id: 5, name: '其他', color: '#9b59b6' }
  ],
  accounts: [],
  nextGroupId: 6,
  nextAccountId: 1
};

const adapter = new JSONFile('./password-vault.json');
const db = new Low(adapter, defaultData);

async function initDB() {
  await db.read();
  if (!db.data || !db.data.groups) {
    db.data = { ...defaultData };
  }
  await db.write();
}

app.get('/api/groups', async (req, res) => {
  try {
    await db.read();
    const groups = [...db.data.groups].sort((a, b) => a.name.localeCompare(b.name));
    res.json({ success: true, data: groups });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/api/groups', async (req, res) => {
  try {
    await db.read();
    const { name, color } = req.body;
    const newGroup = {
      id: db.data.nextGroupId++,
      name,
      color: color || '#3498db'
    };
    db.data.groups.push(newGroup);
    await db.write();
    res.json({ success: true, data: newGroup });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.delete('/api/groups/:id', async (req, res) => {
  try {
    await db.read();
    const groupId = parseInt(req.params.id);
    db.data.accounts = db.data.accounts.map(acc => 
      acc.group_id === groupId ? { ...acc, group_id: null } : acc
    );
    db.data.groups = db.data.groups.filter(g => g.id !== groupId);
    await db.write();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.get('/api/accounts', async (req, res) => {
  try {
    await db.read();
    const { search, group_id } = req.query;
    let accounts = [...db.data.accounts];
    
    if (search) {
      const searchLower = search.toLowerCase();
      accounts = accounts.filter(a => 
        a.platform.toLowerCase().includes(searchLower) ||
        a.username.toLowerCase().includes(searchLower) ||
        (a.notes && a.notes.toLowerCase().includes(searchLower))
      );
    }
    
    if (group_id) {
      accounts = accounts.filter(a => a.group_id === parseInt(group_id));
    }
    
    accounts = accounts.map(acc => {
      const group = db.data.groups.find(g => g.id === acc.group_id);
      return {
        ...acc,
        password: decrypt(acc.password),
        group_name: group ? group.name : null,
        group_color: group ? group.color : null
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json({ success: true, data: accounts });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/api/accounts', async (req, res) => {
  try {
    await db.read();
    const { group_id, platform, username, password, url, notes } = req.body;
    const newAccount = {
      id: db.data.nextAccountId++,
      group_id: group_id ? parseInt(group_id) : null,
      platform,
      username,
      password: encrypt(password),
      url: url || '',
      notes: notes || '',
      created_at: new Date().toISOString()
    };
    db.data.accounts.push(newAccount);
    await db.write();
    res.json({ success: true, data: { id: newAccount.id } });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.put('/api/accounts/:id', async (req, res) => {
  try {
    await db.read();
    const accountId = parseInt(req.params.id);
    const { group_id, platform, username, password, url, notes } = req.body;
    const index = db.data.accounts.findIndex(a => a.id === accountId);
    
    if (index !== -1) {
      db.data.accounts[index] = {
        ...db.data.accounts[index],
        group_id: group_id ? parseInt(group_id) : null,
        platform,
        username,
        password: encrypt(password),
        url: url || '',
        notes: notes || ''
      };
      await db.write();
    }
    
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.delete('/api/accounts/:id', async (req, res) => {
  try {
    await db.read();
    const accountId = parseInt(req.params.id);
    db.data.accounts = db.data.accounts.filter(a => a.id !== accountId);
    await db.write();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 密码保险箱服务已启动!`);
    console.log(`📱 访问地址: http://localhost:${PORT}`);
    console.log(`💾 数据库: password-vault.json\n`);
  });
}).catch(err => {
  console.error('初始化失败:', err);
});
