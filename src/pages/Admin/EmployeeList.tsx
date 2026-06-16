import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, UserCheck, Users, X } from 'lucide-react';
import { getUsers, saveUsers, getRoleNameByNo } from '../../utils/storage';
import { User as UserType } from '../../data/mockData';
import EmployeeForm from '../../components/Employee/EmployeeForm';
import EmployeeDetail from '../../components/Employee/EmployeeDetail';

const EmployeeList = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const filteredUsers = users.filter(
    user =>
      user.user_no.includes(searchTerm) ||
      user.user_name.includes(searchTerm) ||
      user.login_username.includes(searchTerm)
  );

  const handleDelete = (user_no: string) => {
    if (confirm('确定要删除该员工吗？此操作不可撤销。')) {
      const updatedUsers = users.filter(u => u.user_no !== user_no);
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    }
  };

  const handleView = (user: UserType) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setUsers(getUsers());
    setShowForm(false);
    setEditingUser(null);
  };

  const adminCount = users.filter(u => u.role_no === 'R001').length;
  const employeeCount = users.filter(u => u.role_no === 'R002').length;
  const totalSalary = users.reduce((sum, u) => sum + u.salary, 0);

  return (
    <div className="animate-fade-in max-w-[1400px]">
      {/* 页面标题 + 操作区 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-accent-700 mb-1">员工管理</h1>
          <p className="text-sm text-accent-500">统一管理员工档案，查看、编辑或新增员工信息</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-soft transition-all"
        >
          <Plus className="w-4 h-4" />
          新增员工
        </button>
      </div>

      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card card-hover flex items-center gap-4 !p-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-soft">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-accent-500 mb-1">员工总数</p>
            <p className="text-2xl font-bold text-accent-700">{users.length}</p>
          </div>
        </div>
        <div className="card card-hover flex items-center gap-4 !p-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center shrink-0 shadow-soft">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-accent-500 mb-1">岗位分布</p>
            <p className="text-2xl font-bold text-accent-700">
              <span className="text-lg">管理 {adminCount} · 柜员 {employeeCount}</span>
            </p>
          </div>
        </div>
        <div className="card card-hover flex items-center gap-4 !p-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0 shadow-soft">
            <span className="text-white font-bold text-sm">¥</span>
          </div>
          <div>
            <p className="text-xs text-accent-500 mb-1">月薪总额</p>
            <p className="text-2xl font-bold text-accent-700">¥{totalSalary.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="card !p-4 mb-6">
        <div className="relative">
          <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-accent-500/70" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索工号、姓名或登录用户名..."
            className="input-field pl-12 h-11"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-400 hover:text-accent-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 员工列表 - 表格 */}
      <div className="card !p-0 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 bg-accent-50/60 text-xs font-semibold text-accent-500 uppercase tracking-wider border-b border-accent-100">
          <div className="col-span-3">员工</div>
          <div className="col-span-2">工号</div>
          <div className="col-span-2">登录账号</div>
          <div className="col-span-2">岗位</div>
          <div className="col-span-1">月薪</div>
          <div className="col-span-2 text-right">操作</div>
        </div>

        <div className="divide-y divide-accent-100">
          {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
            <div key={idx} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-accent-50/40 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium shadow-soft shrink-0">
                  {user.user_name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-accent-700 truncate">{user.user_name}</p>
                  <p className="text-xs text-accent-500">{user.gender === 'm' ? '男' : '女'}</p>
                </div>
              </div>
              <div className="col-span-2 text-sm text-accent-600 font-mono">{user.user_no}</div>
              <div className="col-span-2 text-sm text-accent-600">{user.login_username}</div>
              <div className="col-span-2">
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg
                  ${user.role_no === 'R001'
                    ? 'bg-primary-50 text-primary-600'
                    : 'bg-emerald-50 text-emerald-600'}`}>
                  {getRoleNameByNo(user.role_no)}
                </span>
              </div>
              <div className="col-span-1 text-sm text-accent-600 font-medium">¥{user.salary.toLocaleString()}</div>
              <div className="col-span-2 flex items-center justify-end gap-1">
                <button
                  onClick={() => handleView(user)}
                  className="p-2 text-accent-500 hover:text-accent-700 hover:bg-accent-100 rounded-lg transition-colors"
                  title="查看详情"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="编辑"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(user.user_no)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-50 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent-400" />
              </div>
              <p className="text-accent-500 text-sm mb-1">没有找到匹配的员工</p>
              <p className="text-accent-400 text-xs">试试其他关键词，或新增员工</p>
            </div>
          )}
        </div>

        {/* 底部统计 */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-3.5 bg-accent-50/40 border-t border-accent-100 text-xs text-accent-500">
            显示 {filteredUsers.length} / {users.length} 条员工记录
          </div>
        )}
      </div>

      {/* 新增/编辑员工弹窗 */}
      {showForm && (
        <EmployeeForm
          user={editingUser}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* 员工详情弹窗 */}
      {showDetail && selectedUser && (
        <EmployeeDetail
          user={selectedUser}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
};

export default EmployeeList;
