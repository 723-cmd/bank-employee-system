import { useEffect, useState } from 'react';
import { Building2, User, Banknote, Calendar, Filter, CheckCircle, Search, CreditCard, ArrowRightLeft, PiggyBank, Wallet } from 'lucide-react';
import { getUsers } from '../../utils/storage';
import { User as UserType } from '../../data/mockData';

interface Transaction {
  id: string;
  transaction_no: string;
  user_name: string;
  user_no: string;
  type: '存款' | '取款' | '转账' | '开户';
  amount: number;
  date: string;
  time: string;
  status: '成功' | '处理中' | '失败';
}

const generateTransactions = (users: UserType[]): Transaction[] => {
  const tellers = users.filter(u => u.role_no === 'R002');
  const types: Transaction['type'][] = ['存款', '取款', '转账', '开户'];
  const statuses: Transaction['status'][] = ['成功', '成功', '成功', '成功', '处理中', '失败'];

  const transactions: Transaction[] = [];
  for (let i = 0; i < 25; i++) {
    const teller = tellers[i % tellers.length];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(i / 2));
    date.setHours(9 + (i % 8), (i * 13) % 60, (i * 7) % 60);

    transactions.push({
      id: `t${i}`,
      transaction_no: `TX${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(10000 + i).slice(1)}`,
      user_name: teller.user_name,
      user_no: teller.user_no,
      type: types[i % types.length],
      amount: Math.floor((Math.random() * 50000 + 1000) / 100) * 100,
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
      status: statuses[i % statuses.length],
    });
  }
  return transactions;
};

const TransactionRecords = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const us = getUsers();
    setUsers(us);
    setTransactions(generateTransactions(us));
  }, []);

  let filtered = transactions;
  if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);
  if (filterStatus !== 'all') filtered = filtered.filter(t => t.status === filterStatus);
  if (search) filtered = filtered.filter(t => t.user_name.includes(search) || t.transaction_no.includes(search));

  const totalAmount = transactions.filter(t => t.status === '成功').reduce((s, t) => s + t.amount, 0);
  const todayCount = transactions.filter(t => t.status === '成功').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '存款': return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case '取款': return <Wallet className="w-4 h-4 text-amber-600" />;
      case '转账': return <ArrowRightLeft className="w-4 h-4 text-sky-600" />;
      case '开户': return <PiggyBank className="w-4 h-4 text-violet-600" />;
      default: return <CreditCard className="w-4 h-4 text-accent-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '存款': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case '取款': return 'bg-amber-50 text-amber-600 border-amber-100';
      case '转账': return 'bg-sky-50 text-sky-600 border-sky-100';
      case '开户': return 'bg-violet-50 text-violet-600 border-violet-100';
      default: return 'bg-accent-50 text-accent-600 border-accent-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '成功': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case '处理中': return 'bg-amber-50 text-amber-600 border-amber-100';
      case '失败': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-accent-50 text-accent-600 border-accent-100';
    }
  };

  const typeCounts = {
    存款: transactions.filter(t => t.type === '存款').length,
    取款: transactions.filter(t => t.type === '取款').length,
    转账: transactions.filter(t => t.type === '转账').length,
    开户: transactions.filter(t => t.type === '开户').length,
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-[1400px]">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-700">业务办理记录</h2>
          <p className="text-sm text-accent-500 mt-1">查看柜员业务办理数据</p>
        </div>
      </div>

      {/* 数据卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100/50 border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-accent-500 mb-1">总笔数</p>
          <p className="text-2xl font-bold text-accent-700">{transactions.length}</p>
        </div>

        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-soft">
              <Banknote className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-accent-500 mb-1">交易总额</p>
          <p className="text-2xl font-bold text-accent-700">¥{totalAmount.toLocaleString()}</p>
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-soft">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-accent-500 mb-1">成功笔数</p>
          <p className="text-2xl font-bold text-accent-700">{todayCount}</p>
        </div>

        <div className="card bg-gradient-to-br from-violet-50 to-violet-100/50 border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center shadow-soft">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-accent-500 mb-1">柜员人数</p>
          <p className="text-2xl font-bold text-accent-700">{users.filter(u => u.role_no === 'R002').length}</p>
        </div>
      </div>

      {/* 业务类型概览 */}
      <div className="card">
        <h3 className="text-sm font-semibold text-accent-600 mb-4">业务类型分布</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-700">{typeCounts.存款}</span>
            </div>
            <p className="text-sm font-medium text-accent-700">存款</p>
            <p className="text-xs text-accent-500">业务笔数</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-700">{typeCounts.取款}</span>
            </div>
            <p className="text-sm font-medium text-accent-700">取款</p>
            <p className="text-xs text-accent-500">业务笔数</p>
          </div>
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
            <div className="flex items-center justify-between mb-2">
              <ArrowRightLeft className="w-5 h-5 text-sky-600" />
              <span className="text-2xl font-bold text-sky-700">{typeCounts.转账}</span>
            </div>
            <p className="text-sm font-medium text-accent-700">转账</p>
            <p className="text-xs text-accent-500">业务笔数</p>
          </div>
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
            <div className="flex items-center justify-between mb-2">
              <PiggyBank className="w-5 h-5 text-violet-600" />
              <span className="text-2xl font-bold text-violet-700">{typeCounts.开户}</span>
            </div>
            <p className="text-sm font-medium text-accent-700">开户</p>
            <p className="text-xs text-accent-500">业务笔数</p>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-accent-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索柜员姓名或交易单号..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-accent-200 bg-white rounded-xl text-accent-600 placeholder-accent-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-accent-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-9 pr-8 py-2.5 text-sm border border-accent-200 bg-white rounded-xl text-accent-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all appearance-none cursor-pointer"
              >
                <option value="all">全部类型</option>
                <option value="存款">存款</option>
                <option value="取款">取款</option>
                <option value="转账">转账</option>
                <option value="开户">开户</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 text-sm border border-accent-200 bg-white rounded-xl text-accent-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all appearance-none cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="成功">成功</option>
              <option value="处理中">处理中</option>
              <option value="失败">失败</option>
            </select>
          </div>
        </div>
      </div>

      {/* 交易表格 */}
      <div className="card !p-0 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 bg-accent-50/50 text-xs font-semibold text-accent-500 uppercase tracking-wider">
          <div className="col-span-2">交易单号</div>
          <div className="col-span-2">办理柜员</div>
          <div className="col-span-1">类型</div>
          <div className="col-span-2">金额</div>
          <div className="col-span-2">日期</div>
          <div className="col-span-1">时间</div>
          <div className="col-span-2 text-center">状态</div>
        </div>

        <div className="divide-y divide-accent-100">
          {filtered.map((t) => (
            <div key={t.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-accent-50/50 transition-colors text-sm">
              <div className="col-span-2 text-accent-600 font-mono text-xs">{t.transaction_no}</div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium">
                  {t.user_name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-accent-700">{t.user_name}</span>
              </div>
              <div className="col-span-1">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg border ${getTypeColor(t.type)}`}>
                  {getTypeIcon(t.type)} {t.type}
                </span>
              </div>
              <div className="col-span-2 text-sm font-semibold text-accent-700">¥{t.amount.toLocaleString()}</div>
              <div className="col-span-2 flex items-center gap-1 text-sm text-accent-500">
                <Calendar className="w-3.5 h-3.5" /> {t.date}
              </div>
              <div className="col-span-1 text-sm text-accent-500">{t.time}</div>
              <div className="col-span-2 text-center">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(t.status)}`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-accent-500 text-sm">暂无交易记录</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionRecords;
