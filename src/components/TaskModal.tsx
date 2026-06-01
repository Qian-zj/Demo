import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { X, Search } from 'lucide-react';

interface TaskModalProps {
  task: any;
  onClose: () => void;
}

const DAILY_TASK_OPTIONS = [
  { value: '', label: '无' },
  { value: 'daily', label: '每日' },
  { value: 'fullStamina', label: '满体' },
  { value: 'dailyStamina', label: '日体' },
];

const WEEKLY_TASK_OPTIONS = [
  { value: 'weekly1', label: '周常1' },
  { value: 'weekly2', label: '周常2' },
  { value: 'weeklyBoss', label: '周本' },
  { value: 'hollow', label: '空洞' },
];

const ABYSS_TASK_OPTIONS = [
  { value: 'defense', label: '式舆防卫战' },
  { value: 'assault', label: '危局强袭战' },
];

export default function TaskModal({ task, onClose }: TaskModalProps) {
  const { addTask, updateTask, staffs, bosses } = useAppStore();
  const [formData, setFormData] = useState<any>({
    gameAccount: '',
    gameId: '',
    bossNo: '',
    dailyTask: '',
    weeklyTasks: [],
    abyssTasks: [],
    notes: '',
    startDate: '',
    endDate: '',
    status: '进行中',
    loginDevice: '',
    staffId: '',
    income: 0,
    expense: 0,
    receiveDate: new Date().toISOString().split('T')[0],
  });
  const [bossSearch, setBossSearch] = useState('');

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const filteredBosses = bosses.filter((boss: any) => {
    const searchTerm = bossSearch.toLowerCase();
    return (
      boss.bossNo.toLowerCase().includes(searchTerm) ||
      boss.gameAccount.toLowerCase().includes(searchTerm) ||
      boss.gameId.toLowerCase().includes(searchTerm)
    );
  });

  const handleWeeklyChange = (value: string, checked: boolean) => {
    let newWeeklyTasks: string[];
    
    if (value === 'weekly1') {
      newWeeklyTasks = checked ? ['weekly1'] : formData.weeklyTasks.filter((v: string) => v !== 'weekly1');
    } else if (value === 'weekly2') {
      if (checked) {
        newWeeklyTasks = ['weekly2', 'weeklyBoss', 'hollow'];
      } else {
        newWeeklyTasks = formData.weeklyTasks.filter((v: string) => !['weekly2', 'weeklyBoss', 'hollow'].includes(v));
      }
    } else {
      if (checked) {
        newWeeklyTasks = [...formData.weeklyTasks, value];
      } else {
        newWeeklyTasks = formData.weeklyTasks.filter((v: string) => v !== value);
        if (newWeeklyTasks.includes('weekly2')) {
          newWeeklyTasks = newWeeklyTasks.filter((v: string) => v !== 'weekly2');
        }
      }
    }
    
    setFormData({ ...formData, weeklyTasks: newWeeklyTasks });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      await updateTask(task.id, formData);
    } else {
      await addTask(formData);
    }
    onClose();
  };

  const handleBossSelect = (boss: any) => {
    setFormData({
      ...formData,
      bossNo: boss.bossNo,
      gameAccount: boss.gameAccount,
      gameId: boss.gameId,
    });
    setBossSearch('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{task ? '编辑任务' : '新增任务'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">负责员工</label>
              <select
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">请选择</option>
                {staffs.map((staff: any) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}({staff.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">老板信息</label>
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={bossSearch || (formData.bossNo ? `${formData.bossNo}-${formData.gameAccount}-${formData.gameId}` : '')}
                    onChange={(e) => setBossSearch(e.target.value)}
                    placeholder="搜索老板..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {bossSearch && filteredBosses.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredBosses.map((boss: any) => (
                      <button
                        key={boss.id}
                        type="button"
                        onClick={() => handleBossSelect(boss)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {boss.bossNo}-{boss.gameAccount}-{boss.gameId}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">游戏账号</label>
              <input
                type="text"
                value={formData.gameAccount}
                onChange={(e) => setFormData({ ...formData, gameAccount: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">游戏ID</label>
              <input
                type="text"
                value={formData.gameId}
                onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">老板编号</label>
              <input
                type="text"
                value={formData.bossNo}
                onChange={(e) => setFormData({ ...formData, bossNo: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">日任务</label>
              <select
                value={formData.dailyTask}
                onChange={(e) => setFormData({ ...formData, dailyTask: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {DAILY_TASK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-start space-x-4 md:col-span-2">
              <label className="w-24 text-sm font-medium text-gray-700 pt-2">周任务</label>
              <div className="flex-1 flex flex-wrap gap-4">
                {WEEKLY_TASK_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.weeklyTasks.includes(opt.value)}
                      onChange={(e) => handleWeeklyChange(opt.value, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-start space-x-4 md:col-span-2">
              <label className="w-24 text-sm font-medium text-gray-700 pt-2">深渊任务</label>
              <div className="flex-1 flex flex-wrap gap-4">
                {ABYSS_TASK_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.abyssTasks.includes(opt.value)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newAbyss = checked
                          ? [...formData.abyssTasks, opt.value]
                          : formData.abyssTasks.filter((v: string) => v !== opt.value);
                        setFormData({ ...formData, abyssTasks: newAbyss });
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">开始日期</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">结束日期</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">备注</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">登录设备</label>
              <input
                type="text"
                value={formData.loginDevice}
                onChange={(e) => setFormData({ ...formData, loginDevice: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">收款金额</label>
              <input
                type="number"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: Number(e.target.value) })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">支出金额</label>
              <input
                type="number"
                value={formData.expense}
                onChange={(e) => setFormData({ ...formData, expense: Number(e.target.value) })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">收款日期</label>
              <input
                type="date"
                value={formData.receiveDate}
                onChange={(e) => setFormData({ ...formData, receiveDate: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-sm font-medium text-gray-700">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="进行中">进行中</option>
                <option value="已完成">已完成</option>
                <option value="已暂停">已暂停</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {task ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
