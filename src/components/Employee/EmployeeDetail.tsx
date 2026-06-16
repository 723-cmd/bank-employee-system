import { X, User, Mail, Briefcase, DollarSign } from 'lucide-react';
import { User as UserType } from '../../data/mockData';
import { getRoleNameByNo } from '../../utils/storage';

interface EmployeeDetailProps {
  user: UserType;
  onClose: () => void;
}

const EmployeeDetail = ({ user, onClose }: EmployeeDetailProps) => {
  const infoItems = [
    { icon: User, label: '工号', value: user.user_no },
    { icon: Mail, label: '登录用户名', value: user.login_username },
    { icon: Briefcase, label: '岗位', value: getRoleNameByNo(user.role_no) },
    { icon: DollarSign, label: '月薪', value: `¥ ${user.salary.toLocaleString()} / 月` },
    { icon: User, label: '性别', value: user.gender === 'm' ? '男' : '女' },
  ];

  return (
    <div className="fixed inset-0 bg-accent-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-3xl shadow-card w-full max-w-md animate-scale-in overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-accent-100">
          <div>
            <h2 className="text-lg font-bold text-accent-700">员工档案详情</h2>
            <p className="text-xs text-accent-500 mt-0.5">查看员工完整信息</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-100 rounded-xl transition-colors text-accent-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* 顶部头像区 */}
          <div className="text-center mb-6 pb-6 border-b border-accent-100">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
              <span className="text-white text-2xl font-bold">{user.user_name.charAt(0)}</span>
            </div>
            <h3 className="text-xl font-bold text-accent-700">{user.user_name}</h3>
            <p className="text-sm text-accent-500 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 bg-primary-50 text-primary-600 rounded-lg text-xs">
                {getRoleNameByNo(user.role_no)}
              </span>
            </p>
          </div>

          {/* 信息卡片列表 */}
          <div className="space-y-3">
            {infoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-accent-50/60 rounded-2xl hover:bg-accent-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-primary-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-accent-500 mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-accent-700 truncate">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 关闭按钮 */}
          <button onClick={onClose} className="btn-primary w-full mt-6 h-11">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
