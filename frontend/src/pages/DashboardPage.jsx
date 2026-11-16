import { useEffect, useState } from 'react';
import {
  Users, UserCheck, UserX, Building2,
  TrendingUp, ArrowRight, Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStats, getEmployees } from '../services/employeeService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatusBadge from '../components/ui/StatusBadge';

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, gradient, iconBg, iconColor, index }) => (
  <div
    className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    {/* Background shimmer */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} />

    <div className="relative flex items-start justify-between mb-5">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
        <Icon size={20} className={iconColor} strokeWidth={2.2} />
      </div>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Live</span>
    </div>

    <div className="relative">
      <p className="text-4xl font-black text-slate-900 tabular-nums">
        {value ?? <span className="text-slate-300">—</span>}
      </p>
      <p className="text-slate-500 text-sm font-medium mt-1">{label}</p>
    </div>
  </div>
);

/* ─── Department Row ─────────────────────────────────────────────────────── */
const DeptRow = ({ name, count, total, active, inactive }) => {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-sm font-semibold text-slate-700">{name}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="text-emerald-600 font-medium">{active} active</span>
          {inactive > 0 && <span className="text-rose-500 font-medium">{inactive} inactive</span>}
          <span className="font-bold text-slate-600">{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ─── Dashboard Page ─────────────────────────────────────────────────────── */
const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [sRes, eRes] = await Promise.all([
          getStats(),
          getEmployees({ limit: 6 }),
        ]);
        setStats(sRes?.data || null);
        setRecentEmployees(Array.isArray(eRes?.data) ? eRes.data : []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <LoadingSpinner size="lg" text="Loading dashboard..." />;

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4 shadow-sm">
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="text-slate-700 font-bold text-lg mb-1">Could not load dashboard</h3>
      <p className="text-slate-400 text-sm max-w-sm">{error}</p>
      <p className="text-slate-300 text-xs mt-3">Make sure the backend is running on port 5000</p>
    </div>
  );

  const cards = [
    {
      label: 'Total Employees',
      value: stats?.totalEmployees,
      icon: Users,
      gradient: 'bg-gradient-to-br from-blue-50 to-transparent',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Employees',
      value: stats?.activeEmployees,
      icon: UserCheck,
      gradient: 'bg-gradient-to-br from-emerald-50 to-transparent',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Inactive Employees',
      value: stats?.inactiveEmployees,
      icon: UserX,
      gradient: 'bg-gradient-to-br from-rose-50 to-transparent',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-500',
    },
    {
      label: 'Departments',
      value: stats?.totalDepartments,
      icon: Building2,
      gradient: 'bg-gradient-to-br from-purple-50 to-transparent',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">

      {/* ── Welcome Banner ── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl px-7 py-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-indigo-400 blur-3xl" />
          <div className="absolute bottom-4 right-20 w-20 h-20 rounded-full bg-blue-400 blur-2xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Admin Dashboard</span>
          </div>
          <h1 className="text-white text-2xl font-black">Welcome back, Admin 👋</h1>
          <p className="text-slate-400 text-sm mt-1">
            Your organization has{' '}
            <span className="text-emerald-400 font-bold">{stats?.activeEmployees ?? 0} active</span>
            {' '}and{' '}
            <span className="text-rose-400 font-bold">{stats?.inactiveEmployees ?? 0} inactive</span>
            {' '}employees across {stats?.totalDepartments ?? 0} departments.
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} index={i} />
        ))}
      </div>

      {/* ── Department Breakdown + Recent Employees ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Department breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Department Breakdown</h3>
              <p className="text-slate-400 text-xs mt-0.5">Headcount per department</p>
            </div>
            <Building2 size={16} className="text-slate-300" />
          </div>
          <div className="px-6 py-2">
            {!stats?.departmentStats?.length ? (
              <p className="text-slate-400 text-sm text-center py-6">No data yet</p>
            ) : (
              stats.departmentStats.map((dept) => (
                <DeptRow
                  key={dept._id}
                  name={dept._id}
                  count={dept.count}
                  total={stats?.totalEmployees || 0}
                  active={dept.active}
                  inactive={dept.inactive}
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Employees */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Recent Employees</h3>
              <p className="text-slate-400 text-xs mt-0.5">Last added records</p>
            </div>
            <button
              onClick={() => navigate('/employees')}
              className="flex items-center gap-1 text-indigo-600 text-xs font-semibold hover:gap-2 transition-all"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {!recentEmployees?.length ? (
              <p className="text-slate-400 text-sm text-center py-8">No employees yet</p>
            ) : (
              recentEmployees.map((emp) => (
                <div
                  key={emp._id}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-sm font-black shadow-sm flex-shrink-0">
                    {emp.employeeName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-semibold text-sm truncate">{emp.employeeName}</p>
                    <p className="text-slate-400 text-xs truncate">{emp.designation} · {emp.department}</p>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
