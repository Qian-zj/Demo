import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import { Plus, Edit2, Search, Filter, Clock, DollarSign, Users } from 'lucide-react';
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

export default function HostedTasksMobile() {
  const { tasks, staffs, bosses } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const [showFilter, setShowFilter] = useState(false);

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
    return staff ? staff.name : '-';
  };

  const formatTaskValue = (value: any, type: 'daily' | 'weekly' | 'abyss') => {
    if (!value) return '-';
    if (type === 'daily') return DAILY_TASK_OPTIONS[value as keyof typeof DAILY_TASK_OPTIONS] || value;
    if (type === 'weekly') {
      if (!Array.isArray(value)) return '-';
      return value.map((v) => WEEKLY_TASK_OPTIONS[v as keyof typeof WEEKLY_TASK_OPTIONS] || v).join(', ');
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
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center space-x-1 px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm">
            <Filter className="w-4 h-4" />
            <span>筛选</span>
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
          <Plus className="w-4 h-4" />
          <span>新增</span>
        </button>
      </div>

      {/* 筛选面板 */}
      {showFilter && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">筛选条件</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="游戏账号"
              onChange={(e) => setFilters({ ...filters, gameAccount: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="老板编号"
              onChange={(e) => setFilters({ ...filters, bossNo: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <select
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">所有状态</option>
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
            <option value="已暂停">已暂停</option>
          </select>
        </div>
      )}

      {/* 任务卡片列表 */}
      <div className="space-y-3">
        {filteredTasks.map((task: any) => (
          <div
            key={task.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* 任务头部 */}
            <div className="bg-gradient-to-r from-blue-50 to-white px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{task.gameAccount}</h3>
                  <p className="text-xs text-gray-500">{task.gameId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === '进行中' ? 'bg-blue-100 text-blue-800' :
                  task.status === '已完成' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>

            {/* 任务内容 */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">老板</p>
                    <p className="text-sm font-medium">{task.bossNo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">金额</p>
                    <p className="text-sm font-medium">收 {task.income}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">日期</p>
                  <p className="text-sm">{task.startDate} 至 {task.endDate}</p>
                </div>
              </div>

              {/* 任务类型标签 */}
              <div className="flex flex-wrap gap-1">
                {task.dailyTask && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {formatTaskValue(task.dailyTask, 'daily')}
                  </span>
                )}
                {task.weeklyTasks?.length > 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    周任务
                  </span>
                )}
                {task.abyssTasks?.length > 0 && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                    深渊
                  </span>
                )}
              </div>
            </div>

            {/* 任务底部操作栏 */}
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs text-blue-800 font-medium">
                  {getStaffName(task.staffId).charAt(0)}
                </div>
                <span className="text-sm text-gray-600">{getStaffName(task.staffId)}</span>
              </div>
              <button
                onClick={() => handleEdit(task)}
                className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
                <Edit2 className="w-4 h-4" />
                <span>编辑</span>
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>暂无托管任务</p>
          </div>
        )}
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
