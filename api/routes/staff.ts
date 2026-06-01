import { Router } from 'express';
import { getStaffs, saveStaffs, getTasks } from '../utils/data';

const router = Router();

// 获取员工列表
router.get('/', (req, res) => {
  const staffs = getStaffs();
  res.json(staffs);
});

// 新增员工
router.post('/', (req, res) => {
  const staffs = getStaffs();
  const newStaff = {
    id: `staff-${Date.now()}`,
    status: 'active',
    ...req.body,
  };
  staffs.push(newStaff);
  saveStaffs(staffs);
  res.json(newStaff);
});

// 更新员工
router.put('/:id', (req, res) => {
  const staffs = getStaffs();
  const index = staffs.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    staffs[index] = { ...staffs[index], ...req.body };
    saveStaffs(staffs);
    res.json(staffs[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// 删除员工
router.delete('/:id', (req, res) => {
  const staffs = getStaffs();
  const tasks = getTasks();
  
  const hasTasks = tasks.some(t => t.staffId === req.params.id);
  if (hasTasks) {
    return res.status(400).json({ error: '该员工有负责的任务，无法删除' });
  }
  
  const newStaffs = staffs.filter(s => s.id !== req.params.id);
  saveStaffs(newStaffs);
  res.json({ success: true });
});

export default router;
