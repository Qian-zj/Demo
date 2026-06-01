import { useDevice } from '@/hooks/useDevice';
import HostedTasksDesktop from './HostedTasksDesktop';
import HostedTasksMobile from './HostedTasksMobile';

export default function HostedTasks() {
  const { isMobile } = useDevice();
  
  return isMobile ? <HostedTasksMobile /> : <HostedTasksDesktop />;
}
