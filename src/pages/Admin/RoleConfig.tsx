import { useState, useEffect } from 'react';
import { ShieldCheck, Check, Users, UserCheck, ChevronRight } from 'lucide-react';
import { getRoles, getMenus, getRoleMenuMaps, saveRoleMenuMaps } from '../../utils/storage';
import { Role, SysMenu, RoleMenuMap } from '../../data/mockData';

const RoleConfig = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<SysMenu[]>([]);
  const [roleMenuMaps, setRoleMenuMaps] = useState<RoleMenuMap[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setRoles(getRoles());
    setMenus(getMenus());
    setRoleMenuMaps(getRoleMenuMaps());
  }, []);

  useEffect(() => {
    if (selectedRole) {
      const map = roleMenuMaps.find(m => m.role_no === selectedRole);
      setSelectedMenus(map ? [...map.menu_nos] : []);
      setSaveMessage('');
    }
  }, [selectedRole, roleMenuMaps]);

  const handleMenuToggle = (menu_no: string) => {
    setSelectedMenus(prev =>
      prev.includes(menu_no)
        ? prev.filter(m => m !== menu_no)
        : [...prev, menu_no]
    );
  };

  const handleSave = () => {
    const updatedMaps = roleMenuMaps.map(map =>
      map.role_no === selectedRole
        ? { ...map, menu_nos: selectedMenus }
        : map
    );
    setRoleMenuMaps(updatedMaps);
    saveRoleMenuMaps(updatedMaps);
    setSaveMessage('权限配置已保存');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const currentRole = roles.find(r => r.role_no === selectedRole);

  return (
    <div className="animate-fade-in max-w-[1400px]">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-accent-700 mb-1">岗位权限配置</h1>
        <p className="text-sm text-accent-500">为不同岗位配置可访问的系统菜单权限</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：岗位列表 */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="card !p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-base font-semibold text-accent-700">岗位列表</h2>
            </div>
            <div className="space-y-2">
              {roles.map(role => {
                const isActive = selectedRole === role.role_no;
                const menuCount = roleMenuMaps.find(m => m.role_no === role.role_no)?.menu_nos.length || 0;
                return (
                  <button
                    key={role.role_no}
                    onClick={() => setSelectedRole(role.role_no)}
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-200 group
                      ${isActive
                        ? 'bg-primary-500 text-white shadow-card'
                        : 'bg-accent-50/60 hover:bg-accent-100 text-accent-700 border border-transparent hover:border-accent-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                          ${isActive ? 'bg-white/20' : 'bg-white shadow-soft'}`}>
                          <UserCheck className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-primary-500'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{role.role_name}</p>
                          <p className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-accent-500'}`}>{role.role_no}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-lg font-medium
                          ${isActive ? 'bg-white/20 text-white' : 'bg-white text-accent-500'}`}>
                          {menuCount} 项权限
                        </span>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-accent-400 group-hover:translate-x-0.5'}`} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧：权限配置 */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="card !p-0 overflow-hidden">
            {/* 顶部栏 */}
            <div className="px-6 py-5 border-b border-accent-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-accent-700">
                    {selectedRole
                      ? `${currentRole?.role_name} 的权限配置`
                      : '请选择一个岗位'}
                  </h2>
                  {selectedRole && (
                    <p className="text-xs text-accent-500 mt-0.5">
                      已选 {selectedMenus.length} / {menus.length} 项菜单权限
                    </p>
                  )}
                </div>
              </div>
              {selectedRole && (
                <div className="flex items-center gap-3">
                  {saveMessage && (
                    <span className="text-sm text-emerald-600 flex items-center gap-1.5 animate-fade-in">
                      <Check className="w-4 h-4" />
                      {saveMessage}
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-soft transition-all"
                  >
                    <Check className="w-4 h-4" />
                    保存配置
                  </button>
                </div>
              )}
            </div>

            {/* 菜单网格 */}
            {selectedRole ? (
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {menus.map(menu => {
                    const isChecked = selectedMenus.includes(menu.menu_no);
                    return (
                      <button
                        key={menu.menu_no}
                        onClick={() => handleMenuToggle(menu.menu_no)}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-start gap-3
                          ${isChecked
                            ? 'border-primary-500 bg-primary-50/70 shadow-soft'
                            : 'border-accent-100 hover:border-accent-300 bg-white hover:bg-accent-50/40'}`}
                      >
                        <div className={`w-5 h-5 shrink-0 rounded-md flex items-center justify-center transition-all mt-0.5
                          ${isChecked
                            ? 'bg-primary-500 text-white'
                            : 'bg-accent-100 text-transparent group-hover:bg-accent-200'}`}>
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium mb-0.5 ${isChecked ? 'text-primary-700' : 'text-accent-700'}`}>
                            {menu.menu_name}
                          </p>
                          <p className="text-xs text-accent-500/70 font-mono">{menu.menu_no}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 快速操作 */}
                <div className="mt-6 pt-5 border-t border-accent-100 flex items-center gap-2">
                  <span className="text-xs text-accent-500 mr-2">快速选择：</span>
                  <button
                    onClick={() => setSelectedMenus(menus.map(m => m.menu_no))}
                    className="text-xs px-3 py-1.5 bg-accent-50 hover:bg-accent-100 text-accent-600 rounded-lg transition-colors"
                  >
                    全选
                  </button>
                  <button
                    onClick={() => setSelectedMenus([])}
                    className="text-xs px-3 py-1.5 bg-accent-50 hover:bg-accent-100 text-accent-600 rounded-lg transition-colors"
                  >
                    清空
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-accent-400">
                <div className="w-20 h-20 rounded-3xl bg-accent-50 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-10 h-10 text-accent-300" />
                </div>
                <p className="text-sm text-accent-500 mb-1">请从左侧选择一个岗位</p>
                <p className="text-xs text-accent-400">然后为它配置可访问的系统菜单</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleConfig;
