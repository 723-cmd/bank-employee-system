import { useState, useEffect } from 'react';
import { X, User, Lock, Mail } from 'lucide-react';
import { User as UserType } from '../../data/mockData';
import { getUsers, saveUsers, validateUserNo, validatePassword, getRoles } from '../../utils/storage';

interface EmployeeFormProps {
  user: UserType | null;
  onClose: () => void;
  onSubmit: () => void;
}

const EmployeeForm = ({ user, onClose, onSubmit }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<{
    user_no: string;
    user_name: string;
    login_username: string;
    login_password: string;
    gender: 'm' | 'f';
    salary: number;
    role_no: string;
  }>({
    user_no: '',
    user_name: '',
    login_username: '',
    login_password: '',
    gender: 'm',
    salary: 0,
    role_no: 'R002',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        user_no: user.user_no,
        user_name: user.user_name,
        login_username: user.login_username,
        login_password: user.login_password,
        gender: user.gender,
        salary: user.salary,
        role_no: user.role_no,
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_no) newErrors.user_no = '请输入工号';
    else if (!validateUserNo(formData.user_no)) newErrors.user_no = '工号必须是10位数字';

    if (!formData.user_name) newErrors.user_name = '请输入姓名';
    else if (formData.user_name.length > 8) newErrors.user_name = '姓名不能超过4个汉字';

    if (!formData.login_password) newErrors.login_password = '请输入密码';
    else if (!validatePassword(formData.login_password)) newErrors.login_password = '密码必须是6位数字';

    if (formData.salary <= 0) newErrors.salary = '工资必须大于0';

    if (!user) {
      const existingUsers = getUsers();
      if (existingUsers.some(u => u.user_no === formData.user_no)) {
        newErrors.user_no = '该工号已存在';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const existingUsers = getUsers();
    let updatedUsers;

    if (user) {
      updatedUsers = existingUsers.map(u =>
        u.user_no === user.user_no ? { ...formData } : u
      );
    } else {
      updatedUsers = [...existingUsers, formData];
    }

    saveUsers(updatedUsers);
    onSubmit();
  };

  const roles = getRoles();

  return (
    <div className="fixed inset-0 bg-accent-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-3xl shadow-card w-full max-w-lg animate-scale-in overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-accent-100">
          <div>
            <h2 className="text-lg font-bold text-accent-700">
              {user ? '编辑员工档案' : '新建员工档案'}
            </h2>
            <p className="text-xs text-accent-500 mt-0.5">
              {user ? '修改员工信息并保存' : '填写员工基本信息创建档案'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-100 rounded-xl transition-colors text-accent-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 工号 */}
          <div>
            <label className="block text-xs font-medium text-accent-600 mb-1.5">工号</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400" />
              <input
                type="text"
                value={formData.user_no}
                onChange={(e) => setFormData({ ...formData, user_no: e.target.value })}
                disabled={!!user}
                className={`input-field pl-10 h-11 ${errors.user_no ? 'border-red-400 focus:ring-red-200' : ''}`}
                placeholder="10位数字"
              />
            </div>
            {errors.user_no && <p className="text-red-500 text-xs mt-1.5">{errors.user_no}</p>}
          </div>

          {/* 姓名 */}
          <div>
            <label className="block text-xs font-medium text-accent-600 mb-1.5">姓名</label>
            <input
              type="text"
              value={formData.user_name}
              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              className={`input-field h-11 ${errors.user_name ? 'border-red-400 focus:ring-red-200' : ''}`}
              placeholder="小于4个汉字"
            />
            {errors.user_name && <p className="text-red-500 text-xs mt-1.5">{errors.user_name}</p>}
          </div>

          {/* 登录用户名 */}
          <div>
            <label className="block text-xs font-medium text-accent-600 mb-1.5">登录用户名</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400" />
              <input
                type="text"
                value={formData.login_username}
                onChange={(e) => setFormData({ ...formData, login_username: e.target.value })}
                className="input-field pl-10 h-11"
                placeholder="用于系统登录"
              />
            </div>
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-xs font-medium text-accent-600 mb-1.5">登录密码</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-400" />
              <input
                type="password"
                value={formData.login_password}
                onChange={(e) => setFormData({ ...formData, login_password: e.target.value })}
                className={`input-field pl-10 h-11 ${errors.login_password ? 'border-red-400 focus:ring-red-200' : ''}`}
                placeholder="6位数字"
              />
            </div>
            {errors.login_password && <p className="text-red-500 text-xs mt-1.5">{errors.login_password}</p>}
          </div>

          {/* 性别 + 工资 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-accent-600 mb-1.5">性别</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'm' | 'f' })}
                className="input-field h-11"
              >
                <option value="m">男</option>
                <option value="f">女</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-accent-600 mb-1.5">月薪 (元)</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className={`input-field h-11 ${errors.salary ? 'border-red-400 focus:ring-red-200' : ''}`}
                placeholder="0.00"
              />
              {errors.salary && <p className="text-red-500 text-xs mt-1.5">{errors.salary}</p>}
            </div>
          </div>

          {/* 岗位 */}
          <div>
            <label className="block text-xs font-medium text-accent-600 mb-1.5">所属岗位</label>
            <select
              value={formData.role_no}
              onChange={(e) => setFormData({ ...formData, role_no: e.target.value })}
              className="input-field h-11"
            >
              {roles.map(role => (
                <option key={role.role_no} value={role.role_no}>
                  {role.role_name} ({role.role_no})
                </option>
              ))}
            </select>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 h-11">
              取消
            </button>
            <button type="submit" className="btn-primary flex-1 h-11">
              {user ? '保存修改' : '创建员工'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
