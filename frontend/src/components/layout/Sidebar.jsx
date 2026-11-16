import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Building2, X, ChevronRight } from 'lucide-react';

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/employees',    icon: Users,            label: 'Employees'    },
  { to: '/employees/add',icon: UserPlus,         label: 'Add Employee' },
];

const Sidebar = ({ isOpen, onClose }) => (
  <>
    {/* Mobile overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
        onClick={onClose}
      />
    )}

    <aside
      className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Decorative top glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-900/40 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="relative flex items-center justify-between px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Building2 size={18} className="text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-white font-black text-lg leading-none tracking-wide">BMDU</h1>
            <p className="text-indigo-400 text-[10px] font-semibold uppercase tracking-widest mt-0.5">Enterprise Portal</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.15em] px-3 mb-3">
          Navigation
        </p>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-150 group relative overflow-hidden
              ${isActive
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={13} className="text-indigo-200" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin profile */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-black shadow-md">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">Admin User</p>
            <p className="text-slate-500 text-xs truncate">admin@bmdu.com</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
        </div>
      </div>
    </aside>
  </>
);

export default Sidebar;
