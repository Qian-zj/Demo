import { useDevice } from '@/hooks/useDevice';
import DailyTasksDesktop from './DailyTasksDesktop';
import DailyTasksMobile from './DailyTasksMobile';

export default function DailyTasks() {
  const { isMobile } = useDevice();
  
  return isMobile ? <DailyTasksMobile /> : <DailyTasksDesktop />;
}
