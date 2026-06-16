import { DollarSign, TrendingUp, Calendar, Download, TrendingDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MySalary = () => {
  const { user } = useAuth();

  const monthlySalary = user?.salary || 0;
  const bonus = Math.round(monthlySalary * 0.15);
  const tax = Math.round(monthlySalary * 0.1);
  const netSalary = monthlySalary + bonus - tax;

  const salaryHistory = [
    { month: '2024年6月', base: monthlySalary, bonus: bonus, tax: tax, net: netSalary },
    { month: '2024年5月', base: monthlySalary, bonus: Math.round(bonus * 0.8), tax: tax, net: monthlySalary + Math.round(bonus * 0.8) - tax },
    { month: '2024年4月', base: monthlySalary, bonus: 0, tax: tax, net: monthlySalary - tax },
    { month: '2024年3月', base: monthlySalary, bonus: bonus, tax: tax, net: netSalary },
    { month: '2024年2月', base: monthlySalary, bonus: Math.round(bonus * 1.2), tax: tax, net: monthlySalary + Math.round(bonus * 1.2) - tax },
    { month: '2024年1月', base: monthlySalary, bonus: Math.round(bonus * 2), tax: tax, net: monthlySalary + Math.round(bonus * 2) - tax },
  ];

  const handleExport = () => {
    const date = new Date();
    const content = `工资条
姓名: ${user?.user_name}
工号: ${user?.user_no}
月份: ${date.getFullYear()}年${date.getMonth() + 1}月

【本月工资明细】
基本工资: ¥${monthlySalary.toLocaleString()}
绩效奖金: +¥${bonus.toLocaleString()}
个人所得税: -¥${tax.toLocaleString()}
实发工资: ¥${netSalary.toLocaleString()}

【历史工资记录】
月份,基本工资,绩效奖金,个人所得税,实发工资
${salaryHistory.map(item => `${item.month},¥${item.base.toLocaleString()},¥${item.bonus.toLocaleString()},¥${item.tax.toLocaleString()},¥${item.net.toLocaleString()}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `工资条_${user?.user_name}_${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-[1000px]">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-700">我的工资</h2>
          <p className="text-sm text-accent-500 mt-1">查看个人薪资明细</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-soft"
        >
          <Download className="w-4 h-4" />
          导出工资条
        </button>
      </div>

      {/* 本月工资卡片 */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/70">本月工资</p>
              <p className="text-xs text-white/50">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold mb-1">¥{netSalary.toLocaleString()}</p>
            <p className="text-sm text-white/60">税后实发金额</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-white/60 mb-1">基本工资</p>
              <p className="text-sm font-semibold">¥{monthlySalary.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-white/60 mb-1">绩效奖金</p>
              <p className="text-sm font-semibold text-emerald-300">+¥{bonus.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-white/60 mb-1">个人所得税</p>
              <p className="text-sm font-semibold text-red-300">-¥{tax.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 工资构成 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-accent-600 mb-4">工资构成说明</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary-50">
              <span className="text-sm text-accent-600">基本工资</span>
              <span className="text-sm font-semibold text-accent-700">¥{monthlySalary.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50">
              <span className="text-sm text-accent-600">绩效奖金</span>
              <span className="text-sm font-semibold text-emerald-600">¥{bonus.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50">
              <span className="text-sm text-accent-600">个人所得税</span>
              <span className="text-sm font-semibold text-red-500">¥{tax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-accent-600 mb-4">年度收入概览</h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-sm text-accent-500 mb-2">年度累计收入</p>
              <p className="text-3xl font-bold text-accent-700 mb-1">
                ¥{(monthlySalary * 6 + bonus * 3).toLocaleString()}
              </p>
              <p className="text-xs text-accent-400">含奖金及补贴</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-accent-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-accent-500">月均收入</span>
              <span className="text-sm font-semibold text-accent-700">¥{Math.round((monthlySalary * 6 + bonus * 3) / 6).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 历史工资记录 */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-accent-100">
          <h3 className="text-sm font-semibold text-accent-600">历史工资记录</h3>
        </div>
        <div className="grid grid-cols-12 px-6 py-3 bg-accent-50/50 text-xs font-semibold text-accent-500 uppercase tracking-wider">
          <div className="col-span-2">月份</div>
          <div className="col-span-2 text-right">基本工资</div>
          <div className="col-span-2 text-right">绩效奖金</div>
          <div className="col-span-2 text-right">个人所得税</div>
          <div className="col-span-2 text-right">实发工资</div>
          <div className="col-span-2 text-center">趋势</div>
        </div>
        <div className="divide-y divide-accent-100">
          {salaryHistory.map((item, idx) => {
            const prevItem = salaryHistory[idx + 1];
            const trend = prevItem ? item.net - prevItem.net : 0;
            return (
              <div key={idx} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-accent-50/50 transition-colors">
                <div className="col-span-2 flex items-center gap-2 text-sm text-accent-600">
                  <Calendar className="w-4 h-4 text-accent-400" />
                  {item.month}
                </div>
                <div className="col-span-2 text-right text-sm text-accent-600">¥{item.base.toLocaleString()}</div>
                <div className="col-span-2 text-right text-sm text-emerald-600">¥{item.bonus.toLocaleString()}</div>
                <div className="col-span-2 text-right text-sm text-red-500">¥{item.tax.toLocaleString()}</div>
                <div className="col-span-2 text-right text-sm font-semibold text-accent-700">¥{item.net.toLocaleString()}</div>
                <div className="col-span-2 text-center">
                  {trend > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                      <TrendingUp className="w-3.5 h-3.5" /> +¥{trend.toLocaleString()}
                    </span>
                  ) : trend < 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-red-500">
                      <TrendingDown className="w-3.5 h-3.5" /> ¥{trend.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs text-accent-400">-</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MySalary;
