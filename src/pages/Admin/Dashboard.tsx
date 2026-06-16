import { useEffect, useState } from 'react';
import { Users, Briefcase, DollarSign, UserPlus, TrendingUp, Award, ChevronRight, FileText, ShieldCheck, Activity, Megaphone, ClipboardList, PiggyBank } from 'lucide-react';
import { getUsers, getRoleNameByNo } from '../../utils/storage';
import { User as UserType } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onOpenModal: (type: string) => void;
}

const Dashboard = ({ onNavigate, onOpenModal }: DashboardProps) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const adminCount = users.filter(u => u.role_no === 'R001').length;
  const employeeCount = users.filter(u => u.role_no === 'R002').length;
  const totalSalary = users.reduce((sum, u) => sum + u.salary, 0);
  const avgSalary = users.length > 0 ? Math.round(totalSalary / users.length) : 0;
  const maxSalary = users.length > 0 ? Math.max(...users.map(u => u.salary)) : 0;

  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 星期${'日一二三四五六'[today.getDay()]}`;

  // 顶部大卡片中的概览数据
  const heroStats = [
    { label: '员工总数', value: users.length, sub: '在职人员', icon: Users, color: 'from-primary-400 to-primary-600' },
    { label: '管理员', value: adminCount, sub: '系统管理', icon: ShieldCheck, color: 'from-violet-400 to-violet-600' },
    { label: '柜员人数', value: employeeCount, sub: '业务办理', icon: UserPlus, color: 'from-emerald-400 to-emerald-600' },
    { label: '月薪总额', value: `¥${totalSalary.toLocaleString()}`, sub: '月度支出', icon: DollarSign, color: 'from-amber-400 to-amber-600' },
  ];

  // 概览卡片
  const overviewCards = [
    {
      title: '员工管理',
      desc: '查看和管理员工档案',
      action: '去查看',
      icon: Users,
      color: 'from-emerald-50 to-emerald-100',
      iconColor: 'bg-emerald-500',
      onClick: () => onNavigate('employees'),
    },
    {
      title: '权限配置',
      desc: '设置岗位与菜单权限',
      action: '去配置',
      icon: ShieldCheck,
      color: 'from-sky-50 to-sky-100',
      iconColor: 'bg-sky-500',
      onClick: () => onNavigate('roles'),
    },
    {
      title: '工资统计',
      desc: `当前月薪 ¥${totalSalary.toLocaleString()}`,
      action: '查看详情',
      icon: DollarSign,
      color: 'from-amber-50 to-amber-100',
      iconColor: 'bg-amber-500',
      onClick: () => onOpenModal('salary'),
    },
    {
      title: '岗位分布',
      desc: `管理员 ${adminCount} · 柜员 ${employeeCount}`,
      action: '查看详情',
      icon: Briefcase,
      color: 'from-violet-50 to-violet-100',
      iconColor: 'bg-violet-500',
      onClick: () => onOpenModal('role-overview'),
    },
  ];

  // 快捷入口
  const quickEntries = [
    {
      title: '新增员工',
      desc: '录入新员工档案信息',
      icon: UserPlus,
      color: 'from-emerald-500/10 to-emerald-500/5',
      iconBg: 'bg-emerald-500',
      onClick: () => onOpenModal('add-employee'),
    },
    {
      title: '权限配置',
      desc: '为岗位分配菜单权限',
      icon: ShieldCheck,
      color: 'from-sky-500/10 to-sky-500/5',
      iconBg: 'bg-sky-500',
      onClick: () => onOpenModal('quick-config'),
    },
    {
      title: '员工档案',
      desc: '查看全部员工列表',
      icon: FileText,
      color: 'from-violet-500/10 to-violet-500/5',
      iconBg: 'bg-violet-500',
      onClick: () => onNavigate('employees'),
    },
    {
      title: '岗位概览',
      desc: '查看系统岗位结构',
      icon: Award,
      color: 'from-rose-500/10 to-rose-500/5',
      iconBg: 'bg-rose-500',
      onClick: () => onNavigate('overview'),
    },
  ];

  // 其他功能入口卡片（新增模块）
  const featureCards = [
    {
      title: '公告通知',
      desc: '发布和查看系统公告',
      icon: Megaphone,
      color: 'from-rose-50 to-rose-100',
      iconColor: 'bg-rose-500',
      onClick: () => onNavigate('announcements'),
    },
    {
      title: '业务办理记录',
      desc: '查看柜员业务办理数据',
      icon: ClipboardList,
      color: 'from-cyan-50 to-cyan-100',
      iconColor: 'bg-cyan-500',
      onClick: () => onNavigate('transactions'),
    },
    {
      title: '操作日志',
      desc: '查看系统操作记录',
      icon: Activity,
      color: 'from-indigo-50 to-indigo-100',
      iconColor: 'bg-indigo-500',
      onClick: () => onNavigate('logs'),
    },
    {
      title: '工资报表',
      desc: '详细工资支出分析',
      icon: PiggyBank,
      color: 'from-amber-50 to-amber-100',
      iconColor: 'bg-amber-500',
      onClick: () => onNavigate('salary'),
    },
  ];

  // 最近入职员工（已集成到列表页）

  return (
    <div className="animate-fade-in space-y-6 max-w-[1400px]">
      {/* 顶部大卡片 - 深色渐变 + 用户问候 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#2a3650] to-[#3b4a66] p-8 text-white shadow-card">
        {/* 装饰光晕 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-start gap-8">
          {/* 左侧：问候信息 */}
          <div className="flex-1">
            <p className="text-white/60 text-sm mb-2">欢迎回来，</p>
            <h1 className="text-3xl font-bold mb-3">{user?.user_name}</h1>
            <div className="flex items-center gap-4 text-sm text-white/70 mb-6">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                {user?.role_no ? getRoleNameByNo(user.role_no) : '员工'}
              </span>
              <span className="flex items-center gap-1.5">
                {dateStr}
              </span>
            </div>

            {/* 数据格子 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {heroStats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-sm transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-soft`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-white/60 mb-1">{stat.sub}</p>
                    <p className="text-xl font-bold mb-0.5">{stat.value}</p>
                    <p className="text-xs text-white/50">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右侧装饰 */}
          <div className="hidden lg:flex flex-col items-center justify-center pt-4">
            <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-12 h-12 text-white/80" />
            </div>
            <p className="mt-3 text-sm text-white/50">系统运行正常</p>
          </div>
        </div>
      </div>

      {/* 概览标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-accent-600">概览</h3>
        <span className="text-xs text-accent-500/70">点击卡片可查看详情</span>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.onClick}
              className={`card card-hover group relative overflow-hidden bg-gradient-to-br ${item.color} border-0 cursor-pointer`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl ${item.iconColor} flex items-center justify-center shadow-soft`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-accent-500/50 group-hover:text-accent-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-base font-semibold text-accent-700 mb-1">{item.title}</p>
              <p className="text-xs text-accent-500 mb-3">{item.desc}</p>
              <p className="text-xs font-medium text-primary-600">{item.action} →</p>
            </div>
          );
        })}
      </div>

      {/* 快捷入口 */}
      <div className="flex items-center justify-between mt-2">
        <h3 className="text-sm font-semibold text-accent-600">快捷入口</h3>
        <span className="text-xs text-accent-500/70">常用功能一键到达</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickEntries.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.onClick}
              className={`card card-hover group bg-gradient-to-br ${item.color} border border-white cursor-pointer`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-soft shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-accent-700">{item.title}</p>
                  <p className="text-xs text-accent-500 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-accent-500/50 group-hover:text-accent-600 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 更多功能模块 */}
      <div className="flex items-center justify-between mt-2">
        <h3 className="text-sm font-semibold text-accent-600">更多功能</h3>
        <span className="text-xs text-accent-500/70">扩展模块</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featureCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.onClick}
              className={`card card-hover group relative overflow-hidden bg-gradient-to-br ${item.color} border-0 cursor-pointer`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl ${item.iconColor} flex items-center justify-center shadow-soft`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-accent-500/50 group-hover:text-accent-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-base font-semibold text-accent-700 mb-1">{item.title}</p>
              <p className="text-xs text-accent-500">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 最近入职员工 + 薪资概览 双栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        {/* 最近入职员工 */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-accent-600">员工列表</h3>
            <button
              onClick={() => onNavigate('employees')}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部 →
            </button>
          </div>
          <div className="card !p-0 overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-4 bg-accent-50/50 text-xs font-medium text-accent-500 uppercase tracking-wider">
              <div className="col-span-3">员工姓名</div>
              <div className="col-span-2">工号</div>
              <div className="col-span-3">岗位</div>
              <div className="col-span-2">月薪</div>
              <div className="col-span-2">性别</div>
            </div>
            <div className="divide-y divide-accent-100">
              {users.length > 0 ? users.slice(0, 5).map((u, idx) => (
                <div key={idx} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-accent-50/50 transition-colors">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                      {u.user_name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-accent-700">{u.user_name}</span>
                  </div>
                  <div className="col-span-2 text-sm text-accent-600">{u.user_no}</div>
                  <div className="col-span-3">
                    <span className="inline-flex items-center px-2.5 py-1 bg-primary-50 text-primary-600 text-xs rounded-lg">
                      {getRoleNameByNo(u.role_no)}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-accent-600">¥{u.salary.toLocaleString()}</div>
                  <div className="col-span-2 text-sm text-accent-500">{u.gender === 'm' ? '男' : '女'}</div>
                </div>
              )) : (
                <div className="px-6 py-12 text-center text-accent-500 text-sm">暂无员工数据</div>
              )}
            </div>
          </div>
        </div>

        {/* 薪资概览 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-accent-600">薪资概览</h3>
            <button
              onClick={() => onNavigate('salary')}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              详情 →
            </button>
          </div>
          <div className="card space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-accent-500">月薪总额</span>
                <span className="text-sm font-semibold text-accent-700">¥{totalSalary.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-accent-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-accent-500">平均工资</span>
                <span className="text-sm font-semibold text-accent-700">¥{avgSalary.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-accent-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${totalSalary > 0 ? (avgSalary / maxSalary) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-accent-500">最高工资</span>
                <span className="text-sm font-semibold text-accent-700">¥{maxSalary.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-accent-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="pt-3 border-t border-accent-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-accent-500">管理岗支出</span>
                <span className="text-xs font-medium text-primary-600">¥{(users.filter(u => u.role_no === 'R001').reduce((s, u) => s + u.salary, 0)).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-accent-500">柜员岗支出</span>
                <span className="text-xs font-medium text-emerald-600">¥{(users.filter(u => u.role_no === 'R002').reduce((s, u) => s + u.salary, 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
