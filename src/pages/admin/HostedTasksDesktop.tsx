import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import { Plus, Edit2, Search } from 'lucide-react';
import TaskModal from '@/components/TaskModal';

const DAILY_TASK_OPTIONS = {
  daily: '每日',
  fullStamina: '满体',
  dailyStamina: '日体',
};

const WEEKLY_TASK_OPTIONS = {
  weekly1: '周常1',
  weekly2: '周常2',
  weeklyBoss: '周本',
  hollow: '空洞',
};

const ABYSS_TASK_OPTIONS = {
  defense: '式舆防卫战',
  assault: '危局强袭战',
};

export default function HostedTasksDesktop() {
  const { tasks, staffs, bosses } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});

  const filteredTasks = useMemo(() => {
    return tasks.filter((task: any) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (Array.isArray(task[key])) {
          return task[key].includes(value);
        }
        return String(task[key]).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }, [tasks, filters]);

  const getStaffName = (staffId: string) => {
    const staff = staffs.find((s: any) => s.id === staffId);
    return staff ? `${staff.name}(${staff.id})` : '-';
  };

  const formatTaskValue = (value: any, type: 'daily' | 'weekly' | 'abyss') => {
    if (!value) return '-';
    if (type === 'daily') return DAILY_TASK_OPTIONS[value as keyof typeof DAILY_TASK_OPTIONS] || value;
    if (type === 'weekly') {
      if (!Array.isArray(value)) return '-';
      return value.map((v) => WEEKLY_TASK_OPTIONS[v as keyof typeof WEEKLY_TASK_OPTIONS] || v).join(', ');
    }
    if (type === 'abyss') {
      if (!Array.isArray(value)) return '-';
      return value.map((v) => ABYSS_TASK_OPTIONS[v as keyof typeof ABYSS_TASK_OPTIONS] || v).join(', ');
    }
    return value;
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">托管任务</h1>
          <p className="text-gray-500 mt-1">管理所有托管任务</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>新增任务</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">筛选条件</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="游戏账号"
            onChange={(e) => setFilters({ ...filters, gameAccount: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="游戏ID"
            onChange={(e) => setFilters({ ...filters, gameId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="老板编号"
            onChange={(e) => setFilters({ ...filters, bossNo: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <select
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有状态</option>
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
            <option value="已暂停">已暂停</option>
          </select>
          <input
            type="text"
            placeholder="负责员工"
            onChange={(e) => setFilters({ ...filters, staffId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">游戏账号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">游戏ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">老板编号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">日任务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">周任务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">深渊任务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">备注</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">开始日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">结束日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">登录设备</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">负责员工</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">收款日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task: any) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{task.gameAccount}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.gameId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.bossNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatTaskValue(task.dailyTask, 'daily')}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatTaskValue(task.weeklyTasks, 'weekly')}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatTaskValue(task.abyssTasks, 'abyss')}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.notes || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.startDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.endDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === '进行中' ? 'bg-blue-100 text-blue-800' :
                      task.status === '已完成' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.loginDevice}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{getStaffName(task.staffId)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>收: {task.income}</div>
                    <div className="text-gray-500">支: {task.expense}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.receiveDate}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>编辑</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
