import { useState } from 'react';
import { useAppStore } from '@/store';
import { Upload, X } from 'lucide-react';

export default function StaffDailyTasks() {
  const { user, tasks, updateTask } = useAppStore();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 这里我们暂时复用任务数据，实际应用中可以添加任务类型字段区分托管和代肝
  const myTasks = tasks.filter((task: any) => task.staffId === user?.id);

  const handleUploadImages = (taskId: string, files: FileList) => {
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    const task = tasks.find((t: any) => t.id === taskId);
    if (task) {
      updateTask(taskId, {
        returnImages: [...task.returnImages, ...newImages],
      });
    }
  };

  const handleUploadVideos = (taskId: string, files: FileList) => {
    const newVideos = Array.from(files).map((file) => URL.createObjectURL(file));
    const task = tasks.find((t: any) => t.id === taskId);
    if (task) {
      updateTask(taskId, {
        returnVideos: [...task.returnVideos, ...newVideos],
      });
    }
  };

  const openTaskDetail = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">我的代肝任务</h1>
        <p className="text-gray-500 mt-1">查看和管理负责的代肝任务</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myTasks.map((task: any) => (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openTaskDetail(task)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{task.gameAccount}</h3>
                <p className="text-sm text-gray-500">{task.gameId}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.status === '进行中' ? 'bg-blue-100 text-blue-800' :
                task.status === '已完成' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>老板编号：{task.bossNo}</p>
              <p>开始日期：{task.startDate}</p>
              <p>结束日期：{task.endDate}</p>
              <p>登录设备：{task.loginDevice}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">
                已上传图片：{task.returnImages.length} | 已上传视频：{task.returnVideos.length}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">任务详情</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">游戏账号</p>
                  <p className="font-medium">{selectedTask.gameAccount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">游戏ID</p>
                  <p className="font-medium">{selectedTask.gameId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">老板编号</p>
                  <p className="font-medium">{selectedTask.bossNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">登录设备</p>
                  <p className="font-medium">{selectedTask.loginDevice}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">上传返图</h3>
                <label className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">点击选择图片或拖拽到此处</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleUploadImages(selectedTask.id, e.target.files);
                      }
                    }}
                  />
                </label>

                {selectedTask.returnImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {selectedTask.returnImages.map((img: string, index: number) => (
                      <img key={index} src={img} alt={`返图 ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">上传视频</h3>
                <label className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">点击选择视频或拖拽到此处</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleUploadVideos(selectedTask.id, e.target.files);
                      }
                    }}
                  />
                </label>

                {selectedTask.returnVideos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {selectedTask.returnVideos.map((vid: string, index: number) => (
                      <video key={index} src={vid} controls className="w-full rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
