import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { useDevice } from "@/hooks/useDevice";
import Login from "@/pages/Login";
import AdminLayout from "@/components/AdminLayout";
import AdminMobileLayout from "@/components/AdminMobileLayout";
import StaffLayout from "@/components/StaffLayout";
import StaffMobileLayout from "@/components/StaffMobileLayout";
import HostedTasks from "@/pages/admin/HostedTasks";
import GanttView from "@/pages/admin/GanttView";
import Bosses from "@/pages/admin/Bosses";
import Staffs from "@/pages/admin/Staffs";
import StaffHostedTasks from "@/pages/staff/StaffHostedTasks";
import StaffDailyTasks from "@/pages/staff/StaffDailyTasks";
import StaffProfile from "@/pages/staff/StaffProfile";

export default function App() {
  const { user } = useAppStore();
  const { isMobile } = useDevice();

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/staff'} /> : <Login />} />
        
        {user?.role === 'admin' && (
          <Route path="/admin" element={isMobile ? <AdminMobileLayout /> : <AdminLayout />}>
            <Route index element={<Navigate to="/admin/tasks/hosted" />} />
            <Route path="tasks/hosted" element={<HostedTasks />} />
            <Route path="tasks/gantt" element={<GanttView />} />
            <Route path="bosses" element={<Bosses />} />
            <Route path="staff" element={<Staffs />} />
          </Route>
        )}
        
        {user?.role === 'staff' && (
          <Route path="/staff" element={isMobile ? <StaffMobileLayout /> : <StaffLayout />}>
            <Route index element={<Navigate to="/staff/tasks/hosted" />} />
            <Route path="tasks/hosted" element={<StaffHostedTasks />} />
            <Route path="tasks/daily" element={<StaffDailyTasks />} />
            <Route path="profile" element={<StaffProfile />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}
