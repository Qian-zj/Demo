import { useState } from 'react';
import { useAppStore } from '@/store';
import { User, Upload } from 'lucide-react';

export default function StaffProfile() {
  const { user, staffs, updateStaff } = useAppStore();
  const currentStaff = staffs.find((s: any) => s.id === user?.id);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    if (currentStaff && passwordForm.oldPassword !== currentStaff.password) {
      alert('原密码不正确');
      return;
    }

    if (currentStaff) {
      updateStaff(currentStaff.id, { password: passwordForm.newPassword });
      setIsEditingPassword(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      alert('密码修改成功');
    }
  };

  const handleAvatarUpload = (files: FileList) => {
    if (files[0] && currentStaff) {
      const avatarUrl = URL.createObjectURL(files[0]);
      updateStaff(currentStaff.id, { avatar: avatarUrl });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">个人中心</h1>
        <p className="text-gray-500 mt-1">管理个人信息</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 头像区域 */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4 overflow-hidden">
              {currentStaff?.avatar ? (
                <img
                  src={currentStaff.avatar}
                  alt="头像"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-blue-500" />
              )}
            </div>
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
              <Upload className="w-4 h-4" />
              <span>更换头像</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleAvatarUpload(e.target.files);
                  }
                }}
              />
            </label>
          </div>

          {/* 基本信息 */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">姓名</p>
                <p className="font-medium text-gray-900">{currentStaff?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">用户名</p>
                <p className="font-medium text-gray-900">{currentStaff?.username || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">状态</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentStaff?.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {currentStaff?.status === 'active' ? '在职中' : '已离职'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 修改密码区域 */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">安全设置</h3>
            {!isEditingPassword && (
              <button
                onClick={() => setIsEditingPassword(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                修改密码
              </button>
            )}
          </div>

          {isEditingPassword && (
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">原密码</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingPassword(false);
                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
