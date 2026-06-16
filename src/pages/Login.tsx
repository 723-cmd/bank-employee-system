import { useState } from 'react';
import { Banknote, User, Lock, Eye, EyeOff, UserPlus, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addPendingUser, validateUserNo, validatePassword } from '../utils/storage';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', userNo: '', role: 'R002', password: '' });
  const [regSuccess, setRegSuccess] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    const result = login(username, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.userNo || !regForm.password) {
      setError('请填写完整信息');
      return;
    }
    if (!validateUserNo(regForm.userNo)) {
      setError('工号必须为10位数字');
      return;
    }
    if (!validatePassword(regForm.password)) {
      setError('密码必须为6位数字');
      return;
    }
    // 添加到待审核列表
    addPendingUser({
      user_name: regForm.name,
      user_no: regForm.userNo,
      role_no: regForm.role,
      login_username: regForm.name,
      login_password: regForm.password,
      gender: 'm',
      salary: regForm.role === 'R002' ? 5000 : 8000,
    });
    setRegSuccess(true);
    setTimeout(() => {
      setShowRegister(false);
      setRegSuccess(false);
      setRegForm({ name: '', userNo: '', role: 'R002', password: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#e0e7ff] p-4">
      {/* 装饰背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-card">
            <Banknote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-accent-700 mb-1.5">银行员工权限系统</h1>
          <p className="text-accent-500 text-sm">安全 · 高效 · 便捷</p>
        </div>

        {/* 登录卡片 */}
        {!showRegister && !showForgot ? (
          <div className="bg-white rounded-3xl shadow-card p-8 border border-accent-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 用户名 */}
              <div>
                <label className="block text-sm font-medium text-accent-600 mb-2">用户名</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-4.5 h-4.5 text-accent-500/70" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    className="input-field pl-11 h-12"
                    autoFocus
                  />
                </div>
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-sm font-medium text-accent-600 mb-2">密码</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-4.5 h-4.5 text-accent-500/70" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码（6位数字）"
                    className="input-field pl-11 pr-12 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-accent-500/70 hover:text-accent-600"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-3 rounded-xl text-sm animate-fade-in">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                  {error}
                </div>
              )}

              {/* 登录按钮 */}
              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700
                  text-white rounded-xl font-medium text-sm shadow-soft hover:shadow-card
                  transition-all duration-200 active:scale-[0.98]"
              >
                登 录
              </button>
            </form>

            {/* 底部功能链接 */}
            <div className="mt-6 pt-5 border-t border-accent-100">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-accent-500 hover:text-primary-600 transition-colors"
                >
                  忘记密码？
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  申请注册
                </button>
              </div>
            </div>

            {/* 安全提示 */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-accent-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>系统已启用安全防护，请通过正规渠道登录</span>
            </div>
          </div>
        ) : showRegister ? (
          /* 注册表单 */
          <div className="bg-white rounded-3xl shadow-card p-8 border border-accent-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-accent-700">申请注册账号</h2>
              <button
                onClick={() => { setShowRegister(false); setError(''); setRegSuccess(false); }}
                className="w-8 h-8 rounded-xl hover:bg-accent-50 flex items-center justify-center text-accent-500 transition-colors"
              >
                ×
              </button>
            </div>

            {regSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-accent-700 mb-2">注册申请已提交</h3>
                <p className="text-sm text-accent-500">您的账号正在等待管理员审核<br/>审核通过后即可登录</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-accent-600 mb-2">真实姓名</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-accent-500/70" />
                    </div>
                    <input
                      type="text"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      placeholder="请输入真实姓名"
                      className="input-field pl-11 h-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-accent-600 mb-2">工号</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="w-4 h-4 text-accent-500/70" />
                    </div>
                    <input
                      type="text"
                      value={regForm.userNo}
                      onChange={(e) => setRegForm({ ...regForm, userNo: e.target.value })}
                      placeholder="请输入10位工号"
                      className="input-field pl-11 h-11"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-accent-600 mb-2">申请岗位</label>
                  <select
                    value={regForm.role}
                    onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                    className="input-field h-11"
                  >
                    <option value="R002">柜员岗</option>
                    <option value="R001">管理岗（需特殊审批）</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-accent-600 mb-2">登录密码</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-accent-500/70" />
                    </div>
                    <input
                      type="password"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="请输入6位数字密码"
                      className="input-field pl-11 h-11"
                      maxLength={6}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700
                    text-white rounded-xl font-medium text-sm shadow-soft transition-all duration-200"
                >
                  提交注册申请
                </button>

                <button
                  type="button"
                  onClick={() => { setShowRegister(false); setError(''); }}
                  className="w-full h-11 text-accent-600 bg-accent-50 hover:bg-accent-100 rounded-xl font-medium text-sm transition-colors"
                >
                  返回登录
                </button>
              </form>
            )}
          </div>
        ) : (
          /* 忘记密码表单 */
          <div className="bg-white rounded-3xl shadow-card p-8 border border-accent-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-accent-700">忘记密码</h2>
              <button
                onClick={() => { setShowForgot(false); setError(''); }}
                className="w-8 h-8 rounded-xl hover:bg-accent-50 flex items-center justify-center text-accent-500 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-sky-500" />
              </div>
              <h3 className="text-lg font-semibold text-accent-700 mb-2">请联系管理员</h3>
              <p className="text-sm text-accent-500 leading-relaxed">
                为了保障账户安全，密码重置需要联系管理员进行操作。<br/>
                请前往银行柜台或联系系统管理员。
              </p>
            </div>

            <button
              onClick={() => setShowForgot(false)}
              className="w-full h-11 text-accent-600 bg-accent-50 hover:bg-accent-100 rounded-xl font-medium text-sm transition-colors"
            >
              返回登录
            </button>
          </div>
        )}

        {/* 页脚 */}
        <p className="text-center mt-6 text-xs text-accent-500/60">
          银行员工权限管理系统 © 2024
        </p>
      </div>
    </div>
  );
};

export default Login;
