import { Menu, Bell } from 'lucide-react';

const Topbar = ({ onMenuClick, title }) => (
  <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shadow-sm">
    <div className="flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
        aria-label="Open menu"
      >
        <Menu size={19} />
      </button>
      <h2 className="text-slate-800 font-black text-lg hidden sm:block tracking-tight">{title}</h2>
    </div>

    <div className="flex items-center gap-2">
      <button className="relative p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
        <Bell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
      </button>
      <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-sm cursor-pointer">
          AD
        </div>
        <div className="hidden md:block">
          <p className="text-slate-700 text-xs font-bold leading-none">Admin</p>
          <p className="text-slate-400 text-[10px] leading-none mt-0.5">Administrator</p>
        </div>
      </div>
    </div>
  </header>
);

export default Topbar;
