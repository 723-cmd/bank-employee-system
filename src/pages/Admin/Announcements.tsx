import { useState } from 'react';
import { Megaphone, Plus, Calendar, CheckCircle, Bell, ChevronRight, X } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: '系统' | '公告' | '通知';
  pinned: boolean;
  read: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: '系统维护通知',
    content: '本周六凌晨 2:00-4:00 将进行系统维护升级，期间系统将暂时无法使用。请提前保存您的工作，以免数据丢失。感谢您的理解与配合。',
    date: '2024-06-10',
    category: '系统',
    pinned: true,
    read: true,
  },
  {
    id: 'a2',
    title: '第二季度绩效考核公告',
    content: '第二季度绩效考核工作即将开始，请各位员工按照部门要求完成自评工作。具体时间安排：6月15日至6月20日为自评阶段，6月21日至6月25日为部门审核阶段。',
    date: '2024-06-08',
    category: '公告',
    pinned: true,
    read: false,
  },
  {
    id: 'a3',
    title: '新员工入职培训安排',
    content: '本月新员工入职培训将于 6月20日上午 9:00 在三楼会议室举行。培训内容包括：公司文化、规章制度、业务系统操作等。请相关人员准时参加。',
    date: '2024-06-05',
    category: '通知',
    pinned: false,
    read: false,
  },
  {
    id: 'a4',
    title: '工资发放通知',
    content: '本月工资已于 6月10日发放至各位员工的工资卡中，请注意查收。如有疑问，请联系人力资源部门。',
    date: '2024-06-10',
    category: '通知',
    pinned: false,
    read: true,
  },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'系统' | '公告' | '通知'>('通知');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const unreadCount = announcements.filter(a => !a.read).length;
  const pinnedCount = announcements.filter(a => a.pinned).length;

  const filtered = filterCategory === 'all'
    ? announcements
    : announcements.filter(a => a.category === filterCategory);

  const handleAdd = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newItem: Announcement = {
      id: `a${Date.now()}`,
      title: newTitle,
      content: newContent,
      date: new Date().toISOString().split('T')[0],
      category: newCategory,
      pinned: false,
      read: false,
    };
    setAnnouncements([newItem, ...announcements]);
    setNewTitle('');
    setNewContent('');
    setShowForm(false);
  };

  const toggleRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: !a.read } : a));
  };

  const togglePin = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  };

  const categoryColor = (cat: string) => {
    switch (cat) {
      case '系统': return 'bg-sky-50 text-sky-600 border-sky-100';
      case '公告': return 'bg-primary-50 text-primary-600 border-primary-100';
      case '通知': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-accent-50 text-accent-600 border-accent-100';
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-[1400px]">
      {/* 顶部标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-accent-700">公告通知中心</h2>
          <p className="text-sm text-accent-500 mt-1">发布和查看系统公告信息</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-soft"
        >
          <Plus className="w-4 h-4" />
          发布公告
        </button>
      </div>

      {/* 数据总览 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center mb-3 shadow-soft">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">公告总数</p>
          <p className="text-2xl font-bold text-accent-700">{announcements.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-3 shadow-soft">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">置顶公告</p>
          <p className="text-2xl font-bold text-accent-700">{pinnedCount}</p>
        </div>
        <div className="card bg-gradient-to-br from-sky-50 to-sky-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center mb-3 shadow-soft">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">未读</p>
          <p className="text-2xl font-bold text-accent-700">{unreadCount}</p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-3 shadow-soft">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">已读</p>
          <p className="text-2xl font-bold text-accent-700">{announcements.length - unreadCount}</p>
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-accent-500 mr-2">筛选：</span>
        {['all', '系统', '公告', '通知'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterCategory === cat
                ? 'bg-primary-500 text-white shadow-soft'
                : 'bg-white text-accent-500 hover:bg-accent-50 border border-accent-100'
            }`}
          >
            {cat === 'all' ? '全部' : cat}
          </button>
        ))}
      </div>

      {/* 公告列表 */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className={`card hover:shadow-card transition-all cursor-pointer group ${!item.read ? 'border-l-4 border-l-primary-500' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {item.pinned && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                      <Megaphone className="w-3 h-3" /> 置顶
                    </span>
                  )}
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-lg border ${categoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  {!item.read && (
                    <span className="inline-flex items-center text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                      未读
                    </span>
                  )}
                  <span className="text-xs text-accent-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>
                <h3 className={`text-base font-semibold mb-2 ${item.read ? 'text-accent-600' : 'text-accent-700'}`}>
                  {item.title}
                </h3>
                <p className="text-sm text-accent-500 leading-relaxed line-clamp-2">{item.content}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <ChevronRight className="w-5 h-5 text-accent-300 group-hover:text-accent-500 transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-accent-100">
              <button
                onClick={() => toggleRead(item.id)}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {item.read ? '标记为未读' : '标记为已读'}
              </button>
              <span className="text-accent-200 text-xs">|</span>
              <button
                onClick={() => togglePin(item.id)}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                {item.pinned ? '取消置顶' : '置顶'}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card text-center py-12">
            <Bell className="w-10 h-10 text-accent-300 mx-auto mb-3" />
            <p className="text-sm text-accent-500">暂无公告</p>
          </div>
        )}
      </div>

      {/* 发布公告弹窗 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-accent-700/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-card max-w-lg w-full animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-accent-100">
              <h3 className="text-base font-semibold text-accent-700">发布新公告</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl hover:bg-accent-50 flex items-center justify-center text-accent-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-accent-600 mb-2 block">公告类别</label>
                <div className="flex items-center gap-2">
                  {(['系统', '公告', '通知'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                        newCategory === cat
                          ? 'bg-primary-500 text-white shadow-soft'
                          : 'bg-accent-50 text-accent-500 hover:bg-accent-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-accent-600 mb-2 block">公告标题</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="请输入公告标题..."
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-accent-600 mb-2 block">公告内容</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="请输入公告内容..."
                  rows={5}
                  className="input-field w-full resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-accent-600 bg-accent-50 hover:bg-accent-100 rounded-xl font-medium transition-colors">
                  取消
                </button>
                <button onClick={handleAdd} className="px-4 py-2.5 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-xl font-medium transition-colors shadow-soft">
                  发布公告
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
