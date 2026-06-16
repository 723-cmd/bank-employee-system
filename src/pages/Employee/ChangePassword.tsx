import { useState } from 'react';
import { Lock, Save, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveUsers, getUsers, validatePassword } from '../../utils/storage';

interface ChangePasswordProps {
  onPageChange: (page: string) => void;
}

const ChangePassword = ({ onPageChange }: ChangePasswordProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (!formData.old_password) {
      setErrors({ old: '请输入原密码' });
      return;
    }

    if (!formData.new_password) {
      setErrors({ new: '请输入新密码' });
      return;
    }

    if (!validatePassword(formData.new_password)) {
      setErrors({ new: '密码必须是6位数字' });
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setErrors({ confirm: '两次输入的密码不一致' });
      return;
    }

    if (formData.old_password !== user?.login_password) {
      setErrors({ old: '原密码不正确' });
      return;
    }

    const users = getUsers();
    const updatedUsers = users.map(u => {
      if (u.user_no === user?.user_no) {
        return { ...u, login_password: formData.new_password };
      }
      return u;
    });

    saveUsers(updatedUsers);
    setMessage('密码修改成功！');
    setFormData({ old_password: '', new_password: '', confirm_password: '' });
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in max-w-md mx-auto space-y-6">
      <div className="mb-6">
        <button
          onClick={() => onPageChange('profile')}
          className="flex items-center gap-2 text-accent-500 hover:text-accent-700 mb-4 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回个人档案
        </button>
        <h1 className="text-xl font-bold text-accent-700 mb-1">修改密码</h1>
        <p className="text-sm text-accent-500">安全修改您的登录密码</p>
      </div>

      {/* 密码修改表单 */}
      <div className="card !p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-semibold">密码安全</h2>
              <p className="text-xs text-white/70 mt-0.5">请使用6位数字作为密码</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-accent-600 mb-1.5">原密码</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400" />
              <input
                type="password"
                value={formData.old_password}
                onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                className={`input-field pl-10 h-11 ${errors.old ? 'border-red-400 focus:ring-red-200' : ''}`}
                placeholder="请输入原密码"
              />
            </div>
            {errors.old && <p className="text-red-500 text-xs mt-1.5">{errors.old}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-accent-600 mb-1.5">新密码</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400" />
              <input
                type="password"
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                className={`input-field pl-10 h-11 ${errors.new ? 'border-red-400 focus:ring-red-200' : ''}`}
                placeholder="6位数字新密码"
              />
            </div>
            {errors.new && <p className="text-red-500 text-xs mt-1.5">{errors.new}</p>}
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
                placeholder="再次输入新密码"
              />
            </div>
            {errors.confirm && <p className="text-red-500 text-xs mt-1.5">{errors.confirm}</p>}
          </div>

          {message && (
            <div className="text-sm text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => onPageChange('profile')} className="btn-secondary flex-1 h-11">
              取消
            </button>
            <button type="submit" className="btn-primary flex-1 h-11 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              保存密码
            </button>
          </div>
        </form>
      </div>

      {/* 安全提示 */}
      <div className="p-4 bg-accent-50/60 rounded-2xl">
        <p className="text-xs text-accent-500 leading-relaxed">
          <span className="font-medium text-accent-600">安全提示：</span>
          请勿使用生日、手机号等容易被猜测的数字作为密码。定期更换密码有助于保障您的账户安全。
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
