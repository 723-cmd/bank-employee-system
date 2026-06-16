import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, Download, Filter, PieChart } from 'lucide-react';
import { getUsers, getRoleNameByNo } from '../../utils/storage';
import { User as UserType } from '../../data/mockData';

const SalaryReport = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'salary-desc' | 'salary-asc' | 'name'>('salary-desc');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 20000]);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const totalSalary = users.reduce((sum, u) => sum + u.salary, 0);
  const avgSalary = users.length > 0 ? Math.round(totalSalary / users.length) : 0;
  const maxSalary = users.length > 0 ? Math.max(...users.map(u => u.salary)) : 0;
  const minSalary = users.length > 0 ? Math.min(...users.map(u => u.salary)) : 0;

  const adminTotal = users.filter(u => u.role_no === 'R001').reduce((s, u) => s + u.salary, 0);
  const tellerTotal = users.filter(u => u.role_no === 'R002').reduce((s, u) => s + u.salary, 0);
  const adminCount = users.filter(u => u.role_no === 'R001').length;
  const tellerCount = users.filter(u => u.role_no === 'R002').length;

  let filteredUsers = users;
  if (filterRole !== 'all') filteredUsers = filteredUsers.filter(u => u.role_no === filterRole);
  filteredUsers = filteredUsers.filter(u => u.salary >= salaryRange[0] && u.salary <= salaryRange[1]);
  if (sortBy === 'salary-desc') filteredUsers = [...filteredUsers].sort((a, b) => b.salary - a.salary);
  else if (sortBy === 'salary-asc') filteredUsers = [...filteredUsers].sort((a, b) => a.salary - b.salary);
  else filteredUsers = [...filteredUsers].sort((a, b) => a.user_name.localeCompare(b.user_name));

  // 简单分档统计
  const salaryBands = [
    { label: '¥5,000 以下', count: users.filter(u => u.salary < 5000).length, color: 'bg-sky-500' },
    { label: '¥5,000 - ¥8,000', count: users.filter(u => u.salary >= 5000 && u.salary < 8000).length, color: 'bg-emerald-500' },
    { label: '¥8,000 - ¥10,000', count: users.filter(u => u.salary >= 8000 && u.salary < 10000).length, color: 'bg-amber-500' },
    { label: '¥10,000 以上', count: users.filter(u => u.salary >= 10000).length, color: 'bg-primary-500' },
  ];

  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const trendData = months.map((m, i) => ({
    month: m,
    total: totalSalary + (i - 3) * 2500,
  }));
  const maxTrend = Math.max(...trendData.map(d => d.total));

