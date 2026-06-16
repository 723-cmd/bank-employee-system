import { User, Briefcase, DollarSign, Calendar, Phone, Mail, Building2, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRoleNameByNo } from '../../utils/storage';

interface EmployeeProfileProps {
  onPageChange: (page: string) => void;
}

const EmployeeProfile = ({ onPageChange }: EmployeeProfileProps) => {
  const { user } = useAuth();

  if (!user) return null;

  // 模拟更多档案信息
  const profileInfo = [
    { icon: Briefcase, label: '岗位', value: getRoleNameByNo(user.role_no), color: 'bg-primary-50 text-primary-600' },
    { icon: DollarSign, label: '月薪', value: `¥${user.salary.toLocaleString()}`, color: 'bg-emerald-50 text-emerald-600' },
    { icon: User, label: '性别', value: user.gender === 'm' ? '男' : '女', color: 'bg-sky-50 text-sky-600' },
    { icon: Calendar, label: '入职时间', value: '2024年1月15日', color: 'bg-amber-50 text-amber-600' },
    { icon: Building2, label: '所属部门', value: '营业部', color: 'bg-violet-50 text-violet-600' },
    { icon: Phone, label: '联系电话', value: '138****8888', color: 'bg-rose-50 text-rose-600' },
    { icon: Mail, label: '邮箱', value: `${user.login_username}@bank.com`, color: 'bg-cyan-50 text-cyan-600' },
    { icon: Award, label: '职级', value: '二级柜员', color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-accent-700 mb-1">个人档案</h1>
        <p className="text-sm text-accent-500">查看您的个人详细信息</p>
      </div>

      {/* 顶部个人资料卡 */}
      <div className="card !p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-8 text-white relative overflow-hidden">
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="text-4xl font-bold">{user.user_name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{user.user_name}</h2>
              <p className="text-white/80 text-sm mb-1">{getRoleNameByNo(user.role_no)}</p>
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <span>工号: {user.user_no}</span>
                <span>|</span>
                <span>入职: 2024年1月</span>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="flex items-center gap-3 p-4 bg-accent-50/50">
          <button
            onClick={() => onPageChange('my-salary')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-accent-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <DollarSign className="w-4 h-4 text-emerald-500" />
            查看工资
          </button>
          <button
            onClick={() => onPageChange('my-transactions')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-accent-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <Briefcase className="w-4 h-4 text-primary-500" />
            业务记录
          </button>
          <button
            onClick={() => onPageChange('password')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-accent-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <User className="w-4 h-4 text-sky-500" />
            修改密码
          </button>
        </div>
      </div>

      {/* 基本信息网格 */}
      <div className="card">
        <h3 className="text-sm font-semibold text-accent-600 mb-4 px-1">基本信息</h3>
        <div className="grid grid-cols-2 gap-3">
          {profileInfo.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-white border border-accent-100 hover:shadow-sm transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs text-accent-500 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-accent-700">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 职责说明 */}
      <div className="card bg-gradient-to-br from-primary-50 to-primary-100/30 border border-primary-100">
        <h3 className="text-sm font-semibold text-accent-600 mb-3">岗位职责</h3>
        <ul className="space-y-2 text-sm text-accent-600">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0"></span>
            负责日常柜台业务办理，包括存款、取款、转账等操作
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0"></span>
            维护客户关系，提供优质的客户服务
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0"></span>
            遵守银行各项规章制度，确保业务操作合规
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0"></span>
            定期参加业务培训，提升专业技能
          </li>
        </ul>
      </div>

      {/* 系统权限说明 */}
      <div className="card">
        <h3 className="text-sm font-semibold text-accent-600 mb-3">系统权限</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-accent-50">
            <span className="text-sm text-accent-600">查看个人档案</span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              已开通
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-accent-50">
            <span className="text-sm text-accent-600">修改个人密码</span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              已开通
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-accent-50">
            <span className="text-sm text-accent-600">查看工资信息</span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              已开通
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-accent-50">
            <span className="text-sm text-accent-600">查看公告通知</span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              已开通
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
