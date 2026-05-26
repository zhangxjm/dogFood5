# 少儿绘画课时记录系统 - 使用说明

## 启动方法

### 方法1：使用PowerShell脚本（推荐）

在PowerShell中执行：
```powershell
.\start.ps1
```

### 方法2：使用批处理脚本

在命令提示符(cmd)中执行：
```cmd
start.bat
```

或者在PowerShell中执行：
```powershell
.\start.bat
```

### 方法3：手动启动

**启动后端：**
```powershell
cd backend
$env:DB_TYPE="sqlite"
$env:BACKEND_PORT="15234"
.\venv\Scripts\python.exe app.py
```

**启动前端（新终端）：**
```powershell
cd frontend
python server.py 18956 15234
```

---

## 访问地址

启动成功后，终端会显示访问地址，例如：
- 前端地址: http://localhost:18956
- 后端地址: http://localhost:15234

---

## 停止服务

运行 `stop.ps1` 或直接关闭终端窗口。

---

## 常见问题

### Q1: 报错"无法将项识别为 cmdlet..."

**原因**: PowerShell需要在脚本名前加 `.\`

**解决**: 使用 `.\start.ps1` 而不是 `start.ps1`

### Q2: 报错"未找到Python"

**原因**: Python路径不正确

**解决**: 检查 `start.ps1` 或 `start.bat` 中的Python路径，修改为实际安装路径

查看Python路径：
```powershell
where.exe python
```

### Q3: 虚拟环境创建失败

**解决**: 
1. 确保Python已正确安装
2. 手动创建虚拟环境：
```powershell
cd backend
python -m venv venv
```

### Q4: 端口被占用

**解决**: 
1. 脚本会自动选择随机端口（10000-65000）
2. 如果仍然冲突，可以修改脚本中的端口范围

### Q5: 数据库初始化失败

**解决**: 
1. 删除旧的数据库文件：`backend\art_lesson.db`
2. 重新运行启动脚本

---

## 初始数据

系统会自动创建以下数据：
- 12个学员（小明、小红、小华等）
- 6门课程（儿童素描、水彩画、创意绘画等）
- 12个排班
- 多条上课记录

---

## 功能说明

| 功能 | 说明 |
|------|------|
| 仪表盘 | 统计概览、课时预警、今日课程 |
| 学员管理 | 添加、编辑、删除学员，管理课时 |
| 课程管理 | 添加、编辑、删除课程 |
| 课程排班 | 周视图排班管理 |
| 上课记录 | 登记上课，自动扣减课时 |
