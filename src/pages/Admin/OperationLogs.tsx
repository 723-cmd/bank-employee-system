import { useEffect, useState } from 'react';
import { Activity, User, Search, Filter, Calendar, Clock, ChevronRight, Settings, KeyRound, Users, Plus } from 'lucide-react';
import { getUsers } from '../../utils/storage';
import { User as UserType } from '../../data/mockData';

interface LogEntry {
  id: string;
  user_name: string;
  action: string;
  module: string;
  time: string;
  date: string;
  status: 'success' | 'warning' | 'error';
  details: string;
  icon: 'settings' | 'key' | 'users' | 'plus' | 'user';
}

const generateLogs = (users: UserType[]): LogEntry[] => {
  const templates = [
    { action: '登录系统', module: '账户', icon: 'user' as const, status: 'success' as const, details: '用户成功登录系统' },
    { action: '修改密码', module: '安全', icon: 'key' as const, status: 'success' as const, details: '用户修改登录密码' },
    { action: '新增员工', module: '人事', icon: 'plus' as const, status: 'success' as const, details: '在员工管理模块新增员工档案' },
    { action: '编辑员工信息', module: '人事', icon: 'users' as const, status: 'success' as const, details: '更新员工档案信息' },
    { action: '权限配置变更', module: '权限', icon: 'settings' as const, status: 'warning' as const, details: '修改岗位权限菜单配置' },
    { action: '查看员工档案', module: '人事', icon: 'user' as const, status: 'success' as const, details: '浏览员工档案信息' },
    { action: '个人设置更新', module: '账户', icon: 'settings' as const, status: 'success' as const, details: '更新个人设置信息' },
    { action: '系统维护操作', module: '系统', icon: 'settings' as const, status: 'warning' as const, details: '执行系统维护相关操作' },
  ];

  const logs: LogEntry[] = [];
  const usernames = users.map(u => u.user_name);

  for (let i = 0; i < 20; i++) {
    const template = templates[i % templates.length];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(i / 3));
    date.setHours(18 - (i % 10), (i * 7) % 60, (i * 13) % 60);

    logs.push({
      id: `log_${i}`,
      user_name: usernames[i % usernames.length],
      action: template.action,
      module: template.module,
      time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`,
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      status: template.status,
      details: template.details,
      icon: template.icon,
    });
  }

  return logs;
};

const OperationLogs = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  void users;
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    const us = getUsers();
    setUsers(us);
    setLogs(generateLogs(us));
  }, []);

  let filtered = logs;
  if (search) filtered = filtered.filter(l => l.user_name.includes(search) || l.action.includes(search) || l.module.includes(search));
  if (filterStatus !== 'all') filtered = filtered.filter(l => l.status === filterStatus);
  if (filterModule !== 'all') filtered = filtered.filter(l => l.module === filterModule);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'settings': return <Settings className="w-4 h-4 text-violet-600" />;
      case 'key': return <KeyRound className="w-4 h-4 text-amber-600" />;
      case 'users': return <Users className="w-4 h-4 text-sky-600" />;
      case 'plus': return <Plus className="w-4 h-4 text-emerald-600" />;
      default: return <User className="w-4 h-4 text-primary-600" />;
    }
  };

  const getIconBg = (icon: string) => {
    switch (icon) {
      case 'settings': return 'bg-violet-50';
      case 'key': return 'bg-amber-50';
      case 'users': return 'bg-sky-50';
      case 'plus': return 'bg-emerald-50';
      default: return 'bg-primary-50';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'error': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-accent-50 text-accent-600 border-accent-100';
    }
  };

  const modules = Array.from(new Set(logs.map(l => l.module)));

  return (
    <div className="animate-fade-in space-y-6 max-w-[1400px]">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-700">操作日志</h2>
          <p className="text-sm text-accent-500 mt-1">查看系统操作记录</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center mb-3 shadow-soft">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">总操作数</p>
          <p className="text-2xl font-bold text-accent-700">{logs.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-3 shadow-soft">
            <CheckIcon />
          </div>
          <p className="text-xs text-accent-500 mb-1">成功</p>
          <p className="text-2xl font-bold text-accent-700">{logs.filter(l => l.status === 'success').length}</p>
        </div>
        <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-3 shadow-soft">
            <WarningIcon />
          </div>
          <p className="text-xs text-accent-500 mb-1">警告</p>
          <p className="text-2xl font-bold text-accent-700">{logs.filter(l => l.status === 'warning').length}</p>
        </div>
        <div className="card bg-gradient-to-br from-red-50 to-red-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center mb-3 shadow-soft">
            <ErrorIcon />
          </div>
          <p className="text-xs text-accent-500 mb-1">异常</p>
          <p className="text-2xl font-bold text-accent-700">{logs.filter(l => l.status === 'error').length}</p>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-accent-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索操作人、动作..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-accent-200 bg-white rounded-xl text-accent-600 placeholder-accent-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-accent-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-8 py-2.5 text-sm border border-accent-200 bg-white rounded-xl text-accent-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all appearance-none cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="success">成功</option>
                <option value="warning">警告</option>
                <option value="error">异常</option>
              </select>
            </div>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="px-4 py-2.5 text-sm border border-accent-200 bg-white rounded-xl text-accent-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all appearance-none cursor-pointer"
            >
              <option value="all">全部模块</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 日志表格 */}
      <div className="card !p-0 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 bg-accent-50/50 text-xs font-semibold text-accent-500 uppercase tracking-wider">
          <div className="col-span-3">操作人</div>
          <div className="col-span-2">模块</div>
          <div className="col-span-3">操作</div>
          <div className="col-span-2">日期</div>
          <div className="col-span-1">时间</div>
          <div className="col-span-1 text-center">状态</div>
        </div>

        <div className="divide-y divide-accent-100">
          {filtered.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className="grid grid-cols-12 px-6 py-4 items-center hover:bg-accent-50/50 transition-colors cursor-pointer group"
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                  {log.user_name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-accent-700">{log.user_name}</span>
              </div>
              <div className="col-span-2">
                <span className="inline-flex items-center px-2.5 py-1 bg-accent-50 text-accent-600 text-xs rounded-lg">
                  {log.module}
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg ${getIconBg(log.icon)} flex items-center justify-center`}>
                  {getIcon(log.icon)}
                </div>
                <span className="text-sm text-accent-600">{log.action}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1 text-sm text-accent-500">
                <Calendar className="w-3.5 h-3.5" /> {log.date}
              </div>
              <div className="col-span-1 flex items-center gap-1 text-sm text-accent-500">
                <Clock className="w-3.5 h-3.5" /> {log.time}
              </div>
              <div className="col-span-1 flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg border ${getStatusStyle(log.status)}`}>
                  {log.status === 'success' ? '成功' : log.status === 'warning' ? '警告' : '异常'}
                </span>
                <ChevronRight className="w-4 h-4 text-accent-300 group-hover:text-accent-500 transition-colors" />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-accent-500 text-sm">暂无日志数据</div>
          )}
        </div>
      </div>

      {/* 日志详情弹窗 */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-accent-700/40 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <div className="relative bg-white rounded-3xl shadow-card max-w-md w-full animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-accent-100">
              <h3 className="text-base font-semibold text-accent-700">操作详情</h3>
              <button onClick={() => setSelectedLog(null)} className="w-8 h-8 rounded-xl hover:bg-accent-50 flex items-center justify-center text-accent-500 transition-colors">
                <XIcon />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-accent-100">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                  {selectedLog.user_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-accent-700">{selectedLog.user_name}</p>
                  <p className="text-xs text-accent-500">{selectedLog.action}</p>
                </div>
                <span className={`ml-auto inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl border ${getStatusStyle(selectedLog.status)}`}>
                  {selectedLog.status === 'success' ? '成功' : selectedLog.status === 'warning' ? '警告' : '异常'}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent-500">所属模块</span>
                  <span className="text-accent-700 font-medium">{selectedLog.module}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent-500">操作日期</span>
                  <span className="text-accent-700 font-medium">{selectedLog.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent-500">操作时间</span>
                  <span className="text-accent-700 font-medium">{selectedLog.time}</span>
                </div>
                <div className="pt-3 border-t border-accent-100">
                  <p className="text-xs text-accent-500 mb-2">详细描述</p>
                  <p className="text-sm text-accent-600 leading-relaxed">{selectedLog.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default OperationLogs;
