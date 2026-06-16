import { useState } from 'react';
import { Megaphone, Calendar, Bell, CheckCircle } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: '系统' | '公告' | '通知';
  read: boolean;
}

const MyAnnouncements = () => {
  const [announcements] = useState<Announcement[]>([
    {
      id: 'a1',
      title: '系统维护通知',
      content: '本周六凌晨 2:00-4:00 将进行系统维护升级，期间系统将暂时无法使用。请提前保存您的工作，以免数据丢失。感谢您的理解与配合。',
      date: '2024-06-10',
      category: '系统',
      read: false,
    },
    {
      id: 'a2',
      title: '第二季度绩效考核公告',
      content: '第二季度绩效考核工作即将开始，请各位员工按照部门要求完成自评工作。具体时间安排：6月15日至6月20日为自评阶段。',
      date: '2024-06-08',
      category: '公告',
      read: false,
    },
    {
      id: 'a3',
      title: '新员工入职培训安排',
      content: '本月新员工入职培训将于 6月20日上午 9:00 在三楼会议室举行。请相关人员准时参加。',
      date: '2024-06-05',
      category: '通知',
      read: true,
    },
    {
      id: 'a4',
      title: '工资发放通知',
      content: '本月工资已于 6月10日发放至各位员工的工资卡中，请注意查收。',
      date: '2024-06-10',
      category: '通知',
      read: true,
    },
    {
      id: 'a5',
      title: '银行业务培训通知',
      content: '为提升员工业务能力，下周将组织银行业务培训，请各部门员工积极参加。',
      date: '2024-06-03',
      category: '公告',
      read: true,
    },
  ]);

  const [readIds, setReadIds] = useState<string[]>(announcements.filter(a => a.read).map(a => a.id));
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const unreadCount = announcements.filter(a => !readIds.includes(a.id)).length;

  const filtered = filterCategory === 'all'
    ? announcements
    : announcements.filter(a => a.category === filterCategory);

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds([...readIds, id]);
    }
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
    <div className="animate-fade-in space-y-6 max-w-[1000px]">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-700">公告通知</h2>
          <p className="text-sm text-accent-500 mt-1">查看系统公告和通知</p>
        </div>
        {unreadCount > 0 && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-xl">
            <Bell className="w-3.5 h-3.5" />
            {unreadCount} 条未读
          </span>
        )}
      </div>

      {/* 统计 */}
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
        <div className="card bg-gradient-to-br from-sky-50 to-sky-100/50 border-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center mb-3 shadow-soft">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-accent-500 mb-1">本周</p>
          <p className="text-2xl font-bold text-accent-700">{announcements.filter(a => a.date >= '2024-06-10').length}</p>
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
        {filtered.map((item) => {
          const isRead = readIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`card hover:shadow-card transition-all cursor-pointer group ${!isRead ? 'border-l-4 border-l-primary-500' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {!isRead && (
                      <span className="inline-flex items-center text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                        未读
                      </span>
                    )}
                    <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-lg border ${categoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-accent-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.date}
                    </span>
                  </div>
                  <h3 className={`text-base font-semibold mb-2 ${isRead ? 'text-accent-600' : 'text-accent-700'}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-accent-500 leading-relaxed line-clamp-2">{item.content}</p>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card text-center py-12">
            <Bell className="w-10 h-10 text-accent-300 mx-auto mb-3" />
            <p className="text-sm text-accent-500">暂无公告</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnnouncements;
