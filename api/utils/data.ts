import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Boss {
  id: string;
  bossNo: string;
  gameAccount: string;
  gameId: string;
  gamePassword: string;
  game: string;
}

interface Staff {
  id: string;
  name: string;
  username: string;
  password: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

interface Task {
  id: string;
  gameAccount: string;
  gameId: string;
  bossNo: string;
  dailyTask: 'daily' | 'fullStamina' | 'dailyStamina' | null;
  weeklyTasks: string[];
  abyssTasks: string[];
  notes: string;
  startDate: string;
  endDate: string;
  status: string;
  loginDevice: string;
  staffId: string;
  income: number;
  expense: number;
  receiveDate: string;
  returnImages: string[];
  returnVideos: string[];
}

const DATA_DIR = path.join(__dirname, '../../data');

export const readJSON = <T>(filename: string): T[] => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
};

export const writeJSON = (filename: string, data: any): void => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getBosses = (): Boss[] => readJSON<Boss>('bosses.json');
export const saveBosses = (bosses: Boss[]) => writeJSON('bosses.json', bosses);

export const getStaffs = (): Staff[] => readJSON<Staff>('staff.json');
export const saveStaffs = (staffs: Staff[]) => writeJSON('staff.json', staffs);

export const getTasks = (): Task[] => readJSON<Task>('tasks.json');
export const saveTasks = (tasks: Task[]) => writeJSON('tasks.json', tasks);
