import { create } from 'zustand';

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

interface AppStore {
  user: { id: string; name: string; role: 'admin' | 'staff' } | null;
  bosses: Boss[];
  staffs: Staff[];
  tasks: Task[];
  setUser: (user: any) => void;
  logout: () => void;
  fetchBosses: () => Promise<void>;
  fetchStaffs: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  addBoss: (boss: Omit<Boss, 'id'>) => Promise<void>;
  updateBoss: (id: string, boss: Partial<Boss>) => Promise<void>;
  addStaff: (staff: Omit<Staff, 'id' | 'status'>) => Promise<void>;
  updateStaff: (id: string, staff: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'returnImages' | 'returnVideos'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  bosses: [],
  staffs: [],
  tasks: [],
  
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  
  fetchBosses: async () => {
    const res = await fetch('/api/bosses');
    const data = await res.json();
    set({ bosses: data });
  },
  
  fetchStaffs: async () => {
    const res = await fetch('/api/staff');
    const data = await res.json();
    set({ staffs: data });
  },
  
  fetchTasks: async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    set({ tasks: data });
  },
  
  addBoss: async (boss) => {
    const res = await fetch('/api/bosses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(boss),
    });
    const data = await res.json();
    set(state => ({ bosses: [...state.bosses, data] }));
  },
  
  updateBoss: async (id, boss) => {
    const res = await fetch(`/api/bosses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(boss),
    });
    const data = await res.json();
    set(state => ({
      bosses: state.bosses.map(b => b.id === id ? data : b),
    }));
  },
  
  addStaff: async (staff) => {
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staff),
    });
    const data = await res.json();
    set(state => ({ staffs: [...state.staffs, data] }));
  },
  
  updateStaff: async (id, staff) => {
    const res = await fetch(`/api/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staff),
    });
    const data = await res.json();
    set(state => ({
      staffs: state.staffs.map(s => s.id === id ? data : s),
    }));
  },
  
  deleteStaff: async (id) => {
    const res = await fetch(`/api/staff/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      set(state => ({
        staffs: state.staffs.filter(s => s.id !== id),
      }));
    } else {
      const data = await res.json();
      throw new Error(data.error);
    }
  },
  
  addTask: async (task) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    set(state => ({ tasks: [...state.tasks, data] }));
  },
  
  updateTask: async (id, task) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? data : t),
    }));
  },
}));
