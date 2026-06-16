import { useEffect, useState } from 'react';
import { Calendar, CreditCard, Wallet, ArrowRightLeft, PiggyBank, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Transaction {
  id: string;
  transaction_no: string;
  type: '存款' | '取款' | '转账' | '开户';
  amount: number;
  date: string;
  time: string;
  status: '成功' | '处理中' | '失败';
  customer: string;
}

const MyTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    // 模拟当前用户业务记录
    const types: Transaction['type'][] = ['存款', '取款', '转账', '开户'];
    const statuses: Transaction['status'][] = ['成功', '成功', '成功', '处理中'];
    const customers = ['张先生', '李女士', '王先生', '赵女士', '刘先生', '陈女士'];

    const mockTransactions: Transaction[] = [];
    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(9 + (i % 8), (i * 13) % 60);

      mockTransactions.push({
        id: `t${i}`,
        transaction_no: `TX${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(10000 + i).slice(1)}`,
        type: types[i % types.length],
        amount: Math.floor((Math.random() * 30000 + 1000) / 100) * 100,
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
        status: statuses[i % statuses.length],
        customer: customers[i % customers.length],
      });
    }
    setTransactions(mockTransactions);
  }, [user]);

  let filtered = transactions;
  if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);

  const totalAmount = transactions.filter(t => t.status === '成功').reduce((s, t) => s + t.amount, 0);
  const successCount = transactions.filter(t => t.status === '成功').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '存款': return <CreditCard className="w-4 h-4" />;
      case '取款': return <Wallet className="w-4 h-4" />;
      case '转账': return <ArrowRightLeft className="w-4 h-4" />;
      case '开户': return <PiggyBank className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '成功': return <CheckCircle className="w-3.5 h-3.5" />;
      case '处理中': return <Clock className="w-3.5 h-3.5" />;
      case '失败': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
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

  return (
    <div className="animate-fade-in space-y-6 max-w-[1000px]">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-700">我的业务记录</h2>
          <p className="text-sm text-accent-500 mt-1">查看个人业务办理情况</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center mb-3 shadow-soft">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">总笔数</p>
          <p className="text-2xl font-bold text-accent-700">{transactions.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-3 shadow-soft">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">总金额</p>
          <p className="text-2xl font-bold text-accent-700">¥{totalAmount.toLocaleString()}</p>
        </div>
        <div className="card bg-gradient-to-br from-sky-50 to-sky-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center mb-3 shadow-soft">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">成功笔数</p>
          <p className="text-2xl font-bold text-accent-700">{successCount}</p>
        </div>
        <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-3 shadow-soft">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">成功率</p>
          <p className="text-2xl font-bold text-accent-700">{transactions.length > 0 ? Math.round((successCount / transactions.length) * 100) : 0}%</p>
        </div>
      </div>

      {/* 业务类型统计 */}
      <div className="card">
        <h3 className="text-sm font-semibold text-accent-600 mb-4">业务类型分布</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['存款', '取款', '转账', '开户'] as const).map((type) => {
            const count = transactions.filter(t => t.type === type).length;
            return (
              <div key={type} className={`p-4 rounded-2xl border ${getTypeColor(type)} cursor-pointer hover:scale-105 transition-transform`} onClick={() => setFilterType(filterType === type ? 'all' : type)}>
                <div className="flex items-center justify-between mb-2">
                  {getTypeIcon(type)}
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-sm font-medium">{type}</p>
                <p className="text-xs opacity-70">笔数</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-accent-500 mr-2">筛选：</span>
        {(['all', '存款', '取款', '转账', '开户'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === type
                ? 'bg-primary-500 text-white shadow-soft'
                : 'bg-white text-accent-500 hover:bg-accent-50 border border-accent-100'
            }`}
          >
            {type === 'all' ? '全部' : type}
          </button>
        ))}
      </div>

      {/* 交易记录 */}
      <div className="card !p-0 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 bg-accent-50/50 text-xs font-semibold text-accent-500 uppercase tracking-wider">
          <div className="col-span-2">交易单号</div>
          <div className="col-span-1">类型</div>
          <div className="col-span-2">客户</div>
          <div className="col-span-2">金额</div>
          <div className="col-span-2">日期</div>
          <div className="col-span-1">时间</div>
          <div className="col-span-2 text-center">状态</div>
        </div>
        <div className="divide-y divide-accent-100">
          {filtered.map((t) => (
            <div key={t.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-accent-50/50 transition-colors text-sm">
              <div className="col-span-2 text-accent-600 font-mono text-xs">{t.transaction_no}</div>
              <div className="col-span-1">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg border ${getTypeColor(t.type)}`}>
                  {getTypeIcon(t.type)} {t.type}
                </span>
              </div>
              <div className="col-span-2 text-sm text-accent-600">{t.customer}</div>
              <div className="col-span-2 text-sm font-semibold text-accent-700">¥{t.amount.toLocaleString()}</div>
              <div className="col-span-2 flex items-center gap-1 text-sm text-accent-500">
                <Calendar className="w-3.5 h-3.5" /> {t.date}
              </div>
              <div className="col-span-1 text-sm text-accent-500">{t.time}</div>
              <div className="col-span-2 text-center">
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(t.status)}`}>
                  {getStatusIcon(t.status)} {t.status}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-accent-500 text-sm">暂无业务记录</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTransactions;
