import { useState, useEffect, useCallback } from 'react';
import { Bell, User, Search, X, Check, CheckCheck, TrendingUp, Calendar, Building2, ClipboardList, Megaphone, Award, FileText } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getRoleNameByNo, getUsers } from './utils/storage';
import Login from './pages/Login';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Admin/Dashboard';
import EmployeeList from './pages/Admin/EmployeeList';
import RoleConfig from './pages/Admin/RoleConfig';
import AdminProfile from './pages/Admin/Profile';
import EmployeeProfile from './pages/Employee/Profile';
import ChangePassword from './pages/Employee/ChangePassword';
import SalaryReport from './pages/Admin/SalaryReport';
import Announcements from './pages/Admin/Announcements';
import OperationLogs from './pages/Admin/OperationLogs';
import TransactionRecords from './pages/Admin/TransactionRecords';
import RoleOverview from './pages/Admin/RoleOverview';
import Audit from './pages/Admin/Audit';
import MySalary from './pages/Employee/MySalary';
import MyTransactions from './pages/Employee/MyTransactions';
import MyAnnouncements from './pages/Employee/MyAnnouncements';

export interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 'n1', title: '新员工入职', content: '员工「张小坤」已加入柜员岗位', time: '10 分钟前', type: 'info', read: false },
  { id: 'n2', title: '权限变更', content: '管理岗权限配置已更新', time: '2 小时前', type: 'success', read: false },
  { id: 'n3', title: '系统公告', content: '本周六凌晨 2:00-4:00 进行系统维护', time: '1 天前', type: 'warning', read: true },
  { id: 'n4', title: '工资发放', content: '本月工资报表已生成，共 8 人', time: '2 天前', type: 'success', read: true },
  { id: 'n5', title: '登录提醒', content: '检测到您在新设备登录', time: '3 天前', type: 'info', read: true },
];

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: '管理首页', subtitle: '欢迎回来，查看系统概览' },
  employees: { title: '员工管理', subtitle: '管理所有员工档案信息' },
  roles: { title: '岗位权限配置', subtitle: '管理各岗位的系统权限菜单' },
  profile: { title: '个人设置', subtitle: '管理您的账户信息' },
  password: { title: '修改密码', subtitle: '安全修改您的登录密码' },
  salary: { title: '工资统计报表', subtitle: '查看员工工资数据与支出汇总' },
  announcements: { title: '公告通知', subtitle: '发布和查看系统公告信息' },
  logs: { title: '操作日志', subtitle: '查看系统操作记录' },
  transactions: { title: '业务办理记录', subtitle: '查看柜员业务办理数据' },
  overview: { title: '岗位结构概览', subtitle: '查看系统岗位与权限分布' },
  audit: { title: '注册审核', subtitle: '审核新员工注册申请' },
  'my-profile': { title: '个人档案', subtitle: '查看我的档案信息' },
  'my-salary': { title: '我的工资', subtitle: '查看个人薪资明细' },
  'my-transactions': { title: '我的业务', subtitle: '查看个人业务记录' },
  'my-announcements': { title: '公告通知', subtitle: '查看系统公告和通知' },
};

