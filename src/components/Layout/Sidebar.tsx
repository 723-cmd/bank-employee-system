import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  KeyRound,
  Settings,
  LogOut,
  User,
  FileText,
  Banknote,
  ChevronRight,
  Megaphone,
  Activity,
  ClipboardList,
  Building2,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRoleNameByNo, getPendingUsers } from '../../utils/storage';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

// 管理员菜单 - 按分组组织
const adminMenuGroups = [
  {
    label: '概览',
    items: [
      { id: 'dashboard', name: '管理首页', icon: LayoutDashboard },
    ],
  },
  {
    label: '员工管理',
    items: [
      { id: 'employees', name: '员工档案', icon: Users },
      { id: 'roles', name: '权限配置', icon: KeyRound },
      { id: 'overview', name: '岗位结构', icon: Building2 },
    ],
  },
  {
    label: '业务数据',
    items: [
      { id: 'salary', name: '工资报表', icon: DollarSign },
      { id: 'transactions', name: '业务办理', icon: ClipboardList },
    ],
  },
  {
    label: '系统',
    items: [
      { id: 'audit', name: '注册审核', icon: ShieldCheck },
      { id: 'announcements', name: '公告通知', icon: Megaphone },
      { id: 'logs', name: '操作日志', icon: Activity },
      { id: 'profile', name: '个人设置', icon: Settings },
    ],
  },
];

// 普通员工菜单
const employeeMenuGroups = [
  {
    label: '我的工作',
    items: [
      { id: 'my-profile', name: '个人档案', icon: FileText },
      { id: 'my-salary', name: '我的工资', icon: DollarSign },
      { id: 'my-transactions', name: '业务记录', icon: ClipboardList },
      { id: 'my-announcements', name: '公告通知', icon: Megaphone },
    ],
  },
  {
    label: '账户',
    items: [
      { id: 'password', name: '修改密码', icon: KeyRound },
      { id: 'profile', name: '个人设置', icon: Settings },
    ],
  },
];

const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const { user, logout, isAdmin } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      const pending = getPendingUsers().filter(p => p.status === 'pending').length;
      setPendingCount(pending);
    }
  }, [isAdmin]);

  const menuGroups = isAdmin ? adminMenuGroups : employeeMenuGroups;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-accent-100 z-30 flex flex-col
        transition-all duration-300 ease-out
        ${expanded ? 'w-56' : 'w-[72px]'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo / 品牌 */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-accent-100">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
          <Banknote className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap
            ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
        >
          <h1 className="font-semibold text-accent-700 text-[15px] leading-tight">员工管理系统</h1>
          <p className="text-xs text-accent-500/70 leading-tight">Bank EMS</p>
        </div>
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div
              className={`overflow-hidden transition-all duration-200 ease-out mb-2 px-2
                ${expanded ? 'opacity-100 h-auto' : 'opacity-0 h-0'}`}
            >
              <p className="text-[11px] text-accent-400 font-semibold uppercase tracking-wider">
                {group.label}
              </p>
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const showBadge = isAdmin && item.id === 'audit' && pendingCount > 0;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-accent-500 hover:bg-accent-50 hover:text-accent-700'}`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5 shrink-0" strokeWidth={1.8} />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                        {pendingCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm truncate transition-all duration-200 ease-out whitespace-nowrap
                      ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
                  >
                    {item.name}
                  </span>
                  {isActive && expanded && (
                    <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 底部：用户信息 + 退出 */}
      <div className="border-t border-accent-100 p-3">
        <div className="flex items-center gap-3 p-2 mb-2 rounded-xl transition-all duration-200">
          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <User className="w-4.5 h-4.5 text-white" strokeWidth={2} />
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap min-w-0
              ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
          >
            <p className="text-sm font-medium text-accent-700 truncate">{user?.user_name}</p>
            <p className="text-xs text-accent-500/70 truncate">{getRoleNameByNo(user?.role_no || '')}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-accent-500
            hover:bg-red-50 hover:text-red-500 transition-all duration-200`}
        >
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.8} />
          <span
            className={`text-sm transition-all duration-200 ease-out whitespace-nowrap
              ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
          >
            退出登录
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
