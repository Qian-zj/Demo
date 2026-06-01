import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store';
import 'dhtmlx-gantt';

declare let gantt: any;

export default function GanttView() {
  const { tasks, staffs } = useAppStore();
  const ganttContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ganttContainerRef.current) return;

    gantt.config.date_format = '%Y-%m-%d';
    gantt.config.scale_height = 50;
    gantt.config.grid_width = 300;
    gantt.config.grid_attach = 'left';
    gantt.config.columns = [
      { name: 'text', label: '任务名称', tree: true, width: 150 },
      { name: 'staff', label: '负责员工', width: 150 },
    ];

    const ganttData = {
      data: tasks.map((task: any) => {
        const staff = staffs.find((s: any) => s.id === task.staffId);
        return {
          id: task.id,
          text: `${task.gameAccount} - ${task.gameId}`,
          start_date: task.startDate,
          end_date: task.endDate,
          staff: staff ? staff.name : '-',
          progress: task.status === '已完成' ? 1 : task.status === '进行中' ? 0.5 : 0,
        };
      }),
      links: [],
    };

    gantt.init(ganttContainerRef.current);
    gantt.parse(ganttData);

    return () => {
      gantt.clearAll();
    };
  }, [tasks, staffs]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">任务进度</h1>
        <p className="text-gray-500 mt-1">甘特图展示所有托管任务进度</p>
      </div>
      <div
        ref={ganttContainerRef}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
        style={{ height: '600px' }}
      />
    </div>
  );
}
