import { useEffect, useState } from 'react';
import { Building2, Users, ShieldCheck, ChevronRight, CheckCircle, Award, Briefcase, FileText } from 'lucide-react';
import { getUsers, getRoles, getMenus, getMenusByRoleNo } from '../../utils/storage';
import { User as UserType, Role as RoleType, SysMenu as MenuType } from '../../data/mockData';

const RoleOverview = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    setUsers(getUsers());
    setRoles(getRoles());
    setMenus(getMenus());
  }, []);

  if (roles.length === 0) {
    return <div className="animate-fade-in">加载中...</div>;
  }

  const getRoleStats = (role_no: string) => {
    const roleUsers = users.filter(u => u.role_no === role_no);
    const roleMenus = getMenusByRoleNo(role_no);
    const totalSalary = roleUsers.reduce((s, u) => s + u.salary, 0);
    return { count: roleUsers.length, menus: roleMenus, totalSalary, users: roleUsers };
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-[1400px]">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-700">岗位结构概览</h2>
          <p className="text-sm text-accent-500 mt-1">查看系统岗位与权限分布</p>
        </div>
      </div>

      {/* 系统总览 */}
      <div className="card bg-gradient-to-br from-primary-50 via-white to-primary-50 border border-primary-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-accent-700">系统结构总览</h3>
            <p className="text-xs text-accent-500">岗位、权限、人员总体分布</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-accent-100 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-2">
              <Briefcase className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-accent-700 mb-1">{roles.length}</p>
            <p className="text-xs text-accent-500">岗位数</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-accent-100 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-accent-700 mb-1">{users.length}</p>
            <p className="text-xs text-accent-500">员工总数</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-accent-100 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-accent-700 mb-1">{menus.length}</p>
            <p className="text-xs text-accent-500">权限菜单</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-accent-100 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-accent-700 mb-1">¥{users.reduce((s, u) => s + u.salary, 0).toLocaleString()}</p>
            <p className="text-xs text-accent-500">薪资总额</p>
          </div>
        </div>
      </div>

      {/* 岗位卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role, idx) => {
          const stats = getRoleStats(role.role_no);
          const isExpanded = selectedRole === role.role_no;
          return (
            <div key={role.role_no} className="card hover:shadow-card transition-all overflow-hidden">
              <div
                onClick={() => setSelectedRole(isExpanded ? null : role.role_no)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft ${
                    idx === 0 ? 'bg-gradient-to-br from-primary-400 to-primary-600' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                  }`}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-accent-700 mb-1">{role.role_name}</h3>
                    <p className="text-xs text-accent-500 mb-2">{role.role_no}</p>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-xs text-accent-500">
                        <Users className="w-3.5 h-3.5" /> {stats.count} 人
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-accent-500">
                        <ShieldCheck className="w-3.5 h-3.5" /> {stats.menus.length} 个权限
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-accent-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
              </div>

              {/* 统计条 */}
              <div className="mt-5 pt-4 border-t border-accent-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-accent-500">岗位人员占比</span>
                  <span className="text-xs font-medium text-accent-700">{users.length > 0 ? Math.round((stats.count / users.length) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-accent-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      idx === 0 ? 'bg-gradient-to-r from-primary-400 to-primary-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                    }`}
                    style={{ width: users.length > 0 ? `${(stats.count / users.length) * 100}%` : '0%' }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-accent-500">薪资总额</span>
                  <span className="text-sm font-semibold text-accent-700">¥{stats.totalSalary.toLocaleString()}</span>
                </div>
              </div>

              {/* 展开内容 */}
              {isExpanded && (
                <div className="mt-5 pt-4 border-t border-accent-100 space-y-4 animate-fade-in">
                  {/* 权限列表 */}
                  <div>
                    <p className="text-xs font-semibold text-accent-600 mb-2">可用权限菜单</p>
                    <div className="grid grid-cols-2 gap-2">
                      {stats.menus.map((m) => (
                        <div key={m.menu_no} className="flex items-center gap-2 p-2 rounded-lg bg-accent-50/50 text-xs text-accent-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{m.menu_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 员工列表 */}
                  <div>
                    <p className="text-xs font-semibold text-accent-600 mb-2">在岗人员</p>
                    {stats.users.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {stats.users.map((u) => (
                          <div key={u.user_no} className="flex items-center justify-between p-2 rounded-xl hover:bg-accent-50/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium">
                                {u.user_name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-accent-700">{u.user_name}</p>
                                <p className="text-xs text-accent-400">{u.user_no}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-accent-700">¥{u.salary.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-accent-400 text-center py-4">暂无员工</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 系统提示 */}
      <div className="card bg-gradient-to-br from-amber-50 to-amber-100/30 border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-soft shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-accent-700 mb-1">岗位管理说明</h4>
            <p className="text-xs text-accent-500 leading-relaxed">
              系统共设 {roles.length} 个岗位，总计 {menus.length} 个权限菜单。管理员岗拥有全部系统权限，柜员岗仅拥有基础业务办理权限。如需新增岗位或调整权限配置，请前往权限配置页面进行操作。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleOverview;