const AppContent = () => {
  const { user, isAdmin, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showQuickConfig, setShowQuickConfig] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markOneRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    if (isAdmin) {
      switch (currentPage) {
        case 'dashboard': return <Dashboard onNavigate={setCurrentPage} onOpenModal={(type) => {
          if (type === 'add-employee') setShowAddEmployee(true);
          else if (type === 'quick-config') setShowQuickConfig(true);
          else if (type === 'salary') setShowSalaryModal(true);
          else if (type === 'role-overview') setShowRoleModal(true);
        }} />;
        case 'employees': return <EmployeeList />;
        case 'roles': return <RoleConfig />;
        case 'profile': return <AdminProfile />;
        case 'salary': return <SalaryReport />;
        case 'announcements': return <Announcements />;
        case 'logs': return <OperationLogs />;
        case 'transactions': return <TransactionRecords />;
        case 'overview': return <RoleOverview />;
        case 'audit': return <Audit />;
        default: return <Dashboard onNavigate={setCurrentPage} onOpenModal={(type) => {
          if (type === 'add-employee') setShowAddEmployee(true);
          else if (type === 'quick-config') setShowQuickConfig(true);
          else if (type === 'salary') setShowSalaryModal(true);
          else if (type === 'role-overview') setShowRoleModal(true);
        }} />;
      }
    } else {
      switch (currentPage) {
        case 'my-profile': return <EmployeeProfile onPageChange={setCurrentPage} />;
        case 'my-salary': return <MySalary />;
        case 'my-transactions': return <MyTransactions />;
        case 'my-announcements': return <MyAnnouncements />;
        case 'profile': return <EmployeeProfile onPageChange={setCurrentPage} />;
        case 'password': return <ChangePassword onPageChange={setCurrentPage} />;
        default: return <EmployeeProfile onPageChange={setCurrentPage} />;
      }
    }
  };

  const pageInfo = pageTitles[currentPage] || { title: '首页', subtitle: '' };
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 星期${'日一二三四五六'[today.getDay()]}`;

  const renderModal = (open: boolean, onClose: () => void, title: string, children: React.ReactNode, width: string = 'max-w-md') => (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="absolute inset-0 bg-accent-700/40 backdrop-blur-sm" onClick={onClose} />
        <div className={`relative bg-white rounded-3xl shadow-card ${width} w-full animate-scale-in overflow-hidden`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-accent-100">
            <h3 className="text-base font-semibold text-accent-700">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-accent-50 flex items-center justify-center text-accent-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* 主内容区域 */}
      <div className="ml-[72px] min-h-screen">
        {/* 顶部导航栏 */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-accent-100 sticky top-0 z-20">
          <div className="flex items-center justify-between px-8 h-16">
            <div>
              <h2 className="text-lg font-semibold text-accent-700">{pageInfo.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              {/* 搜索框 */}
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-accent-500/60" />
                <input
                  type="text"
                  placeholder="搜索..."
                  className="w-56 pl-9 pr-4 py-2 text-sm bg-accent-50 border-0 rounded-xl text-accent-600 placeholder-accent-500/60
                    focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>

              {/* 通知 */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl bg-accent-50 hover:bg-accent-100 flex items-center justify-center transition-colors relative"
              >
                <Bell className="w-5 h-5 text-accent-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-primary-500 rounded-full text-[10px] text-white font-semibold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* 通知面板 */}
              {showNotifications && (
                <div className="absolute right-8 top-16 w-[380px] bg-white rounded-2xl shadow-card border border-accent-100 animate-scale-in z-40 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-accent-100">
                    <div>
                      <h4 className="text-sm font-semibold text-accent-700">通知中心</h4>
                      <p className="text-xs text-accent-500/70 mt-0.5">共 {notifications.length} 条，{unreadCount} 条未读</p>
                    </div>
                    <button onClick={markAllRead} className="text-xs text-primary-600 hover:text-primary-700 font-medium">全部标记为已读</button>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markOneRead(notif.id)}
                        className={`px-5 py-4 border-b border-accent-100 last:border-b-0 hover:bg-accent-50/50 cursor-pointer transition-colors ${!notif.read ? 'bg-primary-50/30' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center ${
                            notif.type === 'info' ? 'bg-sky-100 text-sky-600' :
                            notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-amber-100 text-amber-600'
                          }`}>
                            {notif.type === 'info' ? <Megaphone className="w-4 h-4" /> :
                             notif.type === 'success' ? <Check className="w-4 h-4" /> :
                             <Calendar className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-accent-700">{notif.title}</p>
                              {!notif.read && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />}
                            </div>
                            <p className="text-xs text-accent-500 mt-1 leading-relaxed">{notif.content}</p>
                            <p className="text-xs text-accent-400 mt-1.5">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 bg-accent-50/50 border-t border-accent-100">
                    <button
                      onClick={() => { setShowNotifications(false); setCurrentPage(isAdmin ? 'announcements' : 'my-announcements'); }}
                      className="w-full text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors"
                    >
                      查看全部公告 →
                    </button>
                  </div>
                </div>
              )}

              {/* 用户信息 */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-xl hover:bg-accent-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-accent-700">{user.user_name}</p>
                    <p className="text-xs text-accent-500/70">{getRoleNameByNo(user.role_no)}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-card border border-accent-100 p-2 animate-scale-in z-30">
                    <div className="px-3 py-3 border-b border-accent-100">
                      <p className="text-sm font-medium text-accent-700">{user.user_name}</p>
                      <p className="text-xs text-accent-500/70">{getRoleNameByNo(user.role_no)}</p>
                    </div>
                    <button
                      onClick={() => { setCurrentPage('profile'); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-accent-600 rounded-lg hover:bg-accent-50 transition-colors"
                    >
                      个人设置
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { setCurrentPage('logs'); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-accent-600 rounded-lg hover:bg-accent-50 transition-colors"
                      >
                        操作日志
                      </button>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-8 animate-fade-in">
          {renderPage()}
        </main>

        {/* 页脚 */}
        <footer className="px-8 py-6 text-center text-xs text-accent-500/60 border-t border-accent-100">
          <p>{dateStr} · 银行员工权限管理系统 © 2024</p>
        </footer>
      </div>

      {/* 点击外部关闭菜单 */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => { setShowUserMenu(false); setShowNotifications(false); }}
        />
      )}

      {/* 新增员工快速弹窗 */}
      {renderModal(showAddEmployee, () => setShowAddEmployee(false), '新增员工快捷入口', (
        <div className="space-y-4">
          <p className="text-sm text-accent-500">点击下方按钮跳转至员工管理页面，在该页面可以新增员工档案。</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <User className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-sm font-medium text-accent-700">添加新员工</p>
              <p className="text-xs text-accent-500 mt-1">录入完整员工信息</p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
              <ClipboardList className="w-5 h-5 text-sky-600 mb-2" />
              <p className="text-sm font-medium text-accent-700">批量导入</p>
              <p className="text-xs text-accent-500 mt-1">Excel 批量导入员工</p>
            </div>
          </div>
          <button
            onClick={() => { setShowAddEmployee(false); setCurrentPage('employees'); }}
            className="w-full btn-primary"
          >
            前往员工管理页面
          </button>
        </div>
      ), 'max-w-lg')}

      {/* 权限配置快速弹窗 */}
      {renderModal(showQuickConfig, () => setShowQuickConfig(false), '权限配置快捷入口', (
        <div className="space-y-4">
          <p className="text-sm text-accent-500">点击下方按钮跳转至权限配置页面，管理各岗位的系统权限菜单。</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
              <Building2 className="w-5 h-5 text-sky-600 mb-2" />
              <p className="text-sm font-medium text-accent-700">岗位管理</p>
              <p className="text-xs text-accent-500 mt-1">管理系统岗位</p>
            </div>
            <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
              <FileText className="w-5 h-5 text-violet-600 mb-2" />
              <p className="text-sm font-medium text-accent-700">菜单权限</p>
              <p className="text-xs text-accent-500 mt-1">配置菜单访问权限</p>
            </div>
          </div>
          <button
            onClick={() => { setShowQuickConfig(false); setCurrentPage('roles'); }}
            className="w-full btn-primary"
          >
            前往权限配置页面
          </button>
        </div>
      ), 'max-w-lg')}

      {/* 工资统计弹窗 */}
      {renderModal(showSalaryModal, () => setShowSalaryModal(false), '工资统计', (
        <div className="space-y-4">
          <p className="text-sm text-accent-500">查看详细工资报表和支出数据。</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
              <TrendingUp className="w-5 h-5 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-accent-700">工资趋势</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <CheckCheck className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-accent-700">发放记录</p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center">
              <Award className="w-5 h-5 text-sky-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-accent-700">薪酬分析</p>
            </div>
          </div>
          <button
            onClick={() => { setShowSalaryModal(false); setCurrentPage('salary'); }}
            className="w-full btn-primary"
          >
            查看完整工资报表
          </button>
        </div>
      ), 'max-w-lg')}

      {/* 岗位概览弹窗 */}
      {renderModal(showRoleModal, () => setShowRoleModal(false), '岗位结构概览', (
        <div className="space-y-4">
          <p className="text-sm text-accent-500">查看系统岗位与权限分布。</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary-50 border border-primary-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-accent-700">管理岗</p>
                  <p className="text-xs text-accent-500">拥有全部系统权限</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-primary-600">3 人</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-accent-700">柜员岗</p>
                  <p className="text-xs text-accent-500">基础业务办理权限</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-emerald-600">5 人</span>
            </div>
          </div>
          <button
            onClick={() => { setShowRoleModal(false); setCurrentPage('overview'); }}
            className="w-full btn-primary"
          >
            查看完整岗位结构
          </button>
        </div>
      ), 'max-w-lg')}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
