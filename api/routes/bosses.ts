import { Router } from 'express';
import { getBosses, saveBosses } from '../utils/data';

const router = Router();

// 获取老板列表
router.get('/', (req, res) => {
  const bosses = getBosses();
  res.json(bosses);
});

// 新增老板
router.post('/', (req, res) => {
  const bosses = getBosses();
  const newBoss = {
    id: `boss-${Date.now()}`,
    ...req.body,
  };
  bosses.push(newBoss);
  saveBosses(bosses);
  res.json(newBoss);
});

// 更新老板
router.put('/:id', (req, res) => {
  const bosses = getBosses();
  const index = bosses.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    bosses[index] = { ...bosses[index], ...req.body };
    saveBosses(bosses);
    res.json(bosses[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

export default router;
