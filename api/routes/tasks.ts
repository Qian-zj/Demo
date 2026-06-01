import { Router } from 'express';
import { getTasks, saveTasks } from '../utils/data';

const router = Router();

// 获取任务列表
router.get('/', (req, res) => {
  const tasks = getTasks();
  res.json(tasks);
});

// 新增任务
router.post('/', (req, res) => {
  const tasks = getTasks();
  const newTask = {
    id: `task-${Date.now()}`,
    returnImages: [],
    returnVideos: [],
    ...req.body,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

// 更新任务
router.put('/:id', (req, res) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...req.body };
    saveTasks(tasks);
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

export default router;
