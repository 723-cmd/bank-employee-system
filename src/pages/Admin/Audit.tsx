import { useEffect, useState } from 'react';
import { ShieldCheck, Calendar, CheckCircle, XCircle, Clock, Users, Check, X } from 'lucide-react';
import { getPendingUsers, approvePendingUser, rejectPendingUser, getRoleNameByNo } from '../../utils/storage';
import { PendingUser } from '../../data/mockData';

const Audit = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    setPendingUsers(getPendingUsers());
  }, []);

  const filtered = filterStatus === 'all'
    ? pendingUsers
    : pendingUsers.filter(u => u.status === filterStatus);

  const pendingCount = pendingUsers.filter(u => u.status === 'pending').length;
  const approvedCount = pendingUsers.filter(u => u.status === 'approved').length;
  const rejectedCount = pendingUsers.filter(u => u.status === 'rejected').length;

  const handleApprove = (id: string) => {
    approvePendingUser(id);
    setPendingUsers(getPendingUsers());
  };

  const handleReject = (id: string) => {
    rejectPendingUser(id);
    setPendingUsers(getPendingUsers());
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-accent-50 text-accent-600 border-accent-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'approved': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'rejected': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-[1400px]">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-700">注册审核</h2>
          <p className="text-sm text-accent-500 mt-1">审核新员工注册申请</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-3 shadow-soft">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">待审核</p>
          <p className="text-2xl font-bold text-accent-700">{pendingCount}</p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-3 shadow-soft">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">已通过</p>
          <p className="text-2xl font-bold text-accent-700">{approvedCount}</p>
        </div>
        <div className="card bg-gradient-to-br from-red-50 to-red-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center mb-3 shadow-soft">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">已拒绝</p>
          <p className="text-2xl font-bold text-accent-700">{rejectedCount}</p>
        </div>
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center mb-3 shadow-soft">
            <Users className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">总申请</p>
          <p className="text-2xl font-bold text-accent-700">{pendingUsers.length}</p>
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-accent-500 mr-2">筛选：</span>
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterStatus === status
                ? 'bg-primary-500 text-white shadow-soft'
                : 'bg-white text-accent-500 hover:bg-accent-50 border border-accent-100'
            }`}
          >
            {status === 'all' ? '全部' : status === 'pending' ? '待审核' : status === 'approved' ? '已通过' : '已拒绝'}
          </button>
        ))}
      </div>

      {/* 申请列表 */}
      <div className="card !p-0 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 bg-accent-50/50 text-xs font-semibold text-accent-500 uppercase tracking-wider">
          <div className="col-span-3">申请人</div>
          <div className="col-span-2">工号</div>
          <div className="col-span-2">申请岗位</div>
          <div className="col-span-2">申请日期</div>
          <div className="col-span-1 text-center">状态</div>
          <div className="col-span-2 text-center">操作</div>
        </div>

        <div className="divide-y divide-accent-100">
          {filtered.map((user) => (
            <div key={user.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-accent-50/50 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                  {user.user_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-accent-700">{user.user_name}</p>
                  <p className="text-xs text-accent-400">{user.gender === 'm' ? '男' : '女'}</p>
                </div>
              </div>
              <div className="col-span-2 text-sm text-accent-600 font-mono">{user.user_no}</div>
              <div className="col-span-2">
                <span className="inline-flex items-center px-2.5 py-1 bg-primary-50 text-primary-600 text-xs rounded-lg">
                  {getRoleNameByNo(user.role_no)}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-sm text-accent-500">
                <Calendar className="w-3.5 h-3.5" />
                {user.apply_date}
              </div>
              <div className="col-span-1 text-center">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg border ${getStatusStyle(user.status)}`}>
                  {getStatusIcon(user.status)}
                  {user.status === 'pending' ? '待审核' : user.status === 'approved' ? '已通过' : '已拒绝'}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2">
                {user.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      通过
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      拒绝
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-accent-400">已处理</span>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-accent-500 text-sm">
              <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-accent-300" />
              暂无{filterStatus === 'pending' ? '待审核' : filterStatus === 'approved' ? '已通过' : filterStatus === 'rejected' ? '已拒绝' : ''}申请
            </div>
          )}
        </div>
      </div>

      {/* 审核说明 */}
      <div className="card bg-gradient-to-br from-sky-50 to-sky-100/30 border border-sky-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-soft shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-accent-700 mb-1">审核说明</h4>
            <p className="text-xs text-accent-500 leading-relaxed">
              • 待审核状态的申请可以点击「通过」或「拒绝」按钮进行处理<br/>
              • 通过审核后，申请人将自动添加到员工列表并可正常登录系统<br/>
              • 拒绝申请后，申请人将收到通知但无法登录<br/>
              • 请确保审核前核实申请人身份和岗位信息
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
