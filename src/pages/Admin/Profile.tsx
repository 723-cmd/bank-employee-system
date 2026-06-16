import { useState } from 'react';
import { User, Lock, Mail, Briefcase, DollarSign, Save, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveUsers, getUsers, validatePassword, getRoleNameByNo } from '../../utils/storage';

const Profile = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    login_username: user?.login_username || '',
    login_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (!formData.login_username) {
      setErrors({ username: '请输入用户名' });
      return;
    }

    if (formData.login_password) {
      if (!validatePassword(formData.login_password)) {
        setErrors({ password: '密码必须是6位数字' });
        return;
      }
      if (formData.login_password !== formData.confirm_password) {
        setErrors({ confirm: '两次输入的密码不一致' });
        return;
      }
    }

    const users = getUsers();
    const updatedUsers = users.map(u => {
      if (u.user_no === user?.user_no) {
        return {
          ...u,
          login_username: formData.login_username,
          login_password: formData.login_password || u.login_password,
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    setMessage('管理员信息修改成功！');
    setEditing(false);
    setFormData({ login_username: formData.login_username, login_password: '', confirm_password: '' });
  };

  if (!user) return null;

  const infoItems = [
    { icon: User, label: '工号', value: user.user_no },
    { icon: Briefcase, label: '岗位', value: getRoleNameByNo(user.role_no) },
    { icon: DollarSign, label: '月薪', value: `¥ ${user.salary.toLocaleString()}` },
    { icon: User, label: '性别', value: user.gender === 'm' ? '男' : '女' },
  ];

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-accent-700 mb-1">个人设置</h1>
        <p className="text-sm text-accent-500">管理您的账户信息和登录凭证</p>
      </div>

      {/* 顶部用户资料卡 */}
      <div className="card !p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-8 text-white">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="text-3xl font-bold">{user.user_name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{user.user_name}</h2>
              <p className="text-white/80 text-sm">{getRoleNameByNo(user.role_no)}</p>
              <p className="text-white/60 text-xs mt-1">工号: {user.user_no}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          {infoItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-accent-50/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-accent-500 mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-accent-700 truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 账户设置 */}
      <div className="card !p-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-accent-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-accent-700">账户与密码</h3>
              <p className="text-xs text-accent-500">修改登录用户名和密码</p>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary !px-4 !py-2 !text-sm"
            >
              编辑信息
            </button>
          )}
        </div>

        <div className="p-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-accent-600 mb-1.5">登录用户名</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400" />
                  <input
                    type="text"
                    value={formData.login_username}
                    onChange={(e) => setFormData({ ...formData, login_username: e.target.value })}
                    className={`input-field pl-10 h-11 ${errors.username ? 'border-red-400 focus:ring-red-200' : ''}`}
                    placeholder="输入新用户名"
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1.5">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-accent-600 mb-1.5">新密码 <span className="text-accent-400 font-normal">（6位数字，不修改请留空）</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400" />
                  <input
                    type="password"
                    value={formData.login_password}
                    onChange={(e) => setFormData({ ...formData, login_password: e.target.value })}
                    className={`input-field pl-10 h-11 ${errors.password ? 'border-red-400 focus:ring-red-200' : ''}`}
                    placeholder="6位数字"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-accent-600 mb-1.5">确认新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400" />
                  <input
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    className={`input-field pl-10 h-11 ${errors.confirm ? 'border-red-400 focus:ring-red-200' : ''}`}
                    placeholder="确认密码"
                  />
                </div>
                {errors.confirm && <p className="text-red-500 text-xs mt-1.5">{errors.confirm}</p>}
              </div>

              {message && (
                <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {message}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1 h-11">
                  取消
                </button>
                <button type="submit" className="btn-primary flex-1 h-11 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-accent-50/60 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-accent-500 mb-0.5">当前登录用户名</p>
                  <p className="text-sm font-medium text-accent-700">{user.login_username}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