const handleExport = () => {
    const date = new Date();
    const content = `工资统计报表
日期: ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}

【统计概览】
员工总数: ${users.length} 人
月度总支出: ¥${totalSalary.toLocaleString()}
平均工资: ¥${avgSalary.toLocaleString()}
最高工资: ¥${maxSalary.toLocaleString()}
最低工资: ¥${minSalary.toLocaleString()}

【岗位支出】
管理岗: ${adminCount} 人, ¥${adminTotal.toLocaleString()}
柜员岗: ${tellerCount} 人, ¥${tellerTotal.toLocaleString()}

【员工薪资明细】
姓名,工号,岗位,月薪,相对平均
${filteredUsers.map(u => {
      const diff = u.salary - avgSalary;
      return `${u.user_name},${u.user_no},${getRoleNameByNo(u.role_no)},¥${u.salary.toLocaleString()},${diff >= 0 ? '+' : ''}¥${diff.toLocaleString()}`;
    }).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `工资报表_${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-[1400px]">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-700">工资统计报表</h2>
          <p className="text-sm text-accent-500 mt-1">员工工资数据与支出汇总</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-soft"
        >
          <Download className="w-4 h-4" />
          导出报表
        </button>
      </div>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100/50 border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" /> 3.2%
            </span>
          </div>
          <p className="text-xs text-accent-500 mb-1">月度总支出</p>
          <p className="text-2xl font-bold text-accent-700">¥{totalSalary.toLocaleString()}</p>
        </div>

        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-soft">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" /> 1.5%
            </span>
          </div>
          <p className="text-xs text-accent-500 mb-1">平均工资</p>
          <p className="text-2xl font-bold text-accent-700">¥{avgSalary.toLocaleString()}</p>
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-soft">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-accent-500 bg-accent-50 px-2 py-1 rounded-lg">{users.length} 人</span>
          </div>
          <p className="text-xs text-accent-500 mb-1">最高工资</p>
          <p className="text-2xl font-bold text-accent-700">¥{maxSalary.toLocaleString()}</p>
        </div>

        <div className="card bg-gradient-to-br from-violet-50 to-violet-100/50 border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center shadow-soft">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-accent-500 bg-accent-50 px-2 py-1 rounded-lg">最低工资</span>
          </div>
          <p className="text-xs text-accent-500 mb-1">最低工资</p>
          <p className="text-2xl font-bold text-accent-700">¥{minSalary.toLocaleString()}</p>
        </div>
      </div>

      {/* 薪资对比 + 岗位支出 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 岗位支出分布 */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-accent-700">岗位支出分布</h3>
              <p className="text-xs text-accent-500 mt-1">按岗位分类的工资支出</p>
            </div>
            <PieChart className="w-5 h-5 text-accent-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-accent-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                  管理岗（{adminCount} 人）
                </span>
                <span className="text-sm font-semibold text-accent-700">¥{adminTotal.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-accent-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700"
                  style={{ width: totalSalary > 0 ? `${(adminTotal / totalSalary) * 100}%` : '0%' }}
                />
              </div>
              <p className="text-xs text-accent-400 mt-1.5">占比 {totalSalary > 0 ? Math.round((adminTotal / totalSalary) * 100) : 0}%</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-accent-600 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  柜员岗（{tellerCount} 人）
                </span>
                <span className="text-sm font-semibold text-accent-700">¥{tellerTotal.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-accent-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: totalSalary > 0 ? `${(tellerTotal / totalSalary) * 100}%` : '0%' }}
                />
              </div>
              <p className="text-xs text-accent-400 mt-1.5">占比 {totalSalary > 0 ? Math.round((tellerTotal / totalSalary) * 100) : 0}%</p>
            </div>
          </div>

          {/* 薪资分档 */}
          <div className="mt-6 pt-5 border-t border-accent-100">
            <p className="text-sm font-medium text-accent-600 mb-3">薪资分档</p>
            <div className="space-y-2">
              {salaryBands.map((band, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-accent-500">{band.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-accent-600 font-medium">{band.count} 人</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 月度趋势 */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-accent-700">月度支出趋势</h3>
              <p className="text-xs text-accent-500 mt-1">近 6 个月工资支出变化</p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent-400" />
          </div>
          <div className="flex items-end justify-between gap-3 h-48 px-2">
            {trendData.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-xs font-semibold text-accent-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  ¥{(d.total / 1000).toFixed(1)}k
                </div>
                <div
                  className="w-full bg-gradient-to-t from-primary-400 to-primary-600 rounded-xl shadow-soft transition-all duration-300 group-hover:from-primary-500 group-hover:to-primary-700"
                  style={{ height: `${(d.total / maxTrend) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-xs text-accent-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 薪资范围滑动拉杆筛选 */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-accent-500" />
            <span className="text-sm font-medium text-accent-600">薪资范围筛选</span>
          </div>
          <span className="text-sm text-accent-600 font-medium">
            ¥{salaryRange[0].toLocaleString()} - ¥{salaryRange[1].toLocaleString()}
          </span>
        </div>
        <div className="space-y-4">
          {/* 双滑块范围选择器 */}
          <div className="relative h-2">
            {/* 背景轨道 */}
            <div className="absolute inset-0 bg-accent-200 rounded-full"></div>
            {/* 选中范围 */}
            <div
              className="absolute h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
              style={{
                left: `${(salaryRange[0] / 20000) * 100}%`,
                right: `${100 - (salaryRange[1] / 20000) * 100}%`,
              }}
            />
            {/* 最小值滑块 */}
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={salaryRange[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val < salaryRange[1]) setSalaryRange([val, salaryRange[1]]);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {/* 最大值滑块 */}
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={salaryRange[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > salaryRange[0]) setSalaryRange([salaryRange[0], val]);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {/* 滑块指示点 - 最小值 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary-500 rounded-full shadow-md -ml-2.5 pointer-events-none"
              style={{ left: `calc(${(salaryRange[0] / 20000) * 100}% + 0px)` }}
            />
            {/* 滑块指示点 - 最大值 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary-500 rounded-full shadow-md -ml-2.5 pointer-events-none"
              style={{ left: `calc(${(salaryRange[1] / 20000) * 100}% + 0px)` }}
            />
          </div>
          {/* 快捷档位按钮 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSalaryRange([0, 20000])}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                salaryRange[0] === 0 && salaryRange[1] === 20000
                  ? 'bg-primary-500 text-white'
                  : 'bg-accent-50 text-accent-500 hover:bg-accent-100'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setSalaryRange([0, 5000])}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                salaryRange[0] === 0 && salaryRange[1] === 5000
                  ? 'bg-primary-500 text-white'
                  : 'bg-accent-50 text-accent-500 hover:bg-accent-100'
              }`}
            >
              ¥5,000 以下
            </button>
            <button
              onClick={() => setSalaryRange([5000, 8000])}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                salaryRange[0] === 5000 && salaryRange[1] === 8000
                  ? 'bg-primary-500 text-white'
                  : 'bg-accent-50 text-accent-500 hover:bg-accent-100'
              }`}
            >
              ¥5,000-8,000
            </button>
            <button
              onClick={() => setSalaryRange([8000, 10000])}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                salaryRange[0] === 8000 && salaryRange[1] === 10000
                  ? 'bg-primary-500 text-white'
                  : 'bg-accent-50 text-accent-500 hover:bg-accent-100'
              }`}
            >
              ¥8,000-10,000
            </button>
            <button
              onClick={() => setSalaryRange([10000, 20000])}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                salaryRange[0] === 10000 && salaryRange[1] === 20000
                  ? 'bg-primary-500 text-white'
                  : 'bg-accent-50 text-accent-500 hover:bg-accent-100'
              }`}
            >
              ¥10,000 以上
            </button>
          </div>
        </div>
      </div>

      {/* 员工薪资列表 */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-5 border-b border-accent-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-accent-700">员工薪资明细</h3>
              <p className="text-xs text-accent-500 mt-1">共 {filteredUsers.length} 条记录</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-accent-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="pl-9 pr-8 py-2 text-sm border border-accent-200 bg-white rounded-xl text-accent-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">全部岗位</option>
                  <option value="R001">管理岗</option>
                  <option value="R002">柜员岗</option>
                </select>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 text-sm border border-accent-200 bg-white rounded-xl text-accent-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all appearance-none cursor-pointer"
              >
                <option value="salary-desc">工资从高到低</option>
                <option value="salary-asc">工资从低到高</option>
                <option value="name">按姓名排序</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 px-6 py-3 bg-accent-50/50 text-xs font-semibold text-accent-500 uppercase tracking-wider">
          <div className="col-span-4">员工姓名</div>
          <div className="col-span-2">工号</div>
          <div className="col-span-2">岗位</div>
          <div className="col-span-2">月薪</div>
          <div className="col-span-2">相对平均</div>
        </div>

        <div className="divide-y divide-accent-100">
          {filteredUsers.map((u, idx) => {
            const diff = u.salary - avgSalary;
            return (
              <div key={idx} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-accent-50/50 transition-colors">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                    {u.user_name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-accent-700">{u.user_name}</span>
                </div>
                <div className="col-span-2 text-sm text-accent-600">{u.user_no}</div>
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2.5 py-1 bg-primary-50 text-primary-600 text-xs rounded-lg">
                    {getRoleNameByNo(u.role_no)}
                  </span>
                </div>
                <div className="col-span-2 text-sm font-semibold text-accent-700">¥{u.salary.toLocaleString()}</div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${diff >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {diff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {diff >= 0 ? '+' : ''}¥{diff.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center text-accent-500 text-sm">暂无数据</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryReport;
